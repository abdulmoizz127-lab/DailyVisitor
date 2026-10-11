import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';


// CHANGED: Sirf 3 active services ka simple dummy data
const subscriptions = [
  {
    id: 1,
    service: 'Milk Delivery',
    provider: 'Ali Jahanzaib',
    days: 'Monday, Tuesday,Wednesday, Thursday,Friday, Saturday, Sunday',
    time: '07:00 AM - 07:30 AM',
  },

  {
    id: 2,
    service: 'Newspaper',
    provider: 'Abdul Moiz',
    days: 'Wednesday, Thursday',
    time: '07:30 AM - 08:30 AM',
  },

  {
    id: 3,
    service: 'Garbage',
    provider: 'Muhammad Jan',
    days: 'Friday, Saturday, Sunday',
    time: '08:00 AM - 09:00 AM',
  },
];


// CHANGED: Component now receives "route" as well, so it can read the userId and name sent from other Resident screens
export default function ResidentSchedule({navigation, route}) {

  // CHANGED: Resident id and name received from other Resident screens (same param names Home uses)
  const residentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;

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


        {/* CHANGED: Simple subscription cards */}
        {subscriptions.map((item) => (

          <TouchableOpacity
             key={item.id}
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
                    {item.service}
                  </Text>

                  <Text style={styles.active}>
                    Active
                  </Text>

                  <Text style={styles.arrow}>
                    ›
                  </Text>

                </View>

                <Text style={styles.provider}>
                  {item.provider}
                </Text>

              </View>

            </View>


            {/* Service days */}
            <View style={styles.detailRow}>

              <Text style={styles.detailIcon}>
                📅
              </Text>

              <Text style={styles.detailText}>
                {item.days}
              </Text>

            </View>


            {/* Service time */}
            <View style={styles.detailRow}>

              <Text style={styles.detailIcon}>
                🕐
              </Text>

              <Text style={styles.time}>
                {item.time}
              </Text>

            </View>

          </TouchableOpacity>

        ))}

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