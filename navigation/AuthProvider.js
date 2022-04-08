import React, { createContext, useState } from 'react';
import { Popup } from 'react-native-popup-confirm-toast';
import { firebase } from '../constants/Firebase';
import { Platform } from 'react-native';

// PUSH NOTIFICATION
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


export const AuthContext = createContext({
	user: null,
	setUser: () => {},
	loading: false,
	setLoading: () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				setLoading,

				// LOGIN
				login: async (email, password) => {
					try {
						firebase.auth().signInWithEmailAndPassword(email.trim(), password)
							.then(async () => {
								// retrieve user data
								let current_user = await firebase.firestore()
									.collection('users')
									.doc(firebase.auth().currentUser.uid)
									.get()
									.then(async (user) => {
										let _id = user.id;
										let data = user.data();
										return { ...data, _id }
									})

								// check push notification in case change of device
								async function registerForPushNotificationsAsync() {
									let token;
									if (Device.isDevice) {
										const { status: existingStatus } = await Notifications.getPermissionsAsync();
										let finalStatus = existingStatus;
										if (existingStatus !== 'granted') {
											const { status } = await Notifications.requestPermissionsAsync();
											finalStatus = status;
										}
										if (finalStatus !== 'granted') {
											alert('Failed to get push token for push notification!');
											return;
										}
										token = (await Notifications.getExpoPushTokenAsync()).data;
										return token;
									} else {
										alert('Must use physical device for Push Notifications');
									}
								}

								let current_token = await registerForPushNotificationsAsync()
								if(current_user.expoPushToken !== current_token) {
									// update
									let new_current_user = {
										...current_user,
										expoPushToken: current_token,
									}
									await firebase.firestore()
										.collection('users')
										.doc(firebase.auth().currentUser.uid)
										.update(new_current_user)
									setUser(new_current_user)
								} else {
									setUser(current_user)
								}
							})
							.catch((error) => {
								Popup.show({
									type: 'danger',
									title: 'Access Error',
									textBody: error,
									buttonText: 'Close',
									callback: () => Popup.hide()
								})
							})
					} catch(error) {
						Popup.show({
							type: 'danger',
							title: 'Access Error',
							textBody: error,
							buttonText: 'Close',
							callback: () => Popup.hide()
						})
					}
				},

				// REGISTER
				register: async ({ email, name, contact, expoPushToken }) => {
					setLoading(true);

					try {
						await firebase.firestore()
							.collection('applications')
							.add({
								email: email,
								name: name,
								contact: contact,
								expoPushToken: expoPushToken,
								device: Platform.OS,
								createdAt: new Date(),
							})
						Popup.show({
							type: 'success',
							title: 'Success!',
							textBody: 'We have successfully receive your application. We will contact you shortly.',
							buttonText: 'Close',
							callback: () => Popup.hide()
						})
					} catch (error) {
						Popup.show({
							type: 'danger',
							title: 'An error has occurred. Please try again.',
							textBody: error,
							buttonText: 'Close',
							callback: () => Popup.hide()
						})
					}

					setLoading(false);
				},

				// LOGOUT
				logout: async () => {
					try {
						await firebase.auth().signOut();
					} catch (e) {
						console.error(e);
					}
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};