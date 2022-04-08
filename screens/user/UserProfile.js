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
import ItemHorizontalSlider from '../../components/Project/ItemHorizontalSlider';

const DATA = [
    {
        id: 1,
        store: {
            _id: 's1',
            name: 'Store 1',
            image: 'https://i.imgur.com/WYCjkQz.jpg',
        },
        orderDate: moment('2021-12-22'),
        duration: 3,
        arrivalDate: moment('2021-12-25'),
        item: {
            id: 5,
            text: 'Thai Green Curry',
            price: 30,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M.',
            sizes: [
                {
                    size: 'Small',
                    price: 30,
                },
                {
                    size: 'Medium',
                    price: 55,
                },
                {
                    size: 'Large',
                    price: 70,
                },
                {
                    size: 'Larger',
                    price: 100,
                },
            ],
            attributes: [
                'Halal',
                'Best Value',
                'Exclusive'
            ],
            image: require('../../assets/sample/food_item_example/green-curry-bowl-spices-wooden-table.jpg'),
        },
    },
    {
        id: 2,
        store: {
            _id: 's1',
            name: 'Store 1',
            image: 'https://i.imgur.com/WYCjkQz.jpg',
        },
        orderDate: moment('2021-12-21'),
        duration: 3,
        arrivalDate: moment('2021-12-27'),
        item: {
            id: 4,
            text: 'Mung Bean with Egg Yolk',
            price: 30,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque haec coniunctio confusioque virtutum tamen a philosophis ratione quadam distinguitur. Duo Reges: constructio interrete. Ac tamen hic mallet non dolere. Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? At hoc in eo M.',
            sizes: [
                {
                    size: 'Small',
                    price: 30,
                },
                {
                    size: 'Medium',
                    price: 55,
                },
                {
                    size: 'Large',
                    price: 70,
                },
                {
                    size: 'Larger',
                    price: 100,
                },
            ],
            attributes: [
                'Halal',
                'Best Value',
                'Exclusive'
            ],
            image: require('../../assets/sample/food_item_example/chinese-pastry-mung-bean-with-egg-yolk.jpg'),
        },
    }
]


export default function UserProfile({ navigation }) {
    const { colors } = useTheme();
    const [spending, setSpending] = useState(1000);
    const [totalOrders, setTotalOrders] = useState(28);
    const [orders, setOrders] = useState(DATA);
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


    const goToSettings = () => {
        navigation.navigate('Settings')
    }

    const renderOrderItems = (order, index) => (
        <View key={index} style={{ backgroundColor: '#fff', marginRight: 20, width: ORDER_CARD_WIDTH, borderRadius: 10, borderColor: '#ccc', borderWidth: 0.5, }}>
            <View style={{ flexDirection: 'row', margin: 10, flex: 1, }}>
                <Image
                    style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: '#A9A9A9' }}
                    source={order.item.image}
                />
                <View style={{ marginLeft: 10, flex: 1, }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }} numberOfLines={1}>{order.item.text}</Text>
                    <Text style={{ fontSize: 12, }} numberOfLines={3}>{order.item.description}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark, borderBottomEndRadius: 10, borderBottomStartRadius: 10, paddingVertical: 5, paddingHorizontal: 10,}}>
                <Icon color='#fff' name='timer-outline' size={20}/>
                <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5,}}>{moment(order.arrivalDate).format('LL')} {moment(order.arrivalDate).fromNow()}</Text>
            </View>
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
                <UserAvatar size={100} name={currentUser.username}/>
                <Text style={styles.profileName}>{currentUser.username}</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={[styles.actionButton, styles.shadow]}>
                        <Icon color='#A9A9A9' name='person-add-outline' size={20}/>
                        <Text style={[styles.textSign, {color:'#A9A9A9', marginLeft: 5,}]}>Follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.shadow]}>
                        <Icon color='#A9A9A9' name='md-chatbubbles-outline' size={20}/>
                        <Text style={[styles.textSign, {color:'#A9A9A9', marginLeft: 5,}]}>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {/** STATISTICS */}
                <View style={{ flex: 1, margin: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
                    <View style={{ marginHorizontal: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontSize: 14, color: 'black', opacity: 0.4, flex: 1, }}>This Month</Text>
                        <TouchableOpacity style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 30, backgroundColor: colors.primary, height: 20, }}>
                            <Text style={{ fontSize: 11, color: 'white', opacity: 0.9, }}>History</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 22, color: 'black', opacity: 0.8, marginRight: 5, }}>$</Text>
                                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{spending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <Text style={{ color: 'black', opacity: 0.6, }}>spent</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{totalOrders.toString()}</Text>
                            <Text style={{ color: 'black', opacity: 0.6, }}>orders</Text>
                        </View>
                    </View>
                </View>
              
                <ItemHorizontalSlider
                    header='Your Orders'
                    data={orders}
                    renderItems={renderOrderItems}
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
    }
});