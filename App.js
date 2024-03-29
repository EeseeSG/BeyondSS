// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { View, StatusBar, Platform, LogBox, } from 'react-native';
LogBox.ignoreLogs([
  "Setting a timer",
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
]);


import { Root, } from 'react-native-popup-confirm-toast';
import AnimatedSplash from "react-native-animated-splash-screen";

// AUTH PROVIDER
import { AuthProvider } from './navigation/AuthProvider';

// NAVIGATION AND THEME
import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// STYLING
import * as Colors from './constants/Colors';

// SCREENS
import RootStackScreen from './screens/auth/RootStackScreen';
import Tabs from './navigation/Tabs';
import Settings from './screens/settings/Settings';
import Explore from './screens/main/Explore';
import Dashboard from './screens/admin/Dashboard';
import ApproveReceipts from './screens/admin/ApproveReceipts';
import ProjectDetail from './screens/projects/ProjectDetail';
import NewProject from './screens/projects/NewProject';
import UploadReceipt from './screens/projects/UploadReceipt';

// INIT FIREBASE
import { firebase } from './firebase';

// NOTIFICATIONS
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export default function App() {
  //=====================================================================================================================
  //==  THEME  ==
  //=====================================================================================================================
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      ...Colors
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;


  //=====================================================================================================================
  //==  ON SIGN IN STATUS CHANGE ==
  //=====================================================================================================================
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
		firebase.auth().onAuthStateChanged(async (user) => {
			if(!user) {
				/** if  user is not logged in*/
        setIsLoading(false)
				setIsLoggedIn(false)
			} else {
				/** if  user is logged in*/
				setIsLoading(false)
				setIsLoggedIn(true)
			};
		});
	}, []);

  //=====================================================================================================================
  //==  RENDER DISPLAY  ==
  //=====================================================================================================================
  return (
    <AnimatedSplash
      translucent={false}
      isLoaded={!isLoading}
      logoImage={require("./assets/splash.png")}
      backgroundColor={!isLoading ? Colors.primary : '#D9D9D9'}
      logoHeight={150}
      logoWidth={150}
    >
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer theme={theme}>
            <Root>
              {isLoggedIn ? (
                // Screens for logged in users
                <>
                  { Platform.OS === 'android' ? <StatusBar/> : <View style={{ height: 44, }}/> }    
                  <Stack.Navigator>
                    <Stack.Group navigationKey={isLoggedIn ? 'user' : 'guest'}>
                      <Stack.Screen name="Tabs"  component={Tabs} options={{ headerShown: false,}}/>
                      <Stack.Screen name="Settings" component={Settings}/>
                      <Stack.Screen name="Explore" component={Explore} options={{ headerShown: false,}}/>
                      <Stack.Screen name="ProjectDetail" component={ProjectDetail} options={{ headerShown: false,}}/>
                      <Stack.Screen name="Start Giving" component={NewProject} />
                      <Stack.Screen name="Dashboard" component={Dashboard} />
                      <Stack.Screen name="Upload Receipt" component={UploadReceipt} />
                      <Stack.Screen name="Approve Receipt" component={ApproveReceipts} />
                    </Stack.Group>
                  </Stack.Navigator>
                </>
              ) : (
                // Auth screens
                <>
                  { Platform.OS === 'android' ? <StatusBar/> : <StatusBar hidden/> }  
                  <RootStackScreen/>  
                </>
              )}
            </Root>
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </AnimatedSplash>
  )
}
