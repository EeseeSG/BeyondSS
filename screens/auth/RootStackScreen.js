import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
const RootStack = createStackNavigator();

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ForgetPasswordScreen from './ForgetPassword';


export default function RootStackScreen({navigation}) {
	return (
		<RootStack.Navigator 
			screenOptions={{
				headerShown: false,
			}}
		>
			<RootStack.Screen name="SplashScreen" component={SplashScreen}/>
			<RootStack.Screen name="SignInScreen" component={SignInScreen}/>
			<RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
			<RootStack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen}/>
		</RootStack.Navigator>
	);	
}