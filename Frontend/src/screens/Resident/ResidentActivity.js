// CHANGED: useCallback and useRef added (backend fetch + remembering the resident id)
import React, {useCallback, useRef, useState} from 'react';

// ADDED: Screen khulne (aur dobara focus hone) par data load karne ke liye (Resident Home bhi yahi hook use karta hai)
import {useFocusEffect} from '@react-navigation/native';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

// ==================== HELPERS (START) ====================
// ADDED: Neeche ke helper functions Resident Home ki logic jaisi hain,
// taake Home aur Activity ki services same hon.

// ADDED: Weekday names (JavaScript getDay() ke order mein: Sunday = 0)
const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// ADDED: Home jaisa time format: "07:00:00" -> "7:00 AM"
const formatTime = time => {

  if (!time) {
    return '';
  }

  const parts = String(time).split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (isNaN(hours)) {
    return '';
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHour}:${minutes} ${period}`;
};

// ADDED: Home jaisa service name: Milkman -> Milk Delivery, etc.
const formatServiceName = service => {

  if (service === 'Milkman') {
    return 'Milk Delivery';
  }

  if (service === 'Garbage Collector') {
    return 'Garbage Collection';
  }

  if (service === 'Newspaper') {
    return 'Newspaper Delivery';
  }

  return service || 'Service';
};

// ADDED: Home jaisi provider initials (avatar ke liye)
const getInitials = name => {

  if (!name) {
    return 'SP';
  }

  const words = name.trim().split(' ');

  const firstInitial = words[0]?.charAt(0).toUpperCase() || 'S';

  const secondInitial =
    words.length > 1
      ? words[1].charAt(0).toUpperCase()
      : 'P';

  return `${firstInitial}${secondInitial}`;
};

// ADDED: Home ki getServiceDays jaisi logic: services ke selected_days se unique days (Monday se Sunday order mein)
const getServiceDays = acceptedServices => {

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

// ADDED: Home se aaya hua selectedDay valid weekday ho to wohi return karta hai, warna null
const getValidWeekday = value => {

  if (!value) {
    return null;
  }

  const match = WEEKDAY_NAMES.find(
    day => day.toLowerCase() === String(value).toLowerCase(),
  );

  return match || null;
};

// ADDED: Agar Home se selectedDay na aaye to Home ki default logic: aaj (agar available) warna pehla service day
const getDefaultDay = serviceDays => {

  if (!serviceDays || serviceDays.length === 0) {
    return null;
  }

  const todayName = WEEKDAY_NAMES[new Date().getDay()];

  const todayAvailable = serviceDays.find(
    day => day.toLowerCase() === todayName.toLowerCase(),
  );

  return todayAvailable || serviceDays[0];
};

// ADDED: Home ke selectedDayServices jaisa filter (selected_days mein selected day hai ya nahi). Home sorting nahi karta, is liye yahan bhi nahi.
const getServicesForDay = (acceptedServices, selectedDay) => {

  return acceptedServices.filter(service => {

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
};

// ADDED: Backend ki date ko local date (midnight) mein badalta hai, Home ke formatDate jaisa
// (new Date(date) phir local din). Invalid/missing date par null.
const parseServiceDate = value => {

  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
  );
};

// ADDED: Date ko "YYYY-MM-DD" text mein badalta hai (local date, UTC shift ke baghair)
const formatDateKey = date => {

  if (!date) {
    return '';
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

// ADDED: Asal scheduled delivery date = selected weekday ki pehli date jo aaj ya subscription start_date
// (jo bhi baad mein ho) ke baad aaye. start_date sirf subscription ki shuruaat hai, delivery date nahi.
const getScheduledDate = (dayName, startDateValue, now = new Date()) => {

  const dayIndex = WEEKDAY_NAMES.findIndex(
    day => day.toLowerCase() === String(dayName).toLowerCase(),
  );

  if (dayIndex === -1) {
    return null;
  }

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startDate = parseServiceDate(startDateValue);

  const baseDate =
    startDate && startDate.getTime() > today.getTime()
      ? startDate
      : today;

  const daysAhead = (dayIndex - baseDate.getDay() + 7) % 7;

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + daysAhead,
  );
};

// ADDED: Backend service ko existing Activity card ke fields mein map karta hai.
// date = asal scheduled delivery date, startsOn = subscription start date (sirf tab jab abhi shuru nahi hui).
// time = Home ki tarah resident ki selected from/to time window.
const mapServiceToPending = (service, selectedDay, now = new Date()) => {

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startDate = parseServiceDate(service.start_date);

  const providerName = service.provider_name || 'Service Provider';

  const fromTime = formatTime(service.from_time);
  const toTime = formatTime(service.to_time);

  return {
    id: service.request_id,
    initials: getInitials(providerName),
    service: formatServiceName(service.service),
    provider: providerName,
    date: formatDateKey(getScheduledDate(selectedDay, service.start_date, now)),
    startsOn:
      startDate && startDate.getTime() > today.getTime()
        ? formatDateKey(startDate)
        : '',
    time: toTime ? `${fromTime} - ${toTime}` : fromTime,
    status: 'Waiting',
  };
};
// ==================== HELPERS (END) ====================

// CHANGED: Completed abhi khaali hai (delivery completion agle phase mein), is liye count 0 rahega
const completedRequests = [];

// CHANGED: Component now receives "route" as well, so it can read the userId and name sent from other Resident screens
export default function ResidentActivity({navigation, route}) {

  // CHANGED: Resident id and name received from other Resident screens (same param names Home uses)
  const paramResidentId = route?.params?.userId;
  const residentNameParam = route?.params?.name;

  // ADDED: Resident Home ka selected weekday (Home Activity tab dabate waqt navigation params mein bhejta hai)
  const homeSelectedDay = route?.params?.selectedDay;

  // ADDED: Last valid residentId yaad rakhte hain taake params ke baghair wapas aane par bhi API call na ruke (Home jaisa)
  const lastResidentIdRef = useRef(paramResidentId);

  if (paramResidentId) {
    lastResidentIdRef.current = paramResidentId;
  }

  const residentId = paramResidentId || lastResidentIdRef.current;

  const [activeTab, setActiveTab] = useState('Pending');

  // ADDED: Backend se aane wali raw accepted services (filter render par hota hai)
  const [acceptedServices, setAcceptedServices] = useState([]);

  // ADDED: Loading aur error state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ADDED: Har request ka number. Sirf sab se nayi request ka jawab use hota hai, purani request nayi ko block nahi karti.
  const latestRequest = useRef(0);

  // ADDED: Existing Resident Home accepted-services API se services lata hai (har call par nayi request)
  const loadServices = useCallback(() => {

    if (!residentId) {
      setLoading(false);
      setAcceptedServices([]);
      setErrorMessage('Resident ID not found. Please log in again.');
      return;
    }

    latestRequest.current += 1;
    const requestNumber = latestRequest.current;

    setLoading(true);

    fetch(
      `http://localhost:5000/api/residents/accepted-services/${residentId}`,
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('Server returned ' + response.status);
        }

        return response.json();
      })
      .then(data => {

        // Purani request ka jawab ignore karo
        if (requestNumber !== latestRequest.current) {
          return;
        }

        setAcceptedServices(
          Array.isArray(data.services) ? data.services : [],
        );

        setErrorMessage('');
      })
      .catch(error => {

        if (requestNumber !== latestRequest.current) {
          return;
        }

        // Purane cards screen par rehte hain, sirf error message set hota hai
        console.log('Resident Activity API error:', error);
        setErrorMessage('Services could not be loaded.');
      })
      .finally(() => {

        if (requestNumber === latestRequest.current) {
          setLoading(false);
        }
      });
  }, [residentId]);

  // ADDED: Screen khulne par aur har dafa Activity dobara focus ho to fresh data lao (ek hi jagah se, duplicate nahi).
  // Screen se bahar jaate (ya unmount hote) waqt chal rahi request ka jawab ignore ho jata hai.
  useFocusEffect(
    useCallback(() => {

      loadServices();

      return () => {
        latestRequest.current += 1;
      };
    }, [loadServices]),
  );

  // ADDED: Home ka selected weekday; Home se na aaye (ya invalid ho) to Home ki default day logic
  const selectedDay =
    getValidWeekday(homeSelectedDay) ||
    getDefaultDay(getServiceDays(acceptedServices));

  // ADDED: Pending list selected day ke mutabiq filter hoti hai, is liye count bhi asal filtered services ka hai
  const pendingRequests = getServicesForDay(
    acceptedServices,
    selectedDay,
  ).map(service => mapServiceToPending(service, selectedDay));

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

          {/* CHANGED: Pending count ab dynamic hai (selected day ki asal services ka count) */}
          <Text
            style={[
              styles.count,
              activeTab === 'Pending' && styles.activeCount,
            ]}
          >
            {pendingRequests.length}
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

          {/* CHANGED: Completed count completedRequests (abhi khaali) se aata hai, is liye 0 */}
          <Text
            style={[
              styles.count,
              activeTab === 'Completed' && styles.activeCount,
            ]}
          >
            {completedRequests.length}
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


            {/* CHANGED: Dummy card hata diya gaya. Ab selected day ki asal services backend se dikhti hain */}
            {pendingRequests.map(item => (

              <View key={item.id} style={styles.card}>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.initials}
                  </Text>
                </View>

                <View style={styles.cardInfo}>

                  <Text style={styles.deliveryTitle}>
                    {item.service}
                  </Text>

                  <Text style={styles.name}>
                    {item.provider}
                  </Text>

                  {/* CHANGED: asal scheduled delivery date aur time window (date na ho to sirf time) */}
                  <Text style={styles.date}>
                    {item.date ? `${item.date} • ${item.time}` : item.time}
                  </Text>

                  {/* ADDED: Agar subscription abhi shuru nahi hui to uski start date alag se dikhate hain */}
                  {item.startsOn ? (
                    <Text style={styles.date}>
                      Subscription starts {item.startsOn}
                    </Text>
                  ) : null}

                </View>

                <View style={styles.waiting}>
                  <Text style={styles.waitingText}>
                    Waiting
                  </Text>
                </View>

              </View>

            ))}


            {/* ADDED: Loading / error / empty message jab Pending list khaali ho */}
            {pendingRequests.length === 0 && (
              <Text style={styles.emptyText}>
                {loading
                  ? 'Loading services...'
                  : errorMessage
                  ? errorMessage
                  : selectedDay
                  ? `No pending services for ${selectedDay}.`
                  : 'No pending services.'}
              </Text>
            )}

          </>

        ) : (

          <>

            <Text style={styles.sectionTitle}>
              COMPLETED
            </Text>

            {/* No completed deliveries */}

            {/* ADDED: Completed abhi khaali hai, is liye empty message */}
            <Text style={styles.emptyText}>
              No completed services.
            </Text>

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

  // ADDED: Loading / error / empty message ka style (Resident Home ke emptyText jaisa)
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#6B7280',
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