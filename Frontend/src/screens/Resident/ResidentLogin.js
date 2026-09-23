import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ResidentLogin({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    // Check empty fields
    if (!email || !password) {
      Alert.alert(
        'Error',
        'Please enter email and password'
      );
      return;
    }

    try {

      console.log('Resident login API called');
      console.log('Login data:', {
        email: email,
        password: password,
      });

      const response = await fetch(
        'http://localhost:5000/api/residents/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log('Login response:', data);

      if (response.ok) {

  Alert.alert(
    'Success',
    'Login successful!',
    [
      {
        text: 'OK',
       // ==================== RESIDENT ID ====================
// Login ke baad resident ka userId ResidentHome ko bhej rahe hain

onPress: () =>
  navigation.navigate('ResidentHome', {
    name: data.name,
    userId: data.userId,
  
          }),
      },
    ]
  );

} else {

  Alert.alert(
    'Error',
    data.message || 'Login failed'
  );

}

    } catch (error) {

      console.log(
        'Login error:',
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to connect to server'
      );

    }
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* Back */}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>
          ←
        </Text>
      </TouchableOpacity>


      {/* House Icon */}

      <View style={styles.iconBox}>

        <Text style={styles.icon}>
          🏠
        </Text>

      </View>


      {/* Heading */}

      <Text style={styles.title}>
        Welcome Resident
      </Text>

      <Text style={styles.subtitle}>
        Manage your home services efficiently.
      </Text>


      {/* Email */}

      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A0A5B5"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />


      {/* Password */}

      <Text style={styles.label}>
        Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#A0A5B5"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      {/* Forgot Password */}

      <TouchableOpacity
        style={styles.forgot}
      >
        <Text style={styles.forgotText}>
          Forgot password?
        </Text>
      </TouchableOpacity>


      {/* Sign In */}

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleLogin}
      >
        <Text style={styles.signInText}>
          Sign In
        </Text>
      </TouchableOpacity>


      {/* Sign Up */}

      <View style={styles.signup}>

        <Text style={styles.normalText}>
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ResidentSignup')
          }
        >
          <Text style={styles.signupText}>
            {' '}Sign Up
          </Text>
        </TouchableOpacity>

      </View>

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
    color: '#222',
    marginBottom: 25,
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#EEF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  icon: {
    fontSize: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 35,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#F0F2F8',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
    color: '#111827',
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 28,
  },

  forgotText: {
    color: '#2D52E6',
    fontSize: 13,
    fontWeight: '600',
  },

  signInButton: {
    height: 52,
    backgroundColor: '#2D52E6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  normalText: {
    color: '#6B7280',
    fontSize: 14,
  },

  signupText: {
    color: '#2D52E6',
    fontSize: 14,
    fontWeight: 'bold',
  },

});