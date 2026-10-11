import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

// Resident ki sample information
const resident = {
  memberId: 'R1',
  name: 'Dr. Moiz Ahmed',
  location: 'House # 42, Street 5, DHA Phase 6, Karachi',
  activeServices: 3,
  initials: 'DM',
  status: 'Resident',
  verified: true,
};

// Resident ke saved neighbours ki sample list
const neighbours = [
  {
    id: '1',
    name: 'Ahmad Raza',
    phone: '0300-1234567',
    relation: 'Next door (right)',
    initials: 'AR',
  },
  {
    id: '2',
    name: 'Sana Khan',
    phone: '0333-9876543',
    relation: 'Two doors down (left)',
    initials: 'SK',
  },
];

const BLUE = '#2D52E6';
const BLUE_DARK = '#1e3fc4';

// CHANGED: Component now receives both "navigation" and "route"
export default function ResidentProfileScreen({ navigation, route }) {
  // CHANGED: Read userId and name sent from ResidentHome (same param names Home uses)
  const residentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;

  const [activeTab, setActiveTab] = useState('profile');

  // Edit Profile button ka action
  const handleEditProfile = () => {
    const routeNames = navigation.getState().routeNames || [];

    if (routeNames.includes('EditProfile')) {
      navigation.navigate('EditProfile');
      return;
    }

    Alert.alert('Edit Profile', 'Profile editing will be available here.');
  };

  // Privacy & Security button ka action
  const handlePrivacySecurity = () => {
    const routeNames = navigation.getState().routeNames || [];

    if (routeNames.includes('PrivacySecurity')) {
      navigation.navigate('PrivacySecurity');
      return;
    }

    Alert.alert(
      'Privacy & Security',
      'Security settings will be available here.',
    );
  };

  // Rate Our App button ka action
  const handleRateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Thanks for using Smart Visitor Management!',
    );
  };

  // Sign Out button ka action
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            const routeNames = navigation.getState().routeNames || [];

            // CHANGED: Resident login route use karein
            if (routeNames.includes('ResidentLogin')) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ResidentLogin' }],
              });
            } else {
              Alert.alert(
                'Notice',
                'ResidentLogin route App.js mein registered nahi hai.',
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Neighbour par click karne ka action
  const handleNeighbourPress = (neighbour) => {
    const routeNames = navigation.getState().routeNames || [];

    if (routeNames.includes('ResidentNeighbourDetail')) {
      navigation.navigate('ResidentNeighbourDetail', { neighbour });
      return;
    }

    Alert.alert(
      neighbour.name,
      `${neighbour.phone}\n${neighbour.relation}`,
    );
  };

  // CHANGED: Go to ResidentHome and send userId/name back only when they are available.
  // Params are built conditionally and merged, so existing Home params are never overwritten with undefined.
  const goHome = () => {
    // CHANGED: If Home is the previous screen in this stack, simply go back to it.
    // This reuses the already mounted Home (cards and params stay intact) and
    // never creates a second, empty ResidentHome screen.
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

  // CHANGED: Resident Activity par navigation, now sending userId and name
  const goActivity = () => {
    navigation.navigate('ResidentActivity', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Resident Schedule par navigation, now sending userId and name
  const goSchedule = () => {
    navigation.navigate('ResidentSchedule', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Plus button opens NewSubscription and sends residentId, exactly like ResidentHome.
  // The routeNames check was removed because ResidentHome already navigates to NewSubscription directly.
  const handlePlusPress = () => {
    navigation.navigate('NewSubscription', {
      residentId: residentId,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blue Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{resident.initials}</Text>
          </View>

          <Text style={styles.residentName}>{resident.name}</Text>
          <Text style={styles.residentLocation}>{resident.location}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{resident.status}</Text>
            </View>

            {resident.verified && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Resident statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{resident.memberId}</Text>
              <Text style={styles.statLabel}>Member ID</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statValue}>{neighbours.length}</Text>
              <Text style={styles.statLabel}>Neighbours</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statValue}>
                {resident.activeServices} Active
              </Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
          </View>
        </View>

        {/* Profile aur Neighbours tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'profile' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'profile' && styles.tabTextActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'neighbours' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab('neighbours')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'neighbours' && styles.tabTextActive,
              ]}
            >
              Neighbours ({neighbours.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab ke mutabiq content show hoga */}
        <View style={styles.contentArea}>
          {activeTab === 'profile' ? (
            <>
              <Text style={styles.sectionTitle}>Account</Text>

              <View style={styles.accountCard}>
                <TouchableOpacity
                  style={[styles.accountRow, styles.accountRowDivider]}
                  onPress={handleEditProfile}
                  activeOpacity={0.7}
                >
                  <View style={styles.accountIconCircle}>
                    <Text style={styles.accountIcon}>✏️</Text>
                  </View>

                  <View style={styles.accountTextBlock}>
                    <Text style={styles.accountRowTitle}>Edit Profile</Text>
                    <Text style={styles.accountRowSubtitle}>
                      Update name and address
                    </Text>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.accountRow, styles.accountRowDivider]}
                  onPress={handlePrivacySecurity}
                  activeOpacity={0.7}
                >
                  <View style={styles.accountIconCircle}>
                    <Text style={styles.accountIcon}>🔒</Text>
                  </View>

                  <View style={styles.accountTextBlock}>
                    <Text style={styles.accountRowTitle}>
                      Privacy & Security
                    </Text>
                    <Text style={styles.accountRowSubtitle}>
                      Manage your account security
                    </Text>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.accountRow}
                  onPress={handleRateApp}
                  activeOpacity={0.7}
                >
                  <View style={styles.accountIconCircle}>
                    <Text style={styles.accountIcon}>⭐</Text>
                  </View>

                  <View style={styles.accountTextBlock}>
                    <Text style={styles.accountRowTitle}>Rate Our App</Text>
                    <Text style={styles.accountRowSubtitle}>
                      Share your feedback
                    </Text>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Out */}
              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleSignOut}
                activeOpacity={0.8}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>

              {/* App version */}
              <Text style={styles.versionText}>
                Smart Visitor Management v1.0
              </Text>
            </>
          ) : (
            <>
              {/* Neighbours list */}
              <Text style={styles.sectionTitle}>Neighbours</Text>

              {neighbours.map((neighbour) => (
                <TouchableOpacity
                  key={neighbour.id}
                  style={styles.neighbourCard}
                  onPress={() => handleNeighbourPress(neighbour)}
                  activeOpacity={0.75}
                >
                  <View style={styles.neighbourAvatar}>
                    <Text style={styles.neighbourAvatarText}>
                      {neighbour.initials}
                    </Text>
                  </View>

                  <View style={styles.neighbourInfo}>
                    <Text style={styles.neighbourName}>
                      {neighbour.name}
                    </Text>
                    <Text style={styles.neighbourPhone}>
                      {neighbour.phone}
                    </Text>
                    <Text style={styles.neighbourRelation}>
                      {neighbour.relation}
                    </Text>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.versionText}>
                Smart Visitor Management v1.0
              </Text>
            </>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* CHANGED: Center plus button now placed BEFORE the bottom bar, same order as ResidentHome */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePlusPress}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* CHANGED: Bottom navigation re-indented to match ResidentHome (Profile tab stays active) */}
      <View style={styles.bottomBar}>

        {/* Home tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={goHome}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>🏠</Text>
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>

        {/* Activity tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={goActivity}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>🕐</Text>
          <Text style={styles.text}>Activity</Text>
        </TouchableOpacity>

        {/* Center plus button ke liye Home jaisi reserved space */}
        <View style={styles.fabSpace} />

        {/* Schedule tab */}
        <TouchableOpacity
          style={styles.tab}
          onPress={goSchedule}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.text}>Schedule</Text>
        </TouchableOpacity>

        {/* Current screen: Profile tab active */}
        <TouchableOpacity style={styles.tab} activeOpacity={0.7}>
          <Text style={styles.activeIcon}>👤</Text>
          <Text style={styles.activeText}>Profile</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 16,
  },

  // Blue header
  header: {
    backgroundColor: BLUE,
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },

  residentName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },

  residentLocation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Statistics cards
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
  },

  statCol: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },

  // Profile tabs
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: BLUE_DARK,
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  tabBtnActive: {
    backgroundColor: '#ffffff',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },

  tabTextActive: {
    color: BLUE,
  },

  // Main content
  contentArea: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },

  // Account card
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  accountRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },

  accountIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eef1ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  accountIcon: {
    fontSize: 16,
  },

  accountTextBlock: {
    flex: 1,
  },

  accountRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },

  accountRowSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },

  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '300',
  },

  // Sign Out button
  signOutBtn: {
    backgroundColor: '#fde8ec',
    borderWidth: 1,
    borderColor: '#f5b8c4',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 18,
  },

  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e11d3d',
  },

  // Version text
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },

  // Neighbour cards
  neighbourCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  neighbourAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eef1ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  neighbourAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: BLUE,
  },

  neighbourInfo: {
    flex: 1,
  },

  neighbourName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },

  neighbourPhone: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },

  neighbourRelation: {
    fontSize: 12,
    color: BLUE,
    fontWeight: '600',
  },

  // UPDATED: Home screen jaisi bottom navigation bar
  bottomBar: {
    height: 65,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 10,
  },

  // UPDATED: Navigation tabs ki equal width aur alignment
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // UPDATED: Center plus button ke liye reserved space
  fabSpace: {
    width: 58,
  },

  // UPDATED: Normal navigation icon
  icon: {
    fontSize: 20,
  },

  // UPDATED: Active Profile icon
  activeIcon: {
    fontSize: 20,
  },

  // UPDATED: Normal navigation label
  text: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },

  // UPDATED: Active Profile label
  activeText: {
    fontSize: 11,
    color: '#2D52E6',
    fontWeight: 'bold',
    marginTop: 3,
  },

  // UPDATED: Home screen jaisa floating plus button
  fab: {
    position: 'absolute',
    bottom: 58,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2D52E6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    zIndex: 10,
  },

  // UPDATED: Plus button ka text
  fabText: {
    color: '#FFFFFF',
    fontSize: 30,
  },
});