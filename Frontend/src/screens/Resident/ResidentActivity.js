import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

// CHANGED: Component now receives "route" as well, so it can read the userId and name sent from other Resident screens
export default function ResidentActivity({navigation, route}) {

  // CHANGED: Resident id and name received from other Resident screens (same param names Home uses)
  const residentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;

  const [activeTab, setActiveTab] = useState('Pending');

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

  // CHANGED: Schedule tab now opens ResidentSchedule (it had no onPress before)
  const goSchedule = () => {
    navigation.navigate('ResidentSchedule', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Profile tab now opens ResidentProfile with userId and name (it had no onPress before)
  const goProfile = () => {
    navigation.navigate('ResidentProfile', {
      userId: residentId,
      name: residentNameParam,
    });
  };

  // CHANGED: Plus button now sends residentId to NewSubscription, exactly like ResidentHome
  const handlePlusPress = () => {
    navigation.navigate('NewSubscription', {
      residentId: residentId,
    });
  };

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
            1
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
            0
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
                  2026-09-27 • 07:00 AM
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

            {/* No completed deliveries */}

          </>

        )}

      </ScrollView>


      {/* Center + Button */}

      {/* CHANGED: Plus button uses handlePlusPress so residentId is sent to NewSubscription */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handlePlusPress}
      >
        
        <Text style={styles.fabText}>
          +
        </Text>

      </TouchableOpacity>


      {/* Bottom Navigation */}

      <View style={styles.bottomBar}>

        {/* Home */}

        {/* CHANGED: Home tab uses goHome (keeps Home cards and sends userId/name when needed) */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={goHome}
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

        {/* CHANGED: Schedule tab now has an onPress handler */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={goSchedule}
        >

          <Text style={styles.bottomIcon}>
            📅
          </Text>

          <Text style={styles.bottomText}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* Profile */}

        {/* CHANGED: Profile tab now has an onPress handler */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={goProfile}
        >

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