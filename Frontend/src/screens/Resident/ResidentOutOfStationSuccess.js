import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ResidentOutOfStationSuccess({navigation}) {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Out of Station Set</Text>
      </View>

      <View style={styles.content}>

        <View style={styles.circle}>
          <Text style={styles.check}>OK</Text>
        </View>

        <Text style={styles.title}>All Done!</Text>

        <Text style={styles.subtitle}>
          Your out of station settings have been saved.
        </Text>

        <View style={styles.dateBox}>
          <Text style={styles.redText}>Out of Station Days</Text>
          <Text style={styles.dateText}>25 Sept</Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            REDIRECTED TO NEIGHBOUR
          </Text>

          <View style={styles.row}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>Milk Delivery</Text>
              <Text style={styles.provider}>Ali Jahanzaib</Text>
              <Text style={styles.neighbour}>
                Sana Khan - 0333-9876543
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Neighbour</Text>
            </View>

          </View>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ResidentSchedule')}
        >
          <Text style={styles.buttonText}>Done</Text>
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

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  content: {
    padding: 18,
  },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D9FBE7',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  check: {
    color: '#00A63C',
    fontSize: 18,
    fontWeight: 'bold',
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 5,
  },

  dateBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 14,
    marginTop: 25,
  },

  redText: {
    color: '#E11D3D',
    fontWeight: 'bold',
  },

  dateText: {
    marginTop: 6,
    color: '#7A1128',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 16,
    padding: 14,
  },

  cardTitle: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#2D52E6',
    fontWeight: 'bold',
  },

  info: {
    flex: 1,
  },

  name: {
    fontWeight: 'bold',
  },

  provider: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
  },

  neighbour: {
    color: '#2D52E6',
    fontSize: 12,
    marginTop: 3,
  },

  badge: {
    backgroundColor: '#EEF1FF',
    padding: 7,
    borderRadius: 12,
  },

  badgeText: {
    color: '#2D52E6',
    fontSize: 10,
  },

  button: {
    backgroundColor: '#00A63C',
    padding: 15,
    borderRadius: 14,
    marginTop: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});