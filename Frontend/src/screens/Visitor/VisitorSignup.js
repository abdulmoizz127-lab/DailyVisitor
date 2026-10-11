// ==================== REACT IMPORT ====================
// React aur screen state/lifecycle ke liye import kar rahe hain

import React, {useState, useEffect} from 'react';


// ==================== REACT NATIVE IMPORT ====================
// React Native ke required components import kar rahe hain

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


// ==================== DATE TIME PICKER ====================
// Service time select karne ke liye DateTimePicker use kar rahe hain

import DateTimePicker from '@react-native-community/datetimepicker';


// ==================== VISITOR SIGNUP SCREEN ====================
// Visitor provider signup screen

export default function VisitorSignup({navigation, route}) {


  // ==================== ACCOUNT INFORMATION ====================
  // Visitor ki basic account information store kar rahe hain

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullName, setFullName] = useState('');

  const [contactNo, setContactNo] = useState('');

  const [gender, setGender] = useState('');

  const [serviceRadius, setServiceRadius] = useState('');


  // ==================== SELECTED MILK PRODUCTS ====================
  // Milkman ke selected products store kar rahe hain

  const [selectedProducts, setSelectedProducts] = useState([]);


  // ==================== MILK PRODUCT PRICES ====================
  // Har selected milk product ki separate price store kar rahe hain

  const [productPrices, setProductPrices] = useState({});


  // ==================== SELECTED NEWSPAPERS ====================
  // Provider ke selected newspapers store kar rahe hain

  const [selectedNewspapers, setSelectedNewspapers] = useState([]);


  // ==================== NEWSPAPER PRICES ====================
  // Har selected newspaper ki separate price store kar rahe hain

  const [newspaperPrices, setNewspaperPrices] = useState({});


  // ==================== GARBAGE PRICE ====================
  // Garbage ki per-KG price store kar rahe hain

  const [garbagePrice, setGarbagePrice] = useState('');


  // ==================== LOCATION INFORMATION ====================
  // Provider ki location information store kar rahe hain

  const [location, setLocation] = useState('');

  const [locationName, setLocationName] = useState('');

  const [latitude, setLatitude] = useState('');

  const [longitude, setLongitude] = useState('');

  const [country, setCountry] = useState('');

  const [province, setProvince] = useState('');

  const [city, setCity] = useState('');

  const [locationType, setLocationType] = useState('');


  // ==================== SERVICE INFORMATION ====================
  // Provider ki service aur service days/time store kar rahe hain

  const [service, setService] = useState('');

  const [days, setDays] = useState([]);

  const [selectedDay, setSelectedDay] = useState('');

  const [timeSlots, setTimeSlots] = useState({});


  // ==================== TIME STATES ====================
  // Start aur end time store kar rahe hain

  const [startTime, setStartTime] = useState(new Date());

  const [endTime, setEndTime] = useState(new Date());


  // ==================== TIME PICKER STATES ====================
  // Time picker show/hide control kar rahe hain

  const [showStartPicker, setShowStartPicker] = useState(false);

  const [showEndPicker, setShowEndPicker] = useState(false);


  // ==================== RESTORE DATA FROM LOCATION SCREEN ====================
  // Location screen se wapas aane par signup ka existing data restore kar rahe hain

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


    // ==================== RESTORE SELECTED PRODUCTS ====================
    // Location screen se wapas aane par selected milk products restore kar rahe hain

    if (route.params?.selectedProducts !== undefined)
      setSelectedProducts(route.params.selectedProducts);


    // ==================== RESTORE PRODUCT PRICES ====================
    // Location screen se wapas aane par milk product prices restore kar rahe hain

    if (route.params?.productPrices !== undefined)
      setProductPrices(route.params.productPrices);


    // ==================== RESTORE SELECTED NEWSPAPERS ====================
    // Location screen se wapas aane par selected newspapers restore kar rahe hain

    if (route.params?.selectedNewspapers !== undefined)
      setSelectedNewspapers(route.params.selectedNewspapers);


    // ==================== RESTORE NEWSPAPER PRICES ====================
    // Location screen se wapas aane par har newspaper ki individual price restore kar rahe hain

    if (route.params?.newspaperPrices !== undefined)
      setNewspaperPrices(route.params.newspaperPrices);


    // ==================== RESTORE GARBAGE PRICE ====================
    // Location screen se wapas aane par garbage price restore kar rahe hain

    if (route.params?.garbagePrice !== undefined)
      setGarbagePrice(route.params.garbagePrice);


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


  // ==================== MAIN SERVICES ====================
  // Provider ke main service options

  const services = [
    'Milkman',
    'Newspaper',
    'Garbage',
  ];


  // ==================== MILK PRODUCTS ====================
  // Milkman ke extra products jo provider multiple select kar sakta hai

  const milkProducts = [
    'Cow Milk',
    'Goat Milk',
    'Camel Milk',
    'Cheese',
    'Butter/Ghee',
  ];


  // ==================== NEWSPAPER OPTIONS ====================
  // Provider ke newspaper options

  const newspapers = [
    'Dawn',
    'The News',
    'Jang',
    'Express',
    'Tribune',
    'Geo',
  ];


  // ==================== WEEK DAYS ====================
  // Provider ke service days

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];


  // ==================== SELECT MAIN SERVICE ====================
  // Main service select hone par selected service update kar rahe hain

  const selectService = (item) => {

    setService(item);


    // ==================== RESET PRODUCT SELECTION ====================
    // New service select hone par purane products ki selection clear kar rahe hain

    setSelectedProducts([]);


    // ==================== RESET PRODUCT PRICES ====================
    // New service select hone par purani product prices clear kar rahe hain

    setProductPrices({});


    // ==================== RESET NEWSPAPER SELECTION ====================
    // New service select hone par newspapers clear kar rahe hain

    setSelectedNewspapers([]);


    // ==================== RESET NEWSPAPER PRICES ====================
    // New service select hone par newspaper ki individual prices clear kar rahe hain

    setNewspaperPrices({});


    // ==================== RESET GARBAGE PRICE ====================
    // New service select hone par garbage price clear kar rahe hain

    setGarbagePrice('');

  };


  // ==================== SELECT MILK PRODUCT ====================
  // Milkman ke multiple products select/unselect kar rahe hain

  const toggleMilkProduct = (product) => {

    if (selectedProducts.includes(product)) {


      // ==================== REMOVE MILK PRODUCT ====================
      // Agar product already selected hai to usay remove kar rahe hain

      setSelectedProducts(
        selectedProducts.filter(
          item => item !== product
        )
      );


      // ==================== REMOVE PRODUCT PRICE ====================
      // Product remove hone par uski price bhi remove kar rahe hain

      const updatedPrices = {
        ...productPrices,
      };


      delete updatedPrices[product];


      setProductPrices(updatedPrices);


    } else {


      // ==================== ADD MILK PRODUCT ====================
      // Naya milk product selected products mein add kar rahe hain

      setSelectedProducts([
        ...selectedProducts,
        product,
      ]);

    }

  };


  // ==================== CHANGE MILK PRODUCT PRICE ====================
  // Selected milk product ki individual price update kar rahe hain

  const changeProductPrice = (product, price) => {

    setProductPrices({
      ...productPrices,
      [product]: price,
    });

  };


  // ==================== GET MILK PRODUCT UNIT ====================
  // Product ke according uski price unit return kar rahe hain

  const getProductUnit = (product) => {

    if (
      product === 'Cow Milk' ||
      product === 'Goat Milk' ||
      product === 'Camel Milk'
    ) {

      return 'Liter';

    }


    return 'Kg';

  };


  // ==================== SELECT NEWSPAPER ====================
  // Newspaper ko multiple select/unselect kar rahe hain

  const toggleNewspaper = (newspaper) => {

    if (selectedNewspapers.includes(newspaper)) {


      // ==================== REMOVE NEWSPAPER ====================
      // Agar newspaper selected hai to remove kar rahe hain

      setSelectedNewspapers(
        selectedNewspapers.filter(
          item => item !== newspaper
        )
      );


      // ==================== REMOVE NEWSPAPER PRICE ====================
      // Newspaper remove hone par uski price bhi remove kar rahe hain

      const updatedPrices = {
        ...newspaperPrices,
      };


      delete updatedPrices[newspaper];


      setNewspaperPrices(updatedPrices);


    } else {


      // ==================== ADD NEWSPAPER ====================
      // Naya newspaper selected list mein add kar rahe hain

      setSelectedNewspapers([
        ...selectedNewspapers,
        newspaper,
      ]);

    }

  };


  // ==================== CHANGE NEWSPAPER PRICE ====================
  // Selected newspaper ki individual price update kar rahe hain

  const changeNewspaperPrice = (newspaper, price) => {

    setNewspaperPrices({
      ...newspaperPrices,
      [newspaper]: price,
    });

  };


  // ==================== SELECT SERVICE DAY ====================
  // Provider ke service days select/unselect kar rahe hain

  const selectDay = (day) => {

    if (days.includes(day)) {


      setDays(
        days.filter(item => item !== day)
      );


      if (selectedDay === day) {

        setSelectedDay('');

      }


    } else {


      setDays([
        ...days,
        day,
      ]);


      if (!selectedDay) {

        setSelectedDay(day);

      }

    }

  };


  // ==================== FORMAT TIME ====================
  // Date object ko database TIME format mein convert kar rahe hain

  const formatTime = (date) => {

    return date.toTimeString().slice(0, 8);

  };


  // ==================== DISPLAY TIME ====================
  // Time ko AM/PM format mein show kar rahe hain

  const displayTime = (date) => {

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  };


  // ==================== ADD TIME SLOT ====================
  // Selected day ke liye service time slot add kar rahe hain

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


  // ==================== CHECK PRODUCT PRICES ====================
  // Milkman ke selected products ki prices check kar rahe hain

  const checkMilkPrices = () => {

    for (const product of selectedProducts) {

      if (
        !productPrices[product] ||
        !productPrices[product].trim()
      ) {

        return false;

      }

    }


    return true;

  };


  // ==================== HANDLE SIGNUP ====================
  // Provider signup ka complete process handle kar rahe hain

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


    // ==================== CHECK PASSWORD ====================
    // Password aur confirm password same hain ya nahi check kar rahe hain

    if (password !== confirmPassword) {

      Alert.alert(
        'Password Error',
        'Passwords do not match.'
      );


      return;

    }


    // ==================== CHECK SERVICE ====================
    // Provider ne main service select ki hai ya nahi check kar rahe hain

    if (!service) {

      Alert.alert(
        'Service Required',
        'Please select a service.'
      );


      return;

    }


    // ==================== CHECK MILK PRODUCTS ====================
    // Milkman ke liye kam az kam ek product select karna zaroori hai

    if (
      service === 'Milkman' &&
      selectedProducts.length === 0
    ) {

      Alert.alert(
        'Product Required',
        'Please select at least one milk product.'
      );


      return;

    }


    // ==================== CHECK MILK PRODUCT PRICES ====================
    // Har selected milk product ki price required hai

    if (
      service === 'Milkman' &&
      !checkMilkPrices()
    ) {

      Alert.alert(
        'Price Required',
        'Please enter price for all selected products.'
      );


      return;

    }


    // ==================== CHECK NEWSPAPERS ====================
    // Newspaper service ke liye kam az kam ek newspaper select karna zaroori hai

    if (
      service === 'Newspaper' &&
      selectedNewspapers.length === 0
    ) {

      Alert.alert(
        'Newspaper Required',
        'Please select at least one newspaper.'
      );


      return;

    }


    // ==================== CHECK NEWSPAPER PRICES ====================
    // Har selected newspaper ki individual price required hai

    if (service === 'Newspaper') {

      for (const newspaper of selectedNewspapers) {

        // ==================== CHECK INDIVIDUAL NEWSPAPER PRICE ====================
        // Check kar rahe hain ke selected newspaper ki price enter hui hai ya nahi

        if (
          !newspaperPrices[newspaper] ||
          !newspaperPrices[newspaper].trim()
        ) {

          Alert.alert(
            'Price Required',
            `Please enter price for ${newspaper}.`
          );


          return;

        }

      }

    }


    // ==================== CHECK GARBAGE PRICE ====================
    // Garbage service ke liye per-KG price required hai

    if (
      service === 'Garbage' &&
      !garbagePrice.trim()
    ) {

      Alert.alert(
        'Price Required',
        'Please enter garbage price per KG.'
      );


      return;

    }


    // ==================== CHECK LOCATION ====================
    // Location complete hai ya nahi check kar rahe hain

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


    // ==================== CHECK SERVICE DAYS ====================
    // Provider ne service days select kiye hain ya nahi

    if (days.length === 0) {

      Alert.alert(
        'Days Required',
        'Please select service days.'
      );


      return;

    }


    // ==================== CHECK SERVICE TIME ====================
    // Provider ne kam az kam ek time slot add kiya hai ya nahi

    if (Object.keys(timeSlots).length === 0) {

      Alert.alert(
        'Time Required',
        'Please add a service time.'
      );


      return;

    }


    try {


      // ==================== CONVERT SERVICE NAME ====================
      // Database mein Garbage Collector naam save karne ke liye convert kar rahe hain

      let serviceName = service;


      if (service === 'Garbage') {

        serviceName = 'Garbage Collector';

      }


      // ==================== PREPARE PRODUCT DATA ====================
      // Selected products aur unki prices ko simple array mein prepare kar rahe hain

      const products = selectedProducts.map(product => ({

        name: product,

        price: parseFloat(
          productPrices[product]
        ),

        unit: getProductUnit(product),

      }));


      // ==================== SEND SIGNUP REQUEST ====================
      // Visitor signup ka complete new data backend ko send kar rahe hain

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


            // ==================== SEND SELECTED PRODUCTS ====================
            // Selected milk products aur unki individual prices backend ko bhej rahe hain

            products: products,


            // ==================== SEND SELECTED NEWSPAPERS ====================
            // Selected newspapers backend ko bhej rahe hain

            newspapers: selectedNewspapers,


            // ==================== SEND NEWSPAPER PRICES ====================
            // Har newspaper ki individual price backend ko bhej rahe hain

            newspaperPrices: Object.fromEntries(

              selectedNewspapers.map(newspaper => [

                newspaper,

                parseFloat(
                  newspaperPrices[newspaper]
                ),

              ])

            ),


            // ==================== SEND GARBAGE PRICE ====================
            // Garbage ki per-KG price backend ko bhej rahe hain

            garbagePrice:
              garbagePrice
                ? parseFloat(garbagePrice)
                : null,


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
                navigation.navigate(
                  'VisitorLogin'
                ),

            },
          ]
        );


      } else {

        Alert.alert(
          'Signup Failed',
          data.message ||
          'Something went wrong.'
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

          JOIN AS PROVIDER !

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


        {/* ==================== GENDER ==================== */}
        {/* Provider ka gender select kar rahe hain */}

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


        {/* ==================== LOCATION ==================== */}
        {/* Provider ki location map se select kar rahe hain */}

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
              navigation.navigate(
                'Location',
                {

                  from: 'VisitorSignup',

                  email,

                  password,

                  confirmPassword,

                  fullName,

                  contactNo,

                  gender,

                  serviceRadius,


                  // ==================== PASS NEW PRICE DATA TO MAP ====================
                  // Location screen se wapas aane par product aur newspaper prices lose na hon

                  selectedProducts,

                  productPrices,

                  selectedNewspapers,

                  newspaperPrices,

                  garbagePrice,


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

                }
              )
            }
          >

            <Text style={styles.mapIcon}>

              📍

            </Text>

          </TouchableOpacity>


        </View>


        {/* ==================== SERVICE SELECTION ==================== */}
        {/* Provider apni main service select karega */}

        <Text style={styles.label}>

          Services

        </Text>


        {services.map(item => (

          <TouchableOpacity
            key={item}
            style={[
              styles.serviceOption,

              service === item &&
                styles.serviceOptionSelected,

            ]}
            onPress={() => selectService(item)}
          >


            <View style={styles.serviceLeft}>


              <View style={styles.checkbox}>


                {service === item && (

                  <Text style={styles.check}>

                    ✓

                  </Text>

                )}


              </View>


              <Text
                style={[
                  styles.optionText,

                  service === item &&
                    styles.selectedOptionText,

                ]}
              >

                {item === 'Garbage'
                  ? 'Garbage Collector'
                  : item}

              </Text>


            </View>


            {/* ==================== SERVICE RADIO INDICATOR ==================== */}
            {/* Selected service ko radio style mein show kar rahe hain */}

            <View
              style={[
                styles.radioOuter,

                service === item &&
                  styles.radioOuterSelected,

              ]}
            >

              {service === item && (

                <View style={styles.radioInner} />

              )}

            </View>


          </TouchableOpacity>

        ))}


        {/* ==================== MILK PRODUCTS ==================== */}
        {/* Sirf Milkman select hone par extra milk products show kar rahe hain */}

        {service === 'Milkman' && (

          <View style={styles.extraSection}>


            <Text style={styles.extraTitle}>

              Select Products (multi-select) *

            </Text>


            <View style={styles.productContainer}>


              {milkProducts.map(product => {

                const selected =
                  selectedProducts.includes(
                    product
                  );


                return (

                  <TouchableOpacity
                    key={product}
                    style={[
                      styles.productButton,

                      selected &&
                        styles.productButtonSelected,

                    ]}
                    onPress={() =>
                      toggleMilkProduct(product)
                    }
                  >


                    <Text
                      style={[
                        styles.productText,

                        selected &&
                          styles.productTextSelected,

                      ]}
                    >

                      {product}

                    </Text>


                  </TouchableOpacity>

                );

              })}


            </View>


            {/* ==================== MILK PRODUCT PRICES ==================== */}
            {/* Sirf selected milk products ki individual price fields show kar rahe hain */}

            {selectedProducts.length > 0 && (

              <View style={styles.priceSection}>


                <Text style={styles.extraTitle}>

                  Set Your Prices (Rs.)

                </Text>


                {selectedProducts.map(product => (

                  <View
                    key={product}
                    style={styles.priceRow}
                  >


                    <Text
                      style={styles.priceProductName}
                    >

                      {product}

                    </Text>


                    <Text style={styles.rsText}>

                      Rs.

                    </Text>


                    <TextInput
                      style={styles.smallPriceInput}
                      placeholder="0"
                      value={
                        productPrices[product] ||
                        ''
                      }
                      onChangeText={price =>
                        changeProductPrice(
                          product,
                          price
                        )
                      }
                      keyboardType="numeric"
                    />


                    <Text style={styles.unitText}>

                      per {getProductUnit(product)}

                    </Text>


                  </View>

                ))}


              </View>

            )}


          </View>

        )}


        {/* ==================== NEWSPAPER OPTIONS ==================== */}
        {/* Sirf Newspaper select hone par newspaper options show kar rahe hain */}

        {service === 'Newspaper' && (

          <View style={styles.extraSection}>


            <Text style={styles.extraTitle}>

              Newspapers You Sell (multi-select) *

            </Text>


            <View style={styles.productContainer}>


              {newspapers.map(newspaper => {

                const selected =
                  selectedNewspapers.includes(
                    newspaper
                  );


                return (

                  <TouchableOpacity
                    key={newspaper}
                    style={[
                      styles.productButton,

                      selected &&
                        styles.productButtonSelected,

                    ]}
                    onPress={() =>
                      toggleNewspaper(
                        newspaper
                      )
                    }
                  >


                    <Text
                      style={[
                        styles.productText,

                        selected &&
                          styles.productTextSelected,

                      ]}
                    >

                      📰 {newspaper}

                    </Text>


                  </TouchableOpacity>

                );

              })}


            </View>


            {/* ==================== NEWSPAPER PRICES ==================== */}
            {/* Sirf selected newspapers ki individual price fields show kar rahe hain */}

            {selectedNewspapers.length > 0 && (

              <View style={styles.priceSection}>


                {/* ==================== SET YOUR PRICES ==================== */}
                {/* Selected newspapers ke liye heading */}

                <Text style={styles.extraTitle}>

                  Set Your Prices (Rs.)

                </Text>


                {/* ==================== SELECTED NEWSPAPER PRICES ==================== */}
                {/* Har selected newspaper ke liye separate price field bana rahe hain */}

                {selectedNewspapers.map(newspaper => (

                  <View
                    key={newspaper}
                    style={styles.priceRow}
                  >


                    {/* ==================== NEWSPAPER NAME ==================== */}
                    {/* Newspaper ka naam show kar rahe hain */}

                    <Text style={styles.priceProductName}>

                      {newspaper}

                    </Text>


                    {/* ==================== RS TEXT ==================== */}
                    {/* Price se pehle Rs. show kar rahe hain */}

                    <Text style={styles.rsText}>

                      Rs.

                    </Text>


                    {/* ==================== NEWSPAPER PRICE INPUT ==================== */}
                    {/* Har newspaper ki apni individual price input */}

                    <TextInput
                      style={styles.smallPriceInput}
                      placeholder="0"
                      value={
                        newspaperPrices[newspaper] ||
                        ''
                      }
                      onChangeText={price =>
                        changeNewspaperPrice(
                          newspaper,
                          price
                        )
                      }
                      keyboardType="numeric"
                    />


                    {/* ==================== PRICE UNIT ==================== */}
                    {/* Newspaper ki price per piece hai */}

                    <Text style={styles.unitText}>

                      / piece

                    </Text>


                  </View>

                ))}


              </View>

            )}


          </View>

        )}


        {/* ==================== GARBAGE PRICING ==================== */}
        {/* Sirf Garbage Collector select hone par per KG price show kar rahe hain */}

        {service === 'Garbage' && (

          <View style={styles.extraSection}>


            <Text style={styles.extraTitle}>

              Pricing

            </Text>


            <View style={styles.priceRow}>


              <Text
                style={styles.priceProductName}
              >

                Charge per KG

              </Text>


              <Text style={styles.rsText}>

                Rs.

              </Text>


              <TextInput
                style={styles.smallPriceInput}
                placeholder="0"
                value={garbagePrice}
                onChangeText={
                  setGarbagePrice
                }
                keyboardType="numeric"
              />


              <Text style={styles.unitText}>

                / Kg

              </Text>


            </View>


          </View>

        )}


        {/* ==================== SERVICE DAYS ==================== */}
        {/* Provider ke service days select kar rahe hain */}

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
              onPress={() =>
                selectDay(day)
              }
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


        {/* ==================== SERVICE TIME ==================== */}
        {/* Selected days ke liye service time add kar rahe hain */}

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
                onChange={(
                  event,
                  selectedTime
                ) => {

                  setShowStartPicker(false);

                  if (selectedTime) {

                    setStartTime(
                      selectedTime
                    );

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
                onChange={(
                  event,
                  selectedTime
                ) => {

                  setShowEndPicker(false);

                  if (selectedTime) {

                    setEndTime(
                      selectedTime
                    );

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


        {/* ==================== CONTINUE BUTTON ==================== */}
        {/* Signup request start kar rahe hain */}

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
              navigation.navigate(
                'VisitorLogin'
              )
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


// ==================== SCREEN STYLES ====================
// Visitor Signup screen ke styles

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


  // ==================== SERVICE OPTION ====================
  // Main service ko Figma jaisi large selectable row mein show kar rahe hain

  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F2F8',
  },


  // ==================== SELECTED SERVICE OPTION ====================
  // Selected service ko highlight kar rahe hain

  serviceOptionSelected: {
    backgroundColor: '#E9FBF7',
    borderColor: '#18B89B',
  },


  // ==================== SERVICE LEFT AREA ====================
  // Checkbox aur service name ko ek row mein rakh rahe hain

  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },


  // ==================== CHECKBOX ====================
  // Service selection ka checkbox

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


  // ==================== CHECK MARK ====================
  // Selected checkbox ka check mark

  check: {
    color: '#18B89B',
    fontSize: 16,
    fontWeight: 'bold',
  },


  // ==================== SERVICE RADIO OUTER ====================
  // Service row ke right side radio circle

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C9D0DA',
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ==================== SELECTED RADIO OUTER ====================
  // Selected service ka radio circle

  radioOuterSelected: {
    borderColor: '#18B89B',
  },


  // ==================== RADIO INNER ====================
  // Selected radio ke andar green dot

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#18B89B',
  },


  // ==================== OPTION TEXT ====================
  // Service name ka normal text

  optionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },


  // ==================== SELECTED OPTION TEXT ====================
  // Selected service name ko green kar rahe hain

  selectedOptionText: {
    color: '#087D6D',
  },


  // ==================== EXTRA SERVICE SECTION ====================
  // Service ke extra products/options ka section

  extraSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },


  // ==================== EXTRA SECTION TITLE ====================
  // Extra products heading

  extraTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },


  // ==================== PRODUCT CONTAINER ====================
  // Products ko multiple rows mein wrap kar rahe hain

  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },


  // ==================== PRODUCT BUTTON ====================
  // Normal product button

  productButton: {
    backgroundColor: '#F4F6FA',
    borderWidth: 1,
    borderColor: '#DDE2EA',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 8,
  },


  // ==================== SELECTED PRODUCT BUTTON ====================
  // Selected product ko green highlight kar rahe hain

  productButtonSelected: {
    backgroundColor: '#18B89B',
    borderColor: '#18B89B',
  },


  // ==================== PRODUCT TEXT ====================
  // Product ka normal text

  productText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },


  // ==================== SELECTED PRODUCT TEXT ====================
  // Selected product ka white text

  productTextSelected: {
    color: '#FFFFFF',
  },


  // ==================== PRICE SECTION ====================
  // Product pricing section

  priceSection: {
    marginTop: 8,
  },


  // ==================== PRICE ROW ====================
  // Product name, Rs input aur unit ko ek row mein show kar rahe hain

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8,
  },


  // ==================== PRICE PRODUCT NAME ====================
  // Price row ke andar product/service ka name

  priceProductName: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },


  // ==================== RS TEXT ====================
  // Price input se pehle Rs. text

  rsText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginRight: 5,
  },


  // ==================== SMALL PRICE INPUT ====================
  // Individual product price input

  smallPriceInput: {
    width: 75,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE2EA',
    borderRadius: 9,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 13,
  },


  // ==================== PRICE UNIT TEXT ====================
  // Price input ke baad unit show kar rahe hain

  unitText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 5,
  },


  // ==================== SERVICE DAYS CONTAINER ====================
  // Service days ko multiple rows mein show kar rahe hain

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },


  // ==================== DAY BUTTON ====================
  // Normal day button

  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    backgroundColor: '#F0F2F8',
    borderRadius: 10,
    marginRight: 7,
    marginBottom: 8,
  },


  // ==================== SELECTED DAY ====================
  // Selected day ko highlight kar rahe hain

  selectedDay: {
    backgroundColor: '#DDE5FF',
    borderWidth: 1,
    borderColor: '#2D52E6',
  },


  // ==================== DAY TEXT ====================
  // Normal day text

  dayText: {
    fontSize: 13,
    color: '#374151',
  },


  // ==================== SELECTED DAY TEXT ====================
  // Selected day text

  selectedDayText: {
    color: '#2D52E6',
    fontWeight: 'bold',
  },


  // ==================== DAY HEADING ====================
  // Currently selected day ka heading

  dayHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },


  // ==================== TIME ROW ====================
  // Start aur end time ko ek row mein rakh rahe hain

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  // ==================== TIME INPUT ====================
  // Time selection button

  timeInput: {
    flex: 1,
    height: 45,
    backgroundColor: '#F0F2F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },


  // ==================== TIME TEXT ====================
  // Time ka text

  timeText: {
    fontSize: 14,
    color: '#374151',
  },


  // ==================== TO TEXT ====================
  // Start aur end time ke darmiyan "to"

  toText: {
    marginHorizontal: 8,
    color: '#6B7280',
  },


  // ==================== ADD TIME BUTTON ====================
  // New time slot add karne ka button

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


  // ==================== ADD TIME TEXT ====================
  // Add Time Slot ka text

  addText: {
    color: '#2D52E6',
    fontWeight: '600',
  },


  // ==================== TIME SLOT ====================
  // Added time slot ka box

  slot: {
    backgroundColor: '#E8EDFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },


  // ==================== TIME SLOT TEXT ====================
  // Added time slot ka text

  slotText: {
    color: '#374151',
  },


  // ==================== CONTINUE BUTTON ====================
  // Signup submit button

  continueButton: {
    height: 50,
    backgroundColor: '#2D52E6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },


  // ==================== CONTINUE TEXT ====================
  // Continue button ka text

  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },


  // ==================== LOGIN ROW ====================
  // Existing account login row

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },


  // ==================== LOGIN TEXT ====================
  // Existing account text

  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },


  // ==================== LOGIN LINK ====================
  // Login link

  loginLink: {
    color: '#2D52E6',
    fontSize: 14,
    fontWeight: 'bold',
  },

});