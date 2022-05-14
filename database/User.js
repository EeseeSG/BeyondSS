import firebase from 'firebase';
require('firebase/firestore');
import { firebaseConfig } from '../firebase';
import { uuidv4 } from '../components/Helper/UUID';

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

export const getAllApplicationsActive = async () => {
    return await firebase.firestore()
        .collection('applications')
        .where('isClosed', '!=', true)
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
        let new_app_name = uuidv4();  // create random app for secondary initiation
        var secondaryApp = firebase.initializeApp(firebaseConfig, new_app_name);

        let initial_password = data.contact.slice(-6);  // raw password for user to log in
        await secondaryApp.auth()
            .createUserWithEmailAndPassword(data.email, initial_password)
            .then((credential) => {
                credential.user.updateProfile({ displayName: data.name })
                    .then(async () => {
                        let user_id = credential.user.uid;
                        let user_data = {
                            email: data.email,
                            name: data.name,
                            contact: data.contact,
                            type: data.type,
                            device: data.device,
                            expoPushToken: data.expoPushToken,
                            application_id: data._id,
                            appliedAt: data.createdAt,
                            createdAt: new Date(),
                            initial_password: initial_password,
                            raw_data: data,
                        }
                        await firebase.firestore()
                            .collection('users')
                            .doc(user_id)
                            .set(user_data)
                    }).catch((error) => {
                        throw new Error(error);
                    });

                // delete from application database
                let isRejected = false;
                closeApplication(data._id, isRejected)

                // logout of secondary app
                secondaryApp.auth().signOut();
                // must always remove secondary app or will face persistence error
                secondaryApp.delete(); 

                // check if there are too many secondary accounts
                if (firebase.apps.length > 50) {
                    throw new Error('There are multiple backlogs in the server. Please contact your administrator to restart the server for best performance.');
                }

            }).catch((error) => {
                throw new Error(error.message)
            });

            return {
                success: true,
            }
    } catch (error) {
        const error_text = typeof error === 'object' ? error.message : error;
        return {
            success: false,
            error: error_text,
        }
    }
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

export const closeApplication = async (application_id, isRejected) => {
    try {
        await firebase.firestore()
            .collection('applications')
            .doc(application_id)
            .update({
                isClosed: true,
                isRejected: isRejected,
            })
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