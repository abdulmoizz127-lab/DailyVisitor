import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';


// ==================== SELECT PROVIDER SCREEN ====================
// Backend se matching providers receive karke styled cards mein show karenge

export default function SelectProviderScreen({navigation, route}) {

  // ==================== SELECTED PROVIDER ====================
  // User jis provider ko select karega uski ID yahan save hogi
  const [selectedId, setSelectedId] = useState(null);


  // ==================== PROVIDERS DATA ====================
  // Backend se aane wale real providers yahan store honge
  const [providers, setProviders] = useState([]);


  // ==================== LOADING STATE ====================
  // API request ke waqt loading show karne ke liye
  const [loading, setLoading] = useState(true);


  // ==================== RESIDENT ID ====================
  // NewSubscriptionScreen se resident ki ID receive kar rahe hain
  const residentId = route.params?.residentId;


  // ==================== RECEIVING SUBSCRIPTION DATA ====================
  // NewSubscriptionScreen se subscription ki information receive kar rahe hain
  const serviceType = route.params?.serviceType;
  const startDate = route.params?.startDate;
  const selectedDays = route.params?.selectedDays || [];
  const fromTime = route.params?.fromTime;
  const toTime = route.params?.toTime;
  const radius = route.params?.radius;


  // ==================== FIND PROVIDERS API ====================
  // Backend ko resident ki requirements bhej kar matching providers receive karenge
  const findProviders = async () => {

    try {

      // ==================== START LOADING ====================
      setLoading(true);


      // ==================== REQUIRED DATA CHECK ====================
      // API call se pehle required data check kar rahe hain
      if (
        !residentId ||
        !serviceType ||
        selectedDays.length === 0 ||
        !fromTime ||
        !toTime ||
        !radius
      ) {

        Alert.alert(
          'Missing Information',
          'Provider search ke liye required information missing hai.'
        );

        setLoading(false);

        return;
      }


      // ==================== API REQUEST ====================
      // Backend Find Provider API ko subscription data bhej rahe hain
      const response = await fetch(
        'http://localhost:5000/api/residents/find-provider',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            residentId: residentId,
            serviceType: serviceType,
            selectedDays: selectedDays,
            fromTime: fromTime,
            toTime: toTime,
            radius: radius,
          }),
        }
      );


      // ==================== API RESPONSE ====================
      // Backend ka JSON response receive kar rahe hain
      const data = await response.json();


      // ==================== CHECK API RESPONSE ====================
      if (!response.ok) {

        Alert.alert(
          'Error',
          data.message || 'Providers find nahi ho sake.'
        );

        setProviders([]);

        return;
      }


      // ==================== SAVE PROVIDERS ====================
      // Backend se providers ke saath price aur price unit bhi receive hogi
      setProviders(data.providers || []);

    } catch (error) {

      // ==================== API ERROR ====================
      // Backend connection mein problem aaye to error show karenge
      console.log('Find Provider API error:', error);

      Alert.alert(
        'Connection Error',
        'Backend se connection nahi ho saka. Check karein ke server running hai.'
      );

      setProviders([]);

    } finally {

      // ==================== STOP LOADING ====================
      // API complete hone ke baad loading band kar rahe hain
      setLoading(false);
    }
  };


  // ==================== CALL FIND PROVIDER API ====================
  // Screen open hote hi matching providers search karenge
  useEffect(() => {
    findProviders();
  }, []);


  // ==================== PROVIDER SELECTION ====================
  // User ke selected provider ko save kar rahe hain
  const handleProviderSelect = provider => {

    setSelectedId(provider.provider_id);
  };


  // ==================== CONFIRM PROVIDER ====================
  // Selected provider ko ConfirmProvider screen par bhej rahe hain
  const handleConfirmProvider = () => {

    if (!selectedId) {

      Alert.alert(
        'Select Provider',
        'Please pehle ek provider select karein.'
      );

      return;
    }


    // ==================== SELECTED PROVIDER ====================
    // Selected provider ka complete object find kar rahe hain
    const selectedProvider = providers.find(
      provider => provider.provider_id === selectedId
    );


    if (!selectedProvider) {

      Alert.alert(
        'Error',
        'Selected provider nahi mila.'
      );

      return;
    }


    // ==================== NAVIGATE TO CONFIRM PROVIDER ====================
    // Selected provider aur subscription data next screen ko bhej rahe hain
    navigation.navigate('ConfirmProvider', {

      // ==================== RESIDENT ID ====================
      // Resident ki ID next booking screen tak forward kar rahe hain
      residentId: residentId,

      // ==================== PROVIDER ID ====================
      // Provider ki database ID future request ke liye forward kar rahe hain
      providerId: selectedProvider.provider_id,

      // ==================== PROVIDER USER ID ====================
      // Provider ki User table wali ID future request ke liye forward kar rahe hain
      providerUserId: selectedProvider.user_id,

      // ==================== PROVIDER NAME ====================
      // Selected provider ka naam next screen ko bhej rahe hain
      providerName: selectedProvider.user_name,

      // ==================== SERVICE ====================
      // Selected provider ki service next screen ko bhej rahe hain
      serviceType: selectedProvider.service,

      // ==================== PROVIDER PRICE ====================
      // Selected provider ki price next screen ko bhej rahe hain
      servicePrice: selectedProvider.service_price,

      // ==================== PROVIDER PRICE UNIT ====================
      // Selected provider ki price unit next screen ko bhej rahe hain
      priceUnit: selectedProvider.price_unit,

      // ==================== SUBSCRIPTION DATA ====================
      startDate: startDate,
      selectedDays: selectedDays,
      fromTime: fromTime,
      toTime: toTime,
      radius: radius,
    });
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* ==================== HEADER ==================== */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.backButton}>
            ←
          </Text>

        </TouchableOpacity>


        <View style={styles.headerCenter}>

          <Text style={styles.headerTitle}>
            Select Provider
          </Text>

          <Text style={styles.headerSubtitle}>
            Choose a provider for your service
          </Text>

        </View>


        <View style={styles.headerRight} />

      </View>


      {/* ==================== PROVIDER LIST ==================== */}
      {loading ? (

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
          />

          <Text style={styles.loadingText}>
            Finding providers...
          </Text>

        </View>

      ) : (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* ==================== AVAILABLE PROVIDERS TITLE ==================== */}
          {providers.length > 0 && (

            <View style={styles.sectionHeader}>

              <Text style={styles.sectionTitle}>
                Available Providers
              </Text>

              <Text style={styles.sectionSubtitle}>
                Select one provider to continue
              </Text>

            </View>

          )}


          {/* ==================== NO PROVIDERS ==================== */}
          {providers.length === 0 ? (

            <View style={styles.noProviderCard}>

              <View style={styles.noProviderIcon}>

                <Text style={styles.noProviderIconText}>
                  !
                </Text>

              </View>


              <Text style={styles.noProviderTitle}>
                No Matching Provider
              </Text>


              <Text style={styles.noProviderText}>
                Aapki service, days, time aur radius ke
                according koi provider nahi mila.
              </Text>

            </View>

          ) : (

            /* ==================== PROVIDER CARDS ==================== */
            providers.map(provider => {

              const isSelected =
                selectedId === provider.provider_id;


              return (

                <TouchableOpacity
                  key={provider.provider_id}
                  activeOpacity={0.8}
                  style={[
                    styles.providerCard,
                    isSelected && styles.selectedProviderCard,
                  ]}
                  onPress={() => handleProviderSelect(provider)}
                >

                  {/* ==================== PROVIDER AVATAR ==================== */}
                  <View style={styles.avatar}>

                    <Text style={styles.avatarText}>
                      {provider.user_name
                        ? provider.user_name.charAt(0).toUpperCase()
                        : 'P'}
                    </Text>

                  </View>


                  {/* ==================== PROVIDER INFORMATION ==================== */}
                  <View style={styles.providerInfo}>

                    <Text style={styles.providerName}>
                      {provider.user_name}
                    </Text>


                    <Text style={styles.providerService}>
                      {provider.service}
                    </Text>


                    {/* ==================== PROVIDER PRICE ==================== */}
                    {/* Backend se aayi provider ki actual signup price show kar rahe hain */}
                    <View style={styles.detailRow}>

                      <Text style={styles.detailIcon}>
                        💰
                      </Text>

                      <Text style={styles.priceText}>
                        Rs. {provider.service_price} / {provider.price_unit}
                      </Text>

                    </View>


                    {/* ==================== PROVIDER DISTANCE ==================== */}
                    <View style={styles.detailRow}>

                      <Text style={styles.detailIcon}>
                        📍
                      </Text>

                      <Text style={styles.detailText}>
                        {provider.distance} km away
                      </Text>

                    </View>


                    {/* ==================== PROVIDER SERVICE RADIUS ==================== */}
                    <View style={styles.detailRow}>

                      <Text style={styles.detailIcon}>
                        ✓
                      </Text>

                      <Text style={styles.detailText}>
                        Service available within {provider.service_radius_km} km
                      </Text>

                    </View>

                  </View>


                  {/* ==================== SELECTION INDICATOR ==================== */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >

                    {isSelected && (

                      <View style={styles.radioInner} />

                    )}

                  </View>

                </TouchableOpacity>

              );

            })

          )}

        </ScrollView>

      )}


      {/* ==================== CONFIRM BUTTON ==================== */}
      {!loading && providers.length > 0 && (

        <View style={styles.bottomContainer}>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.confirmButton,
              !selectedId && styles.disabledButton,
            ]}
            onPress={handleConfirmProvider}
            disabled={!selectedId}
          >

            <Text style={styles.confirmButtonText}>
              Confirm Provider
            </Text>

          </TouchableOpacity>

        </View>

      )}

    </SafeAreaView>
  );
}


