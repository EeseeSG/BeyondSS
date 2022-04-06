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

export const addItemToFavourite = async ({product_id, currentUser}) => {
    try {
        await firebase.firestore()
        .collection('store_products')
        .doc(product_id)
        .update({
            favourites: firebase.firestore.FieldValue.arrayUnion(currentUser._id)
        })
        return { success: true, }
    } catch(error) {
        return { success: false, error, }
    }
}

export const removeItemFromFavourite = async ({product_id, currentUser}) => {
    try {
        await firebase.firestore()
        .collection('store_products')
        .doc(product_id)
        .update({
            favourites: firebase.firestore.FieldValue.arrayRemove(currentUser._id)
        })
        return { success: true, }
    } catch(error) {
        return { success: false, error, }
    }
}

export const getPaymentHistory = async () => {
    return await firebase.firestore()
    .collection('store_orders')
    .doc(firebase.auth().currentUser.uid)
    .collection('payment_history')
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((snap) => {
            let _id = snap.id;
            let data = snap.data();
            return { _id, ...data }
        })
    })
}

// PROMO
export const getPromoCode = async (promoCode) => {
    return await firebase.firestore()
    .collection('promo_code')
    .where('code', '==', promoCode)
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((snap) => {
            let _id = snap.id;
            let data = snap.data();
            return { _id, ...data }
        })
    })
}

// CARD
export const getCartItems = async () => {
    return await firebase.firestore()
    .collection('store_orders')
    .doc(firebase.auth().currentUser.uid)
    .collection('cart')
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((snap) => {
            let _id = snap.id;
            let data = snap.data();
            return { _id, ...data }
        })
    })
}

export const updateCartItems = async ({cart_id, updated_data}) => {
    try {
        await firebase.firestore()
            .collection('store_orders')
            .doc(firebase.auth().currentUser.uid)
            .collection('cart')
            .doc(cart_id)
            .update(updated_data)
        return { success: true }
    } catch(error) {
        return { success: false, error, }
    }
}

export const deleteCartItemsByID = async (cart_id) => {
    try {
        await firebase.firestore()
            .collection('store_orders')
            .doc(firebase.auth().currentUser.uid)
            .collection('cart')
            .doc(cart_id)
            .delete()
        return { success: true }
    } catch(error) {
        return { success: false, error, }
    }
}


// ORDER
export const getPurchasedItems = async () => {
    return await firebase.firestore()
    .collection('store_orders')
    .doc(firebase.auth().currentUser.uid)
    .collection('pending_orders')
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((snap) => {
            let _id = snap.id;
            let data = snap.data();
            return { _id, ...data }
        })
    })
}

export const setPurchasedItem = async ({order_arr, payment_id}) => {
    try {
        const currentUserID = firebase.auth().currentUser.uid;
        for(const order of order_arr) {
            await firebase.firestore()
                .collection('store_orders')
                .doc(currentUserID)
                .collection('pending_orders')
                .add({
                    ...order,
                    payment_id,
                })
        }
        return { success: true }
    } catch(error) {
        return { success: false, error, }
    }
}

export const setPurchasedDetails = async (payment_details) => {
    try {
        await firebase.firestore()
            .collection('store_orders')
            .doc(firebase.auth().currentUser.uid)
            .collection('payment_history')
            .add(payment_details)
        return { success: true }
    } catch(error) {
        return { success: false, error, }
    }
}


// FAVOURITE
export const getFavouriteProducts = async () => {
    return await firebase.firestore()
    .collection('store_products')
    .where('favourites', 'array-contains', firebase.auth().currentUser.uid)
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((snap) => {
            let _id = snap.id;
            let data = snap.data();
            return { _id, ...data }
        })
    })
}