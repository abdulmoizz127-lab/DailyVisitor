import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {WebView} from 'react-native-webview';

export default function LocationScreen({navigation, route}) {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [locationType, setLocationType] = useState('');

  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
        }
      </style>
    </head>

    <body>

      <div id="map"></div>

      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

      <script>

        var map = L.map('map').setView([33.6844, 73.0479], 13);

        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19
          }
        ).addTo(map);

        var marker;

        map.on('click', function(e) {

          if (marker) {
            map.removeLayer(marker);
          }

          marker = L.marker(e.latlng).addTo(map);

          fetch(
            'https://nominatim.openstreetmap.org/reverse?format=json&lat='
            + e.latlng.lat
            + '&lon='
            + e.latlng.lng
            + '&zoom=18&addressdetails=1'
          )
          .then(response => response.json())

          .then(data => {

            var address = data.address || {};

            var locationName =
              address.suburb ||
              address.neighbourhood ||
              address.residential ||
              address.quarter ||
              address.city_district ||
              address.city ||
              address.town ||
              address.village ||
              'Location selected';

            var countryValue =
              address.country || '';

            var provinceValue =
              address.state || '';

            var cityValue =
              address.city ||
              address.town ||
              address.village ||
              '';

            var locationTypeValue =
              address.suburb ||
              address.neighbourhood ||
              address.residential ||
              address.quarter ||
              address.road ||
              '';

            window.ReactNativeWebView.postMessage(
              JSON.stringify({

                latitude: e.latlng.lat,

                longitude: e.latlng.lng,

                locationName: locationName,

                country: countryValue,

                province: provinceValue,

                city: cityValue,

                locationType: locationTypeValue

              })
            );

          })

          .catch(error => {

            console.log(error);

            window.ReactNativeWebView.postMessage(
              JSON.stringify({

                latitude: e.latlng.lat,

                longitude: e.latlng.lng,

                locationName: 'Location selected',

                country: '',

                province: '',

                city: '',

                locationType: ''

              })
            );

          });

        });

      </script>

    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Select Location
        </Text>

      </View>


      {/* Map */}

      <WebView
        source={{html: mapHTML}}
        style={styles.map}

        onMessage={event => {

          try {

            const data = JSON.parse(
              event.nativeEvent.data
            );

            console.log(
              'Location data received:',
              data
            );

            setLocation({
              latitude: data.latitude,
              longitude: data.longitude,
            });

            setLocationName(
              data.locationName || ''
            );

            setCountry(
              data.country || ''
            );

            setProvince(
              data.province || ''
            );

            setCity(
              data.city || ''
            );

            setLocationType(
              data.locationType || ''
            );

          } catch (error) {

            console.log(
              'Location data error:',
              error.message
            );

          }

        }}
      />


      {/* Bottom Box */}

      <View style={styles.bottomBox}>

        {location ? (

          <>

            <Text style={styles.locationText}>
              📍 {locationName}
            </Text>

            <TouchableOpacity
              style={styles.okButton}

              onPress={() => {

                navigation.navigate(
                  route.params?.from,
                  {

                    // Location data

                    location: location,

                    locationName: locationName,

                    latitude: location.latitude,

                    longitude: location.longitude,

                    country: country,

                    province: province,

                    city: city,

                    locationType: locationType,


                    // Previous Visitor Signup data

                    email:
                      route.params?.email,

                    password:
                      route.params?.password,

                    confirmPassword:
                      route.params?.confirmPassword,

                    fullName:
                      route.params?.fullName,

                    contactNo:
                      route.params?.contactNo,

                    serviceRadius:
                      route.params?.serviceRadius,
                      
                    servicePrice:
                      route.params?.servicePrice,

                    service:
                      route.params?.service,

                    days:
                      route.params?.days,

                    selectedDay:
                      route.params?.selectedDay,

                    timeSlots:
                      route.params?.timeSlots,

                  }
                );

              }}
            >

              <Text style={styles.okText}>
                OK
              </Text>

            </TouchableOpacity>

          </>

        ) : (

          <Text style={styles.instruction}>
            Tap on the map to select your location
          </Text>

        )}

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  map: {
    flex: 1,
  },

  bottomBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  instruction: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
  },

  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },

  okButton: {
    backgroundColor: '#2D52E6',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },

  okText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});