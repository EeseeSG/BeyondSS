import firebase from 'firebase';
require('firebase/firestore');

export const getBannerData = async () => {
    return await firebase.firestore()
        .collection('banner')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}

export const getPartnerData = async () => {
    return await firebase.firestore()
        .collection('partners')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}

export const getNewsData = async () => {
    return await firebase.firestore()
        .collection('news')
        .limit(10)
        .orderBy('date', 'desc')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}

export const getAllUserData = async () => {
    return await firebase.firestore()
        .collection('users')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(project => {
                let _id = project.id;
                let data = project.data();
                return { _id, ...data }
            })
        })
}
