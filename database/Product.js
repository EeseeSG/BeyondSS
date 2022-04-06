import firebase from 'firebase';
require('firebase/firestore');

export const getAllProductData = async () => {
    return await firebase.firestore()
        .collection('store_products')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(store => {
                let _id = store.id;
                let data = store.data();
                return { _id, ...data }
            })
        })
}