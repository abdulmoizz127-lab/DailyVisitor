import React, {useState} from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';

const serviceTypes = [
  'Milkman',
  'Newspaper',
  'Garbage Collector',
];

const radiusOptions = [
  '1 km',
  '3 km',
  '5 km',
  '10 km',
];

/* ==================== GROUP DAY BUTTONS ==================== */

const groupDayButtons = [
  {day: 'Monday', short: 'Mon'},
  {day: 'Tuesday', short: 'Tue'},
  {day: 'Wednesday', short: 'Wed'},
  {day: 'Thursday', short: 'Thu'},
  {day: 'Friday', short: 'Fri'},
  {day: 'Saturday', short: 'Sat'},
  {day: 'Sunday', short: 'Sun'},
];

/* ==================== MILK PRODUCT OPTIONS ==================== */

const milkProductOptions = [
  {name: 'Cow Milk', emoji: '🐄'},
  {name: 'Goat Milk', emoji: '🐐'},
  {name: 'Camel Milk', emoji: '🐪'},
  {name: 'Cheese', emoji: '🧀'},
  {name: 'Ghee', emoji: '🧈'},
];

/* ==================== NEWSPAPER PRODUCTS ==================== */

const newspaperOptions = [
  'Dawn',
  'The News',
  'Jang',
  'Express',
  'Geo',
];

/* ==================== CREATE SERVICE GROUP ==================== */

const createServiceGroup = id => ({
  id: id,
  days: [],
  products: [],
  quantities: {
    'Cow Milk': 1,
    'Goat Milk': 1,
    'Camel Milk': 1,
    'Cheese': 0.25,
    'Ghee': 0.25,
  },
  newspapers: [],
  newspaperQuantities: {
    Dawn: 1,
    'The News': 1,
    Jang: 1,
    Express: 1,
    Geo: 1,
  },
  garbageQuantity: 1,
});

