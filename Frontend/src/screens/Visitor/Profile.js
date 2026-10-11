import React, {useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

// MODIFIED: route add kiya taake Visitor Home se aane wale userId aur name read ho sakein
export default function Profile({navigation, route}) {

  // ADDED: Visitor Home se aaya hua userId, taake wapas Home bhejne par cards dobara load ho sakein
  const visitorUserId = route.params?.userId;

  // ADDED: Visitor Home se aaya hua name, taake wapas Home bhejne par greeting sahi dikhe
  const visitorName = route.params?.name;

  // ADDED: Profile aur Alternatives tabs ke liye state
  const [activeTab, setActiveTab] = useState('Profile');

  // ADDED: New alternative add karne ke liye states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');

  // ADDED: Sample alternatives list; baad mein backend se connect hogi
  const [alternatives, setAlternatives] = useState([
    {
      id: '1',
      name: 'Abdul Moiz',
      phone: '0312-5678901',
      relation: 'Colleague',
    },
    {
      id: '2',
      name: 'Mohammad Charzeb',
      phone: '0300-1234567',
      relation: 'Colleague',
    },
  ]);

  // ADDED: New alternative ko list mein save karne ka function
  const addAlternative = () => {
    if (!newName.trim() || !newPhone.trim() || !newRelation.trim()) {
      Alert.alert('Required Fields', 'Please fill all fields.');
      return;
    }

    setAlternatives([
      ...alternatives,
      {
        id: Date.now().toString(),
        name: newName.trim(),
        phone: newPhone.trim(),
        relation: newRelation.trim(),
      },
    ]);

    setNewName('');
    setNewPhone('');
    setNewRelation('');
    setShowAddForm(false);
  };

  // ADDED: Sign out confirmation
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Do you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        onPress: () => navigation.navigate('Welcome'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* UPDATED: Screenshot jaisa blue profile header */}
        <View style={styles.header}>

          <View style={styles.profileTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>Ali Jahanzaib</Text>
              <Text style={styles.role}>💼 Milk Delivery</Text>

              <View style={styles.badgeRow}>
                <Text style={styles.badge}>🛡 Visitor</Text>
                <Text style={styles.badge}>★ 4.8</Text>
              </View>
            </View>
          </View>

          {/* ADDED: Visitor ID, Total Jobs aur Alternatives cards */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>V1</Text>
              <Text style={styles.statLabel}>Visitor ID</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Total Jobs</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{alternatives.length}</Text>
              <Text style={styles.statLabel}>Alternatives</Text>
            </View>
          </View>

          {/* ADDED: Profile aur Alternatives tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'Profile' && styles.selectedTab,
              ]}
              onPress={() => setActiveTab('Profile')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Profile' && styles.selectedTabText,
                ]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'Alternatives' && styles.selectedTab,
              ]}
              onPress={() => setActiveTab('Alternatives')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Alternatives' && styles.selectedTabText,
                ]}>
                Alternatives ({alternatives.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* UPDATED: Tab ke mutabiq content show hoga */}
        {activeTab === 'Profile' ? (

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.card}>

              <TouchableOpacity
                style={styles.accountRow}
                onPress={() =>
                  Alert.alert('Edit Profile', 'Profile editing will be added later.')
                }>
                <Text style={styles.optionIcon}>💼</Text>
                <View style={styles.optionInfo}>
                  <Text style={styles.rowTitle}>Edit Profile</Text>
                  <Text style={styles.rowSubtitle}>
                    Update name and profession
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accountRow}
                onPress={() =>
                  Alert.alert('Privacy & Security', 'Settings will be added later.')
                }>
                <Text style={styles.optionIcon}>🛡️</Text>
                <View style={styles.optionInfo}>
                  <Text style={styles.rowTitle}>Privacy & Security</Text>
                  <Text style={styles.rowSubtitle}>
                    Manage your account security
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.accountRow, styles.lastRow]}
                onPress={() =>
                  Alert.alert('Rate Our App', 'Thanks for your feedback!')
                }>
                <Text style={styles.optionIcon}>⭐</Text>
                <View style={styles.optionInfo}>
                  <Text style={styles.rowTitle}>Rate Our App</Text>
                  <Text style={styles.rowSubtitle}>
                    Share your feedback
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

            </View>

            {/* UPDATED: Sign Out button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}>
              <Text style={styles.logoutText}>↪  Sign Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>
              Smart Visitor Management v1.0
            </Text>
          </View>

        ) : (

          /* ADDED: Alternatives ki list */
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Alternatives</Text>

            {alternatives.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.emptyText}>
                  No alternatives added yet.
                </Text>
              </View>
            ) : (
              <View style={styles.card}>
                {alternatives.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.alternativeRow,
                      index === alternatives.length - 1 && styles.lastRow,
                    ]}
                    onPress={() =>
                      Alert.alert(
                        item.name,
                        'Phone: ' + item.phone + '\nRelation: ' + item.relation,
                      )
                    }>
                    <View style={styles.alternativeAvatar}>
                      <Text style={styles.alternativeInitial}>
                        {item.name
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.optionInfo}>
                      <Text style={styles.rowTitle}>{item.name}</Text>
                      <Text style={styles.rowSubtitle}>{item.phone}</Text>
                      <Text style={styles.rowSubtitle}>{item.relation}</Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ADDED: New alternative form open/close button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}>
              <Text style={styles.addButtonText}>
                {showAddForm ? 'Cancel' : '+ Add New Alternative'}
              </Text>
            </TouchableOpacity>

            {/* ADDED: New alternative ki details enter karne ka form */}
            {showAddForm && (
              <View style={styles.card}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={newName}
                  onChangeText={setNewName}
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  value={newPhone}
                  onChangeText={setNewPhone}
                />

                <Text style={styles.inputLabel}>Relation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Colleague, Friend"
                  value={newRelation}
                  onChangeText={setNewRelation}
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={addAlternative}>
                  <Text style={styles.saveButtonText}>Save Alternative</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* MODIFIED: Bottom navigation ab Visitor Home jaisi chaar tabs hain,
          wahi order: Home, Activity, Schedule, Profile. Purana Services tab remove kar diya
          kyunke App.js mein 'Services' naam ka koi route registered nahi hai. */}
      <View style={styles.bottomBar}>

        {/* MODIFIED: Home par wapas jaate waqt userId aur name wapas bhej rahe hain
            (route 'VisitorHome' App.js mein registered hai), taake VisitorHome
            accepted services dobara fetch kar sake aur cards dikhein */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('VisitorHome', {
              userId: visitorUserId,
              name: visitorName,
            })
          }>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* ADDED: Activity tab, Visitor Home ki tarah second position par.
            Route 'VisitorActivity' App.js mein registered hai.
            userId aur name bhi bhej rahe hain; agar Activity screen inhein use na kare to koi farq nahi parta. */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('VisitorActivity', {
              userId: visitorUserId,
              name: visitorName,
            })
          }>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>

        {/* MODIFIED: Schedule tab ab third position par hai (Services ki jagah).
            Route 'Schedule' App.js mein registered hai (ScheduleScreen).
            userId aur name bhi bhej rahe hain taake Schedule se wapas aane ka flow baad mein use kar sake. */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Schedule', {
              userId: visitorUserId,
              name: visitorName,
            })
          }>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>

        {/* Profile tab: current screen, last position (unchanged) */}
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIconBox}>
            <Text style={styles.activeIcon}>👤</Text>
          </View>
          <Text style={styles.activeText}>Profile</Text>
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

  
 header: {
  backgroundColor: '#2563EB',
  paddingHorizontal: 16,
  paddingTop: 55, 
  paddingBottom: 16,
  borderBottomLeftRadius: 22,
  borderBottomRightRadius: 22,
},

  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 29,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  role: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 4,
  },

  badgeRow: {
    flexDirection: 'row',
    marginTop: 7,
    gap: 7,
  },

  badge: {
    color: '#FFFFFF',
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // ADDED: Three small statistic cards
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },

  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#E0E7FF',
    fontSize: 10,
    marginTop: 4,
  },

  // ADDED: Two tabs inside blue header
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 9,
  },

  selectedTab: {
    backgroundColor: '#FFFFFF',
  },

  tabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  selectedTabText: {
    color: '#1D4ED8',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 4,
    elevation: 2,
    marginBottom: 16,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  optionIcon: {
    fontSize: 19,
    width: 42,
    height: 42,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#F1F5FF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },

  optionInfo: {
    flex: 1,
  },

  rowTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: 'bold',
  },

  rowSubtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    color: '#9CA3AF',
    fontSize: 23,
    marginHorizontal: 5,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  logoutButton: {
    backgroundColor: '#FDEAEA',
    borderWidth: 1,
    borderColor: '#F5B5B5',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 1,
  },

  logoutText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 14,
  },

  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 15,
    marginBottom: 20,
  },

  // ADDED: Alternative list design
  alternativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  alternativeAvatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  alternativeInitial: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // ADDED: Add alternative button and input form styles
  addButton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  inputLabel: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
  },

  saveButton: {
    backgroundColor: '#16A34A',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 14,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // UPDATED: Bottom navigation
  bottomBar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    fontSize: 21,
    color: '#9CA3AF',
  },

  navText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },

  activeIconBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },

  activeIcon: {
    fontSize: 21,
    color: '#2563EB',
  },

  activeText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 3,
  },

});