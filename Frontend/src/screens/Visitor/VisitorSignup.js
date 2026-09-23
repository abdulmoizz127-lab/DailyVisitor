import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VisitorSignup({navigation, route}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [gender, setGender] = useState('');
  const [serviceRadius, setServiceRadius] = useState('');

  // ==================== SERVICE PRICE ====================
  // Provider ki service ki price store kar rahe hain
  const [servicePrice, setServicePrice] = useState('');

  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [locationType, setLocationType] = useState('');

  const [service, setService] = useState('');
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [timeSlots, setTimeSlots] = useState({});

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);


  useEffect(() => {

    if (route.params?.email !== undefined)
      setEmail(route.params.email);

    if (route.params?.password !== undefined)
      setPassword(route.params.password);

    if (route.params?.confirmPassword !== undefined)
      setConfirmPassword(route.params.confirmPassword);

    if (route.params?.fullName !== undefined)
      setFullName(route.params.fullName);

    if (route.params?.contactNo !== undefined)
      setContactNo(route.params.contactNo);

    if (route.params?.gender !== undefined)
      setGender(route.params.gender);

    if (route.params?.serviceRadius !== undefined)
      setServiceRadius(route.params.serviceRadius);

    // ==================== GET SERVICE PRICE FROM ROUTE ====================
    // Map screen se wapas aane par service price ko restore kar rahe hain
    if (route.params?.servicePrice !== undefined)
      setServicePrice(route.params.servicePrice);

    if (route.params?.location !== undefined)
      setLocation(route.params.location);

    if (route.params?.locationName !== undefined)
      setLocationName(route.params.locationName);

    if (route.params?.latitude !== undefined)
      setLatitude(route.params.latitude);

    if (route.params?.longitude !== undefined)
      setLongitude(route.params.longitude);

    if (route.params?.country !== undefined)
      setCountry(route.params.country);

    if (route.params?.province !== undefined)
      setProvince(route.params.province);

    if (route.params?.city !== undefined)
      setCity(route.params.city);

    if (route.params?.locationType !== undefined)
      setLocationType(route.params.locationType);

    if (route.params?.service !== undefined)
      setService(route.params.service);

    if (route.params?.days !== undefined)
      setDays(route.params.days);

    if (route.params?.selectedDay !== undefined)
      setSelectedDay(route.params.selectedDay);

    if (route.params?.timeSlots !== undefined)
      setTimeSlots(route.params.timeSlots);

  }, [route.params]);


  const services = [
    'Milkman',
    'Newspaper',
    'Garbage',
  ];


  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];


  const selectDay = (day) => {

    if (days.includes(day)) {

      setDays(days.filter(item => item !== day));

      if (selectedDay === day) {
        setSelectedDay('');
      }

    } else {

      setDays([...days, day]);

      if (!selectedDay) {
        setSelectedDay(day);
      }
    }
  };


  const formatTime = (date) => {
    return date.toTimeString().slice(0, 8);
  };


  const displayTime = (date) => {

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  };


  const addTimeSlot = () => {

    if (!selectedDay) {
      return;
    }

    const start = formatTime(startTime);
    const end = formatTime(endTime);

    const newSlot = start + ' - ' + end;

    setTimeSlots({
      ...timeSlots,

      [selectedDay]: [
        ...(timeSlots[selectedDay] || []),
        newSlot,
      ],
    });
  };


  const handleSignup = async () => {

    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !fullName.trim() ||
      !contactNo.trim() ||
      !gender ||
      !serviceRadius.trim()
    ) {

      Alert.alert(
        'Missing Fields',
        'Please fill all required fields.'
      );

      return;
    }


    // ==================== CHECK SERVICE PRICE ====================
    // Signup se pehle check kar rahe hain ke provider ne price enter ki hai
    if (!servicePrice.trim()) {
      Alert.alert(
        'Price Required',
        'Please enter your service price.'
      );

      return;
    }


    if (password !== confirmPassword) {

      Alert.alert(
        'Password Error',
        'Passwords do not match.'
      );

      return;
    }


    if (
      !latitude ||
      !longitude ||
      !locationName ||
      !country ||
      !province ||
      !city
    ) {

      Alert.alert(
        'Location Required',
        'Please select your location from the map.'
      );

      return;
    }


    if (!service) {

      Alert.alert(
        'Service Required',
        'Please select a service.'
      );

      return;
    }


    if (days.length === 0) {

      Alert.alert(
        'Days Required',
        'Please select service days.'
      );

      return;
    }


    if (Object.keys(timeSlots).length === 0) {

      Alert.alert(
        'Time Required',
        'Please add a service time.'
      );

      return;
    }


    try {

      let serviceName = service;

      if (service === 'Garbage') {
        serviceName = 'Garbage Collector';
      }


      // ==================== SEND SIGNUP REQUEST ====================
      // Visitor signup ka complete data backend ko send kar rahe hain
      const response = await fetch(
        'http://localhost:5000/api/visitors/signup',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({

            email: email.trim(),
            password: password,
            confirmPassword: confirmPassword,
            fullName: fullName.trim(),
            contactNo: contactNo.trim(),
            gender: gender,

            serviceRadius: parseInt(
              serviceRadius,
              10
            ),

            // ==================== SEND SERVICE PRICE ====================
            // Provider ki entered price backend ko send kar rahe hain
            servicePrice: parseFloat(servicePrice),

            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),

            locationName: locationName,
            country: country,
            province: province,
            city: city,
            locationType: locationType,

            service: serviceName,
            days: days,
            timeSlots: timeSlots,

          }),
        }
      );


      const data = await response.json();

      console.log(
        'Visitor Signup Response:',
        data
      );


      if (response.ok) {

        Alert.alert(
          'Success',
          'Visitor account created successfully!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('VisitorLogin'),
            },
          ]
        );

      } else {

        Alert.alert(
          'Signup Failed',
          data.message || 'Something went wrong.'
        );
      }

    } catch (error) {

      console.log(
        'Visitor Signup Error:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Failed to connect to the server.'
      );
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>


        <View style={styles.iconBox}>
          <Text style={styles.icon}>🛡️</Text>
        </View>


        <Text style={styles.title}>
          Join as Visitor
        </Text>

        <Text style={styles.subtitle}>
          Create an account to start accepting jobs.
        </Text>


        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />


        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />


        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />


        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />


        <Text style={styles.label}>
          Contact Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter contact number"
          value={contactNo}
          onChangeText={setContactNo}
          keyboardType="phone-pad"
        />


        {/* Gender */}

        <Text style={styles.label}>
          Gender
        </Text>

        <View style={styles.genderRow}>

          <TouchableOpacity
            style={
              gender === 'Male'
                ? styles.genderSelected
                : styles.genderButton
            }
            onPress={() => setGender('Male')}
          >
            <Text>Male</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={
              gender === 'Female'
                ? styles.genderSelected
                : styles.genderButton
            }
            onPress={() => setGender('Female')}
          >
            <Text>Female</Text>
          </TouchableOpacity>

        </View>


        <Text style={styles.label}>
          Service Radius (KM)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter service radius"
          value={serviceRadius}
          onChangeText={setServiceRadius}
          keyboardType="numeric"
        />


        {/* ==================== SERVICE PRICE INPUT ==================== */}
        {/* Provider apni service ki unit price yahan enter karega */}
        <Text style={styles.label}>
          Service Price
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter service price"
          value={servicePrice}
          onChangeText={setServicePrice}
          keyboardType="numeric"
        />


        {/* ==================== PRICE UNIT DISPLAY ==================== */}
        {/* Selected service ke according price ki unit user ko show kar rahe hain */}
        {service !== '' && (
          <Text style={styles.priceUnitText}>
            Price Unit: {
              service === 'Milkman'
                ? 'Liter'
                : service === 'Newspaper'
                ? 'Newspaper'
                : 'Collection'
            }
          </Text>
        )}


        {/* Location */}

        <Text style={styles.label}>
          Location / Area
        </Text>

        <View style={styles.locationRow}>

          <TextInput
            style={styles.locationInput}
            placeholder="Select from map"
            value={locationName}
            editable={false}
          />

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate('Location', {

                from: 'VisitorSignup',

                email,
                password,
                confirmPassword,
                fullName,
                contactNo,
                gender,
                serviceRadius,

                // ==================== PASS SERVICE PRICE TO MAP ====================
                // Map screen se wapas aane par price lose na ho is liye pass kar rahe hain
                servicePrice,

                service,
                days,
                selectedDay,
                timeSlots,

                location,
                locationName,
                latitude,
                longitude,
                country,
                province,
                city,
                locationType,

              })
            }
          >
            <Text style={styles.mapIcon}>
              📍
            </Text>
          </TouchableOpacity>

        </View>


        {/* Services */}

        <Text style={styles.label}>
          Services
        </Text>

        {services.map(item => (

          <TouchableOpacity
            key={item}
            style={styles.option}
            onPress={() => setService(item)}
          >

            <View style={styles.checkbox}>

              {service === item && (
                <Text style={styles.check}>
                  ✓
                </Text>
              )}

            </View>

            <Text style={styles.optionText}>
              {item}
            </Text>

          </TouchableOpacity>

        ))}


        {/* Days */}

        <Text style={styles.label}>
          Service Days
        </Text>

        <View style={styles.daysContainer}>

          {weekDays.map(day => (

            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                days.includes(day) &&
                  styles.selectedDay,
              ]}
              onPress={() => selectDay(day)}
            >

              <Text
                style={[
                  styles.dayText,
                  days.includes(day) &&
                    styles.selectedDayText,
                ]}
              >
                {day.substring(0, 3)}
              </Text>

            </TouchableOpacity>

          ))}

        </View>


        {/* Time */}

        {days.length > 0 && (

          <>

            <Text style={styles.label}>
              Service Time
            </Text>


            <View style={styles.daysContainer}>

              {days.map(day => (

                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDay === day &&
                      styles.selectedDay,
                  ]}
                  onPress={() =>
                    setSelectedDay(day)
                  }
                >

                  <Text
                    style={[
                      styles.dayText,
                      selectedDay === day &&
                        styles.selectedDayText,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>


            <Text style={styles.dayHeading}>
              {selectedDay}
            </Text>


            <View style={styles.timeRow}>

              <TouchableOpacity
                style={styles.timeInput}
                onPress={() =>
                  setShowStartPicker(true)
                }
              >

                <Text style={styles.timeText}>
                  {displayTime(startTime)}
                </Text>

              </TouchableOpacity>


              <Text style={styles.toText}>
                to
              </Text>


              <TouchableOpacity
                style={styles.timeInput}
                onPress={() =>
                  setShowEndPicker(true)
                }
              >

                <Text style={styles.timeText}>
                  {displayTime(endTime)}
                </Text>

              </TouchableOpacity>

            </View>


            {showStartPicker && (

              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={(event, selectedTime) => {

                  setShowStartPicker(false);

                  if (selectedTime) {
                    setStartTime(selectedTime);
                  }

                }}
              />

            )}


            {showEndPicker && (

              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={(event, selectedTime) => {

                  setShowEndPicker(false);

                  if (selectedTime) {
                    setEndTime(selectedTime);
                  }

                }}
              />

            )}


            <TouchableOpacity
              style={styles.addButton}
              onPress={addTimeSlot}
            >

              <Text style={styles.addText}>
                + Add Time Slot
              </Text>

            </TouchableOpacity>


            {(timeSlots[selectedDay] || []).map(
              (slot, index) => (

                <View
                  key={index}
                  style={styles.slot}
                >

                  <Text style={styles.slotText}>
                    {slot}
                  </Text>

                </View>

              )
            )}

          </>

        )}


        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSignup}
        >

          <Text style={styles.continueText}>
            Continue
          </Text>

        </TouchableOpacity>


        <View style={styles.loginRow}>

          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('VisitorLogin')
            }
          >

            <Text style={styles.loginLink}>
              {' '}Log In
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    padding: 28,
  },

  back: {
    fontSize: 25,
    marginBottom: 18,
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#EEF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  icon: {
    fontSize: 27,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    height: 47,
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 14,
    fontSize: 14,
  },

  // ==================== PRICE UNIT STYLE ====================
  // Price unit ko service price ke neeche show karne ke liye style
  priceUnitText: {
    fontSize: 13,
    color: '#2D52E6',
    fontWeight: '600',
    marginTop: -5,
    marginBottom: 14,
  },

  genderRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  genderButton: {
    flex: 1,
    height: 47,
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  genderSelected: {
    flex: 1,
    height: 47,
    backgroundColor: '#DDE5FF',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2D52E6',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  locationInput: {
    flex: 1,
    height: 47,
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 14,
  },

  mapButton: {
    width: 47,
    height: 47,
    backgroundColor: '#DDE5FF',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  mapIcon: {
    fontSize: 20,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  check: {
    color: '#2D52E6',
    fontSize: 16,
    fontWeight: 'bold',
  },

  optionText: {
    fontSize: 14,
    color: '#374151',
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },

  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    backgroundColor: '#F0F2F8',
    borderRadius: 10,
    marginRight: 7,
    marginBottom: 8,
  },

  selectedDay: {
    backgroundColor: '#DDE5FF',
    borderWidth: 1,
    borderColor: '#2D52E6',
  },

  dayText: {
    fontSize: 13,
    color: '#374151',
  },

  selectedDayText: {
    color: '#2D52E6',
    fontWeight: 'bold',
  },

  dayHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeInput: {
    flex: 1,
    height: 45,
    backgroundColor: '#F0F2F8',
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
  },

  addButton: {
    height: 42,
    borderWidth: 1,
    borderColor: '#2D52E6',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  addText: {
    color: '#2D52E6',
    fontWeight: '600',
  },

  slot: {
    backgroundColor: '#E8EDFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },

  slotText: {
    color: '#374151',
  },

  continueButton: {
    height: 50,
    backgroundColor: '#2D52E6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },

  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },

  loginLink: {
    color: '#2D52E6',
    fontSize: 14,
    fontWeight: 'bold',
  },

});