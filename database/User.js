import firebase from 'firebase';
require('firebase/firestore');

// GENERAL
export const currentUserData = async () => {
    return await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((user) => {
            let _id = user.id;
            let data = user.data();
            return { _id, ...data }
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
                    return { _id, ...data }
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
                    return { _id, ...data }
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
                    return { _id, ...data }
                }
            })
            return result
        })
}