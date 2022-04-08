// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator,
    ScrollView,
    Dimensions
} from 'react-native';

// DESIGN
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from '../../constants/defaultStyles';
import { useTheme } from 'react-native-paper';
import { currentUserData } from '../../database/User';
import UserAvatar from 'react-native-user-avatar';

// CUSTOM
import CollectionItem from '../../components/Project/CollectionItem';
import ActivityItem from '../../components/Project/ActivityItem';

// DATA
import * as ProjectData from '../../database/Project';
import firebase from 'firebase';
require('firebase/firestore');

export default function Profile({ navigation }) {
    const { colors } = useTheme();
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const [selection, setSelection] = useState(0);
    const [isChef, setIsChef] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
    //==  NAVIGATION ==
    //=====================================================================================================================
    const goToSettings = () => {
        navigation.navigate('Settings')
    }

    //=====================================================================================================================
    //==  GET UPCOMING DETAILS ==
    //=====================================================================================================================
    const [reservations, setReservations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [upcomingIsLoaded, setUpcomingIsLoaded] = useState(false);
    useEffect(() => {
        if(currentUser) {
            async function _getReservations() {
                firebase.firestore()
                    .collection('reservations')
                    .where('user_id', '==', currentUser._id)
                    .where('project.datetime', '>', new Date())
                    .onSnapshot(async (snapshot) => {
                        let reservations_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        setReservations(reservations_arr);
                        setUpcomingIsLoaded(true);
                    })
            }
            async function _getActivitiesByChef() {
                firebase.firestore()
                    .collection('projects')
                    .where('user._id', '==', currentUser._id)
                    .where('datetime', '>', new Date())
                    .onSnapshot(async (snapshot) => {
                        let projects_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        firebase.firestore()
                            .collection('reservations')
                            .where('user_id', '==', currentUser._id)
                            .where('project.datetime', '>', new Date())
                            .onSnapshot(async (snapshot) => {
                                let reservations_arr = await Promise.all(snapshot.docs.map(snap => {
                                    let _id = snap.id;
                                    let data = snap.data();
                                    return { ...data, _id }
                                }));
                                let activities_arr = await ProjectData._parseDetailedProjectData(projects_arr, reservations_arr);
                                setActivities(activities_arr);
                                setUpcomingIsLoaded(true);
                            });
                    })
            }
            async function _getAllUpcomingActivities() {
                firebase.firestore()
                    .collection('projects')
                    .where('datetime', '>', new Date())
                    .onSnapshot(async (snapshot) => {
                        let projects_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        let reservations_arr = await ProjectData.getAllUpcomingReservations();
                        let activities_arr = await ProjectData._parseDetailedProjectData(projects_arr, reservations_arr)
                        setActivities(activities_arr);
                        setUpcomingIsLoaded(true);
                    })
            }

            const is_chef = currentUser.type === 'chef';
            const is_beneficiary = currentUser.type === 'beneficiary';
            const is_admin = currentUser.type === 'admin';
            setIsChef(is_chef);
            setIsBeneficiary(is_beneficiary);
            setIsAdmin(is_admin);

            if(is_chef) {
                return _getActivitiesByChef()
            } else if(is_beneficiary) {
                return _getReservations()
            } else if(is_admin) {
                return _getAllUpcomingActivities()
            }
        }
    }, [currentUser])


    //=====================================================================================================================
    //==  GET HISTORICAL DATA ==
    //=====================================================================================================================
    const [reservationsHistory, setReservationsHistory] = useState([]);
    const [activitiesHistory, setActivitiesHistory] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if(currentUser) {
            async function _getReservations() {
                firebase.firestore()
                    .collection('reservations')
                    .where('user_id', '==', currentUser._id)
                    .where('project.datetime', '<=', new Date())
                    .onSnapshot(async (snapshot) => {
                        let reservations_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        setReservationsHistory(reservations_arr);
                        setIsLoaded(true);
                    })
            }
            async function _getActivitiesByChef() {
                firebase.firestore()
                    .collection('projects')
                    .where('user._id', '==', currentUser._id)
                    .where('datetime', '<=', new Date())
                    .onSnapshot(async (snapshot) => {
                        let projects_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        firebase.firestore()
                            .collection('reservations')
                            .where('user_id', '==', currentUser._id)
                            .where('project.datetime', '>', new Date())
                            .onSnapshot(async (snapshot) => {
                                let reservations_arr = await Promise.all(snapshot.docs.map(snap => {
                                    let _id = snap.id;
                                    let data = snap.data();
                                    return { ...data, _id }
                                }));
                                let activities_arr = await ProjectData._parseDetailedProjectData(projects_arr, reservations_arr);
                                setActivitiesHistory(activities_arr);
                                setIsLoaded(true);
                            });
                    })
            }
            async function _getAllUpcomingActivities() {
                firebase.firestore()
                    .collection('projects')
                    .where('datetime', '<=', new Date())
                    .onSnapshot(async (snapshot) => {
                        let projects_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));
                        let reservations_arr = await ProjectData.getAllUpcomingReservations();
                        let activities_arr = await ProjectData._parseDetailedProjectData(projects_arr, reservations_arr)
                        setActivitiesHistory(activities_arr);
                        setIsLoaded(true);
                    })
            }

            const is_chef = currentUser.type === 'chef';
            const is_beneficiary = currentUser.type === 'beneficiary';
            const is_admin = currentUser.type === 'admin';
            setIsChef(is_chef);
            setIsBeneficiary(is_beneficiary);
            setIsAdmin(is_admin);

            if(is_chef) {
                return _getActivitiesByChef()
            } else if(is_beneficiary) {
                return _getReservations()
            } else if(is_admin) {
                return _getAllUpcomingActivities()
            }
        }
    }, [upcomingIsLoaded])

    const RenderCollectionOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 10, }}>
            <Text>You have not made any reservation. Make one now!</Text>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                <Text style={{ color: '#fff' }}>Explore</Text>
            </TouchableOpacity>
        </View>
    )


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
        <View style={defaultStyles.container}>
            <View style={[styles.profileCard, styles.shadow]}>
                <TouchableOpacity style={styles.flushRightContainer} onPress={goToSettings}>
                    <Icon color='#A9A9A9' name='settings-outline' size={30}/>
                </TouchableOpacity>
                <UserAvatar size={80} name={currentUser.name}/>
                <Text style={styles.profileName}>{currentUser.name}</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100, }}>
                {/** STATISTICS */}
                <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                            {
                                isBeneficiary ? (
                                    reservations.length.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                ) : (
                                    activities.length.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                )
                            }
                            </Text>
                            <Text style={{ color: 'black', opacity: 0.6, }}>pending</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                            {
                                isBeneficiary ? (
                                    reservationsHistory.length.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                ) : (
                                    activitiesHistory.length.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                )
                            }
                            </Text>
                            <Text style={{ color: 'black', opacity: 0.6, }}>{isBeneficiary ? 'received' : 'completed'}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10, paddingHorizontal: 20, }}>
                    <TouchableOpacity style={[selection === 0 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(0)}>
                        <Text>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[selection === 1 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(1)}>
                        <Text>Past</Text>
                    </TouchableOpacity>
                </View>

                {
                    selection === 0 ? (
                        isBeneficiary ? (
                            reservations.length !== 0 ? (
                                reservations.map((reservation, i) => (
                                    <CollectionItem 
                                        key={i}
                                        data={reservation} 
                                        user_id={currentUser._id}
                                        navigation={navigation}
                                    />
                                ))
                            ) : (
                                <RenderCollectionOnEmpty />
                            )
                        ) : (
                            activities.length !== 0 ? (
                                activities.map((activity, i) => (
                                    <ActivityItem 
                                        key={i}
                                        data={activity} 
                                        user_id={currentUser._id}
                                        navigation={navigation}
                                    />
                                ))
                            ) : (
                                <RenderCollectionOnEmpty />
                            )
                        )
                    ) : (
                        isBeneficiary ? (
                            reservationsHistory.length !== 0 ? (
                                reservationsHistory.map((hist, i) => (
                                    <CollectionItem 
                                        key={i}
                                        data={hist} 
                                        user_id={currentUser._id}
                                        navigation={navigation}
                                    />
                                ))
                            ) : (
                                <RenderCollectionOnEmpty />
                            )
                        ) : (
                            activitiesHistory.length !== 0 ? (
                                activitiesHistory.map((hist, i) => (
                                    <ActivityItem 
                                        key={i}
                                        data={hist} 
                                        user_id={currentUser._id}
                                        navigation={navigation}
                                    />
                                ))
                            ) : (
                                <RenderCollectionOnEmpty />
                            )
                        )
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