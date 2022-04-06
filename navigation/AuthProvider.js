import React, { createContext, useState } from 'react';
import { Popup } from 'react-native-popup-confirm-toast';
import { firebase } from '../constants/Firebase';
import { kitty } from '../constants/ChatKitty';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const default_avatar = 'https://firebasestorage.googleapis.com/v0/b/sg-eesee.appspot.com/o/default%2Fdefault_avatar.png?alt=media&token=928854a5-f4ec-4792-b4a9-ae2e671f3f15';
  const loginChatKitty = async (email, password) => {
    const result = await kitty.startSession({
      username: email,
      authParams: {
        password: password,
      },
    });
    if (result.failed) {
      console.log('Could not login');
    }
  }

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
                // login to chatkitty
                loginChatKitty(email.trim(), password)

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
        register: async (displayName, email, password) => {
          setLoading(true);

          try {
            await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((credential) => {
              credential.user.updateProfile({ displayName: displayName })
                .then(async () => {
                  let user_id = credential.user.uid;
                  let user_data = {
                    email: email,
                    username: displayName,
                    username_lower: displayName.toLowerCase(),
                    avatar: default_avatar,
                    createdAt: new Date(),
                    online: true,
                    lastOnline: new Date(),
                  }
                  await firebase.firestore()
                    .collection('users')
                    .doc(user_id)
                    .set(user_data)

                  // set user data
                  setUser(user_data)

                  // login to chatkitty
                  await loginChatKitty(email.trim(), password)
                });
            });
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
            await kitty.endSession();
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