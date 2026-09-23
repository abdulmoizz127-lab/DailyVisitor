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
    days: 'Monday, Tuesday',
    time: '07:00 AM - 08:00 AM',
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


export default function ResidentSchedule({navigation}) {

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
        <TouchableOpacity style={styles.outStation}>

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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FindProvider')}
      >
        <Text style={styles.fabText}>
          +
        </Text>
      </TouchableOpacity>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>

        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ResidentHome')}
        >
          <Text style={styles.navIcon}>
            🏠
          </Text>

          <Text style={styles.navText}>
            Home
          </Text>
        </TouchableOpacity>


        {/* Activity */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ResidentActivity')}
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
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