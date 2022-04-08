// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
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
import CollectionItem from '../../components/Project/CollectionItem';

// DATA
import * as UserData from '../../database/User';
import * as ProjectData from '../../database/Project';


export default function Profile({ navigation }) {
    const { colors } = useTheme();
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const [selection, setSelection] = useState(0);

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


    //=====================================================================================================================
    //==  NAVIGATION ==
    //=====================================================================================================================
    const goToSettings = () => {
        navigation.navigate('Settings')
    }

    //=====================================================================================================================
    //==  RESERVATIONS ==
    //=====================================================================================================================
    const [reservations, setReservations] = useState([]);
    useEffect(() => {
        if(currentUser) {
            async function _getCollections() {
                let reservation_data = await ProjectData.getUserUpcomingReservations(currentUser._id);
                setReservations(reservation_data)
            }
            return _getCollections()
        }
    }, [currentUser])

    const renderCollectionOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <Text>You have not made any reservation. Make one now!</Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                <Text style={{ color: '#fff' }}>Explore</Text>
            </TouchableOpacity>
        </View>
    )


    //=====================================================================================================================
    //==  GET HISTORY==
    //=====================================================================================================================
    const [history, setHistory] = useState([]);
    useEffect(() => {
        async function _getHistory() {
            let historical_data = await ProjectData.getUserPastReservations(currentUser._id);
            setHistory(historical_data)
        }
        return _getHistory()
    }, [])


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
                <UserAvatar size={80} name={currentUser.username}/>
                <Text style={styles.profileName}>{currentUser.username}</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100, }}>
                {/** STATISTICS */}
                <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
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

                <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, paddingHorizontal: 20, }}>
                    <TouchableOpacity style={[selection === 0 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(0)}>
                        <Text style={{ }}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[selection === 1 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(1)}>
                        <Text>Past</Text>
                    </TouchableOpacity>
                </View>

                {
                    selection === 0 ? (
                        reservations.map((reservation) => (
                            <CollectionItem 
                                data={reservation} 
                                user_id={currentUser._id}
                                navigation={navigation}
                            />
                        ))
                    ) : (
                        history.map((hist) => (
                            <CollectionItem 
                                data={hist} 
                                user_id={currentUser._id}
                                navigation={navigation}
                            />
                        ))
                    )
                }

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