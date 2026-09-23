
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

// Resident Signup screen.
// navigation = doosri screens par jane ke liye.
// route = doosri screen se aaye hue parameters receive karne ke liye.
export default function ResidentSignup({navigation, route}) {

  // State temporary boxes hain jahan user ka signup data React Native mein store hota hai.
  // email ki current value email state mein store hoti hai.
  // setEmail email state ki value change karta hai.
  const [email, setEmail] = useState('');

  // Password ki current value password state mein store hoti hai.
  const [password, setPassword] = useState('');

  // Confirm password ki current value confirmPassword state mein store hoti hai.
  const [confirmPassword, setConfirmPassword] = useState('');

  // User ka full name yahan store hota hai.
  const [fullName, setFullName] = useState('');

  // User ka contact number yahan store hota hai.
  const [contactNo, setContactNo] = useState('');

  // User ka selected gender yahan store hota hai.
  const [gender, setGender] = useState('');

  // Location ki latitude aur longitude wali information yahan object ki form mein aa sakti hai.
  const [location, setLocation] = useState('');

  // Location ka readable/name wala part yahan store hota hai.
  const [locationName, setLocationName] = useState('');

  // Location ke additional data ke liye states.
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [locationType, setLocationType] = useState('');


  // Jab route.params mein koi data aaye/change ho,
  // ye function us data ko ResidentSignup ki states mein set karta hai.
  useEffect(() => {

    // Location screen se locationName aaye to locationName state mein save karo.
    if (route.params?.locationName) {
      setLocationName(route.params.locationName);
    }

    // Location screen se location object aaye to location state mein save karo.
    if (route.params?.location) {
      setLocation(route.params.location);
    }

    // Agar previous screen se email aaye to email state mein save karo.
    if (route.params?.email) {
      setEmail(route.params.email);
    }

    // Agar password aaye to password state mein save karo.
    if (route.params?.password) {
      setPassword(route.params.password);
    }

    // Agar confirm password aaye to confirmPassword state mein save karo.
    if (route.params?.confirmPassword) {
      setConfirmPassword(route.params.confirmPassword);
    }

    // Agar full name aaye to fullName state mein save karo.
    if (route.params?.fullName) {
      setFullName(route.params.fullName);
    }

    // Agar contact number aaye to contactNo state mein save karo.
    if (route.params?.contactNo) {
      setContactNo(route.params.contactNo);
    }

    // Agar gender aaye to gender state mein save karo.
    if (route.params?.gender) {
      setGender(route.params.gender);
    }

    // Location ki country state mein save karo.
    if (route.params?.country) {
      setCountry(route.params.country);
    }

    // Location ki province state mein save karo.
    if (route.params?.province) {
      setProvince(route.params.province);
    }

    // Location ki city state mein save karo.
    if (route.params?.city) {
      setCity(route.params.city);
    }

    // Location type state mein save karo.
    if (route.params?.locationType) {
      setLocationType(route.params.locationType);
    }

  }, [route.params]);


  // User jab Continue button press karta hai to ye function run hota hai.
  // Ye signup ka actual process start karta hai.
  const handleSignup = async () => {

    try {

      // fetch() frontend se backend ko API request bhej raha hai.
      // API URL:
      // http://localhost:5000/api/residents/signup
      const response = await fetch(
        'http://localhost:5000/api/residents/signup',
        {

          // POST ka matlab frontend signup ka data backend ko bhej raha hai.
          method: 'POST',

          // Backend ko bataya ja raha hai ke request ka data JSON format mein hai.
          headers: {
            'Content-Type': 'application/json',
          },

          // body ke andar frontend ka signup data backend ko send ho raha hai.
          // JSON.stringify() JavaScript object ko JSON format mein convert karta hai.
          body: JSON.stringify({

            // Ye values React Native state se aa rahi hain.
            email,
            password,
            confirmPassword,
            fullName,
            contactNo,
            gender,

            // Location state se latitude aur longitude liye ja rahe hain.
            latitude: location?.latitude,
            longitude: location?.longitude,

            // Location ki remaining information bhi backend ko bheji ja rahi hai.
            locationName,
            country,
            province,
            city,
            locationType,

          }),
        }
      );


      // Backend se response aane ke baad response ko JSON data mein convert kar rahe hain.
      const data = await response.json();

      // Backend se received response console mein show kar raha hai.
      console.log('Signup response:', data);


      // Agar backend ka response successful hai to response.ok true hoga.
      if (response.ok) {

        // User ko successful signup ka message show hota hai.
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',

              // OK press karne ke baad ResidentLogin screen open hoti hai.
              onPress: () =>
                navigation.navigate('ResidentLogin'),
            },
          ]
        );

      } else {

        // Agar backend error response bheje to uska message show hota hai.
        Alert.alert(
          'Error',
          data.message || 'Signup failed'
        );

      }


    } catch (error) {

      // Agar backend se connection na ho ya request mein error aaye,
      // to error yahan catch hota hai.
      console.log(
        'Signup error:',
        error.message
      );

      // User ko server connection error ka message show hota hai.
      Alert.alert(
        'Error',
        'Unable to connect to server'
      );

    }

  };


  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>


        <View style={styles.iconBox}>
          <Text style={styles.icon}>🏠</Text>
        </View>


        <Text style={styles.title}>
          Join as Resident
        </Text>


        <Text style={styles.subtitle}>
          Register your home to request services.
        </Text>


        {/* Email input.
            value={email} = input mein state ki current value show hoti hai.
            onChangeText={setEmail} = user type kare to email state update hoti hai.
        */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />


        {/* Password input.
            User jo password type karta hai wo password state mein store hota hai.
        */}
        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />


        {/* Confirm Password input.
            User ki entered confirmation confirmPassword state mein store hoti hai.
        */}
        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />


        {/* Full Name input.
            User ka naam fullName state mein store hota hai.
        */}
        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />


        {/* Contact Number input.
            User ka contact number contactNo state mein store hota hai.
        */}
        <Text style={styles.label}>
          Contact Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          value={contactNo}
          onChangeText={setContactNo}
        />


        {/* Gender selection.
            Male press karne par gender state mein 'Male' save hota hai.
        */}
        <Text style={styles.label}>
          Gender
        </Text>

        <View style={styles.genderRow}>

          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'Male' &&
                styles.selectedGender,
            ]}
            onPress={() => setGender('Male')}
          >
            <Text style={styles.genderText}>
              Male
            </Text>
          </TouchableOpacity>


          {/* Female press karne par gender state mein 'Female' save hota hai. */}
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'Female' &&
                styles.selectedGender,
            ]}
            onPress={() => setGender('Female')}
          >
            <Text style={styles.genderText}>
              Female
            </Text>
          </TouchableOpacity>

        </View>


        {/* Location section. */}
        <View style={styles.locationRow}>

          <TextInput
            style={styles.locationInput}
            placeholder="Select from map or enter area"

            // Agar locationName available hai to wo show hoga,
            // warna location show hogi.
            value={locationName || location}
          />


          {/* Map button press karne par Location screen open hoti hai.
              Saath current signup data bhi Location screen ko bheja ja raha hai.
          */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate(
                'Location',
                {
                  from: 'ResidentSignup',
                  email,
                  password,
                  confirmPassword,
                  fullName,
                  contactNo,
                  gender,
                }
              )
            }
          >
            <Text style={styles.mapIcon}>
              📍
            </Text>
          </TouchableOpacity>

        </View>


        {/* Continue button.
            User is button ko press karega to handleSignup() function chalega.
            Yahin se frontend → API communication start hoti hai.
        */}
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
            onPress={() => navigation.goBack()}
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
    marginBottom: 6,
  },

  input: {
    height: 47,
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 13,
    fontSize: 14,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
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

  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 13,
  },

  genderButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#F0F2F8',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedGender: {
    backgroundColor: '#DDE5FF',
    borderWidth: 1,
    borderColor: '#2D52E6',
  },

  genderText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },

  continueButton: {
    height: 50,
    backgroundColor: '#2D52E6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
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
  },

  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },

  loginLink: {
    color: '#2D52E6',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

});

