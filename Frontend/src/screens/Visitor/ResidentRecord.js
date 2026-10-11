// ADDED: React aur required components
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function ResidentRecord({navigation}) {

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ADDED: Blue header */}
        <View style={styles.header}>

          <View style={styles.headerRow}>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.headerButtonText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.headerTitle}>
              <Text style={styles.title}></Text>
              <Text style={styles.title}>Resident Record</Text>
              
              <Text style={styles.subtitle}>Milk Delivery</Text>
            </View>

            

          </View>

          {/* ADDED: Resident profile */}
          <View style={styles.profileCard}>

            <View style={styles.profileCircle}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>

            <View style={styles.profileInfo}>

              <Text style={styles.profileName}>
                Dr.Moiz
              </Text>

              <Text style={styles.profileTime}>
                ⭐ 4.8  •  🕐 07:00 AM - 07:30 AM
              </Text>

              <Text style={styles.profileAddress}>
                I-10
              </Text>

              <Text style={styles.profileSince}>
                Active since sep 1, 2026
              </Text>

            </View>

          </View>

        </View>

        {/* ADDED: Attendance Summary */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            🗓️ Attendance Summary
          </Text>

          <View style={styles.summaryRow}>

            <View style={styles.presentBox}>
              <Text style={styles.presentNumber}>22</Text>
              <Text style={styles.smallText}>Present</Text>
            </View>

            <View style={styles.absentBox}>
              <Text style={styles.absentNumber}>2</Text>
              <Text style={styles.smallText}>Absent</Text>
            </View>

            <View style={styles.outBox}>
              <Text style={styles.outNumber}>3</Text>
              <Text style={styles.smallText}>
                Out of{'\n'}Station
              </Text>
            </View>

          </View>

        </View>

        {/* ADDED: Attendance Calendar */}
        <View style={styles.card}>

          <View style={styles.calendarHeader}>

            <Text style={styles.cardTitle}>
              Attendance
            </Text>

            <View style={styles.monthRow}>
              <Text style={styles.arrow}>‹</Text>

              <Text style={styles.month}>
                Septemper 2026
              </Text>

              <Text style={styles.arrow}>›</Text>
            </View>

          </View>

          {/* ADDED: Days heading */}
          <View style={styles.weekRow}>

            <Text style={styles.weekText}>S</Text>
            <Text style={styles.weekText}>M</Text>
            <Text style={styles.weekText}>T</Text>
            <Text style={styles.weekText}>W</Text>
            <Text style={styles.weekText}>T</Text>
            <Text style={styles.weekText}>F</Text>
            <Text style={styles.weekText}>S</Text>

          </View>

          {/* ADDED: Calendar row 1 */}
          <View style={styles.weekRow}>

            <Text></Text>

            <Text style={styles.greenDay}>1</Text>
            <Text style={styles.greenDay}>2</Text>
            <Text style={styles.redDay}>3</Text>
            <Text style={styles.greenDay}>4</Text>
            <Text style={styles.greenDay}>5</Text>
            <Text style={styles.greenDay}>6</Text>

          </View>

          {/* ADDED: Calendar row 2 */}
          <View style={styles.weekRow}>

            <Text style={styles.greenDay}>7</Text>
            <Text style={styles.blueDay}>8</Text>
            <Text style={styles.blueDay}>9</Text>
            <Text style={styles.greenDay}>10</Text>
            <Text style={styles.greenDay}>11</Text>
            <Text style={styles.greenDay}>12</Text>
            <Text style={styles.greenDay}>13</Text>

          </View>

          {/* ADDED: Calendar row 3 */}
          <View style={styles.weekRow}>

            <Text style={styles.blueDay}>14</Text>
            <Text style={styles.greenDay}>15</Text>
            <Text style={styles.greenDay}>16</Text>
            <Text style={styles.redDay}>17</Text>
            <Text style={styles.greenDay}>18</Text>
            <Text style={styles.greenDay}>19</Text>
            <Text style={styles.greenDay}>20</Text>

          </View>

          {/* ADDED: Calendar row 4 */}
          <View style={styles.weekRow}>

            <Text style={styles.greenDay}>21</Text>
            <Text style={styles.greenDay}>22</Text>
            <Text style={styles.greenDay}>23</Text>
            <Text style={styles.greenDay}>24</Text>
            <Text style={styles.todayDay}>25</Text>
            <Text style={styles.greenDay}>26</Text>
            <Text style={styles.greenDay}>27</Text>

          </View>

          {/* ADDED: Calendar row 5 */}
          <View style={styles.weekRow}>

            <Text style={styles.greenDay}>28</Text>

            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>

          </View>

          {/* ADDED: Calendar legend */}
          <View style={styles.legendRow}>

            <Text style={styles.presentLegend}>
              ● Present
            </Text>

            <Text style={styles.absentLegend}>
              ● Absent
            </Text>

            <Text style={styles.outLegend}>
              ● Out of Station
            </Text>

            <Text style={styles.todayLegend}>
              ● Today
            </Text>

          </View>

        </View>

        {/* ADDED: Payment */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Payment
          </Text>

          <View style={styles.paymentGreen}>

            <Text>
              Present Days
            </Text>

            <Text style={styles.paymentGreenText}>
              22
            </Text>

          </View>

          <View style={styles.paymentGray}>

            <Text>
              Daily Rate
            </Text>

            <Text style={styles.paymentValue}>
              Rs. 200
            </Text>

          </View>

          <View style={styles.line} />

          <View style={styles.totalBox}>

            <Text style={styles.totalFormula}>
              22 × Rs. 200
            </Text>

            <Text style={styles.totalLabel}>
              Total Payment
            </Text>

            <Text style={styles.totalAmount}>
              Rs. 4,400
            </Text>

          </View>

        </View>

        {/* ADDED: Schedule and Rating */}
        <View style={styles.infoRow}>

          <View style={styles.scheduleBox}>

            <Text style={styles.infoIcon}>
              ▣
            </Text>

            <Text style={styles.infoLabel}>
              Schedule
            </Text>

            <Text style={styles.infoValue}>
              Daily
            </Text>

          </View>

          <View style={styles.ratingBox}>

            <Text style={styles.infoIcon}>
              ★
            </Text>

            <Text style={styles.infoLabel}>
              Rating
            </Text>

            <Text style={styles.infoValue}>
              4.8
            </Text>

          </View>

        </View>

        {/* ADDED: Manage Subscription */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Manage Subscription
          </Text>

          {/* ADDED: Visitor can edit timing */}
          <TouchableOpacity style={styles.editTimingButton}>

            <Text style={styles.editTimingText}>
              Edit Timing
            </Text>

          </TouchableOpacity>

          {/* ADDED: Visitor can cancel subscription */}
          <TouchableOpacity style={styles.cancelManageButton}>

            <Text style={styles.cancelManageText}>
              Cancel Subscription
            </Text>

          </TouchableOpacity>

        </View>

        <View style={{height: 25}} />

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // ADDED: Main screen
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // ADDED: Blue project theme
  header: {
    backgroundColor: '#2D52E6',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  headerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerTitle: {
    flex: 1,
  },

  title: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
  },

  subtitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },

  // ADDED: Resident profile
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
  },

  profileCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  profileIcon: {
    fontSize: 24,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  profileTime: {
    color: 'white',
    fontSize: 11,
    marginBottom: 5,
  },

  profileAddress: {
    color: 'white',
    fontSize: 10,
    marginBottom: 4,
  },

  profileSince: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },

  // ADDED: Common card
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 18,
    marginTop: 16,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },

  // ADDED: Attendance boxes
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },

  presentBox: {
    flex: 1,
    backgroundColor: '#EAFBF0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  absentBox: {
    flex: 1,
    backgroundColor: '#FDEEEE',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  outBox: {
    flex: 1,
    backgroundColor: '#EAF1FD',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  presentNumber: {
    color: '#16A34A',
    fontSize: 24,
    fontWeight: 'bold',
  },

  absentNumber: {
    color: '#DC2626',
    fontSize: 24,
    fontWeight: 'bold',
  },

  outNumber: {
    color: '#2D52E6',
    fontSize: 24,
    fontWeight: 'bold',
  },

  smallText: {
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
  },

  // ADDED: Calendar
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  month: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 18,
    color: '#6B7280',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 7,
  },

  weekText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },

  greenDay: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E6F9EE',
    color: '#16A34A',
    textAlign: 'center',
    paddingTop: 7,
  },

  redDay: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FDEAEA',
    color: '#DC2626',
    textAlign: 'center',
    paddingTop: 7,
  },

  blueDay: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E7EFFE',
    color: '#2D52E6',
    textAlign: 'center',
    paddingTop: 7,
  },

  todayDay: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#2D52E6',
    color: 'white',
    textAlign: 'center',
    paddingTop: 7,
    fontWeight: 'bold',
  },

  // ADDED: Calendar legend
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },

  presentLegend: {
    color: '#16A34A',
    fontSize: 10,
  },

  absentLegend: {
    color: '#DC2626',
    fontSize: 10,
  },

  outLegend: {
    color: '#2D52E6',
    fontSize: 10,
  },

  todayLegend: {
    color: '#2D52E6',
    fontSize: 10,
  },

  // ADDED: Payment
  paymentGreen: {
    backgroundColor: '#EAFBF0',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  paymentGreenText: {
    color: '#16A34A',
    fontWeight: 'bold',
  },

  paymentGray: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  paymentValue: {
    fontWeight: 'bold',
  },

  line: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  totalBox: {
    backgroundColor: '#F5F0FF',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
  },

  totalFormula: {
    color: '#2D52E6',
    fontSize: 11,
  },

  totalLabel: {
    color: '#6B7280',
    fontSize: 12,
  },

  totalAmount: {
    color: '#2D52E6',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 3,
  },

  // ADDED: Schedule and Rating
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 18,
    marginTop: 16,
  },

  scheduleBox: {
    flex: 1,
    backgroundColor: '#EEF0FF',
    borderRadius: 16,
    padding: 16,
  },

  ratingBox: {
    flex: 1,
    backgroundColor: '#EAFBF0',
    borderRadius: 16,
    padding: 16,
  },

  infoIcon: {
    fontSize: 18,
  },

  infoLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 5,
  },

  infoValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },

  // ADDED: Edit Timing green button
  editTimingButton: {
    backgroundColor: '#EAFBF0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  editTimingText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ADDED: Cancel Subscription red button
  cancelManageButton: {
    backgroundColor: '#FDEAEA',
    borderWidth: 1,
    borderColor: '#F5B5B5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  cancelManageText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },

});