// ==================== STYLES ====================

const styles = StyleSheet.create({

  // ==================== MAIN CONTAINER ====================
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },


  // ==================== HEADER ====================
  header: {
    height: 70,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },


  backButton: {
    fontSize: 27,
    color: '#374151',

    width: 35,
  },


  headerCenter: {
    flex: 1,

    alignItems: 'center',
  },


  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },


  headerSubtitle: {
    fontSize: 11,
    color: '#7B8494',
    marginTop: 3,
  },


  headerRight: {
    width: 35,
  },


  // ==================== CONTENT ====================
  content: {
    padding: 18,
    paddingBottom: 25,
  },


  // ==================== SECTION HEADER ====================
  sectionHeader: {
    marginBottom: 12,
  },


  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },


  sectionSubtitle: {
    fontSize: 11,
    color: '#7B8494',
    marginTop: 4,
  },


  // ==================== PROVIDER CARD ====================
  providerCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    padding: 15,

    marginBottom: 13,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 2,
  },


  // ==================== SELECTED PROVIDER CARD ====================
  selectedProviderCard: {
    borderWidth: 2,
    borderColor: '#2D52E6',
    backgroundColor: '#F8FAFF',
  },


  // ==================== PROVIDER AVATAR ====================
  avatar: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: '#E8EEFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },


  avatarText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#2D52E6',
  },


  // ==================== PROVIDER INFORMATION ====================
  providerInfo: {
    flex: 1,
  },


  providerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },


  providerService: {
    fontSize: 12,
    color: '#2D52E6',
    fontWeight: '600',
    marginTop: 3,
    marginBottom: 7,
  },


  // ==================== PROVIDER PRICE TEXT ====================
  // Provider ki actual price ko thora prominent show kar rahe hain
  priceText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '700',
  },


  // ==================== PROVIDER DETAILS ====================
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },


  detailIcon: {
    fontSize: 11,
    width: 18,
  },


  detailText: {
    fontSize: 11,
    color: '#64748B',
  },


  // ==================== RADIO BUTTON ====================
  radioOuter: {
    width: 23,
    height: 23,

    borderRadius: 12,

    borderWidth: 2,
    borderColor: '#CBD5E1',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 8,
  },


  radioOuterSelected: {
    borderColor: '#2D52E6',
  },


  radioInner: {
    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: '#2D52E6',
  },


  // ==================== LOADING ====================
  loadingContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },


  loadingText: {
    marginTop: 10,

    fontSize: 13,
    color: '#64748B',
  },


  // ==================== NO PROVIDER CARD ====================
  noProviderCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    padding: 25,

    marginTop: 35,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    elevation: 2,
  },


  noProviderIcon: {
    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#FFF3CD',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 12,
  },


  noProviderIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706',
  },


  noProviderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',

    marginBottom: 7,
  },


  noProviderText: {
    fontSize: 12,
    color: '#7B8494',

    textAlign: 'center',

    lineHeight: 19,
  },


  // ==================== BOTTOM BUTTON ====================
  bottomContainer: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 18,
    paddingVertical: 15,

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },


  confirmButton: {
    height: 52,

    borderRadius: 12,

    backgroundColor: '#2D52E6',

    alignItems: 'center',
    justifyContent: 'center',
  },


  disabledButton: {
    opacity: 0.45,
  },


  confirmButtonText: {
    color: '#FFFFFF',

    fontSize: 14,
    fontWeight: 'bold',
  },

});