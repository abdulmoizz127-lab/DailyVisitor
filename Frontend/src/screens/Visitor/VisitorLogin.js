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

export default function VisitorLogin({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email.trim() || !password) {
      Alert.alert(
        'Error',
        'Please enter email and password'
      );
      return;
    }

    try {

      const response = await fetch(
        'http://localhost:5000/api/visitors/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log('Visitor login response:', data);

      if (!response.ok) {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password'
        );
        return;
      }

      Alert.alert(
        'Success',
        'Login successful!'
      );

      navigation.navigate('VisitorHome', {
        name: data.name,
        userId: data.userId,
        email: data.email,
      });

    } catch (error) {

      console.log(
        'Visitor login error:',
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
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      {/* Shield */}
      <View style={styles.iconBox}>
        <Text style={styles.icon}>🛡️</Text>
      </View>

      {/* Heading */}
      <Text style={styles.title}>
        Welcome Service Provider
      </Text>

      <Text style={styles.subtitle}>
        Sign in to manage your daily tasks.
      </Text>

      {/* Email */}
      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A0A5B5"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgot}>
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
      <View style={styles.signupRow}>

        <Text style={styles.normalText}>
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('VisitorSignup')}
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
    marginBottom: 24,
  },

  icon: {
    fontSize: 28,
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

  signupRow: {
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