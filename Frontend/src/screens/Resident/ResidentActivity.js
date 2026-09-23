import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ResidentActivity({navigation}) {

  const [activeTab, setActiveTab] = useState('Pending');

  return (
    <SafeAreaView style={styles.container}>

      {/* Heading */}

      <Text style={styles.title}>
        Activity
      </Text>


      {/* Pending / Completed */}

      <View style={styles.topTabs}>

        <TouchableOpacity
          style={[
            styles.topTab,
            activeTab === 'Pending' && styles.activeTopTab,
          ]}
          onPress={() => setActiveTab('Pending')}
        >
          <Text
            style={[
              styles.topTabText,
              activeTab === 'Pending' && styles.activeTopTabText,
            ]}
          >
            Pending
          </Text>

          <Text
            style={[
              styles.count,
              activeTab === 'Pending' && styles.activeCount,
            ]}
          >
            2
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.topTab,
            activeTab === 'Completed' && styles.activeTopTab,
          ]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text
            style={[
              styles.topTabText,
              activeTab === 'Completed' && styles.activeTopTabText,
            ]}
          >
            Completed
          </Text>

          <Text
            style={[
              styles.count,
              activeTab === 'Completed' && styles.activeCount,
            ]}
          >
            1
          </Text>
        </TouchableOpacity>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {activeTab === 'Pending' ? (

          <>

            <Text style={styles.sectionTitle}>
              WAITING
            </Text>


            {/* First Delivery */}

            <View style={styles.card}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  AJ
                </Text>
              </View>

              <View style={styles.cardInfo}>

                <Text style={styles.deliveryTitle}>
                  Milk Delivery
                </Text>

                <Text style={styles.name}>
                  Ali Jahanzaib
                </Text>

                <Text style={styles.date}>
                  2026-09-06 • 07:00 AM
                </Text>

              </View>

              <View style={styles.waiting}>
                <Text style={styles.waitingText}>
                  Waiting
                </Text>
              </View>

            </View>


            {/* Second Delivery */}

            <View style={styles.card}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  AM
                </Text>
              </View>

              <View style={styles.cardInfo}>

                <Text style={styles.deliveryTitle}>
                  Milk Delivery
                </Text>

                <Text style={styles.name}>
                  Abdul Moiz
                </Text>

                <Text style={styles.date}>
                  2026-09-06 • 07:30 AM
                </Text>

              </View>

              <View style={styles.waiting}>
                <Text style={styles.waitingText}>
                  Waiting
                </Text>
              </View>

            </View>

          </>

        ) : (

          <>

            <Text style={styles.sectionTitle}>
              COMPLETED
            </Text>

            <View style={styles.card}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  AJ
                </Text>
              </View>

              <View style={styles.cardInfo}>

                <Text style={styles.deliveryTitle}>
                  Milk Delivery
                </Text>

                <Text style={styles.name}>
                  Ali Jahanzaib
                </Text>

                <Text style={styles.date}>
                  Completed
                </Text>

              </View>

              <Text style={styles.paid}>
                Paid
              </Text>

            </View>

          </>

        )}

      </ScrollView>


      {/* Center + Button */}

      <TouchableOpacity style={styles.fab}
      onPress={() => navigation.navigate('NewSubscription')}>
        
        <Text style={styles.fabText}>
          +
        </Text>
      </TouchableOpacity>


      {/* Bottom Navigation */}

      <View style={styles.bottomBar}>

        {/* Home */}

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('ResidentHome')}
        >
          <Text style={styles.bottomIcon}>
            🏠
          </Text>

          <Text style={styles.bottomText}>
            Home
          </Text>
        </TouchableOpacity>


        {/* Activity */}

        <TouchableOpacity style={styles.bottomItem}>

          <Text style={styles.activeIcon}>
            ◉
          </Text>

          <Text style={styles.activeText}>
            Activity
          </Text>

        </TouchableOpacity>


        {/* Space for + */}

        <View style={styles.fabSpace} />


        {/* Schedule */}

        <TouchableOpacity style={styles.bottomItem}>

          <Text style={styles.bottomIcon}>
            📅
          </Text>

          <Text style={styles.bottomText}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* Profile */}

        <TouchableOpacity style={styles.bottomItem}>

          <Text style={styles.bottomIcon}>
            👤
          </Text>

          <Text style={styles.bottomText}>
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

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 18,
  },

  topTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
    elevation: 2,
  },

  activeTopTab: {
    backgroundColor: '#2D52E6',
  },

  topTabText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },

  activeTopTabText: {
    color: 'white',
  },

  count: {
    marginLeft: 7,
    color: '#6B7280',
    fontSize: 12,
  },

  activeCount: {
    color: 'white',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF5DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#B7791F',
    fontWeight: 'bold',
  },

  cardInfo: {
    flex: 1,
  },

  deliveryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },

  name: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },

  date: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },

  waiting: {
    borderWidth: 1,
    borderColor: '#F4D35E',
    backgroundColor: '#FFFBEB',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  waitingText: {
    color: '#C27A00',
    fontSize: 11,
    fontWeight: 'bold',
  },

  paid: {
    color: '#22A447',
    fontSize: 12,
    fontWeight: 'bold',
  },

  fab: {
    position: 'absolute',
    bottom: 55,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2D52E6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },

  fabText: {
    color: 'white',
    fontSize: 30,
  },

  bottomBar: {
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 10,
  },

  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabSpace: {
    width: 58,
  },

  bottomIcon: {
    fontSize: 19,
  },

  activeIcon: {
    fontSize: 19,
    color: '#2D52E6',
  },

  bottomText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },

  activeText: {
    fontSize: 11,
    color: '#2D52E6',
    fontWeight: 'bold',
    marginTop: 3,
  },

});