// ==================== REACT IMPORT ====================
// React aur screen lifecycle ke liye import kar rahe hain
import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';


export default function VisitorHome({navigation, route}) {

  // ==================== GET VISITOR NAME ====================
  // Login screen se provider ka name receive kar rahe hain
  const visitorName =
    route.params?.name || 'Service Provider';


  // ==================== GET VISITOR USER ID ====================
  // Login screen se logged-in provider ka userId receive kar rahe hain
  // Isi userId ki help se provider ki accepted services fetch hongi
  const visitorUserId =
    route.params?.userId;


  // ==================== ACCEPTED SERVICES STATE ====================
  // Backend se aane wali accepted deliveries ko store kar rahe hain
  const [acceptedServices, setAcceptedServices] =
    useState([]);


  // ==================== PROVIDER SERVICE DAYS STATE ====================
  // Backend ke Shift table se aane wale actual provider service days store kar rahe hain
  const [providerDays, setProviderDays] =
    useState([]);


  // ==================== SELECTED DAY ====================
  // Home par jis day ko user select karega us day ko save kar rahe hain
  const [selectedDay, setSelectedDay] =
    useState(null);


  // ==================== LOADING STATE ====================
  // Backend data load hone tak loading status maintain kar rahe hain
  const [loading, setLoading] =
    useState(true);


  // ==================== FETCH PROVIDER SERVICES ====================
  // Provider Home open hone par backend se accepted services aur provider days fetch kar rahe hain
  useEffect(() => {

    // ==================== CHECK PROVIDER USER ID ====================
    // Agar provider userId available nahi hai to API call nahi karenge
    if (!visitorUserId) {
      setLoading(false);
      return;
    }


    // ==================== CALL VISITOR HOME API ====================
    // Backend se logged-in provider ki accepted requests aur service days le rahe hain
    fetch(
      `http://localhost:5000/api/visitors/accepted-services/${visitorUserId}`,
    )
      .then(response => response.json())


      // ==================== PROCESS API RESPONSE ====================
      // Backend se received services aur service days ko state mein save kar rahe hain
      .then(data => {

        console.log(
          'Visitor Home services:',
          data,
        );


        // ==================== SAVE ACCEPTED SERVICES ====================
        // Backend se accepted services frontend state mein save kar rahe hain
        if (data.services) {
          setAcceptedServices(data.services);
        } else {
          setAcceptedServices([]);
        }


        // ==================== SAVE PROVIDER SERVICE DAYS ====================
        // Backend ke Shift table se aane wale actual service days save kar rahe hain
        if (data.serviceDays) {
          setProviderDays(data.serviceDays);
        } else {
          setProviderDays([]);
        }

      })


      // ==================== API ERROR ====================
      // Agar API call fail ho jaye to error show karenge
      .catch(error => {

        console.log(
          'Visitor Home API error:',
          error,
        );


        Alert.alert(
          'Error',
          'Deliveries could not be loaded.',
        );

      })


      // ==================== STOP LOADING ====================
      // API request complete hone ke baad loading false karenge
      .finally(() => {
        setLoading(false);
      });

  }, [visitorUserId]);


  // ==================== FORMAT SERVICE TIME ====================
  // Database ke TIME ko readable AM/PM format mein convert kar rahe hain
  const formatTime = time => {

    // ==================== CHECK TIME ====================
    // Agar time available nahi hai
    if (!time) {
      return '';
    }


    // ==================== SPLIT TIME ====================
    // TIME ko hours aur minutes mein divide kar rahe hain
    const parts = String(time).split(':');

    const hours =
      parseInt(parts[0], 10);

    const minutes =
      parts[1];


    // ==================== GET AM OR PM ====================
    // 24-hour time ko AM/PM mein convert kar rahe hain
    const period =
      hours >= 12 ? 'PM' : 'AM';


    // ==================== CONVERT HOUR ====================
    // 13 ko 1 PM, 14 ko 2 PM etc. mein convert kar rahe hain
    const displayHour =
      hours % 12 === 0
        ? 12
        : hours % 12;


    // ==================== RETURN FORMATTED TIME ====================
    // Final readable time return kar rahe hain
    return `${displayHour}:${minutes} ${period}`;
  };


  // ==================== FORMAT SERVICE NAME ====================
  // Database service name ko provider Home ke display name mein convert kar rahe hain
  const formatServiceName = service => {

    // ==================== MILK SERVICE ====================
    // Milkman ko Milk Delivery ke naam se show kar rahe hain
    if (service === 'Milkman') {
      return 'Milk Delivery';
    }


    // ==================== GARBAGE SERVICE ====================
    // Garbage Collector ko Garbage Collection ke naam se show kar rahe hain
    if (service === 'Garbage Collector') {
      return 'Garbage Collection';
    }


    // ==================== NEWSPAPER SERVICE ====================
    // Newspaper ko Newspaper Delivery ke naam se show kar rahe hain
    if (service === 'Newspaper') {
      return 'Newspaper Delivery';
    }


    // ==================== DEFAULT SERVICE ====================
    // Agar future mein koi aur service aaye to uska original name show hoga
    return service;
  };


  // ==================== FORMAT DATE ====================
  // Database ki start_date ko readable date mein convert kar rahe hain
  const formatDate = date => {

    // ==================== CHECK DATE ====================
    // Agar date available nahi hai
    if (!date) {
      return 'Date not available';
    }


    // ==================== CREATE DATE OBJECT ====================
    // Database date ko JavaScript Date mein convert kar rahe hain
    const serviceDate =
      new Date(date);


    // ==================== GET TODAY ====================
    // Aaj ki date le rahe hain
    const today =
      new Date();


    // ==================== RESET TIME ====================
    // Comparison ke liye dono dates ka time zero kar rahe hain
    serviceDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);


    // ==================== CHECK TODAY ====================
    // Agar service aaj hai
    if (
      serviceDate.getTime() ===
      today.getTime()
    ) {
      return 'Today';
    }


    // ==================== FORMAT OTHER DATE ====================
    // Agar service aaj nahi hai to date show karenge
    return serviceDate.toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'short',
      },
    );
  };


  // ==================== GET TODAY NAME ====================
  // Aaj ka weekday name nikal rahe hain
  const getTodayName = () => {

    const today =
      new Date();

    return today.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
      },
    );
  };


  // ==================== SET DEFAULT SELECTED DAY ====================
  // Backend se aaye provider days mein aaj available ho to aaj select hoga
  // warna provider ka pehla available day select hoga
  useEffect(() => {

    if (providerDays.length === 0) {
      setSelectedDay(null);
      return;
    }


    const todayName =
      getTodayName();


    const todayAvailable =
      providerDays.find(
        day =>
          day.toLowerCase() ===
          todayName.toLowerCase(),
      );


    // ==================== SELECT TODAY OR FIRST DAY ====================
    // Current day available ho to usay select kar rahe hain
    setSelectedDay(
      todayAvailable ||
      providerDays[0],
    );

  }, [providerDays]);


  // ==================== GET SELECTED DAY SERVICES ====================
  // User ne jo day select kiya hai us day ki accepted deliveries filter kar rahe hain
  const selectedDayServices =
    acceptedServices.filter(service => {

      if (
        !selectedDay ||
        !service.selected_days
      ) {
        return false;
      }


      const serviceDays =
        String(service.selected_days)
          .split(',')
          .map(day => day.trim().toLowerCase());


      // ==================== CHECK SELECTED DAY ====================
      // Selected day resident ki request mein hai ya nahi check kar rahe hain
      return serviceDays.includes(
        selectedDay.toLowerCase(),
      );
    });


  // ==================== USE SELECTED DAY SERVICES ====================
