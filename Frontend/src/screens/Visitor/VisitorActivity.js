import React, {useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Dummy activity data - backend baad mein connect hoga
const pendingRequests = [
  {
    id: 1,
    service: 'Milk Delivery',
    resident: 'Dr. Moiz Ahmed',
    date: '2026-10-10',
    time: '07:00 AM',
    status: 'Waiting',
  },
];

const completedRequests = [
  {
    id: 2,
    service: 'Newspaper Delivery',
    resident: 'Mrs. Ayesha Khan',
    date: '2026-10-08',
    time: '06:00 AM',
    status: 'Completed',
  },
];

// MODIFIED: route add kiya taake Visitor Home se aane wale userId aur name read ho sakein
export default function VisitorActivity({navigation, route}) {

  // ADDED: Visitor Home ya Profile se aaya hua userId, taake wapas Home bhejne par cards dobara load ho sakein
  const visitorUserId = route.params?.userId;

  // ADDED: Visitor Home ya Profile se aaya hua name, taake wapas Home bhejne par greeting sahi dikhe
  const visitorName = route.params?.name;

  const [selectedTab, setSelectedTab] = useState('Pending');

  // Selected tab ke according requests show hongi
  const requests =
    selectedTab === 'Pending'
      ? pendingRequests
      : completedRequests;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Activity heading */}
        <Text style={styles.heading}>Activity</Text>

        {/* Pending and Completed tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'Pending' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Pending')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Pending' && styles.activeTabText,
              ]}
            >
              Pending {pendingRequests.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'Completed' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Completed')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Completed' && styles.activeTabText,
              ]}
            >
              Completed {completedRequests.length}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Request section */}
        <Text style={styles.sectionTitle}>
          {selectedTab === 'Pending' ? 'WAITING' : 'COMPLETED'}
        </Text>

        {/* Activity cards */}
        {requests.length > 0 ? (
          requests.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.resident.charAt(0)}
                </Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.service}>
                  {item.service}
                </Text>

                <Text style={styles.resident}>
                  {item.resident}
                </Text>

                <Text style={styles.date}>
                  {item.date} • {item.time}
                </Text>
              </View>

              <View
                style={[
                  styles.status,
                  selectedTab === 'Completed' &&
                    styles.completedStatus,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    selectedTab === 'Completed' &&
                      styles.completedStatusText,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No {selectedTab.toLowerCase()} requests.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomBar}>
        {/* MODIFIED: Home par wapas jaate waqt userId aur name wapas bhej rahe hain
            (route 'VisitorHome' App.js mein registered hai), taake VisitorHome
            accepted services dobara fetch kar sake aur cards dikhein */}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() =>
            navigation.navigate('VisitorHome', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >
          <Text style={styles.icon}>🏠</Text>
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab}>
          <Text style={styles.activeIcon}>◉</Text>
          <Text style={styles.activeText}>Activity</Text>
        </TouchableOpacity>

        {/* MODIFIED: Schedule screen ko userId aur name bhej rahe hain,
            taake Schedule se wapas Home aane par cards dobara load ho sakein.
            Route 'Schedule' App.js mein registered hai. */}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() =>
            navigation.navigate('Schedule', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.bottomText}>Schedule</Text>
        </TouchableOpacity>

        {/* ADDED: Profile tab ka onPress pehle missing tha, isliye kuch nahi hota tha.
            Route 'Profile' App.js mein registered hai (Visitor Profile).
            userId aur name bhej rahe hain taake Profile se wapas Home aane par cards load hon. */}
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() =>
            navigation.navigate('Profile', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.bottomText}>Profile</Text>
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
    padding: 20,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 35,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 42,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 25,
    marginRight: 10,
    elevation: 2,
  },

  activeTab: {
    backgroundColor: '#2D52E6',
  },

  tabText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF4D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#B7791F',
    fontSize: 19,
    fontWeight: 'bold',
  },

  details: {
    flex: 1,
  },

  service: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  resident: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 5,
  },

  date: {
    color: '#9CA3AF',
    fontSize: 11,
  },

  status: {
    borderWidth: 1,
    borderColor: '#F2D36B',
    backgroundColor: '#FFFBEB',
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginLeft: 5,
  },

  statusText: {
    color: '#B7791F',
    fontWeight: '600',
    fontSize: 12,
  },

  completedStatus: {
    backgroundColor: '#EAF7EE',
    borderColor: '#B7E4C7',
  },

  completedStatusText: {
    color: '#218838',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },

  bottomBar: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 10,
  },

  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 21,
  },

  activeIcon: {
    fontSize: 21,
    color: '#2D52E6',
  },

  bottomText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },

  activeText: {
    fontSize: 12,
    color: '#2D52E6',
    fontWeight: 'bold',
    marginTop: 4,
  },
});