// ADDED: React aur required React Native components
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

// ADDED: Resident ki active services
const services = [
  {id: 1, name: 'Milk Delivery', provider: 'Ali Jahanzaib'},
  {id: 2, name: 'Newspaper', provider: 'Abdul Moiz'},
  {id: 3, name: 'Garbage', provider: 'Muhammad Jan'},
];

export default function ResidentOutOfStation({navigation}) {

  // ADDED: Selected dates store karne ke liye
  const [selectedDates, setSelectedDates] = useState([]);

  // ADDED: Skip / Alternate status store karne ke liye
  const [actions, setActions] = useState({});

  // ADDED: Current month
  const [month, setMonth] = useState(new Date());

  // ADDED: Month ke total days
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();

  // ADDED: Date select/deselect
  const selectDate = day => {
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter(item => item !== day));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  // ADDED: Skip / Alternate select
  const selectAction = (id, action) => {
    setActions({
      ...actions,
      [id]: actions[id] === action ? '' : action,
    });
  };

  // CHANGED: Submit button - ChooseNeighbour screen par navigation
  const submit = () => {

    if (selectedDates.length === 0) {
      Alert.alert('Select Date', 'Please select at least one date.');
      return;
    }

    // ADDED: Choose Alternate screen open karna
    navigation.navigate('ChooseNeighbour');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ADDED: Header */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Out of Station
        </Text>

        <View style={{width: 25}} />

      </View>

      <ScrollView>

        {/* ADDED: Calendar */}
        <View style={styles.calendar}>

          <View style={styles.monthRow}>

            <TouchableOpacity
              onPress={() =>
                setMonth(
                  new Date(
                    month.getFullYear(),
                    month.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.month}>
              {month.toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setMonth(
                  new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

          </View>

          {/* ADDED: Calendar dates */}
          <View style={styles.days}>

            {Array.from(
              {length: daysInMonth},
              (_, i) => i + 1,
            ).map(day => (

              <TouchableOpacity
                key={day}
                style={[
                  styles.day,
                  selectedDates.includes(day) &&
                    styles.selectedDay,
                ]}
                onPress={() => selectDate(day)}
              >
                <Text
                  style={
                    selectedDates.includes(day)
                      ? styles.selectedText
                      : styles.dayText
                  }
                >
                  {day}
                </Text>
              </TouchableOpacity>

            ))}

          </View>

        </View>

        {/* ADDED: Selected dates */}
        {selectedDates.length > 0 && (

          <View style={styles.selectedBox}>

            <Text style={styles.selectedTitle}>
              Selected: {selectedDates.length} days
            </Text>

            <Text style={styles.selectedDates}>
              {selectedDates.join(' , ')}
            </Text>

          </View>

        )}

        {/* ADDED: Active services */}
        <View style={styles.serviceCard}>

          <View style={styles.serviceHeader}>

            <Text style={styles.serviceHead}>
              SERVICE
            </Text>

            <Text style={styles.skipHead}>
              Skip
            </Text>

            <Text style={styles.altHead}>
              Alternate
            </Text>

          </View>

          {services.map(item => (

            <View style={styles.serviceRow} key={item.id}>

              <View style={{flex: 1}}>

                <Text style={styles.serviceName}>
                  {item.name}
                </Text>

                <Text style={styles.provider}>
                  {item.provider}
                </Text>

              </View>

              {/* ADDED: Skip button */}
              <TouchableOpacity
                style={[
                  styles.check,
                  actions[item.id] === 'skip' &&
                    styles.skip,
                ]}
                onPress={() =>
                  selectAction(item.id, 'skip')
                }
              >
                {actions[item.id] === 'skip' && (
                  <Text style={styles.checkText}>✓</Text>
                )}
              </TouchableOpacity>

              {/* ADDED: Alternate button */}
              <TouchableOpacity
                style={[
                  styles.check,
                  actions[item.id] === 'alternate' &&
                    styles.alternate,
                ]}
                onPress={() =>
                  selectAction(item.id, 'alternate')
                }
              >
                {actions[item.id] === 'alternate' && (
                  <Text style={styles.checkText}>✓</Text>
                )}
              </TouchableOpacity>

            </View>

          ))}

        </View>

        {/* ADDED: Submit button */}
        <TouchableOpacity
          style={styles.submit}
          onPress={submit}
        >
          <Text style={styles.submitText}>
            Submit
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
  },

  close: {
    fontSize: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },

  calendar: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 15,
    borderRadius: 17,
  },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  month: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 25,
  },

  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  day: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedDay: {
    backgroundColor: '#E11D3D',
    borderRadius: 20,
  },

  dayText: {
    color: '#111827',
  },

  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  selectedBox: {
    backgroundColor: '#FDE8EC',
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 14,
    borderRadius: 14,
  },

  selectedTitle: {
    color: '#E11D3D',
    fontWeight: 'bold',
  },

  selectedDates: {
    color: '#E11D3D',
    marginTop: 8,
  },

  serviceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 14,
    borderRadius: 16,
  },

  serviceHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  serviceHead: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 11,
  },

  skipHead: {
    width: 55,
    textAlign: 'center',
    color: '#E11D3D',
  },

  altHead: {
    width: 70,
    textAlign: 'center',
    color: '#2D52E6',
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  serviceName: {
    fontWeight: 'bold',
    color: '#111827',
  },

  provider: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },

  check: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skip: {
    backgroundColor: '#E11D3D',
    borderColor: '#E11D3D',
  },

  alternate: {
    backgroundColor: '#2D52E6',
    borderColor: '#2D52E6',
  },

  checkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  submit: {
    backgroundColor: '#2D52E6',
    margin: 18,
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

});