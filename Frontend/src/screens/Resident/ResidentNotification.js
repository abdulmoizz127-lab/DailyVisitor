// ==================== REACT IMPORT ====================
// React aur screen lifecycle ke liye import kar rahe hain
import React, {useEffect, useState} from 'react';

// ==================== REACT NATIVE IMPORT ====================
// Notification screen ke UI components import kar rahe hain
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';


// ==================== RESIDENT NOTIFICATION SCREEN ====================
// Resident ki service request notifications display kar rahe hain
export default function ResidentNotification({navigation, route}) {

  // ==================== GET RESIDENT USER ID ====================
  // ResidentHome se logged-in resident ka userId receive kar rahe hain
  const residentUserId = route.params?.userId;

  // ==================== NOTIFICATIONS STATE ====================
  // Backend se aane wali notifications ko store kar rahe hain
  const [notifications, setNotifications] = useState([]);

  // ==================== LOADING STATE ====================
  // API request ke waqt loading status maintain kar rahe hain
  const [loading, setLoading] = useState(true);


  // ==================== FETCH NOTIFICATIONS ====================
  // Screen open hone par resident ki notifications backend se fetch karenge
  useEffect(() => {

    // ==================== CHECK RESIDENT USER ID ====================
    // Agar resident userId nahi mila to API call nahi karenge
    if (!residentUserId) {
      setLoading(false);

      Alert.alert(
        'Error',
        'Resident user ID is missing.'
      );

      return;
    }

    // ==================== CALL NOTIFICATION API ====================
    // Backend se resident ki accepted/rejected notifications le rahe hain
    fetch(
      `http://localhost:5000/api/residents/notifications/${residentUserId}`
    )
      .then(response => response.json())

      // ==================== PROCESS API RESPONSE ====================
      // Backend response ko notifications state mein save kar rahe hain
      .then(data => {

        console.log(
          'Resident notifications response:',
          data
        );

        if (data.notifications) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]);
        }
      })

      // ==================== API ERROR ====================
      // Agar notification API fail ho jaye to error console mein show karenge
      .catch(error => {

        console.log(
          'Resident notification fetch error:',
          error
        );

        Alert.alert(
          'Error',
          'Notifications could not be loaded.'
        );
      })

      // ==================== STOP LOADING ====================
      // API complete hone ke baad loading false karenge
      .finally(() => {
        setLoading(false);
      });

  }, [residentUserId]);


  // ==================== FORMAT NOTIFICATION TIME ====================
  // Database ke created_at ko readable relative time mein convert kar rahe hain
  const getRelativeTime = createdAt => {

    // ==================== CHECK CREATED DATE ====================
    // Agar createdAt available nahi hai to default text return karenge
    if (!createdAt) {
      return 'Recently';
    }

    // ==================== CREATE DATE ====================
    // Database date ko JavaScript Date mein convert kar rahe hain
    const createdDate = new Date(createdAt);

    // ==================== CURRENT TIME ====================
    // Abhi ka time le rahe hain
    const currentDate = new Date();

    // ==================== CALCULATE DIFFERENCE ====================
    // Dono dates ke darmiyan milliseconds calculate kar rahe hain
    const difference =
      currentDate.getTime() - createdDate.getTime();

    // ==================== CONVERT TO MINUTES ====================
    // Difference ko minutes mein convert kar rahe hain
    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    // ==================== LESS THAN ONE MINUTE ====================
    // Agar notification ek minute se kam purani hai
    if (minutes < 1) {
      return 'Just now';
    }

    // ==================== MINUTES DISPLAY ====================
    // Agar notification minutes purani hai
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    // ==================== HOURS DISPLAY ====================
    // Agar notification hours purani hai
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    // ==================== DAYS DISPLAY ====================
    // Agar notification days purani hai
    const days = Math.floor(hours / 24);

    return `${days}d ago`;
  };


  // ==================== FORMAT SERVICE TIME ====================
  // Resident ke selected from/to time ko readable format mein show kar rahe hain
  const formatTime = time => {

    // ==================== CHECK SERVICE TIME ====================
    // Agar time available nahi hai
    if (!time) {
      return '';
    }

    // ==================== GET HOURS AND MINUTES ====================
    // TIME value se hours aur minutes nikal rahe hain
    const parts = String(time).split(':');

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    // ==================== AM PM ====================
    // 24-hour time ko AM/PM mein convert kar rahe hain
    const period = hours >= 12 ? 'PM' : 'AM';

    // ==================== CONVERT HOUR ====================
    // 13 ko 1 PM, 14 ko 2 PM etc. mein convert kar rahe hain
    const displayHour =
      hours % 12 === 0 ? 12 : hours % 12;

    // ==================== RETURN FORMATTED TIME ====================
    // Final readable time return kar rahe hain
    return `${displayHour}:${minutes} ${period}`;
  };


  // ==================== FORMAT LOCATION ====================
  // Provider ki saved city aur area ko location text mein convert kar rahe hain
  const formatLocation = notification => {

    // ==================== GET PROVIDER AREA ====================
    // Provider ka area database se receive kar rahe hain
    const area = notification.provider_area;

    // ==================== GET PROVIDER CITY ====================
    // Provider ki city database se receive kar rahe hain
    const city = notification.provider_city;

    // ==================== BOTH AVAILABLE ====================
    // Agar area aur city dono available hain
    if (area && city) {
      return `${area}, ${city}`;
    }

    // ==================== ONLY AREA ====================
    // Agar sirf area available hai
    if (area) {
      return area;
    }

    // ==================== ONLY CITY ====================
    // Agar sirf city available hai
    if (city) {
      return city;
    }

    // ==================== LOCATION NOT AVAILABLE ====================
    // Agar provider ki location available nahi hai
    return 'Location not available';
  };


  // ==================== RENDER NOTIFICATION CARD ====================
  // Har notification ke liye existing card design create kar rahe hain
  const renderNotification = notification => {

    // ==================== CHECK REQUEST STATUS ====================
    // Database status ke according heading aur description set karenge
    const isAccepted =
      notification.status === 'ACCEPTED';

    // ==================== NOTIFICATION HEADING ====================
    // Accepted aur rejected ke liye different heading
    const heading = isAccepted
      ? 'Service Accepted'
      : 'Service Rejected';

    // ==================== NOTIFICATION DESCRIPTION ====================
    // Provider name ke saath dynamic description
    const description = isAccepted
      ? `${notification.provider_name} has accepted your service request.`
      : `${notification.provider_name} has rejected your service request.`;

    return (

      // ==================== NOTIFICATION CARD ====================
      <View
        key={notification.request_id}
        style={styles.card}
      >

        {/* ==================== CARD TOP ==================== */}
        <View style={styles.cardTop}>

          {/* ==================== NOTIFICATION ICON ==================== */}
          <Text style={styles.icon}>
            ⚙️
          </Text>

          {/* ==================== NOTIFICATION TYPE ==================== */}
          <Text style={styles.type}>
            Service Update
          </Text>

          {/* ==================== NOTIFICATION TIME ==================== */}
          <Text style={styles.time}>
            {getRelativeTime(notification.created_at)}
          </Text>

        </View>


        {/* ==================== NOTIFICATION HEADING ==================== */}
        <Text style={styles.heading}>
          {heading}
        </Text>


        {/* ==================== NOTIFICATION DESCRIPTION ==================== */}
        <Text style={styles.description}>
          {description}
        </Text>


        {/* ==================== PROVIDER LOCATION ==================== */}
        <View style={styles.infoRow}>

          <Text style={styles.info}>
            📍 {formatLocation(notification)}
          </Text>

        </View>


        {/* ==================== SERVICE TIME ==================== */}
        <View style={styles.infoRow}>

          <Text style={styles.info}>
            🕐 {formatTime(notification.from_time)} - {formatTime(notification.to_time)}
          </Text>

        </View>

      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>

        {/* ==================== BACK BUTTON ==================== */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>
            ←
          </Text>
        </TouchableOpacity>

        {/* ==================== SCREEN TITLE ==================== */}
        <Text style={styles.title}>
          Notifications
        </Text>

      </View>


      {/* ==================== NOTIFICATION LIST ==================== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ==================== LOADING MESSAGE ==================== */}
        {loading && (
          <Text style={styles.emptyText}>
            Loading notifications...
          </Text>
        )}


        {/* ==================== EMPTY NOTIFICATION MESSAGE ==================== */}
        {!loading && notifications.length === 0 && (
          <Text style={styles.emptyText}>
            No notifications yet.
          </Text>
        )}


        {/* ==================== DISPLAY ALL NOTIFICATIONS ==================== */}
        {!loading &&
          notifications.map(notification =>
            renderNotification(notification)
          )}

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  // ==================== MAIN CONTAINER ====================
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },


  // ==================== HEADER ====================
  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },


  // ==================== BACK BUTTON ====================
  back: {
    fontSize: 28,
    color: '#222',
    marginRight: 15,
  },


  // ==================== SCREEN TITLE ====================
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== SCROLL CONTENT ====================
  scrollContent: {
    paddingBottom: 20,
  },


  // ==================== NOTIFICATION CARD ====================
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 10,
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2D52E6',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },


  // ==================== CARD TOP ====================
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },


  // ==================== NOTIFICATION ICON ====================
  icon: {
    fontSize: 16,
    marginRight: 7,
  },


  // ==================== NOTIFICATION TYPE ====================
  type: {
    color: '#2D52E6',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },


  // ==================== NOTIFICATION TIME ====================
  time: {
    color: '#9CA3AF',
    fontSize: 12,
  },


  // ==================== NOTIFICATION HEADING ====================
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },


  // ==================== NOTIFICATION DESCRIPTION ====================
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },


  // ==================== INFORMATION ROW ====================
  infoRow: {
    marginBottom: 8,
  },


  // ==================== INFORMATION TEXT ====================
  info: {
    fontSize: 13,
    color: '#374151',
  },


  // ==================== EMPTY / LOADING TEXT ====================
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#6B7280',
  },

});