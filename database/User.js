import firebase from 'firebase';
require('firebase/firestore');
import { firebaseConfig } from '../constants/Firebase';

// GENERAL
export const currentUserData = async () => {
    return await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((user) => {
            let _id = user.id;
            let data = user.data();
            return { ...data, _id }
        })
}

export const getUserByPhone = async (phone) => {
    return await firebase.firestore()
        .collection('users')
        .where('contact', '==', phone)
        .get()
        .then((snapshot) => {
            let result = snapshot.docs.map((snap) => {
                if(snap.exists) {
                    let _id = snap.id;
                    let data = snap.data();
                    return { ...data, _id }
                }
            })
            return result
        })
}

export const getApplicationByPhone = async (phone) => {
    return await firebase.firestore()
        .collection('applications')
        .where('contact', '==', phone)
        .get()
        .then((snapshot) => {
            let result = snapshot.docs.map((snap) => {
                if(snap.exists) {
                    let _id = snap.id;
                    let data = snap.data();
                    return { ...data, _id }
                }
            })
            return result
        })
}

export const getAllApplications = async () => {
    return await firebase.firestore()
        .collection('applications')
        .get()
        .then((snapshot) => {
            let result = snapshot.docs.map((snap) => {
                if(snap.exists) {
                    let _id = snap.id;
                    let data = snap.data();
                    return { ...data, _id }
                }
            })
            return result
        })
}

export const getAllUsersByDateJoined = async () => {
    return await firebase.firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
            let result = snapshot.docs.map((snap) => {
                if(snap.exists) {
                    let _id = snap.id;
                    let data = snap.data();
                    return { ...data, _id }
                }
            })
            return result
        })
}

export const createNewUser = async (data) => {
    try {
        // set up secondary app so that does not interfer with current app / admin login
        var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");

        // let initial_password = data.contact.slice(-6);  // raw password for user to log in
        let initial_password = 'beneficiaryaccount'
        await secondaryApp.auth()
            .createUserWithEmailAndPassword(data.email, initial_password)
            .then((credential) => {
                credential.user.updateProfile({ displayName: data.name })
                    .then(async () => {
                        let user_id = credential.user.uid;
                        let user_data = {
                            ...data,
                            appliedAt: data.createdAt,
                            createdAt: new Date(),
                            initial_password: initial_password,
                        }
                        await firebase.firestore()
                            .collection('users')
                            .doc(user_id)
                            .set(user_data)
                    });

                    // delete from application database
                    deleteApplication(data._id)
            }).then(() => {
                // logout
                secondaryApp.auth().signOut();
                return {
                    success: true,
                }
            }).catch((error) => {
                return {
                    success: false,
                    error,
                }
            });
    } catch (error) {
        return {
            success: false,
            error,
        }
    }
}

export const _generateRandomPassword = () => {
    const min = 1;
    const max = 10000;
    const rand = '000000' + (min + Math.random() * (max - min)).toString();
    return rand.slice(-6);
}

export const deleteApplication = async (application_id) => {
    try {
        await firebase.firestore()
            .collection('applications')
            .doc(application_id)
            .delete()
        return {
            success: true,
        }
    } catch(error) {
        return {
            success: false,
            error,
        }
    }
}