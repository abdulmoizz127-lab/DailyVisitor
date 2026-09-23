import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LocationScreen from './src/screens/LocationScreen';

import VisitorLogin from './src/screens/Visitor/VisitorLogin';
import VisitorSignup from './src/screens/Visitor/VisitorSignup';
import VisitorHome from './src/screens/Visitor/VisitorHome';
import ScheduleScreen from './src/screens/Visitor/ScheduleScreen';
import VisitorNotification from './src/screens/Visitor/VisitorNotification';

import ResidentLogin from './src/screens/Resident/ResidentLogin';
import ResidentSignup from './src/screens/Resident/ResidentSignup';
import ResidentHome from './src/screens/Resident/ResidentHome';
import ResidentActivity from './src/screens/Resident/ResidentActivity';
import NewSubscriptionScreen from './src/screens/Resident/NewSubscriptionScreen';
import SelectProviderScreen from './src/screens/Resident/SelectProviderScreen';
import ConfirmProviderScreen from './src/screens/Resident/ConfirmProviderScreen';
import ResidentNotification from './src/screens/Resident/ResidentNotification';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>

      <NavigationContainer>

        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
<Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
          />

          <Stack.Screen
            name="ResidentLogin"
            component={ResidentLogin}
          />

          <Stack.Screen
            name="ResidentSignup"
            component={ResidentSignup}
          />
         <Stack.Screen
            name="ResidentHome"
            component={ResidentHome}
          />
          <Stack.Screen
          name="ResidentActivity"
          component={ResidentActivity}
         />

         
         <Stack.Screen
           name="SelectProvider"
           component={SelectProviderScreen}
         />

         <Stack.Screen
           name="ConfirmProvider"
           component={ConfirmProviderScreen}
         />
          
          <Stack.Screen
            name="NewSubscription"
            component={NewSubscriptionScreen}
          />

          <Stack.Screen
            name="ResidentNotification"
            component={ResidentNotification}
          />

          <Stack.Screen
            name="VisitorLogin"
            component={VisitorLogin}
          />

          <Stack.Screen
            name="VisitorSignup"
            component={VisitorSignup}
          />
          <Stack.Screen
             name="VisitorHome"
             component={VisitorHome}
          />

           <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
           />

           <Stack.Screen
              name="VisitorNotification"
              component={VisitorNotification}
           />
        </Stack.Navigator>

      </NavigationContainer>

    </SafeAreaProvider>
  );
}

export default App;