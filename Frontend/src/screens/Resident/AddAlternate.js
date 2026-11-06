// ADDED: New screen "AddAlternate" - loads real nearby registered residents from the backend.
// Save this file as: src/screens/Resident/AddAlternate.js
// CHANGED: Simulated "Send alternate request" feature removed. This screen now only DISPLAYS nearby residents.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
// CHANGED: "Alert" and "Platform" imports removed because they are no longer used.

const BLUE = '#2D52E6';

// CHANGED: Backend base URL is now fixed for the physical Android phone (PC IPv4 + backend port 5000).
// The old 10.0.2.2 (emulator) logic was removed. Phone and PC must be on the same Wi-Fi network.
const API_BASE_URL = 'http://192.168.100.10:5000';

// ADDED: Maximum time (in milliseconds) to wait for the backend before showing an error
const REQUEST_TIMEOUT_MS = 15000;

// CHANGED: Radius is now 200 METERS (was 200 KM). This default is used until the API sends "max_distance_meters".
const DEFAULT_MAX_DISTANCE_METERS = 200;

// ADDED: Builds initials from a user name. Common titles (Mr, Sir, Dr...) are skipped,
// e.g. "Mr.Hassan Raza" -> "HR", "SIR ZAHID" -> "ZA".
const NAME_TITLES = ['mr', 'mrs', 'ms', 'miss', 'dr', 'sir', 'madam', 'engr'];

