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


// ==================== RESIDENT HOME SCREEN ====================
// Resident ka Home screen
export default function ResidentHome({navigation, route}) {

  const residentName =
    route.params?.name || 'Resident';


  // ==================== RESIDENT ID ====================
  // ResidentLogin se aane wala userId receive kar rahe hain
  const residentId =
    route.params?.userId;


  // ==================== ACCEPTED SERVICES STATE ====================
  // Backend se aane wali accepted services ko store kar rahe hain
  const [acceptedServices, setAcceptedServices] =
    useState([]);


  // ==================== LOADING STATE ====================
  // Backend data load hone tak loading status maintain kar rahe hain
  const [loading, setLoading] =
    useState(true);


  // ==================== SELECTED DAY STATE ====================
  // Resident Home par jis day ko resident select karega usay store kar rahe hain
  const [selectedDay, setSelectedDay] =
    useState(null);


  // ==================== AVAILABLE SERVICE DAYS STATE ====================
  // Accepted services se available service days store kar rahe hain
  const [serviceDays, setServiceDays] =
    useState([]);


  // ==================== FETCH ACCEPTED SERVICES ====================
  // Resident Home open hone par backend se accepted services fetch kar rahe hain
  useEffect(() => {

    // ==================== CHECK RESIDENT ID ====================
    // Agar residentId available nahi hai to API call nahi karenge
    if (!residentId) {
      setLoading(false);
      return;
    }


    // ==================== CALL RESIDENT HOME API ====================
    // Backend se resident ki accepted service requests le rahe hain
    fetch(
      `http://localhost:5000/api/residents/accepted-services/${residentId}`,
    )
      .then(response => response.json())


      // ==================== PROCESS API RESPONSE ====================
      // Backend se received services ko state mein save kar rahe hain
      .then(data => {

        console.log(
          'Resident Home services:',
          data,
        );


        // ==================== SAVE ACCEPTED SERVICES ====================
        // Backend se accepted services frontend state mein save kar rahe hain
        if (data.services) {
          setAcceptedServices(data.services);
        } else {
          setAcceptedServices([]);
        }
      })


      // ==================== API ERROR ====================
      // Agar API call fail ho jaye to error console mein show karenge
      .catch(error => {

        console.log(
          'Resident Home API error:',
          error,
        );


        Alert.alert(
          'Error',
          'Services could not be loaded.',
        );
      })


      // ==================== STOP LOADING ====================
      // API request complete hone ke baad loading false karenge
      .finally(() => {
        setLoading(false);
      });

  }, [residentId]);


  // ==================== GET SERVICE DAYS ====================
  // Accepted services ke selected_days se unique days nikal rahe hain
  const getServiceDays = () => {

    const days = [];

    acceptedServices.forEach(service => {

      if (!service.selected_days) {
        return;
      }

      const selectedServiceDays =
        String(service.selected_days)
          .split(',')
          .map(day => day.trim())
          .filter(Boolean);

      selectedServiceDays.forEach(day => {

        if (
          !days.some(
            existingDay =>
              existingDay.toLowerCase() ===
              day.toLowerCase(),
          )
        ) {
          days.push(day);
        }
      });
    });


    // ==================== WEEK DAY ORDER ====================
    // Days ko Monday se Sunday ke proper order mein arrange kar rahe hain
    const weekOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    return days.sort(
      (a, b) =>
        weekOrder.indexOf(a) -
        weekOrder.indexOf(b),
    );
  };


  // ==================== UPDATE SERVICE DAYS ====================
  // Accepted services change hone par available days update kar rahe hain
  useEffect(() => {

    const days =
      getServiceDays();

    setServiceDays(days);

  }, [acceptedServices]);


  // ==================== GET TODAY NAME ====================
  // Aaj ka weekday name nikal rahe hain
  const getTodayName = () => {

    return new Date().toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
      },
    );
  };


  // ==================== SET DEFAULT SELECTED DAY ====================
  // Agar aaj service available hai to aaj select hoga
  // Warna pehla available service day select hoga
  useEffect(() => {

    if (serviceDays.length === 0) {
      setSelectedDay(null);
      return;
    }

    const todayName =
      getTodayName();

    const todayAvailable =
      serviceDays.find(
        day =>
          day.toLowerCase() ===
          todayName.toLowerCase(),
      );

    setSelectedDay(
      todayAvailable ||
      serviceDays[0],
    );

  }, [serviceDays]);


  // ==================== FILTER SELECTED DAY SERVICES ====================
  // Sirf selected day ki upcoming deliveries show kar rahe hain
  const selectedDayServices =
    acceptedServices.filter(service => {

      if (
        !selectedDay ||
        !service.selected_days
      ) {
        return false;
      }

      const days =
        String(service.selected_days)
          .split(',')
          .map(day =>
            day.trim().toLowerCase(),
          );

      return days.includes(
        selectedDay.toLowerCase(),
      );
    });


  // ==================== SELECTED DAY DELIVERY COUNT ====================
  // Selected day ki deliveries ka count nikal rahe hain
  const selectedDayCount =
    selectedDayServices.length;


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
    const parts =
      String(time).split(':');

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
  // Database ke service name ko Home screen ke display name mein convert kar rahe hain
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
    // Newspaper service ko Newspaper Delivery ke naam se show kar rahe hain
    if (service === 'Newspaper') {
      return 'Newspaper Delivery';
    }


    // ==================== DEFAULT SERVICE NAME ====================
    // Agar future mein koi aur service ho to wahi name show hoga
    return service;
  };


  // ==================== GET PROVIDER INITIALS ====================
  // Provider ke naam se avatar initials create kar rahe hain
  const getInitials = name => {

    // ==================== CHECK PROVIDER NAME ====================
    // Agar provider name available nahi hai
    if (!name) {
      return 'SP';
    }


    // ==================== SPLIT PROVIDER NAME ====================
    // Provider name ko words mein divide kar rahe hain
    const words =
      name.trim().split(' ');


    // ==================== FIRST NAME INITIAL ====================
    // Pehle word ka first letter le rahe hain
    const firstInitial =
      words[0]?.charAt(0).toUpperCase() || 'S';


    // ==================== SECOND NAME INITIAL ====================
    // Doosre word ka first letter le rahe hain
    const secondInitial =
      words.length > 1
        ? words[1].charAt(0).toUpperCase()
        : 'P';


    // ==================== RETURN INITIALS ====================
    // Final initials return kar rahe hain
    return `${firstInitial}${secondInitial}`;
  };


  // ==================== FORMAT SERVICE DATE ====================
  // Database ki start_date ko Home card ke date text mein convert kar rahe hain
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
    // Agar service aaj nahi hai to readable date show karenge
    return serviceDate.toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'short',
      },
    );
  };


  // ==================== RENDER ACCEPTED SERVICE CARD ====================
  // Backend se aane wali selected day ki accepted service ka card create kar rahe hain
  const renderServiceCard = service => {

    // ==================== SERVICE NAME ====================
    // Database service name ko display name mein convert kar rahe hain
    const serviceName =
      formatServiceName(
        service.service,
      );


    // ==================== PROVIDER NAME ====================
    // Provider ka actual name database se receive kar rahe hain
    const providerName =
      service.provider_name ||
      'Service Provider';


    // ==================== PROVIDER INITIALS ====================
    // Provider ke name se avatar initials bana rahe hain
    const providerInitials =
      getInitials(providerName);


    return (

      // ==================== DYNAMIC SERVICE CARD ====================
      // Selected day ki accepted service ko display kar rahe hain
      <View
        key={service.request_id}
        style={styles.card}
      >

        {/* ==================== CARD TOP ==================== */}
        <View style={styles.cardTop}>

          {/* ==================== PROVIDER AVATAR ==================== */}
          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              {providerInitials}
            </Text>

          </View>


          {/* ==================== PROVIDER INFORMATION ==================== */}
          <View style={styles.cardInfo}>

            <View style={styles.nameRow}>

              {/* ==================== SERVICE NAME ==================== */}
              <Text style={styles.deliveryTitle}>
                {serviceName}
              </Text>


              {/* ==================== UPCOMING STATUS ==================== */}
              <Text style={styles.upcoming}>
                Upcoming
              </Text>

            </View>


            {/* ==================== PROVIDER NAME ==================== */}
            <Text style={styles.name}>
              {providerName}
            </Text>

          </View>


          {/* ==================== CARD ARROW ==================== */}
          <Text style={styles.arrow}>
            ›
          </Text>

        </View>


        {/* ==================== SERVICE DATE AND TIME ==================== */}
        {/* Date aur selected from/to time ko ek hi blue box mein show kar rahe hain */}
        <View style={styles.blueBox}>

          <Text style={styles.blueText}>
            🕐 {formatDate(service.start_date)} •{' '}
            {formatTime(service.from_time)} -{' '}
            {formatTime(service.to_time)}
          </Text>

        </View>

      </View>
    );
  };


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
              HELLO, {residentName} ☀️
            </Text>

            <Text style={styles.location}>
              Block A, Flat 402
            </Text>

          </View>


          <TouchableOpacity
            style={styles.notificationButton}

            // ==================== OPEN RESIDENT NOTIFICATIONS ====================
            // Notification screen par logged-in resident ka userId bhej rahe hain
            onPress={() =>
              navigation.navigate(
                'ResidentNotification',
                {
                  userId: residentId,
                },
              )
            }
          >

            <Text style={styles.notification}>
              🔔
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================== SERVICE DAYS ==================== */}
        {/* Resident ki accepted services se available days show kar rahe hain */}

        {serviceDays.length > 0 && (

          <View style={styles.daysSection}>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >

              {serviceDays.map(day => {

                // ==================== CHECK SELECTED DAY ====================
                // Check kar rahe hain ke ye day currently selected hai ya nahi
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


        {/* ==================== UPCOMING DELIVERIES HEADER ==================== */}
        {/* Selected day ki upcoming services ka header show kar rahe hain */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Upcoming Deliveries
          </Text>


          {/* ==================== SELECTED DAY SERVICES COUNT ==================== */}
          {/* Sirf selected day ki upcoming deliveries ka count show kar rahe hain */}
          <Text style={styles.services}>
            {selectedDayCount} Services
          </Text>

        </View>


        {/* ==================== LOADING MESSAGE ==================== */}
        {/* Backend data load hone tak loading message show kar rahe hain */}

        {loading && (
          <Text style={styles.emptyText}>
            Loading services...
          </Text>
        )}


        {/* ==================== EMPTY SELECTED DAY SERVICES ==================== */}
        {/* Selected day par koi upcoming delivery na ho to message show kar rahe hain */}

        {!loading &&
          selectedDayServices.length === 0 && (

            <Text style={styles.emptyText}>
              {selectedDay
                ? `No upcoming services for ${selectedDay}.`
                : 'No upcoming services.'}
            </Text>
        )}


        {/* ==================== DISPLAY SELECTED DAY SERVICES ==================== */}
        {/* Sirf selected day ki accepted upcoming deliveries show kar rahe hain */}

        {!loading &&
          selectedDayServices.map(service =>
            renderServiceCard(service),
          )}

      </ScrollView>


      {/* ==================== CENTER PLUS BUTTON ==================== */}

      {/* ==================== RESIDENT ID ==================== */}
      {/* Resident ka userId NewSubscription screen ko bhej rahe hain */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate(
            'NewSubscription',
            {
              residentId: residentId,
            },
          )
        }
      >

        <Text style={styles.fabText}>
          +
        </Text>

      </TouchableOpacity>


      {/* ==================== BOTTOM NAVIGATION ==================== */}

      <View style={styles.bottomBar}>

        {/* ==================== HOME TAB ==================== */}

        <TouchableOpacity
          style={styles.tab}
        >

          <Text style={styles.activeIcon}>
            🏠
          </Text>

          <Text style={styles.activeText}>
            Home
          </Text>

        </TouchableOpacity>


        {/* ==================== ACTIVITY TAB ==================== */}

        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate(
              'ResidentActivity',
            )
          }
        >

          <Text style={styles.icon}>
            🕐
          </Text>

          <Text style={styles.text}>
            Activity
          </Text>

        </TouchableOpacity>


        {/* ==================== SPACE FOR PLUS BUTTON ==================== */}

        <View style={styles.fabSpace} />


        {/* ==================== SCHEDULE TAB ==================== */}
        {/* Ye bottom Schedule button intentionally navigation karega */}

        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate(
              'Schedule',
            )
          }
        >

          <Text style={styles.icon}>
            📅
          </Text>

          <Text style={styles.text}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* ==================== PROFILE TAB ==================== */}

        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate(
              'Profile',
            )
          }
        >

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
    backgroundColor: '#F5F6FA',
  },


  // ==================== SCROLL CONTENT ====================
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },


  // ==================== HEADER ====================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },


  // ==================== HEADER TITLE ====================
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== LOCATION ====================
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
  },


  // ==================== NOTIFICATION BUTTON ====================
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },


  // ==================== NOTIFICATION ICON ====================
  notification: {
    fontSize: 20,
  },


  // ==================== SERVICE DAYS SECTION ====================
  // Upcoming Deliveries ke upar days ke liye spacing
  daysSection: {
    marginBottom: 18,
  },


  // ==================== DAY BUTTON ====================
  // Resident ke available service day ka button
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
  // Selected day ko blue highlight kar rahe hain
  selectedDayButton: {
    backgroundColor: '#2D52E6',
    borderColor: '#2D52E6',
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


  // ==================== SECTION HEADER ====================
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },


  // ==================== SECTION TITLE ====================
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== SERVICES COUNT ====================
  services: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D52E6',
  },


  // ==================== SERVICE CARD ====================
  card: {
    backgroundColor: 'white',
    borderRadius: 17,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },


  // ==================== CARD TOP ====================
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },


  // ==================== PROVIDER AVATAR ====================
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },


  // ==================== AVATAR TEXT ====================
  avatarText: {
    color: '#2D52E6',
    fontWeight: 'bold',
  },


  // ==================== CARD INFORMATION ====================
  cardInfo: {
    flex: 1,
  },


  // ==================== NAME ROW ====================
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  // ==================== DELIVERY TITLE ====================
  deliveryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  // ==================== UPCOMING LABEL ====================
  upcoming: {
    fontSize: 10,
    color: '#2D52E6',
    backgroundColor: '#EEF1FF',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },


  // ==================== PROVIDER NAME ====================
  name: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },


  // ==================== CARD ARROW ====================
  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
  },


  // ==================== BLUE DATE AND TIME BOX ====================
  // Accepted service ki date aur selected from/to time ko ek box mein show kar rahe hain
  blueBox: {
    backgroundColor: '#EEF3FF',
    padding: 9,
    borderRadius: 10,
  },


  // ==================== BLUE DATE AND TIME TEXT ====================
  // Blue box ke andar date aur selected service time show kar rahe hain
  blueText: {
    color: '#2D52E6',
    fontSize: 13,
  },


  // ==================== EMPTY / LOADING TEXT ====================
  // Jab selected day par accepted service na ho ya data load ho raha ho
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#6B7280',
  },


  // ==================== FLOATING ACTION BUTTON ====================
  fab: {
    position: 'absolute',
    bottom: 58,
    alignSelf: 'center',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2D52E6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    zIndex: 10,
  },


  // ==================== FAB TEXT ====================
  fabText: {
    color: 'white',
    fontSize: 30,
  },


  // ==================== BOTTOM BAR ====================
  bottomBar: {
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 10,
  },


  // ==================== BOTTOM TAB ====================
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==================== FAB SPACE ====================
  fabSpace: {
    width: 58,
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
    color: '#2D52E6',
    fontWeight: 'bold',
    marginTop: 3,
  },

});