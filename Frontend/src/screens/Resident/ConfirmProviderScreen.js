import React, {useState} from 'react';

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


// ==================== CONFIRM PROVIDER SCREEN ====================
// Selected provider ki details show karke actual service request send karenge

export default function BookingSummaryScreen({navigation, route}) {

  // ==================== ROUTE DATA ====================
  // SelectProviderScreen se aane wali sari information receive kar rahe hain
  const data = route?.params || {};


  // ==================== PROVIDER DATA ====================
  // Selected provider ki information receive kar rahe hain
  const providerId = data.providerId;
  const providerUserId = data.providerUserId;

  const providerName = data.providerName || 'Provider';

  const serviceType = data.serviceType || 'Garbage Collector';


  // ==================== RESIDENT DATA ====================
  // Resident ki ID request database mein save karne ke liye receive kar rahe hain
  const residentId = data.residentId;


  // ==================== START DATE DATA ====================
  // NewSubscriptionScreen se Date object receive ho sakta hai
  const rawStartDate = data.startDate;


  // ==================== START DATE DISPLAY FORMAT ====================
  // Date object ko screen par readable format mein convert kar rahe hain
  const formatDateForDisplay = date => {

    if (!date) {
      return '11 Sept 2026';
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return '11 Sept 2026';
    }

    return selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  // ==================== START DATE MYSQL FORMAT ====================
  // Date object ko MySQL ke YYYY-MM-DD format mein convert kar rahe hain
  const formatDateForMySQL = date => {

    if (!date) {
      return null;
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return null;
    }

    const year = selectedDate.getFullYear();

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      selectedDate.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  // ==================== FORMATTED START DATE ====================
  // Screen par show karne ke liye formatted date
  const startDate = formatDateForDisplay(rawStartDate);


  // ==================== MYSQL START DATE ====================
  // Backend ko bhejne ke liye MySQL formatted date
  const mysqlStartDate = formatDateForMySQL(rawStartDate);


  // ==================== SUBSCRIPTION DATA ====================
  // Resident ki subscription ki information receive kar rahe hain
  const selectedDays = data.selectedDays || [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const fromTime = data.fromTime || '07:00:00';
  const toTime = data.toTime || '08:00:00';


  // ==================== LOCATION ====================
  // Abhi location route params mein nahi aa rahi,
  // isliye temporary display value use kar rahe hain
  const location = data.location || 'Resident Location';


  // ==================== REQUEST LOADING STATE ====================
  // Request send hote waqt button ko loading state mein rakhne ke liye
  const [sendingRequest, setSendingRequest] = useState(false);


  // ==================== SEND SERVICE REQUEST ====================
  // Confirm karne ke baad actual request backend ko bhejenge
  const sendRequest = async () => {

    try {

      // ==================== REQUIRED DATA CHECK ====================
      // Backend ko request bhejne se pehle required IDs aur date check kar rahe hain
      if (!residentId || !providerId || !mysqlStartDate) {

        Alert.alert(
          'Error',
          'Resident, provider ya start date information missing hai.'
        );

        return;
      }


      // ==================== START REQUEST LOADING ====================
      setSendingRequest(true);


      // ==================== SERVICE REQUEST API ====================
      // Backend Service Request API ko selected booking data bhej rahe hain
      const response = await fetch(
        'http://localhost:5000/api/residents/service-request',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({

            // ==================== RESIDENT ID ====================
            // Request kis resident ne bheji
            residentId: residentId,


            // ==================== PROVIDER ID ====================
            // Request kis provider ko bheji
            providerId: providerId,


            // ==================== SERVICE ====================
            // Requested service ka naam
            serviceType: serviceType,


            // ==================== START DATE ====================
            // MySQL ke YYYY-MM-DD format mein start date bhej rahe hain
            startDate: mysqlStartDate,


            // ==================== SELECTED DAYS ====================
            // Resident ke selected weekly days
            selectedDays: selectedDays,


            // ==================== FROM TIME ====================
            // Service ka starting time
            fromTime: fromTime,


            // ==================== TO TIME ====================
            // Service ka ending time
            toTime: toTime,

          }),
        }
      );


      // ==================== API RESPONSE ====================
      // Backend ka response receive kar rahe hain
      const responseData = await response.json();


      // ==================== CHECK API RESPONSE ====================
      if (!response.ok) {

        Alert.alert(
          'Request Failed',
          responseData.message || 'Request send nahi ho saki.'
        );

        return;
      }


      // ==================== REQUEST SENT SUCCESSFULLY ====================
      // Backend ne request successfully database mein save kar di
      Alert.alert(
        'Request Sent',
        `Your request has been sent to ${providerName}.`,
        [
          {
            text: 'OK',

            // ==================== AFTER REQUEST SENT ====================
            // Successful request ke baad Resident Activity screen par jayenge
            onPress: () => {

              navigation.navigate('ResidentActivity');

            },
          },
        ]
      );


    } catch (error) {

      // ==================== REQUEST API ERROR ====================
      // Backend connection ya API error handle kar rahe hain
      console.log(
        'Service Request API error:',
        error
      );


      Alert.alert(
        'Connection Error',
        'Backend se connection nahi ho saka. Check karein ke server running hai.'
      );

    } finally {

      // ==================== STOP REQUEST LOADING ====================
      // Request complete hone ke baad loading band kar rahe hain
      setSendingRequest(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>


      {/* ==================== HEADER ==================== */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Confirm Provider
        </Text>


        <View style={{width: 25}} />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        {/* ==================== CONFIRMATION MESSAGE ==================== */}

        <View style={styles.messageCard}>

          <View style={styles.messageIcon}>

            <Text style={styles.messageIconText}>
              ✓
            </Text>

          </View>


          <Text style={styles.messageTitle}>
            Ready to Send Request
          </Text>


          <Text style={styles.messageText}>
            Please review your selected provider and
            subscription details before sending your request.
          </Text>

        </View>


        {/* ==================== SERVICE SUMMARY ==================== */}

        <View style={styles.summaryCard}>

          <Text style={styles.cardTitle}>
            Service Summary
          </Text>


          <View style={styles.line} />


          {/* ==================== SERVICE ==================== */}

          <View style={styles.row}>

            <Text style={styles.label}>
              Service
            </Text>

            <Text style={styles.value}>
              {serviceType}
            </Text>

          </View>


          {/* ==================== PROVIDER ==================== */}

          <View style={styles.row}>

            <Text style={styles.label}>
              Provider
            </Text>

            <Text style={styles.value}>
              {providerName}
            </Text>

          </View>


          {/* ==================== START DATE ==================== */}

          <View style={styles.row}>

            <Text style={styles.label}>
              Start Date
            </Text>

            <Text style={styles.value}>
              {startDate}
            </Text>

          </View>


          {/* ==================== SELECTED DAYS ==================== */}

          <View style={styles.row}>

            <Text style={styles.label}>
              Days
            </Text>

            <Text style={styles.valueDays}>
              {selectedDays.join(', ')}
            </Text>

          </View>


          {/* ==================== LOCATION ==================== */}

          <View style={styles.row}>

            <Text style={styles.label}>
              Location
            </Text>

            <Text style={styles.value}>
              {location}
            </Text>

          </View>


          {/* ==================== SERVICE TIME ==================== */}

          <Text style={styles.timeTitle}>
            ◷ Service Time
          </Text>


          <View style={styles.timeBox}>

            <Text style={styles.timeText}>
              {fromTime} – {toTime}
            </Text>

          </View>


          <Text style={styles.note}>
            Provider should arrive within this time window.
          </Text>

        </View>


        {/* ==================== PROVIDER CARD ==================== */}

        <View style={styles.providerCard}>


          {/* ==================== PROVIDER AVATAR ==================== */}

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              {providerName.charAt(0).toUpperCase()}
            </Text>

          </View>


          {/* ==================== PROVIDER INFORMATION ==================== */}

          <View style={styles.providerInfo}>

            <Text style={styles.providerName}>
              {providerName}
            </Text>

            <Text style={styles.providerService}>
              {serviceType}
            </Text>

          </View>


          {/* ==================== SELECTED STATUS ==================== */}

          <View style={styles.statusBox}>

            <Text style={styles.statusText}>
              Selected
            </Text>

          </View>

        </View>


        {/* ==================== REQUEST INFORMATION ==================== */}

        <View style={styles.requestInfo}>

          <Text style={styles.requestInfoTitle}>
            What happens next?
          </Text>


          <Text style={styles.requestInfoText}>
            1. Your request will be sent to the provider.
          </Text>


          <Text style={styles.requestInfoText}>
            2. The provider can accept or reject your request.
          </Text>


          <Text style={styles.requestInfoText}>
            3. You will see the request status in your activity.
          </Text>

        </View>

      </ScrollView>


      {/* ==================== SEND REQUEST BUTTON ==================== */}

      <View style={styles.bottom}>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            sendingRequest && styles.disabledButton,
          ]}
          onPress={sendRequest}
          disabled={sendingRequest}
        >

          {sendingRequest ? (

            // ==================== REQUEST SENDING LOADER ====================
            // Request send hone ke waqt loading indicator show kar rahe hain
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.confirmText}>
              Send Request
            </Text>

          )}

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}


// ==================== STYLES ====================

const styles = StyleSheet.create({

  // ==================== MAIN CONTAINER ====================
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },


  // ==================== HEADER ====================
  header: {
    height: 58,

    backgroundColor: 'white',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },


  back: {
    fontSize: 25,
    color: '#374151',
  },


  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== CONTENT ====================
  content: {
    padding: 18,
    paddingBottom: 30,
  },


  // ==================== MESSAGE CARD ====================
  messageCard: {
    backgroundColor: '#EEF8F1',

    borderRadius: 15,

    padding: 18,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#CDEBD5',

    marginBottom: 14,
  },


  messageIcon: {
    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#00A63C',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 10,
  },


  messageIconText: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },


  messageTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#166534',

    marginBottom: 6,
  },


  messageText: {
    fontSize: 11,
    color: '#4B6352',

    textAlign: 'center',

    lineHeight: 18,
  },


  // ==================== SUMMARY CARD ====================
  summaryCard: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 16,

    elevation: 2,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },


  line: {
    height: 1,

    backgroundColor: '#E5E7EB',

    marginVertical: 12,
  },


  // ==================== SUMMARY ROW ====================
  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 10,
  },


  label: {
    fontSize: 12,
    color: '#64748B',
  },


  value: {
    fontSize: 12,

    color: '#111827',

    fontWeight: '500',

    textAlign: 'right',

    maxWidth: '60%',
  },


  valueDays: {
    fontSize: 12,

    color: '#111827',

    fontWeight: '500',

    textAlign: 'right',

    maxWidth: '65%',
  },


  // ==================== SERVICE TIME ====================
  timeTitle: {
    fontSize: 12,

    color: '#374151',

    marginTop: 5,
    marginBottom: 7,
  },


  timeBox: {
    backgroundColor: '#EEF3FF',

    borderWidth: 1,

    borderColor: '#C9D8FF',

    borderRadius: 10,

    padding: 14,
  },


  timeText: {
    fontSize: 18,

    color: '#2463EB',

    fontWeight: 'bold',
  },


  note: {
    fontSize: 10,

    color: '#7B8494',

    marginTop: 7,
  },


  // ==================== PROVIDER CARD ====================
  providerCard: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 14,

    marginTop: 14,

    flexDirection: 'row',

    alignItems: 'center',

    elevation: 2,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  // ==================== PROVIDER AVATAR ====================
  avatar: {
    width: 50,
    height: 50,

    borderRadius: 25,

    backgroundColor: '#E8EEFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },


  avatarText: {
    fontSize: 20,

    fontWeight: 'bold',

    color: '#2D52E6',
  },


  // ==================== PROVIDER INFORMATION ====================
  providerInfo: {
    flex: 1,
  },


  providerName: {
    fontSize: 14,

    fontWeight: 'bold',

    color: '#111827',
  },


  providerService: {
    fontSize: 12,

    color: '#6B7280',

    marginTop: 3,
  },


  // ==================== SELECTED STATUS ====================
  statusBox: {
    backgroundColor: '#E8F7ED',

    paddingHorizontal: 8,
    paddingVertical: 6,

    borderRadius: 8,
  },


  statusText: {
    fontSize: 10,

    color: '#16803A',

    fontWeight: 'bold',
  },


  // ==================== REQUEST INFORMATION ====================
  requestInfo: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 16,

    marginTop: 14,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  requestInfoTitle: {
    fontSize: 13,

    fontWeight: 'bold',

    color: '#1F2937',

    marginBottom: 10,
  },


  requestInfoText: {
    fontSize: 11,

    color: '#64748B',

    marginBottom: 7,

    lineHeight: 17,
  },


  // ==================== BOTTOM BUTTON ====================
  bottom: {
    backgroundColor: 'white',

    padding: 18,

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },


  // ==================== SEND REQUEST BUTTON ====================
  confirmButton: {
    height: 52,

    borderRadius: 12,

    backgroundColor: '#00A63C',

    alignItems: 'center',

    justifyContent: 'center',
  },


  // ==================== DISABLED BUTTON ====================
  // Request send hone ke waqt button ko temporarily disable kar rahe hain
  disabledButton: {
    opacity: 0.6,
  },


  // ==================== SEND REQUEST TEXT ====================
  confirmText: {
    color: 'white',

    fontSize: 14,

    fontWeight: 'bold',
  },

});