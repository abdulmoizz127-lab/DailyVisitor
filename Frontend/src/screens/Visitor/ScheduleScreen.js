import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';


const services = [
  {
    id: 1,
    service: 'Milk Delivery',
    customer: 'Dr. Moiz Ahmed',
    time: '07:00 AM – 08:00 AM',
    address: 'House # 42, Street 5, DHA Phase 6',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },

  {
    id: 2,
    service: 'Milk Delivery',
    customer: 'Mrs. Ayesha Khan',
    time: '07:30 AM – 08:30 AM',
    address: 'Flat 304, Block B, Gulshan-e-Iqbal',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },

  {
    id: 3,
    service: 'Milk Delivery',
    customer: 'Mr. Hassan Raza',
    time: '08:00 AM – 09:00 AM',
    address: 'House 45, Sector C, Bahria Town',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
];


export default function ScheduleScreen() {

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Heading */}

        <Text style={styles.title}>
          Service Management
        </Text>

        <Text style={styles.subtitle}>
          Manage your active services
        </Text>


        {/* Out of Station */}

        <TouchableOpacity style={styles.outCard}>

          <View style={styles.outIcon}>
            <Text>
              ⚠️
            </Text>
          </View>

          <View style={styles.outInfo}>

            <Text style={styles.outTitle}>
              Set Out of Station
            </Text>

            <Text style={styles.outText}>
              Select a day and manage your services
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        {/* Active Services */}

        <View style={styles.serviceHeader}>

          <Text style={styles.serviceTitle}>
            Active Services
          </Text>

          <Text style={styles.count}>
            {services.length} services
          </Text>

        </View>


        {/* Service Cards */}

        {services.map(item => (

          <View
            key={item.id}
            style={styles.card}
          >

            <View style={styles.cardHeader}>

              <Text style={styles.serviceName}>
                {item.service}
              </Text>

              <View style={styles.active}>

                <Text style={styles.activeText}>
                  Active
                </Text>

              </View>

            </View>


            <Text style={styles.customer}>
              {item.customer}
            </Text>


            <Text style={styles.detail}>
              🕐 {item.time}
            </Text>


            <Text style={styles.detail}>
              📍 {item.address}
            </Text>


            <View style={styles.days}>

              {item.days.map(day => (

                <View
                  key={day}
                  style={styles.day}
                >

                  <Text style={styles.dayText}>
                    {day}
                  </Text>

                </View>

              ))}

            </View>

          </View>

        ))}

      </ScrollView>


      {/* Bottom Navigation */}

      <View style={styles.bottom}>

        <TouchableOpacity style={styles.tab}>
          <Text style={styles.icon}>
            🏠
          </Text>

          <Text style={styles.tabText}>
            Home
          </Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.tab}>

          <View style={styles.activeIcon}>
            <Text>
              📅
            </Text>
          </View>

          <Text style={styles.activeText}>
            Schedule
          </Text>

        </TouchableOpacity>


        <TouchableOpacity style={styles.tab}>

          <Text style={styles.icon}>
            💼
          </Text>

          <Text style={styles.tabText}>
            Services
          </Text>

        </TouchableOpacity>



        <TouchableOpacity style={styles.tab}>

          <Text style={styles.icon}>
            👤
          </Text>

          <Text style={styles.tabText}>
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
    backgroundColor: '#F5F7FA',
  },


  content: {
    padding: 18,
    paddingBottom: 30,
  },


  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
  },


  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 18,
  },


  outCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    marginBottom: 22,

    elevation: 2,
  },


  outIcon: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#FEE2E2',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },


  outInfo: {
    flex: 1,
  },


  outTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  outText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },


  arrow: {
    fontSize: 25,
    color: '#9CA3AF',
  },


  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 12,
  },


  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },


  count: {
    fontSize: 11,
    color: '#2563EB',

    backgroundColor: '#EFF6FF',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 15,
  },


  card: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 15,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 2,
  },


  cardHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },


  serviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  active: {
    backgroundColor: '#DBEAFE',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 10,
  },


  activeText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: 'bold',
  },


  customer: {
    fontSize: 12,
    color: '#374151',

    marginTop: 5,
    marginBottom: 10,
  },


  detail: {
    fontSize: 11,
    color: '#64748B',

    marginBottom: 7,
  },


  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 4,
  },


  day: {
    backgroundColor: '#EFF6FF',

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 8,

    marginRight: 6,
    marginBottom: 5,
  },


  dayText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
  },


  bottom: {
    height: 70,

    backgroundColor: 'white',

    flexDirection: 'row',

    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',

    paddingHorizontal: 5,
  },


  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  icon: {
    fontSize: 19,
    marginBottom: 3,
  },


  activeIcon: {
    backgroundColor: '#EEF3FF',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 9,

    marginBottom: 3,
  },


  tabText: {
    fontSize: 9,
    color: '#94A3B8',
  },


  activeText: {
    fontSize: 9,
    color: '#2563EB',
    fontWeight: 'bold',
  },

});