import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function Welcome({navigation}) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Top Section */}
      <View style={styles.topSection}>

        {/* Logo ke liye abhi empty space */}
        <View style={styles.logoSpace} />

        <Text style={styles.title}>
          SmartEntry
        </Text>

        <Text style={styles.subtitle}>
          Smart Daily Visitor & Service{'\n'}
          Management System
        </Text>

      </View>


      {/* Buttons Section */}
      <View style={styles.buttons}>

        {/* Visitor Button */}
        <TouchableOpacity
  style={styles.visitorButton}
  onPress={() => navigation.navigate('VisitorLogin')}
>

          <View style={styles.iconBox}>
            <Text style={styles.icon}>🔍</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.visitorTitle}>
              I am a Visitor
            </Text>

            <Text style={styles.visitorText}>
              Find jobs & manage visits
            </Text>
          </View>

          <Text style={styles.visitorArrow}>
            ›
          </Text>

        </TouchableOpacity>


        {/* Resident Button */}
      <TouchableOpacity
  style={styles.residentButton}
  onPress={() => navigation.navigate('ResidentLogin')}
>

          <View style={styles.iconBoxDark}>
            <Text style={styles.icon}>🏠</Text>
          </View>

          <View style={styles.textBox}>
            <Text style={styles.residentTitle}>
              I am a Resident
            </Text>

            <Text style={styles.residentText}>
              Request services & manage home
            </Text>
          </View>

          <Text style={styles.residentArrow}>
            ›
          </Text>

        </TouchableOpacity>

      </View>


      {/* Bottom Dots */}
      <View style={styles.dots}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#3049D9',
    paddingHorizontal: 25,
  },

  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoSpace: {
    height: 100,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#DDE2FF',
    textAlign: 'center',
    lineHeight: 21,
  },

  buttons: {
    marginBottom: 25,
  },

  visitorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  residentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4058DE',
    borderRadius: 20,
    padding: 15,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EEF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBoxDark: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#5268E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 22,
  },

  textBox: {
    flex: 1,
    marginLeft: 15,
  },

  visitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17245E',
    marginBottom: 4,
  },

  visitorText: {
    fontSize: 12,
    color: '#7180A8',
  },

  residentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },

  residentText: {
    fontSize: 12,
    color: '#DDE2FF',
  },

  visitorArrow: {
    fontSize: 30,
    color: '#3049D9',
  },

  residentArrow: {
    fontSize: 30,
    color: 'white',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  activeDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginHorizontal: 3,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8997EA',
    marginHorizontal: 3,
  },

});