export default function NewSubscriptionScreen({navigation, route}) {

  /* ==================== RESIDENT ID ==================== */

  const residentId = route.params?.residentId;

  const [serviceType, setServiceType] = useState('Milkman');

  /* ==================== SERVICE GROUPS ==================== */

  const [serviceGroups, setServiceGroups] = useState([
    createServiceGroup(1),
  ]);

  /* ==================== ADD ANOTHER DAY GROUP ==================== */

  const addServiceGroup = () => {

    setServiceGroups([
      ...serviceGroups,
      createServiceGroup(serviceGroups.length + 1),
    ]);

  };

  /* ==================== UPDATE SINGLE GROUP ==================== */

  const updateGroup = (groupId, changes) => {

    setServiceGroups(
      serviceGroups.map(group =>
        group.id === groupId
          ? {...group, ...changes}
          : group
      )
    );

  };

  /* ==================== GROUP DAY TOGGLE ==================== */

  const toggleGroupDay = (group, day) => {

    if (group.days.includes(day)) {

      updateGroup(group.id, {
        days: group.days.filter(item => item !== day),
      });

    } else {

      updateGroup(group.id, {
        days: [
          ...group.days,
          day,
        ],
      });

    }
  };

  /* ==================== GROUP PRODUCT TOGGLE ==================== */

  const toggleGroupProduct = (group, product) => {

    if (group.products.includes(product)) {

      updateGroup(group.id, {
        products: group.products.filter(item => item !== product),
      });

    } else {

      updateGroup(group.id, {
        products: [
          ...group.products,
          product,
        ],
      });

    }
  };

  /* ==================== QUANTITY UNIT ==================== */

  const getQuantityUnit = product => {

    if (
      product === 'Cheese' ||
      product === 'Ghee'
    ) {
      return 'kg';
    }

    return 'L';
  };

  /* ==================== QUANTITY CHANGE ==================== */

  const changeQuantity = (group, product, change) => {

    const step = 0.25;
    const minimum = 0.25;

    const newQuantity =
      group.quantities[product] +
      change * step;

    if (newQuantity >= minimum) {

      updateGroup(group.id, {
        quantities: {
          ...group.quantities,
          [product]: Number(
            newQuantity.toFixed(2)
          ),
        },
      });

    }
  };

  /* ==================== NEWSPAPER TOGGLE ==================== */

  const toggleNewspaper = (group, newspaper) => {

    if (group.newspapers.includes(newspaper)) {

      updateGroup(group.id, {
        newspapers: group.newspapers.filter(item => item !== newspaper),
      });

    } else {

      updateGroup(group.id, {
        newspapers: [
          ...group.newspapers,
          newspaper,
        ],
      });

    }
  };

  /* ==================== NEWSPAPER QUANTITY ==================== */

  const changeNewspaperQuantity = (group, newspaper, change) => {

    const newQuantity =
      group.newspaperQuantities[newspaper] + change;

    if (newQuantity >= 1) {

      updateGroup(group.id, {
        newspaperQuantities: {
          ...group.newspaperQuantities,
          [newspaper]: newQuantity,
        },
      });

    }
  };

  /* ==================== GARBAGE QUANTITY ==================== */

  const changeGarbageQuantity = (group, change) => {

    const newQuantity = group.garbageQuantity + change;

    if (newQuantity >= 1) {

      updateGroup(group.id, {
        garbageQuantity: newQuantity,
      });

    }
  };

  /* ==================== START DATE ==================== */

  const [startDate, setStartDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  /* ==================== TIME PICKER ==================== */

  const [fromTime, setFromTime] = useState(new Date());

  const [toTime, setToTime] = useState(new Date());

  const [showFromTimePicker, setShowFromTimePicker] =
    useState(false);

  const [showToTimePicker, setShowToTimePicker] =
    useState(false);

  /* ==================== PROVIDER RADIUS ==================== */

  const [radius, setRadius] = useState('5 km');

  const [modal, setModal] = useState(null);

  /* ==================== TIME DISPLAY ==================== */

  const displayTime = date => {

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  };

  /* ==================== TIME CONVERSION ==================== */

  const formatTimeForMySQL = date => {

    return date.toTimeString().slice(0, 8);

  };
/* ==================== CHECK MINIMUM 1 HOUR ==================== */

const isMinimumOneHour = () => {
  const fromMinutes =
    fromTime.getHours() * 60 + fromTime.getMinutes();

  const toMinutes =
    toTime.getHours() * 60 + toTime.getMinutes();

  const difference = toMinutes - fromMinutes;

  return difference >= 60;
};
  /* ==================== DROPDOWN ==================== */

  const openDropdown = (type, data) => {

    setModal({
      type,
      data,
    });

  };

  const selectValue = value => {

    if (modal.type === 'service') {
      setServiceType(value);
    }

    if (modal.type === 'radius') {
      setRadius(value);
    }

    setModal(null);

  };

  const renderDropdown = (
    label,
    value,
    type,
    data,
  ) => {

    return (
      <>
        <Text style={styles.label}>
          {label}
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            openDropdown(type, data)
          }
        >

          <Text style={styles.dropdownText}>
            {value}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>

        </TouchableOpacity>
      </>
    );

  };

  /* ==================== START DATE PICKER ==================== */

  const handleDateChange = (
    event,
    selectedDate,
  ) => {

    setShowDatePicker(false);

    if (selectedDate) {
      setStartDate(selectedDate);
    }

  };

  /* ==================== FROM TIME PICKER ==================== */

  const handleFromTimeChange = (
    event,
    selectedTime,
  ) => {

    setShowFromTimePicker(false);

    if (selectedTime) {
      setFromTime(selectedTime);
    }

  };

  /* ==================== TO TIME PICKER ==================== */

  const handleToTimeChange = (
    event,
    selectedTime,
  ) => {

    setShowToTimePicker(false);

    if (selectedTime) {
      setToTime(selectedTime);
    }

  };

  /* ==================== FIND PROVIDERS ==================== */

  const handleFindProviders = () => {

  /* ==================== MINIMUM 1 HOUR VALIDATION ==================== */

  if (!isMinimumOneHour()) {
    Alert.alert(
      'Invalid Time',
      'Please select at least 1 hour of service time.'
    );
    return;
  }

  

    /* ==================== SERVICE GROUPS FOR SEARCH ==================== */
    /* Only days and products are sent. Quantities are not used for searching. */

    const serviceGroupsForSearch = serviceGroups.map(group => {

      let products = [];

      if (serviceType === 'Milkman') {
        products = group.products;
      }

      if (serviceType === 'Newspaper') {
        products = group.newspapers;
      }

      return {
        days: group.days,
        products: products,
      };

    });

    /* ==================== FULL SERVICE GROUPS ==================== */
    /* Har group ke days, items aur quantity ServiceRequestItem mein save karne ke liye
       alag se tayyar kar rahe hain. Search wala serviceGroupsForSearch unchanged hai. */

    const requestServiceGroups = serviceGroups.map(group => {

      let items = [];

      if (serviceType === 'Milkman') {
        items = group.products.map(product => ({
          item_name: product,
          quantity: group.quantities[product],
        }));
      }

      if (serviceType === 'Newspaper') {
        items = group.newspapers.map(newspaper => ({
          item_name: newspaper,
          quantity: group.newspaperQuantities[newspaper],
        }));
      }

      if (serviceType === 'Garbage Collector') {
        items = [
          {
            item_name: 'Garbage',
            quantity: group.garbageQuantity,
          },
        ];
      }

      return {
        days: group.days,
        items: items,
      };

    });

    navigation.navigate('SelectProvider', {

      residentId: residentId,

      serviceType: serviceType,

      startDate: startDate,

      serviceGroups: serviceGroupsForSearch,

      /* ==================== FULL SERVICE GROUPS ==================== */
      /* Full service groups (days + items + quantity) next screen tak pass kar rahe hain */

      requestServiceGroups: requestServiceGroups,

      fromTime: formatTimeForMySQL(fromTime),

      toTime: formatTimeForMySQL(toTime),

      radius: radius,

    });

  };

  /* ==================== RENDER SERVICE GROUP ==================== */

  const renderServiceGroup = (group, index) => {

    return (

        <View key={group.id} style={styles.serviceCard}>

          {/* ==================== CARD HEADER ==================== */}

          <View style={styles.cardHeader}>

            <View style={styles.groupNumber}>

              <Text style={styles.groupNumberText}>
                {index + 1}
              </Text>

            </View>

            <Text style={styles.groupTitle}>
              Service Group {index + 1}
            </Text>

          </View>

          {/* ==================== SELECT DAYS ==================== */}

          <Text style={styles.cardLabel}>
            SELECT DAYS *
          </Text>

          <View style={styles.daysContainer}>

            {groupDayButtons.map(item => (

              <TouchableOpacity
                key={item.day}
                style={[
                  styles.cardDay,
                  group.days.includes(item.day) &&
                    styles.cardDaySelected,
                ]}
                onPress={() =>
                  toggleGroupDay(group, item.day)
                }
              >

                <Text
                  style={[
                    styles.cardDayText,
                    group.days.includes(item.day) &&
                      styles.cardDayTextSelected,
                  ]}
                >
                  {item.short}
                </Text>

              </TouchableOpacity>

            ))}

          </View>

          {/* ==================== MILKMAN SECTION ==================== */}

          {serviceType === 'Milkman' && (
            <>

              {/* ==================== MILK PRODUCTS ==================== */}

              <Text style={styles.cardLabel}>
                MILK PRODUCTS *
              </Text>

              <View style={styles.productsContainer}>

                {milkProductOptions.map(item => (

                  <TouchableOpacity
                    key={item.name}
                    style={[
                      styles.productButton,
                      group.products.includes(item.name) &&
                        styles.productButtonSelected,
                    ]}
                    onPress={() =>
                      toggleGroupProduct(group, item.name)
                    }
                  >

                    <Text
                      style={[
                        styles.productButtonText,
                        group.products.includes(item.name) &&
                          styles.productButtonTextSelected,
                      ]}
                    >
                      {item.emoji} {item.name}
                    </Text>

                  </TouchableOpacity>

                ))}

              </View>

              {/* ==================== QUANTITIES ==================== */}

              {group.products.length > 0 && (

                <View style={styles.quantitySection}>

                  <Text style={styles.quantityTitle}>
                    QUANTITIES
                  </Text>

                  {group.products.map(product => (

                    <View
                      key={product}
                      style={styles.quantityRow}
                    >

                      <Text style={styles.quantityProduct}>

                        {product === 'Cow Milk' && '🐄 '}
                        {product === 'Goat Milk' && '🐐 '}
                        {product === 'Camel Milk' && '🐪 '}
                        {product === 'Cheese' && '🧀 '}
                        {product === 'Ghee' && '🧈 '}

                        {product}

                      </Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          changeQuantity(group, product, -1)
                        }
                      >

                        <Text style={styles.quantityButtonText}>
                          −
                        </Text>

                      </TouchableOpacity>

                      <Text style={styles.quantityValue}>
                        {group.quantities[product]}
                        {getQuantityUnit(product)}
                      </Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          changeQuantity(group, product, 1)
                        }
                      >

                        <Text style={styles.quantityButtonText}>
                          +
                        </Text>

                      </TouchableOpacity>

                    </View>

                  ))}

                </View>

              )}

            </>
          )}

          {/* ==================== NEWSPAPER SECTION ==================== */}

          {serviceType === 'Newspaper' && (
            <>

              {/* ==================== NEWSPAPER PRODUCTS ==================== */}

              <Text style={styles.cardLabel}>
                NEWSPAPERS *
              </Text>

              <View style={styles.productsContainer}>

                {newspaperOptions.map(newspaper => (

                  <TouchableOpacity
                    key={newspaper}
                    style={[
                      styles.productButton,
                      group.newspapers.includes(newspaper) &&
                        styles.productButtonSelected,
                    ]}
                    onPress={() =>
                      toggleNewspaper(group, newspaper)
                    }
                  >

                    <Text
                      style={[
                        styles.productButtonText,
                        group.newspapers.includes(newspaper) &&
                          styles.productButtonTextSelected,
                      ]}
                    >
                      {newspaper}
                    </Text>

                  </TouchableOpacity>

                ))}

              </View>

              {/* ==================== NEWSPAPER QUANTITY ==================== */}

              {group.newspapers.length > 0 && (

                <View style={styles.quantitySection}>

                  <Text style={styles.quantityTitle}>
                    QUANTITY
                  </Text>

                  {group.newspapers.map(newspaper => (

                    <View
                      key={newspaper}
                      style={styles.quantityRow}
                    >

                      <Text style={styles.quantityProduct}>
                        {newspaper}
                      </Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          changeNewspaperQuantity(group, newspaper, -1)
                        }
                      >

                        <Text style={styles.quantityButtonText}>
                          −
                        </Text>

                      </TouchableOpacity>

                      <Text style={styles.quantityValue}>
                        {group.newspaperQuantities[newspaper]}
                        {group.newspaperQuantities[newspaper] === 1
                          ? ' piece'
                          : ' pieces'}
                      </Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          changeNewspaperQuantity(group, newspaper, 1)
                        }
                      >

                        <Text style={styles.quantityButtonText}>
                          +
                        </Text>

                      </TouchableOpacity>

                    </View>

                  ))}

                </View>

              )}

            </>
          )}

          {/* ==================== GARBAGE SECTION ==================== */}

          {serviceType === 'Garbage Collector' && (

            <View style={styles.quantitySection}>

              {/* ==================== GARBAGE QUANTITY ==================== */}

              <Text style={styles.quantityTitle}>
                GARBAGE QUANTITY
              </Text>

              <View style={styles.quantityRow}>

                <Text style={styles.quantityProduct}>
                  Garbage
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    changeGarbageQuantity(group, -1)
                  }
                >

                  <Text style={styles.quantityButtonText}>
                    −
                  </Text>

                </TouchableOpacity>

                <Text style={styles.quantityValue}>
                  {group.garbageQuantity} kg
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    changeGarbageQuantity(group, 1)
                  }
                >

                  <Text style={styles.quantityButtonText}>
                    +
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          )}

        </View>

    );

  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ==================== HEADER ==================== */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          New Subscription
        </Text>

        <View style={{width: 25}} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ==================== SERVICE TYPE ==================== */}

        {renderDropdown(
          'Service Type',
          serviceType,
          'service',
          serviceTypes,
        )}

        <Text style={styles.helper}>
          Only visitors offering this service will be shown.
        </Text>

        {/* ==================== START DATE ==================== */}

        <Text style={styles.label}>
          Start Date
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            setShowDatePicker(true)
          }
        >

          <Text style={styles.calendar}>
            📅
          </Text>

          <Text style={styles.inputText}>
            {startDate.toLocaleDateString('en-GB')}
          </Text>

        </TouchableOpacity>

        {showDatePicker && (

          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />

        )}

        {/* ==================== SERVICE GROUP CARDS ==================== */}

        {serviceGroups.map((group, index) =>
          renderServiceGroup(group, index)
        )}

        {/* ==================== ADD ANOTHER DAY GROUP ==================== */}

        <TouchableOpacity
          style={styles.addGroupButton}
          onPress={addServiceGroup}
        >

          <Text style={styles.addGroupText}>
            + Add Another Day Group
          </Text>

        </TouchableOpacity>

        {/* ==================== TIME SLOT ==================== */}

        <Text style={styles.label}>
          Time Slot
        </Text>

        <View style={styles.timeRow}>

          {/* ==================== FROM TIME ==================== */}

          <View style={styles.timeColumn}>

            <Text style={styles.smallLabel}>
              From
            </Text>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={() =>
                setShowFromTimePicker(true)
              }
            >

              <Text style={styles.timeText}>
                {displayTime(fromTime)}
              </Text>

            </TouchableOpacity>

          </View>

          <Text style={styles.toText}>
            to
          </Text>

          {/* ==================== TO TIME ==================== */}

          <View style={styles.timeColumn}>

            <Text style={styles.smallLabel}>
              To
            </Text>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={() =>
                setShowToTimePicker(true)
              }
            >

              <Text style={styles.timeText}>
                {displayTime(toTime)}
              </Text>

            </TouchableOpacity>

          </View>

        </View>

        {/* ==================== FROM TIME PICKER ==================== */}

        {showFromTimePicker && (

          <DateTimePicker
            value={fromTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleFromTimeChange}
          />

        )}

        {/* ==================== TO TIME PICKER ==================== */}

        {showToTimePicker && (

          <DateTimePicker
            value={toTime}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleToTimeChange}
          />

        )}

        {/* ==================== PROVIDER RADIUS ==================== */}

        {renderDropdown(
          'Provider Radius',
          radius,
          'radius',
          [
            '1 km',
            '3 km',
            '5 km',
            '10 km',
          ],
        )}

        <Text style={styles.helper}>
          Providers within this distance from your home
          location will be shown.
        </Text>

        {/* ==================== FIND PROVIDERS ==================== */}

        <TouchableOpacity
          style={styles.findButton}
          onPress={handleFindProviders}
        >

          <Text style={styles.findText}>
            Find Providers
          </Text>

        </TouchableOpacity>

      </ScrollView>

      {/* ==================== DROPDOWN MODAL ==================== */}

      <Modal
        visible={modal !== null}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModal(null)
        }
      >

        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() =>
            setModal(null)
          }
        >

          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Select
            </Text>

            <FlatList
              data={
                modal
                  ? modal.data
                  : []
              }
              keyExtractor={item => item}
              renderItem={({
                item,
              }) => (

                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() =>
                    selectValue(item)
                  }
                >

                  <Text style={styles.modalItemText}>
                    {item}
                  </Text>

                  <Text style={styles.modalArrow}>
                    ›
                  </Text>

                </TouchableOpacity>

              )}
            />

          </View>

        </TouchableOpacity>

      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

 /* ==================== SERVICE GROUP CARD ==================== */

  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 14,
    padding: 12,
    marginTop: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  groupNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2463EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  groupNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },

  /* ==================== ADD GROUP BUTTON ==================== */

  addGroupButton: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2463EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  addGroupText: {
    color: '#2463EB',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ==================== CARD LABEL ==================== */

  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 7,
    marginTop: 8,
  },

  /* ==================== CARD DAYS ==================== */

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  cardDay: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  cardDayText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ==================== SELECTED DAY ==================== */

  cardDaySelected: {
    backgroundColor: '#2463EB',
    borderWidth: 1,
    borderColor: '#2463EB',
  },

  cardDayTextSelected: {
    color: '#FFFFFF',
  },

  /* ==================== PRODUCTS ==================== */

  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  productButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  productButtonText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ==================== SELECTED PRODUCT ==================== */

  productButtonSelected: {
    backgroundColor: '#2463EB',
    borderWidth: 1,
    borderColor: '#2463EB',
  },

  productButtonTextSelected: {
    color: '#FFFFFF',
  },

  /* ==================== QUANTITY SECTION ==================== */

  quantitySection: {
    marginTop: 15,
  },

  quantityTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 7,
  },

  quantityRow: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 7,
  },

  quantityProduct: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#E8F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    fontSize: 18,
    color: '#2463EB',
    fontWeight: '600',
  },

  quantityValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 14,
  },

  /* ==================== MAIN SCREEN ==================== */

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  back: {
    fontSize: 25,
    color: '#374151',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* ==================== LABELS ==================== */

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 18,
    marginBottom: 7,
  },

  helper: {
    fontSize: 11,
    color: '#7B8494',
    marginTop: 3,
  },

  /* ==================== DROPDOWN ==================== */

  dropdown: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },

  arrow: {
    fontSize: 12,
    color: '#111827',
  },

  /* ==================== START DATE ==================== */

  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  calendar: {
    fontSize: 15,
    marginRight: 10,
  },

  inputText: {
    fontSize: 14,
    color: '#374151',
  },

  /* ==================== TIME SLOT ==================== */

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeColumn: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },

  timeInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
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
    marginTop: 18,
  },

  /* ==================== FIND PROVIDERS ==================== */

  findButton: {
    height: 50,
    backgroundColor: '#2463EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },

  findText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* ==================== DROPDOWN MODAL ==================== */

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '55%',
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  modalItem: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalItemText: {
    fontSize: 14,
    color: '#374151',
  },

  modalArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },

});