// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Dimensions,
    FlatList,
    Image,
    Alert,
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
import QuantityPicker from '../../components/Store/QuantityPicker';
import StoreTags from '../../components/Store/StoreTags';

// DATA
import * as UserData from '../../database/User';


const IMAGE_HEIGHT = 200;
const PHONE_OFFSET = Platform.OS === 'ios' ? 44 : 0;

export default function FoodItem(props) {
    const { navigation, route } = props;
    const { colors } = useTheme();
    const [isLoaded, setIsLoaded] = useState(false);

    const [data, setData] = useState(route.params.data);
    const image = data.image;
    const [quantity, setQuantity] = useState(1);

    //=====================================================================================================================
    //== INITIATE ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        async function _init() {
            await _getCurrentUser()
            setIsLoaded(true);
        }
        return _init()
    } ,[])


    //=====================================================================================================================
    //==  CURRENT USER ==
    //=====================================================================================================================
    async function _getCurrentUser() {
        let current_user = await UserData.currentUserData();
        setCurrentUser(current_user)
        return
    } 
  
    //=====================================================================================================================
    //==  MAKE RESERVATION ==
    //=====================================================================================================================
    const _addToCart = async () => {
        // // check if it is available yet
        // let avail = checkAvailability();
        // if(!avail) return

        // // post the data
        // let delivery_date = new Date('2022-02-20'); // temp data
        // let data_to_store = { 
        //     user_id: currentUser._id, 
        //     product_data: data, 
        //     order_data: {
        //         selection: {
        //             index: selection,
        //             item: data.sizes[selection],
        //         },
        //         quantity,
        //         item_price: data.price,
        //         total_price: (data.sizes[selection].price * quantity),
        //     },
        //     createdAt: new Date(),
        //     deliveryDate: delivery_date,
        // };
        // let result = await StoreData.setShoppingCart(data_to_store);
        // if(result.success) {
        //     Popup.show({
        //         type: 'success',
        //         title: 'Success!',
        //         textBody: 'Item has been added into your shopping cart.',
        //         buttonText: 'Okay',
        //         callback: () => Popup.hide()
        //     })
        // } else {
        //     Popup.show({
        //         type: 'danger',
        //         title: 'Error. Please try again.',
        //         textBody: result.error,
        //         buttonText: 'Close',
        //         callback: () => Popup.hide()
        //     })
        // }
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
                    <View style={{ marginLeft: 30, }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 5, flex: 1, marginRight: 30, }}>{data.title}</Text>
                        <StoreTags
                            tags={data.tags}
                            style={{ marginTop: 5, }}
                        />
                    </View>
                    <View style={{ marginHorizontal: 30, }}>
                        <Text style={styles.header}>Quantity</Text>
                        <QuantityPicker
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />
                    </View>
                    <View style={{ marginHorizontal: 30, }}>
                        <Text style={styles.header}>Message</Text>
                        <Text style={{ textAlign: 'justify' }}>{data.message}</Text>
                    </View>

                </ScrollView>
                
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                    style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                >
                    <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={_addToCart}>
                        <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 30, }]}>Reserve {quantity} portion</Text>
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
        margin: 20, 
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