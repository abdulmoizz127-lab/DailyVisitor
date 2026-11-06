/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Added useCallback/useState and useFocusEffect (same pattern as ResidentHome)
   so the subscriptions are loaded from the backend and refreshed whenever
   this screen becomes active again. */
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';


/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* The 3 hardcoded dummy subscriptions were removed. Real data now comes from
   GET /api/residents/accepted-services/:residentId (same endpoint ResidentHome uses). */

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Week order used to sort the service days of a subscription */
const weekOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Database service name -> name shown on the Schedule card */
const formatServiceName = service => {

  if (service === 'Milkman') {
    return 'Milk Delivery';
  }

  if (service === 'Newspaper') {
    return 'Newspaper';
  }

  if (service === 'Garbage Collector') {
    return 'Garbage';
  }

  return service || 'Service';
};

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Database TIME (HH:mm:ss) -> 12-hour AM/PM text. Returns '' if unavailable.
   00:00:00 becomes 12:00 AM, so the 11 PM slot shows as 11:00 PM - 12:00 AM. */
const formatTime = time => {

  if (!time) {
    return '';
  }

  const parts = String(time).split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (Number.isNaN(hours) || minutes === undefined) {
    return '';
  }

  const hour24 = hours % 24;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${displayHour}:${minutes.slice(0, 2)} ${period}`;
};

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Builds "6:00 AM – 7:00 AM". If the end time is missing only the start is
   shown; if the start time is missing nothing is shown. */
const formatTimeRange = (fromTime, toTime) => {

  const start = formatTime(fromTime);
  const end = formatTime(toTime);

  if (!start) {
    return '';
  }

  return end ? `${start} – ${end}` : start;
};

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* Collects all service days of ONE subscription into a single text.
   Uses selected_days of the request; falls back to the days of its items. */
const getServiceDays = service => {

  let source = service.selected_days;

  if (!source && Array.isArray(service.items)) {
    source = service.items
      .map(item => item.selected_days)
      .filter(Boolean)
      .join(',');
  }

  if (!source) {
    return '';
  }

  const days = [];

  String(source)
    .split(',')
    .map(day => day.trim())
    .filter(Boolean)
    .forEach(day => {

      const match = weekOrder.find(
        weekDay => weekDay.toLowerCase() === day.toLowerCase(),
      );

      const dayName = match || day;

      if (!days.includes(dayName)) {
        days.push(dayName);
      }
    });

  const dayIndex = day => {
    const index = weekOrder.indexOf(day);
    return index === -1 ? weekOrder.length : index;
  };

  days.sort((a, b) => dayIndex(a) - dayIndex(b));

  return days.join(', ');
};

/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
/* A subscription is active only when the backend status confirms it.
   The backend currently returns only ACCEPTED requests. */
const isActiveSubscription = service =>
  String(service?.status || '').toUpperCase() === 'ACCEPTED';


// CHANGED: Component now receives "route" as well, so it can read the userId and name sent from other Resident screens
export default function ResidentSchedule({navigation, route}) {

  // CHANGED: Resident id and name received from other Resident screens (same param names Home uses)
  const residentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;


  /* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
  /* Subscriptions loaded from the backend, loading flag, error message and a
     reload counter used by the Retry button */
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);


  /* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
  /* Loads the active subscriptions of this resident only (residentId in the URL).
     Runs on first open, on every focus and when Retry is pressed. */
  useFocusEffect(
    useCallback(() => {

      if (!residentId) {
        setSubscriptions([]);
        setError('Resident information is missing. Please go back and try again.');
        setLoading(false);
        return undefined;
      }

      // Ignore a response that arrives after the screen lost focus or residentId changed
      let isActive = true;

      fetch(
        `http://localhost:5000/api/residents/accepted-services/${residentId}`,
      )
        .then(response =>
          response
            .json()
            .catch(() => null)
            .then(data => {

              if (!response.ok) {
                throw new Error(
                  (data && data.message) || 'Server error',
                );
              }

              return data;
            }),
        )
        .then(data => {

          if (!isActive) {
            return;
          }

          console.log('Resident Schedule subscriptions:', data);

          const services =
            data && Array.isArray(data.services)
              ? data.services
              : [];

          setSubscriptions(services.filter(isActiveSubscription));
          setError('');
        })
        .catch(apiError => {

          if (!isActive) {
            return;
          }

          console.log('Resident Schedule API error:', apiError);

          setError(
            'Active subscriptions could not be loaded. Please check your connection and try again.',
          );
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };

    }, [residentId, reloadKey]),
  );


  /* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
  /* Retry button: shows the loading message again and reloads the subscriptions */
  const handleRetry = () => {
    setError('');
    setLoading(true);
    setReloadKey(key => key + 1);
  };


  // CHANGED: Go back to the already mounted ResidentHome when it is the previous screen,
  // so its service cards and params stay intact. Otherwise navigate to ResidentHome and
  // send userId/name (only when available) so Home can still load its services.
  const goHome = () => {
    const navState = navigation.getState();
    const previousRoute = navState?.routes?.[navState.index - 1];

    if (navState?.type === 'stack' && previousRoute?.name === 'ResidentHome') {
      navigation.goBack();
      return;
    }

    const homeParams = {};

    if (residentId) {
      homeParams.userId = residentId;
    }

    if (residentNameParam) {
      homeParams.name = residentNameParam;
    }

    navigation.navigate({
      name: 'ResidentHome',
      params: homeParams,
      merge: true,
    });
  };

  // CHANGED: Activity tab now sends userId and name to ResidentActivity
  const goActivity = () => {
    navigation.navigate('ResidentActivity', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Profile tab now opens the RESIDENT profile (route "ResidentProfile").
  // The old code used "Profile", which App.js registers as the Visitor Profile screen.
  const goProfile = () => {
    navigation.navigate('ResidentProfile', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Plus button now opens "NewSubscription" with residentId, like ResidentHome.
  // The old route "FindProvider" is not registered in App.js.
  const handlePlusPress = () => {
    navigation.navigate('NewSubscription', {
      residentId: residentId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Header */}
        <View style={styles.header}>

          <Text style={styles.title}>
            My Schedule
          </Text>

          <Text style={styles.subtitle}>
            All active subscriptions
          </Text>

        </View>


        {/* ADDED: Out of Station section */}
       {/* CHANGED: Out of Station screen open karne ke liye navigation add ki */}
<TouchableOpacity
  style={styles.outStation}
  onPress={() => navigation.navigate('ResidentOutOfStation')}
>

          <Text style={styles.warningIcon}>
            ⚠️
          </Text>

          <View style={styles.outStationText}>

            <Text style={styles.outStationTitle}>
              Out of Station
            </Text>

            <Text style={styles.outStationSubtitle}>
              Select days and manage your services
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        {/* ADDED: Active Subscriptions heading */}
        <Text style={styles.sectionTitle}>
          Active Subscriptions
        </Text>


        {/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */}
        {/* Loading message while the subscriptions are being fetched */}
        {loading && (
          <Text style={styles.statusText}>
            Loading subscriptions...
          </Text>
        )}


        {/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */}
        {/* Error message with Retry button when the request fails */}
        {!loading && error !== '' && (

          <View style={styles.errorBox}>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
            >

              <Text style={styles.retryText}>
                Retry
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */}
        {/* Empty state when the resident has no active subscriptions */}
        {!loading && error === '' && subscriptions.length === 0 && (
          <Text style={styles.statusText}>
            No active subscriptions yet.
          </Text>
        )}


        {/* ==================== ACTIVE SUBSCRIPTIONS API ==================== */}
        {/* One card per active subscription (ServiceRequest). All days of the
            subscription are shown together in the same card. */}
        {!loading && subscriptions.map((item, index) => {

          const serviceName = formatServiceName(item.service);
          const providerName = item.provider_name || 'Service Provider';
          const serviceDays = getServiceDays(item);
          const serviceTime = formatTimeRange(item.from_time, item.to_time);

          return (

          <TouchableOpacity
             key={item.request_id || index}
             style={styles.card}
             activeOpacity={0.85}
             onPress={() =>
  navigation.navigate('VisitorRecord')

           }
         >

            {/* Service name and status */}
            <View style={styles.cardTop}>

              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  📅
                </Text>
              </View>

              <View style={styles.cardInfo}>

                <View style={styles.nameRow}>

                  <Text style={styles.serviceName}>
                    {serviceName}
                  </Text>

                  <Text style={styles.active}>
                    Active
                  </Text>

                  <Text style={styles.arrow}>
                    ›
                  </Text>

                </View>

                <Text style={styles.provider}>
                  {providerName}
                </Text>

              </View>

            </View>


            {/* Service days */}
            {serviceDays !== '' && (

              <View style={styles.detailRow}>

                <Text style={styles.detailIcon}>
                  📅
                </Text>

                <Text style={styles.detailText}>
                  {serviceDays}
                </Text>

              </View>

            )}


            {/* Service time */}
            {serviceTime !== '' && (

              <View style={styles.detailRow}>

                <Text style={styles.detailIcon}>
                  🕐
                </Text>

                <Text style={styles.time}>
                  {serviceTime}
                </Text>

              </View>

            )}

          </TouchableOpacity>

          );

        })}

        <View style={{height: 100}} />

      </ScrollView>


      {/* Floating + Button */}
      {/* CHANGED: Plus button uses handlePlusPress (registered route + residentId) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePlusPress}
      >
        <Text style={styles.fabText}>
          +
        </Text>
      </TouchableOpacity>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>

        {/* Home */}
        {/* CHANGED: Home tab uses goHome (keeps Home cards and sends userId/name when needed) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={goHome}
        >
          <Text style={styles.navIcon}>
            🏠
          </Text>

          <Text style={styles.navText}>
            Home
          </Text>
        </TouchableOpacity>


        {/* Activity */}
        {/* CHANGED: Activity tab uses goActivity (sends userId and name) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={goActivity}
        >
          <Text style={styles.navIcon}>
            🕐
          </Text>

          <Text style={styles.navText}>
            Activity
          </Text>
        </TouchableOpacity>


        {/* Space for center button */}
        <View style={styles.navSpace} />


        {/* Schedule */}
        <TouchableOpacity style={styles.navItem}>

          <Text style={styles.navIcon}>
            📅
          </Text>

          <Text style={styles.navTextActive}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* Profile */}
        {/* CHANGED: Profile tab uses goProfile, which opens ResidentProfile instead of the Visitor "Profile" route */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={goProfile}
        >
          <Text style={styles.navIcon}>
            👤
          </Text>

          <Text style={styles.navText}>
            Profile
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },


  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
  },


  /* Header */
  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },


  /* Out of Station */
  outStation: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  warningIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  outStationText: {
    flex: 1,
  },

  outStationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },

  outStationSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },

  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
  },


  /* Active Subscriptions */
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },


  /* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
  /* Loading / empty message */
  statusText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: '#6B7280',
  },


  /* ==================== ACTIVE SUBSCRIPTIONS API ==================== */
  /* Error message box and Retry button */
  errorBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  errorText: {
    fontSize: 13,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#2D52E6',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 26,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },


  /* Subscription Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },


  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },


  iconBox: {
    width: 42,
    height: 42,
    backgroundColor: '#EEF1FF',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  icon: {
    fontSize: 20,
  },


  cardInfo: {
    flex: 1,
  },


  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  serviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },


  active: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },


  provider: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },


  /* Service information */
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 7,
  },


  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },


  detailText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },


  time: {
    fontSize: 13,
    color: '#2D52E6',
    fontWeight: '600',
  },


  /* Floating Button */
  fab: {
    position: 'absolute',
    bottom: 54,
    alignSelf: 'center',

    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: '#2D52E6',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 10,
  },


  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
  },


  /* Bottom Navigation */
  bottomNav: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',

    elevation: 8,
  },


  navItem: {
    flex: 1,
    alignItems: 'center',
  },


  navSpace: {
    width: 58,
  },


  navIcon: {
    fontSize: 21,
    marginBottom: 3,
  },


  navText: {
    fontSize: 11,
    color: '#9CA3AF',
  },


  navTextActive: {
    fontSize: 11,
    color: '#2D52E6',
    fontWeight: 'bold',
  },

});