function getInitials(fullName) {
  const words = String(fullName || '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .filter((word) => !NAME_TITLES.includes(word.toLowerCase()));

  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// ADDED: Converts a failed API response into a user-friendly message
function getApiErrorMessage(status, data) {
  const serverMessage = data && data.message ? data.message : '';

  if (status === 400) {
    return serverMessage || 'Invalid resident ID.';
  }

  if (status === 404) {
    // "Resident not found" or "Resident location not found"
    return serverMessage || 'Resident not found.';
  }

  if (status >= 500) {
    return 'Something went wrong on the server. Please try again later.';
  }

  return serverMessage || 'Something went wrong. Please try again.';
}

// ADDED: Component receives "navigation" and "route" so userId/name params are preserved
export default function AddAlternateScreen({ navigation, route }) {
  // ADDED: Read the params sent from ResidentProfile.
  // "userId" is the logged-in resident's ID and is used in the API URL.
  const residentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;

  // CHANGED: "requestedIds" state was removed together with the simulated send-request feature.

  // ADDED: API data and screen states (all hooks at the top level)
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  // CHANGED: State now stores the radius in meters (was maxDistanceKm)
  const [maxDistanceMeters, setMaxDistanceMeters] = useState(
    DEFAULT_MAX_DISTANCE_METERS,
  );

  // ADDED: Remembers whether the screen is still open, so state is not updated after leaving it
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ADDED: Fetches nearby residents from the backend.
  // CHANGED: The backend already excludes the logged-in resident, filters within 200 METERS and sorts nearest first.
  // It does NOT check login / online status, so logged-in and logged-out residents both appear.
  // The frontend only displays the result.
  const loadNearbyResidents = useCallback(async () => {
    // Without a resident ID the URL cannot be built, so show a message instead of calling the API
    if (!residentId) {
      setResidents([]);
      setErrorMessage(
        'Resident ID is missing. Please go back and open this screen again.',
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Abort the request if the server does not answer in time
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/residents/nearby/${encodeURIComponent(residentId)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        },
      );

      // Read the JSON body (error responses also contain a "message")
      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      if (!isMountedRef.current) {
        return;
      }

      // 400 / 404 / 500 etc. -> show a friendly error message
      if (!response.ok) {
        setResidents([]);
        setErrorMessage(getApiErrorMessage(response.status, data));
        return;
      }

      // Success: store the residents (empty array when nobody is nearby)
      setResidents(Array.isArray(data && data.residents) ? data.residents : []);

      // CHANGED: Reads "max_distance_meters" from the API (was "max_distance_km")
      if (data && data.max_distance_meters) {
        setMaxDistanceMeters(data.max_distance_meters);
      }
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      setResidents([]);

      if (error && error.name === 'AbortError') {
        setErrorMessage(
          'The server is taking too long to respond. Please try again.',
        );
      } else {
        // Network error or backend not running
        setErrorMessage(
          'Unable to connect to the server. Check your internet connection and make sure the backend is running.',
        );
      }
    } finally {
      clearTimeout(timeoutId);

      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [residentId]);

  // ADDED: Load residents when the screen opens
  useEffect(() => {
    loadNearbyResidents();
  }, [loadNearbyResidents]);

  // ADDED: Back button - returns to ResidentProfile (Alternates tab state is kept,
  // because ResidentProfile stays mounted underneath in the stack).
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('ResidentProfile', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: "handleSendRequest" (simulated send request) was removed completely.
  // Sending / accepting / rejecting requests will be built separately later.

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ADDED: Screen header - close icon, title and subtitle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Add Alternate</Text>
          {/* CHANGED: Subtitle was "Nearby verified residents" */}
          <Text style={styles.headerSubtitle}>Nearby registered residents</Text>
        </View>
      </View>

      {/* ADDED: Scrollable body so the screen works on small devices */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CHANGED: Info text now says 200 meters (was KM) */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>👥</Text>
          <Text style={styles.infoText}>
            Registered residents within {maxDistanceMeters} meters of your
            saved location are shown here, nearest first.
          </Text>
        </View>

        {/* ADDED: Loading state while the API request is running */}
        {isLoading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={BLUE} />
            <Text style={styles.loadingText}>Finding nearby residents...</Text>
          </View>
        )}

        {/* ADDED: Error state with a "Try again" button */}
        {!isLoading && errorMessage !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={loadNearbyResidents}
              activeOpacity={0.85}
            >
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CHANGED: Empty state message now uses meters */}
        {!isLoading && errorMessage === '' && residents.length === 0 && (
          <Text style={styles.emptyText}>
            No registered residents found within {maxDistanceMeters} meters.
          </Text>
        )}

        {/* ADDED: "CLOSEST FIRST" heading and "Location on" badge (shown only when residents are listed) */}
        {!isLoading && errorMessage === '' && residents.length > 0 && (
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>CLOSEST FIRST</Text>

            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>Location on</Text>
            </View>
          </View>
        )}

        {/* CHANGED: Cards only display resident info now (no request button) */}
        {!isLoading &&
          errorMessage === '' &&
          residents.map((resident) => {
            // ADDED: Address line from the API fields "area" and "city"
            const addressText = [resident.area, resident.city]
              .filter(Boolean)
              .join(', ');

            return (
              <View key={resident.user_id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(resident.user_name)}
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{resident.user_name}</Text>
                    </View>

                    {/* CHANGED: Distance is shown in meters using "distance_meters" (was distance_km + KM) */}
                    <Text style={styles.distance}>
                      {resident.distance_meters} m away
                    </Text>
                    <Text style={styles.address}>{addressText}</Text>
                  </View>
                </View>

                {/* CHANGED: "Send alternate request" button was removed from here */}
              </View>
            );
          })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the AddAlternate screen (same blue and white look as the rest of the app)
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f4',
  },

  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  closeIcon: {
    fontSize: 22,
    color: '#111827',
  },

  headerTextBlock: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  // Info message
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eef4ff',
    borderWidth: 1,
    borderColor: '#d6e4ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },

  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 19,
    color: '#1e40af',
  },

  // ADDED: Loading state
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
  },

  // ADDED: Error state
  errorBox: {
    backgroundColor: '#fde8ec',
    borderWidth: 1,
    borderColor: '#f5b8c4',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#e11d3d',
    textAlign: 'center',
    marginBottom: 12,
  },

  retryBtn: {
    backgroundColor: BLUE,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 18,
  },

  retryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Section row
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.6,
  },

  locationBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  locationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },

  // Resident card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // CHANGED: marginBottom 14 -> 0, because the request button below the row was removed
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#dbe7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: BLUE,
  },

  cardInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  distance: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 3,
  },

  address: {
    fontSize: 11.5,
    color: '#94a3b8',
  },

  // CHANGED: requestBtn, requestBtnSent, requestBtnText and requestBtnTextSent styles were removed (unused now)

  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 30,
  },
});