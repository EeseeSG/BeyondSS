// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import moment from 'moment';

// DESIGN
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from '../../constants/defaultStyles';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { currentUserData } from '../../database/User';
import UserAvatar from 'react-native-user-avatar';

// CUSTOM
import ItemHorizontalSlider from '../../components/Store/ItemHorizontalSlider';
import OrderItem from '../../components/User/OrderItem';
import CartItem from '../../components/User/CartItem';
import Item from '../../components/Store/Item';

// DATA
import * as UserData from '../../database/User';


export default function Profile({ navigation }) {
    const { colors } = useTheme();

    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const ORDER_CARD_WIDTH =  windowWidth * 0.7;

    //=====================================================================================================================
    //==  GET CURRENT USER ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        async function _getCurrentUser() {
            let currentUser = await currentUserData()
            setCurrentUser(currentUser)
            return
        }
        return _getCurrentUser()
    }, [])

    //=====================================================================================================================
    //==  STATISTICS ==
    //=====================================================================================================================
    const [paymentData, setPaymentData] = useState([]);
    const [spending, setSpending] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    useEffect(() => {
        async function _getSpendingData() {
            let payment_data = await UserData.getPaymentHistory();
            setPaymentData(payment_data);

            // calculate spending
            let total_spending = await _calculateSpending(payment_data);
            setSpending(total_spending)

            let orders = await _calculateOrders(payment_data);
            setTotalOrders(orders)
        }
        return _getSpendingData()
    }, [])

    const _calculateSpending = (payment_data) => {
        let amount_arr = payment_data.map((payment) => payment.amount.total);
        let total_spending = amount_arr.reduce((a, b) => a + b, 0);
        return total_spending;
    }

    const _calculateOrders = (paymentData) => {
        return paymentData.length
    }

    const _goToPaymentHistory = () => {
        navigation.navigate('PaymentHistory', { data: paymentData })
    }

    //=====================================================================================================================
    //==  NAVIGATION ==
    //=====================================================================================================================
    const goToSettings = () => {
        navigation.navigate('Settings')
    }

    //=====================================================================================================================
    //==  ORDERS ==
    //=====================================================================================================================
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        async function _getOrders() {
            let orders_data = await UserData.getPurchasedItems();
            setOrders(orders_data)
        }
        return _getOrders()
    }, [])

    const renderOrderItems = (order, index) => (
        <OrderItem
            order={order}
            index={index}
        />
    )

    const renderOrdersOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <Text>You have not order any items. Order now!</Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                <Text style={{ color: '#fff' }}>Explore</Text>
            </TouchableOpacity>
        </View>
    )

    //=====================================================================================================================
    //==  GET CART ITEMS ==
    //=====================================================================================================================
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        async function _getCartItems() {
            let cart_items = await UserData.getCartItems();
            setCartItems(cart_items)
        }
        return _getCartItems()
    }, [])

    const renderCartItems = (cart, index) => (
        <CartItem
            cart={cart}
            index={index}
        />
    )

    const renderCartOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <Text>No items in cart. Add one now!</Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                <Text style={{ color: '#fff' }}>Explore</Text>
            </TouchableOpacity>
        </View>
    )


    //=====================================================================================================================
    //==  GET FAVOURITES==
    //=====================================================================================================================
    const [favourites, setFavourites] = useState([]);
    useEffect(() => {
        async function _getFavourites() {
            let favourites_all = await UserData.getFavouriteProducts();
            setFavourites(favourites_all)
        }
        return _getFavourites()
    }, [])

    const renderFavouriteItems = (product) => (
        <Item
            item={product}
            navigation={navigation}
        />
    )

    const renderFavouritesOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <Text>No favourite items. Add one now!</Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                <Text style={{ color: '#fff' }}>Explore</Text>
            </TouchableOpacity>
        </View>
    )


    //=====================================================================================================================
    //==  RENDER DISPLAY ==
    //=====================================================================================================================
    if(!currentUser) {
        return(<></>)
    }

    return (
        <View style={defaultStyles.container}>
            <View style={[styles.profileCard, styles.shadow]}>
                <TouchableOpacity style={styles.flushRightContainer} onPress={goToSettings}>
                    <Icon color='#A9A9A9' name='settings-outline' size={30}/>
                </TouchableOpacity>
                {/* <Image 
                    style={styles.image}
                    source={{ uri: currentUser.avatar}}
                /> */}
                <UserAvatar size={80} name={currentUser.username}/>
                <Text style={styles.profileName}>{currentUser.username}</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100, }}>
                {/** STATISTICS */}
                <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
                    <View style={{ marginHorizontal: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontSize: 14, color: 'black', opacity: 0.4, flex: 1, }}>This Month</Text>
                        <TouchableOpacity style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 30, backgroundColor: colors.primary, height: 20, }} onPress={_goToPaymentHistory}>
                            <Text style={{ fontSize: 11, color: 'white', opacity: 0.9, }}>History</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 22, color: 'black', opacity: 0.8, marginRight: 5, }}>$</Text>
                                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{spending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <Text style={{ color: 'black', opacity: 0.6, }}>received</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{totalOrders.toString()}</Text>
                            <Text style={{ color: 'black', opacity: 0.6, }}>orders fulfilled</Text>
                        </View>
                    </View>
                </View>
                
                <View style={{ flex: 1, marginHorizontal: 20, marginBottom: 35, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
                    <View style={{ marginHorizontal: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontSize: 14, color: 'black', opacity: 0.4, flex: 1, }}>This Month</Text>
                        <TouchableOpacity style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 30, backgroundColor: colors.primary, height: 20, }} onPress={_goToPaymentHistory}>
                            <Text style={{ fontSize: 11, color: 'white', opacity: 0.9, }}>History</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 22, color: 'black', opacity: 0.8, marginRight: 5, }}>$</Text>
                                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{spending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <Text style={{ color: 'black', opacity: 0.6, }}>pending</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{totalOrders.toString()}</Text>
                            <Text style={{ color: 'black', opacity: 0.6, }}>orders pending</Text>
                        </View>
                    </View>
                </View>

                <ItemHorizontalSlider
                    header='Your Orders'
                    data={orders}
                    renderItems={renderOrderItems}
                    renderIfEmpty={renderOrdersOnEmpty}
                />

                <ItemHorizontalSlider
                    header='Your Recent Engagement'
                    data={favourites}
                    renderItems={renderFavouriteItems}
                    onPressViewAll={() => navigation.navigate('Favourites', { data: favourites })}
                    style={{ marginTop: 30, }}
                    renderIfEmpty={renderFavouritesOnEmpty}
                />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    flushRightContainer: { 
        flexDirection: 'row-reverse', 
        width: '100%' 
    },
    image: { 
        width: 100, 
        height: 100, 
        backgroundColor: '#ccc', 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 100 
    },
    text: { 
        marginTop: 50 
    },
    avatar: { 
        marginTop: 10 
    },
    profileCard: {
        padding: 20,
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    profileName: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    button: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
        marginHorizontal: 5,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#A9A9A9'
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
    primaryBtn: { 
        padding: 10, 
        margin: 5, 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: '#ccc', 
    },
});