// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Image,
    Modal,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../constants/defaultStyles';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import CountDown from 'react-native-countdown-component';
import Feather from 'react-native-vector-icons/Feather';

// ANIMATION
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

// DISPLAY
import QuantityPicker from '../../components/Project/QuantityPicker';
import StoreTags from '../../components/Project/StoreTags';
import ReceiptList from '../../components/Project/ReceiptList';
import Section from '../../components/Container/Section';

// DATA
import * as UserData from '../../database/User';
import * as ProjectData from '../../database/Project';
import firebase from 'firebase';
require('firebase/firestore');

// PUSH NOTIFICATIONS
import { sendPushNotification } from '../../components/Helper/PushNotifications';


const IMAGE_HEIGHT = 200;
const PHONE_OFFSET = Platform.OS === 'ios' ? 44 : 0;

export default function ProjectDetail(props) {
    const { navigation, route } = props;
    const data = route.params.data;
    const { colors } = useTheme();
    const [isLoaded, setIsLoaded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [isChef, setIsChef] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    //=====================================================================================================================
    //== INITIATE ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState([]);
    const [reservations, setReservations] = useState(null);
    const [currentReservations, setCurrentReservations] = useState(null);
    const [quantityReserved, setQuantityReserved] = useState(null);
    const [uploadedReceipts, setUploadedReceipts] = useState(null);

    // get user data
    useEffect(() => {
        async function _getUserData() {
            let current_user = await _getCurrentUser(); // user data
            const is_chef = current_user.type === 'chef';
            const is_beneficiary = current_user.type === 'beneficiary';
            const is_admin = current_user.type === 'admin';
            setIsChef(is_chef);
            setIsBeneficiary(is_beneficiary);
            setIsAdmin(is_admin);

            setCurrentUser(current_user);
        }
        return _getUserData()
    }, [])

    // to load once all data is loaded
    useEffect(() => {
        if(currentReservations !== null && quantityReserved !== null && currentReservationData !== null && currentReservationData !== undefined && uploadedReceipts !== null) {
            setIsLoaded(true);
        }
    }, [currentReservations, quantityReserved, currentReservationData])

    // get reservation data
    useEffect(() => {
        return _getCurrentReservations();
    }, [])

    // update total reserved amount
    useEffect(() => {
        if(reservations) {
            async function _getReservedTotal() {
                let total_reserved_count = await _getTotalReservedCount(reservations);  // total count
                setQuantityReserved(total_reserved_count);
            }
            return _getReservedTotal();
        }
    }, [reservations])

    // update user reserved amount
    useEffect(() => {
        if(reservations !== null & currentUser !== null) {
            async function _getReservedUser() {
                let user_count = await _getUserReservedCount(reservations);  // user specific count
                setCurrentReservations(user_count);
                setQuantity(user_count);
            }
            return _getReservedUser();
        }
    }, [reservations, currentUser])

    // set if user is beneficiary to highlight only instance
    useEffect(() => {
        if(currentUser !== null && reservations !== null) {
            if(currentUser.type === 'beneficiary') {
                const user_reserved_data = reservations.filter((i) => i.user_id === currentUser._id);
                if(user_reserved_data.length === 0) {
                    setCurrentReservationData([]);
                } else {
                    setCurrentReservationData(user_reserved_data[0]);
                }
            } else {
                setCurrentReservationData([]);
            }
        }
    }, [currentUser, reservations])

    // search for receipts
    useEffect(() => {
        if(isChef || isAdmin) {
            async function _getReceipt() {
                firebase.firestore()
                    .collection('receipts')
                    .where('project_id', '==', data._id)
                    .onSnapshot((snapshot) => {
                        let receipt_arr = snapshot.docs.map(snap => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        })
                        let parsed_receipt_arr = receipt_arr.map((receipt, index) => {
                            return {
                                ...receipt,
                                index,
                            }
                        })
                        setUploadedReceipts(parsed_receipt_arr)
                    })
            }
            return _getReceipt()
        } else {
            setUploadedReceipts([])
        }
    }, [isChef, isAdmin])

    //=====================================================================================================================
    //==  CURRENT USER ==
    //=====================================================================================================================
    async function _getCurrentUser() {
        let current_user = await UserData.currentUserData();
        return current_user
    } 

    //=====================================================================================================================
    //==  CURRENT RESERVATIONS ==
    //=====================================================================================================================
    const [currentReservationData, setCurrentReservationData] = useState(null);
    async function _getCurrentReservations() {
        await firebase.firestore()
            .collection('reservations')
            .where('project_id', '==', data._id)
            .onSnapshot((snapshot) => {
                let reservations_all = snapshot.docs.map((snap) => {
                    let _id = snap.id;
                    let data = snap.data();
                    return { ...data, _id }
                })
                setReservations(reservations_all)
            })
    }

    async function _getTotalReservedCount(reservations_all) {
        const reserved_map = reservations_all.map((i) => i.reserved);
        const count = reserved_map.reduce((a, b) => a + b, 0);
        return count
    }

    async function _getUserReservedCount(reservations_all) {
        const user_reserved_data = await Promise.all(reservations_all.filter((i) => i.user_id === currentUser._id));
        const user_reserved_map = await Promise.all(user_reserved_data.map((i) => i.reserved));
        const user_count = user_reserved_map.reduce((a, b) => a + b, 0);
        return user_count
    }

  
    //============================================c=========================================================================
    //==  MAKE RESERVATION ==
    //=====================================================================================================================
    const _saveReservation = async () => {
        // check if it is available yet
        let avail = checkAvailability();
        if(!avail) return;

        // check if there is oversubscription
        let isSufficient = await ProjectData.checkReservationAvailability(data._id, currentUser._id, quantity);
        if(!isSufficient) {
            Popup.show({
                type: 'danger',
                title: 'Invalid quantity',
                textBody: 'The quantity you selected is more than that of what is currently left available. Please lower the quantity and try again.',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return
        };

        // post the data
        let reservation_data = { 
            user_id: currentUser._id,
            user: currentUser, 
            project_id: data._id,
            project: data, 
            reserved: quantity,
            createdAt: new Date(),
        };
        let result = await ProjectData.updateReservation(reservation_data);
        if(result.success) {
            // update by recalling the function
            Popup.show({
                type: 'success',
                title: 'Success!',
                textBody: 'Reservation was made successfully. Please take note of the location, time and any notes by the chef.',
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
        } else {
            Popup.show({
                type: 'danger',
                title: 'Error. Please try again.',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }
    }

    //=====================================================================================================================
    //==  AVAILABILITY ==
    //=====================================================================================================================
    const DisplayTimer = () =>{
        if(data.datetime.seconds > moment().unix()) {
            return (
                <View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10, }}>Available soon!</Text>
                    <CountDown
                        until={data.datetime.seconds - moment().unix()}
                        onPress={checkAvailability}
                        size={20}
                    />
                </View>
            )
        }
        if(data.datetime.seconds > moment().unix()) {
            return (
                <View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10, }}>Whilst stock last!</Text>
                    <CountDown
                        until={data.datetime.seconds - moment().unix()}
                        onPress={checkAvailability}
                        size={20}
                        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
                    />
                </View>
            )
        }
        return null  // fall back
    }

    const checkAvailability = () => {
        if(!data.limitedTime) {
            return true
        }
        if(data.limitedStart.seconds > moment().unix()) {
            Popup.show({
                type: 'warning',
                title: 'Not available yet',
                textBody: `${data.text} will be made available soon. Stay tuned!`,
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
            return false
        }
        if(data.limitedTill.seconds < moment().unix()) {
            Popup.show({
                type: 'warning',
                title: 'Sale has ended',
                textBody: `Sale of ${data.text} has ended. Stay tuned for future sessions!`,
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
            return false
        }
        Popup.show({
            type: 'success',
            title: 'Sale has started',
            textBody: `Sale of ${data.text}. Only available for limited time! \n\nAdd to cart now!`,
            buttonText: 'Okay',
            callback: () => Popup.hide()
        })
        return true
    }

    const handleCancel = () => {
        Popup.show({
            type: 'confirm',
            title: 'WARNING!',
            textBody: 'Are you sure you would like to cancel this reservation? This action cannot be undone.',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await ProjectData.cancelReservation(data._id+'-'+currentUser._id);
                } catch(err) {
                    console.log(err)
                } finally {
                    Popup.hide();
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }

    const handleComplete = (reservation_data) => {
        Popup.show({
            type: 'confirm',
            title: 'Complete Order?',
            textBody: 'Are you ready to complete this order?',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await ProjectData.completeDelivery(reservation_data._id);
                    if(status.success) {
                        // update the list
                        let new_reservations = reservations.map((reservation) => {
                            if(reservation._id === reservation_data._id) {
                                return {
                                    ...reservation,
                                    delivered: true,
                                }
                            }
                            return reservation
                        })
                        setReservations(new_reservations);

                        // send push notification
                        let message = {
                            title: 'Confirmation',
                            body: `Please confirm that you have received ${reservation_data.reserved} of ${reservation_data.project.title}. Enjoy your meal!`,
                            data: {
                                ref: reservation_data.project_id,
                                type: 'project',
                            },
                        }
                        sendPushNotification([reservation_data.project.user.expoPushToken], message)  // communicate to chef
                    } else {
                        Popup.show({
                            type: 'danger',
                            title: 'Error. Please try again.',
                            textBody: result.error,
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                    }
                } catch(err) {
                    console.log(err)
                } finally {
                    Popup.hide();
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }

    const handleAcknowledge = (reservation_data) => {
        Popup.show({
            type: 'confirm',
            title: 'Acknowledgement',
            textBody: 'Are you ready to acknowledge that you have received this delivery?',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await ProjectData.acknowledgeDelivery(reservation_data._id);
                    if(status.success) {
                        // update the list
                        let new_reservations = reservations.map((reservation) => {
                            if(reservation._id === reservation_data._id) {
                                return {
                                    ...reservation,
                                    acknowledged: true,
                                }
                            }
                            return reservation
                        })
                        setReservations(new_reservations);

                        // send push notification
                        let message = {
                            title: 'Acknowledged!',
                            body: 'Your delivery has been acknowledged. Thank you for your service!',
                            data: {
                                ref: reservation_data.project_id,
                                type: 'project',
                            },
                        }
                        sendPushNotification([reservation_data.project.user.expoPushToken], message)  // communicate to chef
                    } else {
                        Popup.show({
                            type: 'danger',
                            title: 'Error. Please try again.',
                            textBody: result.error,
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                    }
                } catch(err) {
                    console.log(err)
                } finally {
                    Popup.hide();
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }
    

    //=====================================================================================================================
    //==  RENDER DISPLAY ==
    //=====================================================================================================================
    if(!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={"#0000ff"} />
            </View>
        )
    }

    return (
        <ScrollView style={[defaultStyles.container, { backgroundColor: colors.primary }]} contentContainerStyle={{ paddingBottom: 90, height: '100%' }}>
            <View style={styles.topButtonContainers}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24}/>
                </TouchableOpacity>
                <View style={{ flex: 1, }}/>
            </View>
            <Animatable.View
                animation="fadeInDownBig"
                style={styles.backgroundImage}
            >
                <LottieView
                    source={require('../../assets/animation/recipes.json')}
                    autoPlay
                    loop
                    style={styles.logo}
                />
            </Animatable.View>
            <Animatable.View 
                animation="fadeInUpBig" 
                style={[styles.detailsContainer, styles.shadow]}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 100, marginHorizontal: 20, }} showsVerticalScrollIndicator={false}>

                    <Section>
                        <View style={[styles.categoryContainer, styles.shadow, { backgroundColor: colors.background, }]}>
                            <Text style={defaultStyles.text}>Brought to you by <Text style={[defaultStyles.textBold]}>Beyond Social Services</Text></Text>
                        </View>
                    </Section>

                    <DisplayTimer />

                    <Section>
                        <Text style={defaultStyles.h1}>{data.title}</Text>
                    </Section>

                    <Section>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', }}>
                            <Text style={[defaultStyles.h1, defaultStyles.textBold, {color: colors.primary, marginRight: 10, }]}>{(data.count - quantityReserved).toString()}</Text>
                            <Text style={[defaultStyles.h4, defaultStyles.textLight]}>left</Text>
                        </View>
                    </Section>

                    <Section>
                        <StoreTags
                            tags={data.tags}
                        />
                    </Section>

                    <Section>
                        <Text style={defaultStyles.h4}>Chef <Text style={[defaultStyles.text, defaultStyles.textBold]}>{data.user.name}</Text></Text>
                    </Section>

                    <Section>
                        <Text style={defaultStyles.h4}>Collect at:</Text>
                        <Text>{data.location}</Text>
                        <Text>{moment(data.datetime.seconds * 1000).format('LLL')}</Text>
                    </Section>

                    {
                        (isBeneficiary || isAdmin) && (
                            <Section>
                                <Text style={defaultStyles.h4}>Change reservation quantity to:</Text>
                                <QuantityPicker
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                />
                                <Text style={{ fontWeight: 'bold', backgroundColor: 'rgba(0,255,0,0.2)', borderRadius: 5, marginHorizontal: 20, marginTop: 10, paddingVertical: 5, flex: 1, textAlign: 'center' }}>You have reserved {currentReservations.toString()} portions</Text>
                                {
                                    (isBeneficiary && currentReservationData !== []) && (
                                        (currentReservationData.delivered && !currentReservationData.acknowledged) ? (
                                            <TouchableOpacity style={{ borderWidth: 1, borderColor: 'green', borderRadius: 30, marginHorizontal: 20, marginTop: 20, }} onPress={() => handleAcknowledge(currentReservationData)}>
                                                <Text style={{ fontWeight: 'bold', paddingVertical: 15, flex: 1, textAlign: 'center', color: 'green' }}>Acknowledge this delivery</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            (currentReservationData.delivered && currentReservationData.acknowledged) ? (
                                                <View style={{ borderWidth: 1, borderColor: 'blue', borderRadius: 30, marginHorizontal: 20, marginTop: 20, }}>
                                                    <Text style={{ fontWeight: 'bold', paddingVertical: 15, flex: 1, textAlign: 'center', color: 'blue' }}>You have acknowledged this delivery</Text>
                                                </View>
                                            ) : (
                                                currentReservations !== 0 && (
                                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: 'red', borderRadius: 30, marginHorizontal: 20, marginTop: 20, }} onPress={handleCancel}>
                                                        <Text style={{ fontWeight: 'bold', paddingVertical: 15, flex: 1, textAlign: 'center', color: 'red' }}>Cancel Reservation</Text>
                                                    </TouchableOpacity>
                                                )
                                            )
                                        )
                                    )
                                }
                            </Section>
                        )
                    }


                    <Section>
                        <Text style={defaultStyles.h4}>Message from Chef:</Text>
                        <Text style={defaultStyles.text}>{data.message.trim().length === 0 ? 'No message.' : data.message}</Text>
                    </Section>


                    {
                        (isAdmin || isChef) && (
                            <Section>
                                <Text style={[styles.header, { marginBottom: 15, }]}>Reservation Details:</Text>
                                {
                                    reservations.length === 0 && (
                                        <Text>No reservations yet.</Text>
                                    )
                                }
                                {
                                    reservations.map((reservation, index) => (
                                        <View key={index} style={{ marginVertical: 5, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 0.5, borderColor: '#ccc', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 5, }}>{reservation.user.name}</Text>
                                                <Text style={{ fontSize: 16, }}>+65 {reservation.user.contact}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Reserved:  <Text style={{ color: 'blue', fontSize: 18, }}>{reservation.reserved.toString()}</Text></Text>
                                            </View>
                                            {
                                                !reservation.delivered ? (
                                                    currentUser._id === data.user._id ? (
                                                        <TouchableOpacity style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleComplete(reservation)}>
                                                            <Feather 
                                                                name="check-square"
                                                                color={'green'}
                                                                size={30}
                                                            />
                                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Mark as delivered</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        /** THIS IS ADMIN OR OTHER CHEF VIEW */
                                                        <View style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleComplete(reservation._id)}>
                                                            <Feather 
                                                                name="loader"
                                                                color={'grey'}
                                                                size={30}
                                                            />
                                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Pending</Text>
                                                        </View>    
                                                    )
                                                ) : (
                                                    !reservation.acknowledged ? (
                                                        <View style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Feather 
                                                                name="loader"
                                                                color={'grey'}
                                                                size={30}
                                                            />
                                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Pending {'\n'}Acknowledgement</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={{ marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Feather 
                                                                name="archive"
                                                                color={'blue'}
                                                                size={30}
                                                            />
                                                            <Text style={{ textAlign: 'center', fontSize: 12, }}>Completed</Text>
                                                        </View>
                                                    )
                                                )
                                            }
                                        </View>
                                    ))
                                }
                            </Section>
                        )
                    }

                    {
                        // show receipts upload option only to creator of event
                        (data.user._id === currentUser._id) && (
                            <Section>
                                <Text style={styles.header}>Uploaded receipts</Text>
                                <ReceiptList
                                    data={uploadedReceipts}
                                />
                            </Section>
                        )
                    }

                </ScrollView>
                
                {
                    isBeneficiary && (
                        // Only available if it is not delivered or not out of time
                        !currentReservationData.delivered && new Date() < new Date(data.datetime.seconds * 1000)) && (
                            <LinearGradient
                                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                                style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                            >
                                <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={_saveReservation}>
                                    <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 20, }]}>Save reservation</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                    )
                }

                {
                    // FOR ADMIN
                    isAdmin && (
                        // Only available if it is not out of time
                        new Date() < new Date(data.datetime.seconds * 1000)) && (
                            <LinearGradient
                                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                                style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                            >
                                <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={_saveReservation}>
                                    <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 20, }]}>Save reservation</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                    )
                }

                {
                    // FOR CHEF
                    (data.user._id === currentUser._id) && (
                        <LinearGradient
                            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                            style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                        >
                            <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={() => navigation.navigate('Upload Receipt', { project: data, currentUser: currentUser, })}>
                                <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 20, }]}>Upload Receipt</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    )
                }
            </Animatable.View>
            <View style={{ height: 50, }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    topButtonContainers: { 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        right: 10, 
        zIndex: 2, 
        flexDirection: 'row', 
    },
    iconContainer: { 
        width: 40, 
        height: 40, 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        borderRadius: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignContent: 'center' 
    },
    backgroundImage: {
        width: '100%', 
        height: IMAGE_HEIGHT,
    },
    detailsContainer: { 
        borderTopStartRadius: 35, 
        borderTopEndRadius: 35, 
        marginTop: -35, 
        height: Dimensions.get('window').height - IMAGE_HEIGHT + 35 - PHONE_OFFSET,
        backgroundColor: '#fff', 
    },
    categoryContainer: { 
        height: 50, 
        flexDirection: 'row', 
        borderRadius: 100, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginVertical: 20,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
    sizeContainer: {
        height: 40,
        marginVertical: 10,
        flexDirection: 'row',
    },
    sizeButton: { 
        borderRadius: 30, 
        height: '100%', 
        marginHorizontal: 10, 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: Dimensions.get('window').width / 5,
    },
    cardButton: {
        marginHorizontal: 20,
        marginVertical: 20, 
        height: 50, 
        width: Dimensions.get('screen').width * 0.8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 50, 
        height: 50,
        flexDirection: 'row',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    primaryButton: {
        width: Dimensions.get('screen').width - 20,
        borderRadius: 30, 
        backgroundColor: '#9980D3', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 20,
        height: 50, 
    },
});