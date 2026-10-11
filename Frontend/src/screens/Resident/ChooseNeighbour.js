import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const neighbours = [
  {
    id: 1,
    name: 'Ahmad Raza',
    phone: '0300-1234567',
    relation: 'Next door (right)',
    initials: 'AR',
  },
  {
    id: 2,
    name: 'Sana Khan',
    phone: '0333-9876543',
    relation: 'Two doors down (left)',
    initials: 'SK',
  },
];

export default function ChooseNeighbour({navigation}) {
  const [selected, setSelected] = useState(null);

  return (
    <SafeAreaView style={styles.container}>

      {/* ADDED: Header with blue plus button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Select Alternate</Text>

        {/* ADDED: Plus button to add new alternate */}
        <TouchableOpacity style={styles.plusButton}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>

        {/* Out of Station Days */}
        <View style={styles.dateBox}>
          <Text style={styles.dateTitle}>Out of Station Days</Text>
          <Text style={styles.date}>18 Sept</Text>
        </View>

        {/* Service */}
        <View style={styles.serviceBox}>

          <View style={styles.serviceHeader}>
            <View>
              <Text style={styles.serviceName}>Milk Delivery</Text>
              <Text style={styles.provider}>Ali Jahanzaib</Text>
            </View>

            <Text style={styles.selectText}>Select Neighbour</Text>
          </View>

          {/* Neighbour 1 */}
          <TouchableOpacity
            style={styles.neighbour}
            onPress={() => setSelected(1)}>
            
            <View style={styles.radio}>
              {selected === 1 && <View style={styles.radioInside} />}
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AR</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>Ahmad Raza</Text>
              <Text style={styles.phone}>☎ 0300-1234567</Text>
              <Text style={styles.relation}>Next door (right)</Text>
            </View>
          </TouchableOpacity>

          {/* Neighbour 2 */}
          <TouchableOpacity
            style={styles.neighbour}
            onPress={() => setSelected(2)}>
            
            <View style={styles.radio}>
              {selected === 2 && <View style={styles.radioInside} />}
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SK</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>Sana Khan</Text>
              <Text style={styles.phone}>☎ 0333-9876543</Text>
              <Text style={styles.relation}>Two doors down (left)</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirm,
            !selected && styles.confirmDisabled,
          ]}
          disabled={!selected}
          onPress={() => navigation.navigate('ResidentOutOfStationSuccess')}>
          <Text style={styles.confirmText}>✓  Confirm</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    height: 65,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  back: {
    fontSize: 30,
    color: '#333333',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  // ADDED: Small blue plus button
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D52E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  plus: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '600',
    marginTop: -2,
  },

  dateBox: {
    backgroundColor: '#FDE8EC',
    margin: 16,
    padding: 14,
    borderRadius: 14,
  },

  dateTitle: {
    color: '#E11D3D',
    fontSize: 12,
    fontWeight: '700',
  },

  date: {
    marginTop: 5,
    color: '#7A1128',
    fontSize: 14,
    fontWeight: '600',
  },

  serviceBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },

  serviceHeader: {
    backgroundColor: '#EEF1FF',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  provider: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  selectText: {
    color: '#2D52E6',
    fontSize: 11,
    fontWeight: '700',
  },

  neighbour: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  radioInside: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D52E6',
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#2D52E6',
    fontWeight: '700',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  phone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  relation: {
    fontSize: 11,
    color: '#2D52E6',
    marginTop: 3,
  },

  confirm: {
    backgroundColor: '#2D52E6',
    margin: 16,
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  confirmDisabled: {
    backgroundColor: '#AFC3F7',
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});