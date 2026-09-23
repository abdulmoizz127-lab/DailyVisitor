import React, {useState} from 'react';

// ==================== DATE TIME PICKER ====================
// Start Date aur Time Slot ke liye DateTimePicker use kar rahe hain
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';


const serviceTypes = [
  'Milkman',
  'Newspaper',
  'Garbage Collector',
];

const milkTypes = ['Cow', 'Buffalo'];

const quantities = [
  '1 Liter',
  '2 Liters',
  '3 Liters',
  '4 Liters',
];

const languages = ['English', 'Urdu'];

const newspapers = [
  'Dawn',
  'Jang',
  'Nawa-i-Waqt',
];

const radiusOptions = [
  '1 km',
  '3 km',
  '5 km',
  '10 km',
];

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];


export default function NewSubscriptionScreen({navigation, route}) {

  // ==================== RESIDENT ID ====================
  // ResidentHome se aane wala residentId receive kar rahe hain

  const residentId = route.params?.residentId;


  const [serviceType, setServiceType] = useState('Milkman');
  const [milkType, setMilkType] = useState('Cow');
  const [quantity, setQuantity] = useState('1 Liter');

  const [language, setLanguage] = useState('English');
  const [newspaper, setNewspaper] = useState('Dawn');


  // ==================== DATE TIME PICKER ====================
  // Selected Start Date store karne ke liye

  const [startDate, setStartDate] = useState(new Date());

  // Date Picker show/hide karne ke liye

  const [showDatePicker, setShowDatePicker] = useState(false);


  const [selectedDays, setSelectedDays] = useState([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);


  // ==================== TIME PICKER ====================
  // From aur To time ke liye Date object use kar rahe hain
  // Isse Visitor Signup jaisa scrollable spinner picker milega

  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());


  // ==================== TIME PICKER VISIBILITY ====================
  // From aur To Time Picker ko show/hide karne ke liye

  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);


  const [radius, setRadius] = useState('5 km');

  const [modal, setModal] = useState(null);


  // ==================== TIME DISPLAY ====================
  // Date object ko screen par "07:00 AM" format mein show karna

  const displayTime = date => {

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  };


  // ==================== TIME CONVERSION ====================
  // Selected time ko MySQL ke "HH:MM:SS" format mein convert karna

  const formatTimeForMySQL = date => {

    return date.toTimeString().slice(0, 8);

  };


  const toggleDay = day => {

    if (selectedDays.includes(day)) {

      setSelectedDays(
        selectedDays.filter(item => item !== day),
      );

    } else {

      setSelectedDays([...selectedDays, day]);

    }

  };


  const openDropdown = (type, data) => {
    setModal({type, data});
  };


  const selectValue = value => {

    if (modal.type === 'service') {
      setServiceType(value);
    }

    if (modal.type === 'milkType') {
      setMilkType(value);
    }

    if (modal.type === 'quantity') {
      setQuantity(value);
    }

    if (modal.type === 'language') {
      setLanguage(value);
    }

    if (modal.type === 'newspaper') {
      setNewspaper(value);
    }

    if (modal.type === 'radius') {
      setRadius(value);
    }

    setModal(null);
  };


  const renderDropdown = (
    label,
    value,
    type,
    data,
  ) => {

    return (
      <>

        <Text style={styles.label}>
          {label}
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            openDropdown(type, data)
          }
        >

          <Text style={styles.dropdownText}>
            {value}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>

        </TouchableOpacity>

      </>
    );

  };


  // ==================== START DATE PICKER ====================
  // User jab Start Date select karega to ye function chalega

  const handleDateChange = (
    event,
    selectedDate,
  ) => {

    setShowDatePicker(false);

    if (selectedDate) {
      setStartDate(selectedDate);
    }

  };


  // ==================== FROM TIME PICKER ====================
  // From time spinner se selected time save karna

  const handleFromTimeChange = (
    event,
    selectedTime,
  ) => {

    setShowFromTimePicker(false);

    if (selectedTime) {
      setFromTime(selectedTime);
    }

  };


  // ==================== TO TIME PICKER ====================
  // To time spinner se selected time save karna

  const handleToTimeChange = (
    event,
    selectedTime,
  ) => {

    setShowToTimePicker(false);

    if (selectedTime) {
      setToTime(selectedTime);
    }

  };


  // ==================== FIND PROVIDERS DATA ====================
  // Find Providers press hone par subscription ki information
  // SelectProvider screen ko bhej rahe hain

  const handleFindProviders = () => {

    navigation.navigate('SelectProvider', {

      // ==================== RESIDENT ID ====================
      // Resident ki ID next screen ko bhej rahe hain

      residentId: residentId,

      serviceType: serviceType,

      startDate: startDate,

      selectedDays: selectedDays,

      // ==================== MYSQL TIME ====================
      // Date object ko "HH:MM:SS" format mein convert karke bhej rahe hain

      fromTime: formatTimeForMySQL(fromTime),

      toTime: formatTimeForMySQL(toTime),

      radius: radius,

    });

  };


  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          New Subscription
        </Text>


        <View style={{width: 25}} />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Service Type */}

        {renderDropdown(
          'Service Type',
          serviceType,
          'service',
          serviceTypes,
        )}


        <Text style={styles.helper}>
          Only visitors offering this service will be shown.
        </Text>


        {/* Milkman */}

        {serviceType === 'Milkman' && (

          <>

            {renderDropdown(
              'Milk Type',
              milkType,
              'milkType',
              milkTypes,
            )}


            {renderDropdown(
              'Quantity (Liters)',
              quantity,
              'quantity',
              quantities,
            )}

          </>

        )}


        {/* Newspaper */}

        {serviceType === 'Newspaper' && (

          <>

            {renderDropdown(
              'Newspaper Language',
              language,
              'language',
              languages,
            )}


            {renderDropdown(
              'Newspaper',
              newspaper,
              'newspaper',
              newspapers,
            )}

          </>

        )}


        {/* ==================== START DATE ==================== */}
        {/* Yahan Start Date par click karne se Date Picker open hoga */}

        <Text style={styles.label}>
          Start Date
        </Text>


        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            setShowDatePicker(true)
          }
        >

          <Text style={styles.calendar}>
            📅
          </Text>


          <Text style={styles.inputText}>
            {startDate.toLocaleDateString('en-GB')}
          </Text>

        </TouchableOpacity>


        {/* ==================== START DATE PICKER ==================== */}
        {/* Actual Start Date Picker yahan display hota hai */}

        {showDatePicker && (

          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />

        )}


        {/* Weekly Schedule */}

        <Text style={styles.label}>
          Weekly Schedule
        </Text>


        <View style={styles.scheduleBox}>

          {days.map(day => (

            <TouchableOpacity
              key={day}
              style={styles.dayRow}
              onPress={() =>
                toggleDay(day)
              }
            >

              <View
                style={[
                  styles.checkbox,
                  selectedDays.includes(day) &&
                    styles.checked,
                ]}
              >

                {selectedDays.includes(day) && (

                  <Text style={styles.tick}>
                    ✓
                  </Text>

                )}

              </View>


              <Text style={styles.dayText}>
                {day}
              </Text>

            </TouchableOpacity>

          ))}

        </View>


        {/* ==================== TIME SLOT ==================== */}
        {/* Resident ke From aur To time ke liye scrollable spinner */}

        <Text style={styles.label}>
          Time Slot
        </Text>


        <View style={styles.timeRow}>

          {/* ==================== FROM TIME ==================== */}
          {/* From Time par click karne se scrollable time picker open hoga */}

          <View style={styles.timeColumn}>

            <Text style={styles.smallLabel}>
              From
            </Text>


            <TouchableOpacity
              style={styles.timeInput}
              onPress={() =>
                setShowFromTimePicker(true)
              }
            >

              <Text style={styles.timeText}>
                {displayTime(fromTime)}
              </Text>

            </TouchableOpacity>

          </View>


          <Text style={styles.toText}>
            to
          </Text>


          {/* ==================== TO TIME ==================== */}
          {/* To Time par click karne se scrollable time picker open hoga */}

          <View style={styles.timeColumn}>

            <Text style={styles.smallLabel}>
              To
            </Text>


            <TouchableOpacity
              style={styles.timeInput}
              onPress={() =>
                setShowToTimePicker(true)
              }
            >

              <Text style={styles.timeText}>
                {displayTime(toTime)}
              </Text>

            </TouchableOpacity>

          </View>

        </View>


        {/* ==================== FROM TIME PICKER ==================== */}
        {/* Visitor Signup jaisa spinner From Time ke liye */}

        {showFromTimePicker && (

          <DateTimePicker
            value={fromTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleFromTimeChange}
          />

        )}


        {/* ==================== TO TIME PICKER ==================== */}
        {/* Visitor Signup jaisa spinner To Time ke liye */}

        {showToTimePicker && (

          <DateTimePicker
            value={toTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleToTimeChange}
          />

        )}


        {/* Provider Radius */}

        {renderDropdown(
          'Provider Radius',
          radius,
          'radius',
          [
            '1 km',
            '3 km',
            '5 km',
            '10 km',
          ],
        )}


        <Text style={styles.helper}>
          Providers within this distance from your home
          location will be shown.
        </Text>


        {/* ==================== FIND PROVIDERS BUTTON ==================== */}
        {/* Selected subscription data ko SelectProvider screen ko bhejna */}

        <TouchableOpacity
          style={styles.findButton}
          onPress={handleFindProviders}
        >

          <Text style={styles.findText}>
            Find Providers
          </Text>

        </TouchableOpacity>

      </ScrollView>


      {/* ==================== DROPDOWN MODAL ==================== */}
      {/* Service, Milk, Newspaper aur Radius selection ka modal */}

      <Modal
        visible={modal !== null}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModal(null)
        }
      >

        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() =>
            setModal(null)
          }
        >

          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Select
            </Text>


            <FlatList
              data={
                modal
                  ? modal.data
                  : []
              }
              keyExtractor={item => item}

              renderItem={({
                item,
              }) => (

                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() =>
                    selectValue(item)
                  }
                >

                  <Text style={styles.modalItemText}>
                    {item}
                  </Text>


                  <Text style={styles.modalArrow}>
                    ›
                  </Text>

                </TouchableOpacity>

              )}

            />

          </View>

        </TouchableOpacity>

      </Modal>

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
    backgroundColor: '#FFFFFF',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },


  content: {
    padding: 20,
    paddingBottom: 40,
  },


  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 18,
    marginBottom: 7,
  },


  helper: {
    fontSize: 11,
    color: '#7B8494',
    marginTop: 3,
  },


  dropdown: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },


  arrow: {
    fontSize: 12,
    color: '#111827',
  },


  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },


  calendar: {
    fontSize: 15,
    marginRight: 10,
  },


  inputText: {
    fontSize: 14,
    color: '#374151',
  },


  scheduleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },


  dayRow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },


  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#AAB1BD',
    borderRadius: 2,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },


  checked: {
    backgroundColor: '#2463EB',
    borderColor: '#2463EB',
  },


  tick: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },


  dayText: {
    fontSize: 12,
    color: '#374151',
  },


  // ==================== TIME SLOT STYLE ====================
  // From aur To time boxes ka design

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  timeColumn: {
    flex: 1,
  },


  smallLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },


  timeInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },


  timeText: {
    fontSize: 14,
    color: '#374151',
  },


  toText: {
    marginHorizontal: 8,
    color: '#6B7280',
    marginTop: 18,
  },


  findButton: {
    height: 50,
    backgroundColor: '#2463EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },


  findText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },


  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },


  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '55%',
  },


  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },


  modalItem: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  modalItemText: {
    fontSize: 14,
    color: '#374151',
  },


  modalArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },

});