// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Dimensions,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../constants/defaultStyles';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import CountDown from 'react-native-countdown-component';

// ANIMATION
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

// DISPLAY
import QuantityPicker from '../../components/Project/QuantityPicker';
import StoreTags from '../../components/Project/StoreTags';

// DATA
import * as UserData from '../../database/User';
import * as ProjectData from '../../database/Project';


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
    } ,[])

    // to load once all data is loaded
    useEffect(() => {
        if(currentReservations !== null && quantityReserved  !== null) {
            setIsLoaded(true);
        }
    }, [currentReservations, quantityReserved])

    // get reservation data
    useEffect(() => {
        return _getReservationData();
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
        if(reservations) {
            async function _getReservedUser() {
                let user_count = await _getUserReservedCount(reservations);  // user specific count
                setCurrentReservations(user_count);
                setQuantity(user_count);
            }
            return _getReservedUser();
        }
    }, [reservations])



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
    async function _getReservationData() {
        let reservations_all = await _getCurrentReservations();  // get reserved data
        setReservations(reservations_all)
    }

    async function _getCurrentReservations() {
        const reservations_all = await ProjectData.getReservationsByID(data._id);
        return reservations_all
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
    const _addToCart = async () => {
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
            await _getReservationData()

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


    //=====================================================================================================================
    //==  RENDER DISPLAY ==
    //=====================================================================================================================
    if(!isLoaded) {
        return (
            <View></View>
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
                <ScrollView contentContainerStyle={{ paddingBottom: 100, }} showsVerticalScrollIndicator={false}>
                    <View style={[styles.categoryContainer, styles.shadow, { backgroundColor: colors.background, }]}>
                        <Text style={{ fontStyle: 'italic' }}>Brought to you by <Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}>Beyond Social Services</Text></Text>
                    </View>
                    <DisplayTimer />
                    <View style={{ marginLeft: 30, marginTop: 10, }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 5, flex: 1, marginRight: 30, }}>{data.title}</Text>
                        <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'flex-end', margin: 10, }}>
                            <Text style={{ fontSize: 22, color: 'black', opacity: 0.7, }}>= </Text>
                            <Text style={{ fontSize: 22, color: colors.primary, fontWeight: 'bold', marginRight: 5, }}>{(data.count - quantityReserved).toString()}</Text>
                            <Text style={{ fontSize: 20, fontStyle: 'italic', justifyContent: 'flex-end', color: 'black', opacity: 0.7, }}>left</Text>
                        </View>
                        <StoreTags
                            tags={data.tags}
                            style={{ marginTop: 5, }}
                        />
                        <View style={{ marginTop: 10, }}>
                            <Text style={{ fontStyle: 'italic', }}>Chef  <Text style={[styles.header, { fontStyle: 'normal', fontSize: 18, }]}>{data.user.name}</Text></Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.header}>Collect at:</Text>
                            <Text>{data.location}</Text>
                            <Text>{moment(data.datetime.seconds * 1000).format('LLL')}</Text>
                        </View>
                    </View>

                    {
                        (isBeneficiary || isAdmin) && (
                            <View style={{ marginHorizontal: 30, }}>
                                <Text style={styles.header}>Change reservation quantity to:</Text>
                                <QuantityPicker
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                />
                                <Text style={{ fontWeight: 'bold', backgroundColor: 'rgba(0,255,0,0.2)', borderRadius: 5, marginHorizontal: 20, marginTop: 10, paddingVertical: 5, flex: 1, textAlign: 'center' }}>You have reserved {currentReservations.toString()} portions</Text>
                                {
                                    currentReservations !== 0 && (
                                        <TouchableOpacity style={{ borderWidth: 1, borderColor: 'rgb(255,0,0)', borderRadius: 30, marginHorizontal: 20, marginTop: 20, }} onPress={handleCancel}>
                                            <Text style={{ fontWeight: 'bold', paddingVertical: 15, flex: 1, textAlign: 'center', color: 'rgb(255,0,0)' }}>Cancel Reservation</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                    }

                    <View style={{ marginHorizontal: 30, }}>
                        <Text style={styles.header}>Message from Chef:</Text>
                        <Text style={{ textAlign: 'justify' }}>{data.message}</Text>
                    </View>

                    {
                        (isAdmin || isChef) && (
                            reservations.map((reservation) => (
                                <View>
                                    <Text>User</Text>
                                </View>
                            ))
                        )
                    }

                </ScrollView>
                
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                    style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                >
                    <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={_addToCart}>
                        <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 20, }]}>Save reservation</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Animatable.View>
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
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 15,
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
});