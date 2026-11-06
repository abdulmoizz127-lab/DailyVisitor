/* ==================== ACTIVE SERVICES API ==================== */
/* useCallback/useState aur useFocusEffect add kiye (ResidentHome jaisa pattern),
   taake accepted services backend se load hon aur screen dobara active hone par refresh hon. */
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';


/* ==================== ACTIVE SERVICES API ==================== */
/* Hardcoded `services` array (3 dummy Milk Delivery cards) remove kar di gayi.
   Ab data GET /api/visitors/accepted-services/:userId se aata hai
   (wohi API jo VisitorHome use karta hai). */

/* ==================== ACTIVE SERVICES API ==================== */
/* Days ko Monday se Sunday ke order mein sort karne ke liye */
const weekOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/* ==================== ACTIVE SERVICES API ==================== */
/* Database service name -> card par dikhne wala naam (VisitorHome jaisa) */
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

/* ==================== ACTIVE SERVICES API ==================== */
/* Database TIME (HH:mm:ss) -> 12-hour AM/PM. Time na ho to '' return hota hai. */
const formatTime = time => {

  if (!time) {
    return '';
  }

  const parts = String(time).split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (Number.isNaN(hours) || minutes === undefined) {
    return '';
  }

  const hour24 = hours % 24;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${displayHour}:${minutes.slice(0, 2)} ${period}`;
};

/* ==================== ACTIVE SERVICES API ==================== */
/* "7:00 AM – 8:00 AM". End time na ho to sirf start, start na ho to kuch nahi. */
const formatTimeRange = (fromTime, toTime) => {

  const start = formatTime(fromTime);
  const end = formatTime(toTime);

  if (!start) {
    return '';
  }

  return end ? `${start} – ${end}` : start;
};

/* ==================== ACTIVE SERVICES API ==================== */
/* Request ke selected_days se day chips ('Mon', 'Tue'...) banata hai.
   Days sorted hote hain aur duplicate remove hote hain. Days na hon to [] return. */
const getDayChips = service => {

  if (!service.selected_days) {
    return [];
  }

  const days = [];

  String(service.selected_days)
    .split(',')
    .map(day => day.trim())
    .filter(Boolean)
    .forEach(day => {

      const match = weekOrder.find(
        weekDay => weekDay.toLowerCase() === day.toLowerCase(),
      );

      const dayName = match || day;

      if (!days.includes(dayName)) {
        days.push(dayName);
      }
    });

  const dayIndex = day => {
    const index = weekOrder.indexOf(day);
    return index === -1 ? weekOrder.length : index;
  };

  return days
    .sort((a, b) => dayIndex(a) - dayIndex(b))
    .map(day => day.substring(0, 3));
};

/* ==================== ACTIVE SERVICES API ==================== */
/* Resident ka address: backend sirf area, city aur province bhejta hai (VisitorHome jaisa) */
const getResidentAddress = service => {

  const addressParts = [
    service.resident_area,
    service.resident_city,
    service.resident_province,
  ].filter(Boolean);

  if (addressParts.length > 0) {
    return addressParts.join(', ');
  }

  return 'Address not available';
};

/* ==================== ACTIVE SERVICES API ==================== */
/* Request sirf tab active hai jab backend status ACCEPTED confirm kare */
const isActiveRequest = service =>
  String(service?.status || '').toUpperCase() === 'ACCEPTED';


// MODIFIED: route add kiya taake Home/Activity/Profile se aane wale userId aur name read ho sakein
export default function ScheduleScreen({navigation, route}) {

  // ADDED: Visitor ka userId, taake wapas Home bhejne par cards dobara load ho sakein
  const visitorUserId = route.params?.userId;

  // ADDED: Visitor ka name, taake wapas Home bhejne par greeting sahi dikhe
  const visitorName = route.params?.name;


  /* ==================== ACTIVE SERVICES API ==================== */
  /* Backend se aane wali accepted services, loading flag, error message
     aur Retry button ke liye reload counter */
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);


  /* ==================== ACTIVE SERVICES API ==================== */
  /* Sirf logged-in visitor (visitorUserId) ki accepted requests fetch hoti hain.
     Pehli dafa open hone par, har dafa screen focus mein aane par aur Retry dabane par chalta hai. */
  useFocusEffect(
    useCallback(() => {

      if (!visitorUserId) {
        setServices([]);
        setError('Visitor information is missing. Please go back and try again.');
        setLoading(false);
        return undefined;
      }

      // Screen focus kho de ya userId badal jaye to purana response ignore hoga
      let isActive = true;

      fetch(
        `http://localhost:5000/api/visitors/accepted-services/${visitorUserId}`,
      )
        .then(response =>
          response
            .json()
            .catch(() => null)
            .then(data => {

              if (!response.ok) {
                throw new Error(
                  (data && data.message) || 'Server error',
                );
              }

              return data;
            }),
        )
        .then(data => {

          if (!isActive) {
            return;
          }

          console.log('Visitor Schedule services:', data);

          const list =
            data && Array.isArray(data.services)
              ? data.services
              : [];

          setServices(list.filter(isActiveRequest));
          setError('');
        })
        .catch(apiError => {

          if (!isActive) {
            return;
          }

          console.log('Visitor Schedule API error:', apiError);

          setError(
            'Active services could not be loaded. Please check your connection and try again.',
          );
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };

    }, [visitorUserId, reloadKey]),
  );


  /* ==================== ACTIVE SERVICES API ==================== */
  /* Retry button: loading message dobara dikhata hai aur services dobara load karta hai */
  const handleRetry = () => {
    setError('');
    setLoading(true);
    setReloadKey(key => key + 1);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Heading */}

        <Text style={styles.title}>
          Service Management
        </Text>

        <Text style={styles.subtitle}>
          Manage your active services
        </Text>


        {/* Out of Station */}

        <TouchableOpacity style={styles.outCard}>

          <View style={styles.outIcon}>
            <Text>
              ⚠️
            </Text>
          </View>

          <View style={styles.outInfo}>

            <Text style={styles.outTitle}>
              Set Out of Station
            </Text>

            <Text style={styles.outText}>
              Select a day and manage your services
            </Text>

          </View>

          <Text style={styles.arrow}>
            ›
          </Text>

        </TouchableOpacity>


        {/* Active Services */}

        <View style={styles.serviceHeader}>

          <Text style={styles.serviceTitle}>
            Active Services
          </Text>

          {/* ==================== ACTIVE SERVICES API ==================== */}
          {/* Count ab real services ka hai; loading ke dauran count hide rehta hai */}
          {!loading && (
            <Text style={styles.count}>
              {services.length} services
            </Text>
          )}

        </View>


        {/* ==================== ACTIVE SERVICES API ==================== */}
        {/* Services load hote waqt loading message */}
        {loading && (
          <Text style={styles.statusText}>
            Loading services...
          </Text>
        )}


        {/* ==================== ACTIVE SERVICES API ==================== */}
        {/* API fail ho to error message aur Retry button */}
        {!loading && error !== '' && (

          <View style={styles.errorBox}>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
            >

              <Text style={styles.retryText}>
                Retry
              </Text>

            </TouchableOpacity>

          </View>

        )}


        {/* ==================== ACTIVE SERVICES API ==================== */}
        {/* Koi accepted request na ho to empty-state message */}
        {!loading && error === '' && services.length === 0 && (
          <Text style={styles.statusText}>
            No active services yet.
          </Text>
        )}


        {/* Service Cards */}

        {/* ==================== ACTIVE SERVICES API ==================== */}
        {/* Har accepted request (request_id) ka ek card. Saare days usi card mein dikhte hain. */}
        {!loading && services.map((item, index) => {

          const dayChips = getDayChips(item);
          const serviceTime = formatTimeRange(item.from_time, item.to_time);

          return (

          // CHANGED: Service card ko clickable banaya
          // ResidentRecord screen par navigate karne ke liye
          <TouchableOpacity
            key={item.request_id || index}
            style={styles.card}
            onPress={() => navigation.navigate('ResidentRecord')}
          >

            <View style={styles.cardHeader}>

              <Text style={styles.serviceName}>
                {formatServiceName(item.service)}
              </Text>

              <View style={styles.active}>

                <Text style={styles.activeText}>
                  Active
                </Text>

              </View>

            </View>


            <Text style={styles.customer}>
              {item.resident_name || 'Resident'}
            </Text>


            {serviceTime !== '' && (
              <Text style={styles.detail}>
                🕐 {serviceTime}
              </Text>
            )}


            <Text style={styles.detail}>
              📍 {getResidentAddress(item)}
            </Text>


            {dayChips.length > 0 && (

              <View style={styles.days}>

                {dayChips.map(day => (

                  <View
                    key={day}
                    style={styles.day}
                  >

                    <Text style={styles.dayText}>
                      {day}
                    </Text>

                  </View>

                ))}

              </View>

            )}

          </TouchableOpacity>

          );

        })}

      </ScrollView>


      {/* Bottom Navigation */}

      {/* MODIFIED: Bottom navigation ab baqi Visitor screens jaisi chaar tabs hain,
          wahi order: Home, Activity, Schedule, Profile. Purana Services tab remove kar diya
          kyunke App.js mein 'Services' naam ka koi route registered nahi hai. */}
      <View style={styles.bottom}>

        {/* MODIFIED: Home tab ka onPress pehle missing tha. Route 'VisitorHome' App.js mein registered hai.
            userId aur name wapas bhej rahe hain taake VisitorHome accepted services dobara fetch kar sake. */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate('VisitorHome', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >
          <Text style={styles.icon}>
            🏠
          </Text>

          <Text style={styles.tabText}>
            Home
          </Text>
        </TouchableOpacity>


        {/* ADDED: Activity tab, second position par (Services ki jagah ka order theek karne ke liye).
            Route 'VisitorActivity' App.js mein registered hai.
            userId aur name bhej rahe hain taake Activity se wapas Home aane par cards load hon. */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate('VisitorActivity', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >
          <Text style={styles.icon}>
            ◉
          </Text>

          <Text style={styles.tabText}>
            Activity
          </Text>
        </TouchableOpacity>


        {/* MODIFIED: Schedule tab ab third position par hai aur current screen hai
            (isliye iska onPress nahi hai, highlighted box pehle jaisa hi hai) */}
        <TouchableOpacity style={styles.tab}>

          <View style={styles.activeIcon}>
            <Text>
              📅
            </Text>
          </View>

          <Text style={styles.activeText}>
            Schedule
          </Text>

        </TouchableOpacity>


        {/* MODIFIED: Profile tab ka onPress pehle missing tha.
            Route 'Profile' App.js mein registered hai (Visitor Profile, ResidentProfile nahi).
            userId aur name bhej rahe hain taake Profile se wapas Home aane par cards load hon. */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.navigate('Profile', {
              userId: visitorUserId,
              name: visitorName,
            })
          }
        >

          <Text style={styles.icon}>
            👤
          </Text>

          <Text style={styles.tabText}>
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
    backgroundColor: '#F5F7FA',
  },


  content: {
    padding: 18,
    paddingBottom: 30,
  },


  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
  },


  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 18,
  },


  outCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 14,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    marginBottom: 22,

    elevation: 2,
  },


  outIcon: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#FEE2E2',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },


  outInfo: {
    flex: 1,
  },


  outTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  outText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },


  arrow: {
    fontSize: 25,
    color: '#9CA3AF',
  },


  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 12,
  },


  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },


  count: {
    fontSize: 11,
    color: '#2563EB',

    backgroundColor: '#EFF6FF',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 15,
  },


  /* ==================== ACTIVE SERVICES API ==================== */
  /* Loading / empty message */
  statusText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#64748B',
  },


  /* ==================== ACTIVE SERVICES API ==================== */
  /* Error message box aur Retry button */
  errorBox: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 16,

    alignItems: 'center',

    marginBottom: 13,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 2,
  },


  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 12,
  },


  retryButton: {
    backgroundColor: '#2563EB',

    borderRadius: 10,

    paddingVertical: 9,
    paddingHorizontal: 26,
  },


  retryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },


  card: {
    backgroundColor: 'white',

    borderRadius: 15,

    padding: 15,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 2,
  },


  cardHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },


  serviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  active: {
    backgroundColor: '#DBEAFE',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 10,
  },


  activeText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: 'bold',
  },


  customer: {
    fontSize: 12,
    color: '#374151',

    marginTop: 5,
    marginBottom: 10,
  },


  detail: {
    fontSize: 11,
    color: '#64748B',

    marginBottom: 7,
  },


  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 4,
  },


  day: {
    backgroundColor: '#EFF6FF',

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 8,

    marginRight: 6,
    marginBottom: 5,
  },


  dayText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
  },


  bottom: {
    height: 70,

    backgroundColor: 'white',

    flexDirection: 'row',

    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',

    paddingHorizontal: 5,
  },


  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  icon: {
    fontSize: 19,
    marginBottom: 3,
  },


  activeIcon: {
    backgroundColor: '#EEF3FF',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 9,

    marginBottom: 3,
  },


  tabText: {
    fontSize: 9,
    color: '#94A3B8',
  },


  activeText: {
    fontSize: 9,
    color: '#2563EB',
    fontWeight: 'bold',
  },

});