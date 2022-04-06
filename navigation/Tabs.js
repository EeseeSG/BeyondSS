// BASIC IMPORTS
import React from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import * as Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

// import screens
import HomeScreen from '../screens/main/Home';
import ExploreScreen from '../screens/main/Explore';
import ProfileScreen from '../screens/main/Profile';
import MapScreen from '../screens/main/Map';

// config
const tabs = {
  Home: { // < Screen name
    screen: HomeScreen,
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      name: "home-outline",
      activeName: "home",
      size: 20,
      activeColor: 'white',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: Colors.primary,
    }
  },
  Explore: { // < Screen name
    screen: ExploreScreen,
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      name: "search-outline",
      activeName: "search",
      size: 20,
      activeColor: 'white',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: Colors.primary,
    }
  },
  Map: { // < Screen name
    screen: MapScreen,
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      name: "location-outline",
      activeName: "location",
      size: 20,
      activeColor: 'white',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: Colors.primary,
    }
  },
  Profile: { // < Screen name
    screen: ProfileScreen,
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      name: "person-outline",
      activeName: "person",
      size: 20,
      activeColor: 'white',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: Colors.primary,
    }
  },
};

const Tabs = () => {
	return (
		<Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 15,
          marginHorizontal: 10,
          paddingHorizontal: 5,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 60,
          ...styles.shadow,
        },
        tabBarShowLabel: false,
      }}
		>
			{
				Object.keys(tabs).map((k, i) => (
					<Tab.Screen
						key={i}
						name={k}
						component={tabs[k].screen}
						options={{
							tabBarIcon: ({focused}) => (
								<View style={focused ? [styles.focusedTabStyle, styles.tabStyle, {backgroundColor: tabs[k].background.activeColor}] : styles.tabStyle}>
										<Icon 
											name={focused ? tabs[k].icon.activeName : tabs[k].icon.name} 
											size={tabs[k].icon.size} 
											color={focused ? tabs[k].icon.activeColor : tabs[k].icon.inactiveColor}
											style={{ zIndex: 9999, }}
										/>
                    {focused && <Text style={{ color: 'white', fontSize: 11, marginLeft: 3, }} numberOfLines={1}>{k}</Text>}
								</View>
							)
						}}
					/>
				))
			}
		</Tab.Navigator>
	)
}

export default Tabs

const PHONE_OFFSET = Platform.OS === 'ios' ? (44 + 10) / 2 : 0;
const styles = StyleSheet.create({
  tabStyle: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 50, 
    marginTop: PHONE_OFFSET,
  },
  focusedTabStyle: { 
    borderRadius: 50/2, 
    borderWidth: 1, 
    borderColor: 'white',
    paddingHorizontal: 10,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})