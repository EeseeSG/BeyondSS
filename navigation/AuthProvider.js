import React, { createContext, useState } from 'react';
import { Popup } from 'react-native-popup-confirm-toast';
import { firebase } from '../constants/Firebase';
import { DEFAULT_AVATAR } from '../constants/Default';
import { Platform } from 'react-native';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const default_avatar = DEFAULT_AVATAR;

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
                await firebase.firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then((user) => {
                    let _id = user.id;
                    let data = user.data();
                    setUser({ _id, ...data })
                })
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