// Existing Current Task aur Timeline ko selected day ke according update kar rahe hain
const todayServices =
  selectedDayServices;


// ==================== GET TODAY NAME FOR CURRENT TASK ====================
// Aaj ka actual weekday name nikal rahe hain
const todayNameForTask =
  getTodayName();


// ==================== CURRENT TASK ONLY FOR TODAY ====================
// Current Task sirf aaj ke selected day par show hoga
// Future day select karne par Current Task show nahi hoga
const currentTask =
  selectedDay &&
  selectedDay.toLowerCase() ===
    todayNameForTask.toLowerCase() &&
  todayServices.length > 0
    ? todayServices[0]
    : null;


  // ==================== GET RESIDENT ADDRESS ====================
  // Resident ke address ke available parts ko combine kar rahe hain
  const getResidentAddress = service => {

    const addressParts = [
      service.resident_area,
      service.resident_city,
      service.resident_province,
    ].filter(Boolean);


    // ==================== CHECK ADDRESS ====================
    // Agar address available hai to combine karke return karenge
    if (addressParts.length > 0) {
      return addressParts.join(', ');
    }


    // ==================== DEFAULT ADDRESS ====================
    // Agar address available nahi hai
    return 'Address not available';
  };


  // ==================== GET DELIVERY COUNT ====================
  // Selected day ki total accepted deliveries count kar rahe hain
  const todayDeliveryCount =
    todayServices.length;


  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ==================== HEADER ==================== */}

        <View style={styles.header}>

          <View>

            <Text style={styles.title}>
              Hello, {visitorName} 👋
            </Text>


            {/* ==================== PROVIDER AVAILABILITY ==================== */}
            {/* Provider ka current availability status show kar rahe hain */}

            <View style={styles.available}>

              <View style={styles.greenDot} />

              <Text style={styles.availableText}>
                Available
              </Text>

            </View>

          </View>


          {/* ==================== OPEN NOTIFICATIONS ==================== */}
          {/* Notification screen par provider ka userId bhej rahe hain */}

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() =>
              navigation.navigate(
                'VisitorNotification',
                {
                  userId: visitorUserId,
                },
              )
            }
          >

            <Text style={styles.notification}>
              🔔
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================== TODAY DELIVERIES SUMMARY ==================== */}
        {/* Selected day's accepted deliveries count show kar rahe hain */}

        <View style={styles.summaryCard}>

          <View style={styles.summaryTop}>

            <View style={styles.checkCircle}>

              <Text style={styles.check}>
                ✓
              </Text>

            </View>


            {/* ==================== SELECTED DAY SUMMARY LABEL ==================== */}
            {/* Selected day ko summary card ke top par show kar rahe hain */}

            <Text style={styles.today}>
              {selectedDay || 'Day'}
            </Text>

          </View>


          {/* ==================== DYNAMIC DELIVERY COUNT ==================== */}
          {/* Selected day's deliveries ka count show kar rahe hain */}

          <Text style={styles.count}>
            {todayDeliveryCount}
          </Text>


          {/* ==================== SELECTED DAY DELIVERY LABEL ==================== */}
          {/* Selected day ke according delivery label show kar rahe hain */}

          <Text style={styles.deliveryText}>
            {selectedDay
              ? `${selectedDay} Deliveries`
              : 'Deliveries'}
          </Text>

        </View>


        {/* ==================== SERVICE DAYS ROW ==================== */}
        {/* Backend ke Shift table se aaye actual provider service days show kar rahe hain */}

        {providerDays.length > 0 && (

          <View style={styles.daysSection}>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >

              {providerDays.map(day => {

                // ==================== CHECK SELECTED DAY ====================
                // Check kar rahe hain ke ye day selected hai ya nahi

                const isSelected =
                  selectedDay &&
                  selectedDay.toLowerCase() ===
                  day.toLowerCase();


                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      isSelected &&
                        styles.selectedDayButton,
                    ]}
                    onPress={() =>
                      setSelectedDay(day)
                    }
                  >

                    <Text
                      style={[
                        styles.dayText,
                        isSelected &&
                          styles.selectedDayText,
                      ]}
                    >
                      {day.substring(0, 3)}
                    </Text>

                  </TouchableOpacity>
                );
              })}

            </ScrollView>

          </View>
        )}


        {/* ==================== CURRENT TASK TITLE ==================== */}

        <Text style={styles.sectionTitle}>
          Current Task
        </Text>


        {/* ==================== CURRENT TASK ==================== */}
        {/* Selected day ki first accepted delivery ko Current Task mein show kar rahe hain */}

        {currentTask ? (

          <View style={styles.taskCard}>

            <View style={styles.taskTop}>

              <Text style={styles.nextDelivery}>
                Next Delivery
              </Text>


              {/* ==================== DELIVERY TIME ==================== */}
              {/* Resident ke selected from time ko show kar rahe hain */}

              <Text style={styles.minutes}>
                {formatTime(currentTask.from_time)}
              </Text>

            </View>


            {/* ==================== RESIDENT NAME ==================== */}
            {/* Database se actual resident name show kar rahe hain */}

            <Text style={styles.customerName}>
              {currentTask.resident_name}
            </Text>


            {/* ==================== RESIDENT ADDRESS ==================== */}
            {/* Database se actual resident location show kar rahe hain */}

            <Text style={styles.detail}>
              📍 {getResidentAddress(currentTask)}
            </Text>


            {/* ==================== SERVICE DATE AND TIME ==================== */}
            {/* Resident ki selected date aur from/to time show kar rahe hain */}

            <Text style={styles.detail}>
              🕐 {formatDate(currentTask.start_date)} •{' '}
              {formatTime(currentTask.from_time)} -{' '}
              {formatTime(currentTask.to_time)}
            </Text>


            {/* ==================== SERVICE NAME ==================== */}
            {/* Resident ne jo service request ki thi uska naam show kar rahe hain */}

            <Text style={styles.detail}>
              🔧 {formatServiceName(currentTask.service)}
            </Text>


            {/* ==================== CURRENT TASK BUTTONS ==================== */}

            <View style={styles.buttonRow}>

              {/* ==================== NAVIGATE BUTTON ==================== */}
              {/* Abhi map backend/screen nahi banaya, isliye placeholder alert hai */}

              <TouchableOpacity
                style={styles.taskButton}
                onPress={() =>
                  Alert.alert(
                    'Navigate',
                    'Opening map...',
                  )
                }
              >

                <Text style={styles.buttonText}>
                  ➤ Navigate
                </Text>

              </TouchableOpacity>


              {/* ==================== MARK ARRIVED BUTTON ==================== */}
              {/* Abhi arrival backend nahi banaya, isliye placeholder alert hai */}

              <TouchableOpacity
                style={styles.taskButton}
                onPress={() =>
                  Alert.alert(
                    'Status',
                    'Marked as arrived',
                  )
                }
              >

                <Text style={styles.buttonText}>
                  ✓ Mark Arrived
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        ) : (

          // ==================== NO CURRENT TASK ====================
          // Agar selected day par koi accepted delivery nahi hai to ye message show hoga

          <View style={styles.noTaskCard}>

            {/* ==================== SELECTED DAY NO TASK TITLE ==================== */}
            {/* Selected day par delivery na hone ki surat mein dynamic title show kar rahe hain */}

            <Text style={styles.noTaskTitle}>
              No Delivery {selectedDay ? `on ${selectedDay}` : 'Today'}
            </Text>


            {/* ==================== SELECTED DAY NO TASK MESSAGE ==================== */}
            {/* Selected day ke according message show kar rahe hain */}

            <Text style={styles.noTaskText}>
              {selectedDay
                ? `You have no accepted delivery scheduled for ${selectedDay}.`
                : 'You have no accepted delivery scheduled.'}
            </Text>

          </View>

        )}


        {/* ==================== SELECTED DAY TIMELINE TITLE ==================== */}
        {/* Selected day ke according timeline ka title show kar rahe hain */}

        <Text style={styles.sectionTitle}>
          {selectedDay
            ? `${selectedDay}'s Timeline`
            : 'Timeline'}
        </Text>


        {/* ==================== LOADING MESSAGE ==================== */}
        {/* Backend data load hone tak loading message show kar rahe hain */}

        {loading && (
          <Text style={styles.emptyText}>
            Loading deliveries...
          </Text>
        )}


        {/* ==================== EMPTY TIMELINE ==================== */}
        {/* Agar selected day par koi delivery nahi hai */}

        {!loading &&
          todayServices.length === 0 && (

            <Text style={styles.emptyText}>
              {selectedDay
                ? `No deliveries scheduled for ${selectedDay}.`
                : 'No deliveries scheduled.'}
            </Text>

          )}


        {/* ==================== DYNAMIC SELECTED DAY TIMELINE ==================== */}
        {/* Selected day ki saari accepted deliveries automatically show kar rahe hain */}

        {!loading &&
          todayServices.map(
            (service, index) => (

              <View
                key={service.request_id}
                style={styles.timelineItem}
              >

                {/* ==================== TIMELINE DOT ==================== */}
                {/* Current first task ko green aur baaki ko grey dot de rahe hain */}

                <View
                  style={
                    index === 0
                      ? styles.timelineDotDone
                      : styles.timelineDot
                  }
                />


                <View style={styles.timelineContent}>

                  <View style={styles.timelineTop}>

                    {/* ==================== TIMELINE TIME ==================== */}
                    {/* Resident ka selected from time show kar rahe hain */}

                    <Text style={styles.time}>
                      {formatTime(service.from_time)}
                    </Text>


                    {/* ==================== TIMELINE SERVICE ==================== */}
                    {/* Actual service name show kar rahe hain */}

                    <Text
                      style={
                        index === 0
                          ? styles.done
                          : styles.milk
                      }
                    >
                      {formatServiceName(
                        service.service,
                      )}
                    </Text>

                  </View>


                  {/* ==================== TIMELINE RESIDENT CARD ==================== */}
                  {/* Actual resident aur address show kar rahe hain */}

                  <View style={styles.timelineCard}>

                    <Text style={styles.timelineName}>
                      {service.resident_name}
                    </Text>


                    {/* ==================== TIMELINE ADDRESS ==================== */}
                    {/* Resident ka actual address show kar rahe hain */}

                    <Text style={styles.address}>
                      📍 {getResidentAddress(service)}
                    </Text>


                    {/* ==================== TIMELINE FULL TIME ==================== */}
                    {/* From aur to time bhi show kar rahe hain */}

                    <Text style={styles.address}>
                      🕐 {formatTime(service.from_time)} -{' '}
                      {formatTime(service.to_time)}
                    </Text>

                  </View>

                </View>

              </View>

            ),
          )}


        <View style={{height: 30}} />

      </ScrollView>


      {/* ==================== BOTTOM TABS ==================== */}

      <View style={styles.bottomBar}>

        {/* ==================== HOME TAB ==================== */}

        <TouchableOpacity style={styles.tab}>

          <Text style={styles.activeIcon}>
            🏠
          </Text>

          <Text style={styles.activeText}>
            Home
          </Text>

        </TouchableOpacity>


        {/* ==================== SCHEDULE TAB ==================== */}
        {/* Provider Schedule screen ko open karne ke liye navigation */}

        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate('Schedule')
          }
        >

          <Text style={styles.icon}>
            📅
          </Text>

          <Text style={styles.text}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* ==================== SERVICES TAB ==================== */}

        <TouchableOpacity style={styles.tab}>

          <Text style={styles.icon}>
            💼
          </Text>

          <Text style={styles.text}>
            Services
          </Text>

        </TouchableOpacity>


        {/* ==================== PROFILE TAB ==================== */}

        <TouchableOpacity style={styles.tab}>

          <Text style={styles.icon}>
            👤
          </Text>

          <Text style={styles.text}>
            Profile
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  // ==================== MAIN CONTAINER ====================
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },


  // ==================== SCROLL CONTENT ====================
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },


  // ==================== HEADER ====================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },


  // ==================== HEADER TITLE ====================
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },


  // ==================== AVAILABLE STATUS ====================
  available: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },


  // ==================== GREEN STATUS DOT ====================
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27A84A',
    marginRight: 6,
  },


  // ==================== AVAILABLE TEXT ====================
  availableText: {
    color: '#1E8F3E',
    fontSize: 13,
    fontWeight: '600',
  },


  // ==================== NOTIFICATION BUTTON ====================
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },


  // ==================== NOTIFICATION ICON ====================
  notification: {
    fontSize: 19,
  },


  // ==================== SUMMARY CARD ====================
  summaryCard: {
    backgroundColor: '#EAF7EE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#C6ECD0',
  },


  // ==================== SUMMARY TOP ====================
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  // ==================== CHECK CIRCLE ====================
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#27A84A',
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==================== CHECK ICON ====================
  check: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },


  // ==================== TODAY TEXT ====================
  today: {
    color: '#1E8F3E',
    fontSize: 13,
    fontWeight: '600',
  },


  // ==================== DELIVERY COUNT ====================
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },


  // ==================== DELIVERY COUNT TEXT ====================
  deliveryText: {
    fontSize: 13,
    color: '#6B7280',
  },


  // ==================== SERVICE DAYS SECTION ====================
  // Provider ke available service days ke liye spacing
  daysSection: {
    marginBottom: 25,
  },


  // ==================== DAY BUTTON ====================
  // Individual day button ka design
  dayButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginRight: 8,
  },


  // ==================== SELECTED DAY BUTTON ====================
  // Selected day ko highlight kar rahe hain
  selectedDayButton: {
    backgroundColor: '#27A84A',
    borderColor: '#27A84A',
  },


  // ==================== DAY TEXT ====================
  // Normal day ka text
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },


  // ==================== SELECTED DAY TEXT ====================
  // Selected day ka text white kar rahe hain
  selectedDayText: {
    color: '#FFFFFF',
  },


  // ==================== SECTION TITLE ====================
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },


  // ==================== CURRENT TASK CARD ====================
  taskCard: {
    backgroundColor: '#27A84A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 27,
    elevation: 6,
  },


  // ==================== CURRENT TASK TOP ====================
  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  // ==================== NEXT DELIVERY TEXT ====================
  nextDelivery: {
    color: 'white',
    fontSize: 13,
  },


  // ==================== DELIVERY TIME LABEL ====================
  minutes: {
    color: 'white',
    backgroundColor: '#49B765',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
  },


  // ==================== CUSTOMER NAME ====================
  customerName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 13,
  },


  // ==================== CURRENT TASK DETAILS ====================
  detail: {
    color: 'white',
    fontSize: 13,
    marginBottom: 8,
  },


  // ==================== CURRENT TASK BUTTON ROW ====================
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },


  // ==================== CURRENT TASK BUTTON ====================
  taskButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },


  // ==================== BUTTON TEXT ====================
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },


  // ==================== NO TASK CARD ====================
  // Jab selected day par provider ki koi accepted delivery na ho
  noTaskCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 27,
    elevation: 3,
  },


  // ==================== NO TASK TITLE ====================
  noTaskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },


  // ==================== NO TASK TEXT ====================
  noTaskText: {
    fontSize: 13,
    color: '#6B7280',
  },


  // ==================== EMPTY / LOADING TEXT ====================
  emptyText: {
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 20,
    fontSize: 14,
    color: '#6B7280',
  },


  // ==================== TIMELINE ITEM ====================
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },


  // ==================== DONE TIMELINE DOT ====================
  timelineDotDone: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27A84A',
    marginTop: 5,
    marginRight: 14,
  },


  // ==================== NORMAL TIMELINE DOT ====================
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginTop: 5,
    marginRight: 14,
  },


  // ==================== TIMELINE CONTENT ====================
  timelineContent: {
    flex: 1,
  },


  // ==================== TIMELINE TOP ====================
  timelineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },


  // ==================== TIMELINE TIME ====================
  time: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },


  // ==================== DONE SERVICE LABEL ====================
  done: {
    backgroundColor: '#27A84A',
    color: 'white',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 15,
    fontSize: 11,
    fontWeight: 'bold',
  },


  // ==================== NORMAL SERVICE LABEL ====================
  milk: {
    color: '#111827',
    fontSize: 13,
  },


  // ==================== TIMELINE CARD ====================
  timelineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },


  // ==================== TIMELINE RESIDENT NAME ====================
  timelineName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },


  // ==================== TIMELINE ADDRESS ====================
  address: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },


  // ==================== BOTTOM BAR ====================
  bottomBar: {
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    paddingHorizontal: 8,
  },


  // ==================== BOTTOM TAB ====================
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==================== NORMAL ICON ====================
  icon: {
    fontSize: 20,
  },


  // ==================== ACTIVE ICON ====================
  activeIcon: {
    fontSize: 20,
  },


  // ==================== NORMAL TAB TEXT ====================
  text: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },


  // ==================== ACTIVE TAB TEXT ====================
  activeText: {
    fontSize: 11,
    color: '#27A84A',
    fontWeight: 'bold',
    marginTop: 3,
  },

});