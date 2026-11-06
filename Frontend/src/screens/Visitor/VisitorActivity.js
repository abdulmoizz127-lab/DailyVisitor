// CHANGED: useCallback, useRef add kiye (backend fetch ke liye); useEffect ki jagah useFocusEffect use ho raha hai
import React, {useState, useCallback, useRef} from 'react';

// ADDED: Screen khulne (aur dobara focus hone) par data load karne ke liye (react-navigation ka apna hook)
import {useFocusEffect} from '@react-navigation/native';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

// ==================== HELPERS (START) ====================
// ADDED: Neeche ke helper functions Visitor Home ki logic jaisi hain, taake Home aur Activity ke services same hon.

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

// ADDED: Aaj ka weekday name (Home ke getTodayName jaisa)
const getTodayName = () => {
  return WEEKDAY_NAMES[new Date().getDay()];
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

// ADDED: Agar Home se selectedDay na aaye to Home ki default logic: aaj (agar available) warna provider ka pehla day
const getDefaultDay = providerDays => {

  if (!providerDays || providerDays.length === 0) {
    return null;
  }

  const todayName = getTodayName();

  const todayAvailable = providerDays.find(
    day => String(day).toLowerCase() === todayName.toLowerCase(),
  );

  return todayAvailable || providerDays[0];
};

// CHANGED: Home ke selectedDayServices aur todayServices ki logic bilkul wahi hai (filter + sort),
// sirf Home ke state variable ki jagah parameters use kiye gaye hain.
const getServicesForDay = (acceptedServices, selectedDay) => {

  // Selected day resident ki request mein hai ya nahi (Home jaisa filter)
  const selectedDayServices = acceptedServices.filter(service => {

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

    return serviceDays.includes(
      selectedDay.toLowerCase(),
    );
  });

  // Home jaisi sorting: from_time, phir to_time, phir route_order
  return [...selectedDayServices].sort((a, b) => {
    const timeA = String(a.from_time || '');
    const timeB = String(b.from_time || '');

    if (timeA !== timeB) {
      return timeA.localeCompare(timeB);
    }

    const toTimeA = String(a.to_time || '');
    const toTimeB = String(b.to_time || '');

    if (toTimeA !== toTimeB) {
      return toTimeA.localeCompare(toTimeB);
    }

    return Number(a.route_order || 999) - Number(b.route_order || 999);
  });
};

// ADDED: Backend ki date ko local date (midnight) mein badalta hai, bilkul Home ke formatDate jaisa
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

  // Subscription abhi shuru nahi hui ho to us ke start_date se aage ki pehli matching date
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

// CHANGED: Backend service ko existing Activity card ke fields mein map karta hai.
// date = asal scheduled delivery date, startsOn = subscription start date (sirf tab jab abhi shuru nahi hui).
// time = Home ki tarah delivery_start_time (assigned slot) ya from_time.
const mapServiceToPending = (service, selectedDay, now = new Date()) => {

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startDate = parseServiceDate(service.start_date);

  return {
    id: service.request_id,
    service: formatServiceName(service.service),
    resident: service.resident_name || 'Unknown',
    date: formatDateKey(getScheduledDate(selectedDay, service.start_date, now)),
    startsOn:
      startDate && startDate.getTime() > today.getTime()
        ? formatDateKey(startDate)
        : '',
    time: formatTime(service.delivery_start_time || service.from_time),
    status: 'Waiting',
  };
};
// ==================== HELPERS (END) ====================

// CHANGED: Dummy pendingRequests hata diya gaya (ab backend se aata hai).
// CHANGED: Completed abhi khaali hai (delivery workflow agle phase mein), is liye count 0 rahega.
const completedRequests = [];

// MODIFIED: route add kiya taake Visitor Home se aane wale userId aur name read ho sakein
export default function VisitorActivity({navigation, route}) {

  // ADDED: Visitor Home ya Profile se aaya hua userId, taake wapas Home bhejne par cards dobara load ho sakein
  const visitorUserId = route.params?.userId;

  // ADDED: Visitor Home ya Profile se aaya hua name, taake wapas Home bhejne par greeting sahi dikhe
  const visitorName = route.params?.name;

  const [selectedTab, setSelectedTab] = useState('Pending');

  // ADDED: Visitor Home ka selected weekday (Home Activity tab dabate waqt navigation params mein bhejta hai)
  const homeSelectedDay = route.params?.selectedDay;

  // CHANGED: Backend se aane wali raw accepted services aur provider days (filter render par hota hai)
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [providerDays, setProviderDays] = useState([]);

  // ADDED: Loading aur error state
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ADDED: Har request ka number. Sirf sab se nayi request ka jawab use hota hai, purani request nayi ko block nahi karti.
  const latestRequest = useRef(0);

  // CHANGED: Existing accepted-services API se services lata hai (har call par nayi request)
  const loadServices = useCallback(() => {

    if (!visitorUserId) {
      setLoading(false);
      setAcceptedServices([]);
      setProviderDays([]);
      setErrorMessage('Visitor ID not found. Please log in again.');
      return;
    }

    latestRequest.current += 1;
    const requestNumber = latestRequest.current;

    setLoading(true);

    fetch(
      `http://localhost:5000/api/visitors/accepted-services/${visitorUserId}`,
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

        setProviderDays(
          Array.isArray(data.serviceDays) ? data.serviceDays : [],
        );

        setErrorMessage('');
      })
      .catch(error => {

        if (requestNumber !== latestRequest.current) {
          return;
        }

        console.log('Visitor Activity API error:', error);
        setErrorMessage('Pending requests could not be loaded.');
      })
      .finally(() => {

        if (requestNumber === latestRequest.current) {
          setLoading(false);
        }
      });
  }, [visitorUserId]);

  // CHANGED: Screen khulne par aur har dafa Activity dobara focus ho to fresh data lao (ek hi jagah se, duplicate nahi).
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
    getDefaultDay(providerDays);

  // CHANGED: Pending list ab selected day ke mutabiq filter hoti hai, is liye count bhi asal filtered services ka hai
  const pendingRequests = getServicesForDay(
    acceptedServices,
    selectedDay,
  ).map(service => mapServiceToPending(service, selectedDay));

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
              {/* CHANGED: count ab dynamic hai (pendingRequests backend se aati hain) */}
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

                {/* CHANGED: asal scheduled delivery date aur time (date na ho to sirf time) */}
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
            {/* CHANGED: Pending tab par loading / error message, warna pehle wala empty message */}
            <Text style={styles.emptyText}>
              {selectedTab === 'Pending' && loading
                ? 'Loading requests...'
                : selectedTab === 'Pending' && errorMessage
                ? errorMessage
                : `No ${selectedTab.toLowerCase()} requests.`}
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

  // ADDED: Cards ke darmiyan vertical gap
  marginBottom: 12,
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