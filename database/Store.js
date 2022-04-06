import firebase from 'firebase';
require('firebase/firestore');

export const getAllStoreData = async () => {
    return await firebase.firestore()
        .collection('stores')
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(store => {
                let _id = store.id;
                let data = store.data();
                return { _id, ...data }
            })
        })
}

export const getStoreByID = async (store_id) => {
    return await firebase.firestore()
        .collection('stores')
        .doc(store_id)
        .get()
        .then((store) => {
            let _id = store.id;
            let data = store.data();
            return { _id, ...data }
        })
}

export const getAllStoreDataLimit = async (limit) => {
    return await firebase.firestore()
        .collection('stores')
        .limit(limit)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(store => {
                let _id = store.id;
                let data = store.data();
                return { _id, ...data }
            })
        })
}

export const getAllStoreProductData = async () => {
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

export const getStoreProductDataByID = async (store_id) => {
    return await firebase.firestore()
        .collection('store_products')
        .where('store_id', '==', store_id)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(store => {
                let _id = store.id;
                let data = store.data();
                return { _id, ...data }
            })
        })
}

export const getProductDataByID = async (product_id) => {
    return await firebase.firestore()
        .collection('store_products')
        .doc(product_id)
        .get()
        .then((product) => {
            let _id = product.id;
            let data = product.data();
            return { _id, ...data }
        })
}

export const getStoreProductDataByGroup = async (arr_store_id) => {
    return await firebase.firestore()
        .collection('store_products')
        .where('store_id', 'in', arr_store_id)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map(store => {
                let _id = store.id;
                let data = store.data();
                return { _id, ...data }
            })
        })
}

export async function _mapProductToStore({arr_store, arr_products}) {
    return await Promise.all(
        arr_store.map((store) => {
            let store_id = store._id;
            let arr = [];
            let tags_arr = [];
            for(const product of arr_products) {
                if(product.store_id === store_id) {
                    arr.push(product)
                    for(const tag of product.tags) {
                        if(tags_arr.indexOf(tag) === -1) {
                            tags_arr.push(tag)
                        }
                    }
                }
            }
            return { ...store, tags: tags_arr, products: arr}
        })
    )
}

export const setShoppingCart = async (data) => {
    try {
        await firebase.firestore()
            .collection('store_orders')
            .doc(data.user_id)
            .collection('cart')
            .add(data)
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