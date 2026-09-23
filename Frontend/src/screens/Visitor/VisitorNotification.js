import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function VisitorNotification({navigation, route}) {

  // ==================== GET PROVIDER USER ID ====================
  // VisitorHome se logged-in provider ka userId receive kar rahe hain
  const visitorUserId = route.params?.userId;

  // ==================== NOTIFICATIONS STATE ====================
  // Database se aane wali pending requests ko store kar rahe hain
  const [notifications, setNotifications] = useState([]);

  // ==================== LOADING STATE ====================
  // Notifications load hone tak loading show karenge
  const [loading, setLoading] = useState(true);

  // ==================== ACTION LOADING STATE ====================
  // Accept ya Reject button press hone par selected request ko track karenge
  const [actionLoading, setActionLoading] = useState(null);


  // ==================== FETCH NOTIFICATIONS ====================
  // Provider ki pending requests database se fetch karenge
  const fetchNotifications = async () => {

    try {

      // ==================== CHECK PROVIDER USER ID ====================
      // Provider userId na ho to API call nahi karenge
      if (!visitorUserId) {
        console.log('Provider userId not found');
        setLoading(false);
        return;
      }

      // ==================== GET NOTIFICATIONS API ====================
      // Backend se logged-in provider ki pending requests mangwa rahe hain
      const response = await fetch(
        `http://localhost:5000/api/visitors/notifications/${visitorUserId}`
      );

      // ==================== CONVERT RESPONSE TO JSON ====================
      // Backend response ko JavaScript object mein convert kar rahe hain
      const data = await response.json();

      // ==================== CHECK API RESPONSE ====================
      // Agar API successful hai to notifications save karenge
      if (response.ok) {

        // ==================== SAVE NOTIFICATIONS ====================
        // Database se milne wali requests ko state mein store kar rahe hain
        setNotifications(data.notifications || []);

      } else {

        // ==================== API ERROR ====================
        // Backend error ko console mein show kar rahe hain
        console.log(
          'Notification API error:',
          data.message
        );
      }

    } catch (error) {

      // ==================== CONNECTION ERROR ====================
      // Backend se connection problem hone par error show karenge
      console.log(
        'Notification connection error:',
        error.message
      );

    } finally {

      // ==================== STOP LOADING ====================
      // Request complete hone ke baad loading band karenge
      setLoading(false);
    }
  };


  // ==================== RUN FETCH WHEN SCREEN OPENS ====================
  // Notification screen open hote hi pending requests fetch hongi
  useEffect(() => {
    fetchNotifications();
  }, [visitorUserId]);


  // ==================== UPDATE REQUEST STATUS ====================
  // Provider ke Accept ya Reject action ko backend mein save karenge
  const updateRequestStatus = async (requestId, status) => {

    try {

      // ==================== START ACTION LOADING ====================
      // Jis request par action ho raha hai uska loading state show karenge
      setActionLoading(requestId);

      // ==================== UPDATE STATUS API ====================
      // Backend ko requestId aur new status bhej rahe hain
      const response = await fetch(
        `http://localhost:5000/api/visitors/notifications/${requestId}/status`,
        {
          // ==================== HTTP METHOD ====================
          // Database mein existing request ko update karne ke liye PUT use kar rahe hain
          method: 'PUT',

          // ==================== REQUEST HEADERS ====================
          // Backend ko bata rahe hain ke data JSON format mein hai
          headers: {
            'Content-Type': 'application/json',
          },

          // ==================== SEND STATUS ====================
          // ACCEPTED ya REJECTED backend ko bhej rahe hain
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      // ==================== CONVERT STATUS RESPONSE ====================
      // Backend ka response JSON mein convert kar rahe hain
      const data = await response.json();

      // ==================== CHECK UPDATE RESULT ====================
      // Agar database update successful hua
      if (response.ok) {

        // ==================== REMOVE PROCESSED REQUEST ====================
        // Accept/Reject hone ke baad request pending list se remove kar rahe hain
        setNotifications(previousNotifications =>
          previousNotifications.filter(
            notification =>
              notification.request_id !== requestId
          )
        );

        // ==================== ACCEPT SUCCESS MESSAGE ====================
        // Provider ko batayenge ke request accept ho gayi
        if (status === 'ACCEPTED') {

          Alert.alert(
            'Request Accepted',
            'Service request has been accepted successfully.'
          );

        }

        // ==================== REJECT SUCCESS MESSAGE ====================
        // Provider ko batayenge ke request reject ho gayi
        if (status === 'REJECTED') {

          Alert.alert(
            'Request Rejected',
            'Service request has been rejected successfully.'
          );

        }

      } else {

        // ==================== UPDATE ERROR ====================
        // Agar backend request update nahi kar saka
        Alert.alert(
          'Error',
          data.message || 'Request status could not be updated.'
        );
      }

    } catch (error) {

      // ==================== CONNECTION ERROR ====================
      // Backend connection fail hone par user ko error show karenge
      console.log(
        'Update request error:',
        error.message
      );

      Alert.alert(
        'Connection Error',
        'Could not connect to the server.'
      );

    } finally {

      // ==================== STOP ACTION LOADING ====================
      // Accept/Reject operation complete hone ke baad loading remove karenge
      setActionLoading(null);
    }
  };


  // ==================== ACCEPT REQUEST ====================
  // Provider ke Accept button se request ko ACCEPTED karenge
  const handleAccept = requestId => {

    // ==================== CONFIRM ACCEPT ====================
    // Provider se confirmation le rahe hain
    Alert.alert(
      'Accept Request',
      'Are you sure you want to accept this service request?',
      [
        // ==================== CANCEL ACCEPT ====================
        // Agar provider cancel kare to kuch nahi hoga
        {
          text: 'Cancel',
          style: 'cancel',
        },

        // ==================== CONFIRM ACCEPT ====================
        // Confirm karne par backend mein ACCEPTED status save hoga
        {
          text: 'Accept',
          onPress: () =>
            updateRequestStatus(
              requestId,
              'ACCEPTED'
            ),
        },
      ]
    );
  };


  // ==================== REJECT REQUEST ====================
  // Provider ke Reject button se request ko REJECTED karenge
  const handleReject = requestId => {

    // ==================== CONFIRM REJECT ====================
    // Provider se confirmation le rahe hain
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this service request?',
      [
        // ==================== CANCEL REJECT ====================
        // Agar provider cancel kare to request same rahegi
        {
          text: 'Cancel',
          style: 'cancel',
        },

        // ==================== CONFIRM REJECT ====================
        // Confirm karne par backend mein REJECTED status save hoga
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () =>
            updateRequestStatus(
              requestId,
              'REJECTED'
            ),
        },
      ]
    );
  };


  // ==================== FORMAT START DATE ====================
  // Database date ko readable format mein show karenge
  const formatDate = date => {

    if (!date) {
      return '';
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return date;
    }

    return selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  // ==================== FORMAT TIME ====================
  // Database ka HH:MM:SS time AM/PM format mein show karenge
  const formatTime = time => {

    if (!time) {
      return '';
    }

    const parts = time.split(':');

    const hour = parseInt(parts[0], 10);
    const minute = parts[1];

    const period = hour >= 12 ? 'PM' : 'AM';

    const displayHour =
      hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour}:${minute} ${period}`;
  };


  // ==================== FORMAT REQUEST TIME ====================
  // Request create hone ka time notification mein show karenge
  const formatCreatedTime = createdAt => {

    if (!createdAt) {
      return '';
    }

    const createdDate = new Date(createdAt);

    if (isNaN(createdDate.getTime())) {
      return '';
    }

    return createdDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* ==================== HEADER ==================== */}
      {/* Notification screen ka header */}
      <View style={styles.header}>

        {/* ==================== BACK BUTTON ==================== */}
        {/* Previous screen par wapas jane ke liye */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>
            ←
          </Text>
        </TouchableOpacity>

        {/* ==================== SCREEN TITLE ==================== */}
        {/* Notification screen ka title */}
        <Text style={styles.title}>
          Notifications
        </Text>

      </View>


      {/* ==================== LOADING INDICATOR ==================== */}
      {/* Database se requests load hone tak loading show karenge */}
      {loading ? (

        <View style={styles.centerContainer}>

          <ActivityIndicator
            size="large"
            color="#2D52E6"
          />

          <Text style={styles.loadingText}>
            Loading requests...
          </Text>

        </View>

      ) : notifications.length === 0 ? (

        // ==================== NO NOTIFICATIONS ====================
        // Agar provider ke paas koi pending request nahi hai
        <View style={styles.centerContainer}>

          <Text style={styles.emptyIcon}>
            🔔
          </Text>

          <Text style={styles.emptyTitle}>
            No New Requests
          </Text>

          <Text style={styles.emptyText}>
            You don't have any pending service requests.
          </Text>

        </View>

      ) : (

        // ==================== NOTIFICATION LIST ====================
        // Har pending request ko separate card mein show karenge
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ==================== LOOP THROUGH NOTIFICATIONS ==================== */}
          {/* Database ki har pending request ka separate card */}
          {notifications.map(notification => (

            <View
              key={notification.request_id}
              style={styles.card}
            >

              {/* ==================== CARD TOP ==================== */}
              {/* Notification type aur request time */}
              <View style={styles.cardTop}>

                <Text style={styles.icon}>
                  🔔
                </Text>

                <Text style={styles.type}>
                  New Service Request
                </Text>

                <Text style={styles.time}>
                  {formatCreatedTime(notification.created_at)}
                </Text>

              </View>


              {/* ==================== SERVICE NAME ==================== */}
              {/* Resident ne jo service request ki hai */}
              <Text style={styles.heading}>
                {notification.service}
              </Text>


              {/* ==================== RESIDENT NAME ==================== */}
              {/* Request bhejne wale resident ka naam */}
              <Text style={styles.description}>
                Resident: {notification.resident_name}
              </Text>


              {/* ==================== RESIDENT LOCATION ==================== */}
              {/* Resident ki saved location */}
              {(notification.area || notification.city) && (
                <View style={styles.infoRow}>

                  <Text style={styles.info}>
                    📍 {notification.area || ''}
                    {notification.area && notification.city ? ', ' : ''}
                    {notification.city || ''}
                  </Text>

                </View>
              )}


              {/* ==================== START DATE ==================== */}
              {/* Service kis date se start hogi */}
              <View style={styles.infoRow}>

                <Text style={styles.info}>
                  📅 Start Date: {formatDate(notification.start_date)}
                </Text>

              </View>


              {/* ==================== SELECTED DAYS ==================== */}
              {/* Resident ke selected weekly days */}
              <View style={styles.infoRow}>

                <Text style={styles.info}>
                  📆 {notification.selected_days}
                </Text>

              </View>


              {/* ==================== SERVICE TIME ==================== */}
              {/* Resident ka selected service time */}
              <View style={styles.infoRow}>

                <Text style={styles.info}>
                  🕐 {formatTime(notification.from_time)}
                  {' - '}
                  {formatTime(notification.to_time)}
                </Text>

              </View>


              {/* ==================== ACCEPT / REJECT BUTTONS ==================== */}
              {/* Provider yahan request accept ya reject karega */}
              <View style={styles.actionRow}>

                {/* ==================== REJECT BUTTON ==================== */}
                {/* Provider request reject karne ke liye */}
                <TouchableOpacity
                  style={styles.rejectButton}
                  disabled={
                    actionLoading === notification.request_id
                  }
                  onPress={() =>
                    handleReject(
                      notification.request_id
                    )
                  }
                >

                  {actionLoading === notification.request_id ? (

                    <ActivityIndicator
                      size="small"
                      color="#DC2626"
                    />

                  ) : (

                    <Text style={styles.rejectText}>
                      ✕ Reject
                    </Text>

                  )}

                </TouchableOpacity>


                {/* ==================== ACCEPT BUTTON ==================== */}
                {/* Provider request accept karne ke liye */}
                <TouchableOpacity
                  style={styles.acceptButton}
                  disabled={
                    actionLoading === notification.request_id
                  }
                  onPress={() =>
                    handleAccept(
                      notification.request_id
                    )
                  }
                >

                  {actionLoading === notification.request_id ? (

                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />

                  ) : (

                    <Text style={styles.acceptText}>
                      ✓ Accept
                    </Text>

                  )}

                </TouchableOpacity>

              </View>

            </View>

          ))}

        </ScrollView>

      )}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  // ==================== MAIN CONTAINER ====================
  // Poori notification screen ka background aur layout
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },


  // ==================== HEADER ====================
  // Notification screen ka top header
  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },


  // ==================== BACK BUTTON ====================
  // Back arrow ki styling
  back: {
    fontSize: 28,
    color: '#222',
    marginRight: 15,
  },


  // ==================== SCREEN TITLE ====================
  // Notifications title ki styling
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== SCROLL CONTENT ====================
  // Notification cards ke neeche spacing
  scrollContent: {
    paddingBottom: 25,
  },


  // ==================== CENTER CONTAINER ====================
  // Loading aur empty message ko center mein rakhne ke liye
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },


  // ==================== LOADING TEXT ====================
  // Loading message ki styling
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },


  // ==================== EMPTY ICON ====================
  // No requests notification icon
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },


  // ==================== EMPTY TITLE ====================
  // No requests title
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },


  // ==================== EMPTY DESCRIPTION ====================
  // No requests description
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },


  // ==================== NOTIFICATION CARD ====================
  // Har pending request ka card
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
  // Card ke upper portion ka layout
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },


  // ==================== NOTIFICATION ICON ====================
  // Bell icon ki styling
  icon: {
    fontSize: 17,
    marginRight: 7,
  },


  // ==================== NOTIFICATION TYPE ====================
  // New Service Request text
  type: {
    color: '#2D52E6',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },


  // ==================== REQUEST TIME ====================
  // Request creation time
  time: {
    color: '#9CA3AF',
    fontSize: 12,
  },


  // ==================== SERVICE HEADING ====================
  // Service name ki styling
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 7,
  },


  // ==================== RESIDENT DESCRIPTION ====================
  // Resident name ki styling
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },


  // ==================== INFORMATION ROW ====================
  // Location, date, days aur time ke darmiyan spacing
  infoRow: {
    marginBottom: 8,
  },


  // ==================== INFORMATION TEXT ====================
  // Request details ki styling
  info: {
    fontSize: 13,
    color: '#374151',
  },


  // ==================== ACCEPT / REJECT ROW ====================
  // Dono action buttons ko ek row mein rakhne ke liye
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },


  // ==================== REJECT BUTTON ====================
  // Reject button ka design
  rejectButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },


  // ==================== ACCEPT BUTTON ====================
  // Accept button ka design
  acceptButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#2D52E6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },


  // ==================== REJECT TEXT ====================
  // Reject button ke text ki styling
  rejectText: {
    color: '#DC2626',
    fontWeight: 'bold',
  },


  // ==================== ACCEPT TEXT ====================
  // Accept button ke text ki styling
  acceptText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});