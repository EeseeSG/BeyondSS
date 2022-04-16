// ESSENTIALS
import React, { useRef, useState, useEffect, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    FlatList,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Popup } from 'react-native-popup-confirm-toast';

// DESIGN
import { defaultStyles } from '../../constants/defaultStyles';
import { Colors, useTheme } from 'react-native-paper';
import UserAvatar from 'react-native-user-avatar';

// DISPLAY
import Carousel from 'react-native-snap-carousel';
import PartnerCarousel from '../../components/Project/PartnerCarousel';

// DATA
import * as UserData from '../../database/User';
import * as IndexData from '../../database/Index';
import * as ProjectData from '../../database/Project';
import moment from 'moment';

// DATABASE
import firebase from 'firebase';
require('firebase/firestore');

// COMPONENTS
import ProjectItem from '../../components/Project/ProjectItem';
import Card from '../../components/Container/Card';
import Section from '../../components/Container/Section';

// AUTH PROVIDER
import { AuthContext } from '../../navigation/AuthProvider';

// NOTIFICATIONS
import * as Notifications from 'expo-notifications';

export default function Home({ navigation }) {
    const { colors } = useTheme();
    const { logout } = useContext(AuthContext);
    const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');
    const [isChef, setIsChef] = useState(false);
    const [isBeneficiary, setIsBeneficiary] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    //=====================================================================================================================
    //==  PUSH NOTIFICATION ==
    //=====================================================================================================================
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(() => {
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
            let data = response.notification.request.content.data;
            let ref = data.ref;
            let type = data.type;

            if(type === 'project') {
                // grab project data by ref
                var project = await ProjectData.getProjectByID(ref);
                var project_arr = [project];
            } else if(type === 'new') {
                // grab project data by ref
                var project_arr = await ProjectData.getProjectByRef(ref);
            }
            let reservations_arr = await ProjectData.getReservationsByID(project_arr[0]._id);
            let project_data = await ProjectData._parseDetailedProjectData(project_arr, reservations_arr);
            navigation.navigate('ProjectDetail', { data: project_data[0] })
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    //=====================================================================================================================
    //==  GET CURRENT USER ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        async function _getCurrentUser() {
            let currentUser = await UserData.currentUserData();
            setCurrentUser(currentUser);
            return
        }
        return _getCurrentUser()
    }, [])

    //=====================================================================================================================
    //==  GET MISC DATA ==
    //=====================================================================================================================
    const [news, setNews] = useState([]);
    useEffect(() => {
        async function _getNews() {
            let news_arr = await IndexData.getNewsData()
            setNews(news_arr)
            return;
        }
        return _getNews();
    }, [])

    const [partners, setPartners] = useState([]);
    useEffect(() => {
        async function _getPartners() {
            let partner_arr = await IndexData.getPartnerData()
            setPartners(partner_arr)
            return;
        }
        return _getPartners();
    }, [])

    const [banners, setBanners] = useState([]);
    useEffect(() => {
        async function _getBanners() {
            let banner_arr = await IndexData.getBannerData()
            setBanners(banner_arr)
            return;
        }
        return _getBanners();
    }, [])

    //=====================================================================================================================
    //==  GET EVENT DETAILS ==
    //=====================================================================================================================
    const [reservations, setReservations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [eventisLoaded, setEventIsLoaded] = useState(false);
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
                        let parsed_reservations_arr = reservations_arr.map((reservation) => {
                            return ({
                                ...reservation.project,
                                reserved: reservation.reserved,
                                reservation_data: [
                                    {
                                        user: reservation.user,
                                        reserved: reservation.reserved
                                    }
                                ],
                            })
                        });
                        setReservations(parsed_reservations_arr);
                        setEventIsLoaded(true);
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
                                setEventIsLoaded(true);
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
                        setEventIsLoaded(true);
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
    //==  GET STATISTICS ==
    //=====================================================================================================================
    const [chefs, setChefs] = useState(0);
    const [beneficiary, setBeneficiary] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if(eventisLoaded) {
            async function _getAllUserData() {
                let arr = await IndexData.getAllUserData();
                let num_chef = arr.filter((i) => i.type === 'chef').length;
                let num_beneficiary = arr.filter((i) => i.type === 'beneficiary').length;
                setChefs(num_chef);
                setBeneficiary(num_beneficiary);
                setIsLoaded(true);
            }
            return _getAllUserData()
        }
    }, [eventisLoaded])

    //=====================================================================================================================
    //==  GET ADV BANNER ==
    //=====================================================================================================================
    const carousel = useRef(null);
    const renderBanner = (data) => (
        <View>
            <Image 
                source={{ uri: data.image }}
                style={{ height: 150, width: 300, borderRadius: 10 }}
            />
        </View>
    )

    //=====================================================================================================================
    //==  HANDLE EXTERNAL LINKS ==
    //=====================================================================================================================
    const _handlePressButtonAsync = async (url) => {
        await WebBrowser.openBrowserAsync(url);
    };


    //=====================================================================================================================
    //==  HANDLE UPCOMING ==
    //=====================================================================================================================
    const renderProjectItem = ({ item }) => {
        return (
            <ProjectItem 
                data={item} 
                user_id={currentUser._id}
                navigation={navigation}
                style={{ width: windowWidth - 20 }}
            />
        )
    }

    const handleCTA = () => {
        if(isAdmin) {
            navigation.navigate('Dashboard')
        } else if(isChef) {
            navigation.navigate('Start Giving')
        } else if(isBeneficiary) {
            navigation.navigate('Explore')
        } else {
            Popup.show({
                type: 'danger',
                title: 'Invalid quantity',
                textBody: 'The quantity you selected is more than that of what is currently left available. Please lower the quantity and try again.',
                buttonText: 'Close',
                callback: () => {
                    Popup.hide();
                    logout();
                }
            })
        }
    }

    const RenderCollectionOnEmpty = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 10, }}>
            <Text>You have not made any reservation. Make one now!</Text>
            <TouchableOpacity style={[defaultStyles.buttonPrimary, defaultStyles.shadow, { backgroundColor: colors.primary, margin: 20, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
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
        <ScrollView style={defaultStyles.container} contentContainerStyle={{ paddingBottom: 90, paddingTop: 10, }}>
            <View style={{ marginHorizontal: 20, marginTop: 40, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }}>
                    <UserAvatar name={currentUser.name} />
                    <Text style={[defaultStyles.h1, { color: colors.primary, }]}>
                        {"  "}Hi {currentUser.name} 
                    </Text>
                </View>
                <Text style={defaultStyles.h2}>
                    {
                        isChef ? (
                            'How would you like to help?'
                        ) : (
                            isAdmin ? (
                                'Manage users'
                            ) : (
                                'How can we help?'
                            )
                        )
                    }
                    </Text>
            </View>

            <View style={[defaultStyles.shadow, { marginTop: 50, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 60, borderBottomEndRadius: 60, borderTopEndRadius: 25, borderBottomStartRadius: 25, marginHorizontal: 10, }]}>
                <Image
                    source={require('../../assets/home_chef_transparent.png')}
                    style={{ width: windowWidth * 0.55, height: windowWidth * 0.45, marginTop: -20 }}
                    resizeMode='cover'
                />
                <View>
                    <TouchableOpacity style={styles.swipeBtn} onPress={handleCTA}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>
                            {isChef ? 
                            'Start Giving!' : 
                            isAdmin ? 
                            'Dashboard' :
                            isBeneficiary ?
                            'Explore!' :
                            'ERROR'}
                        </Text>
                    </TouchableOpacity>
                    {
                        isAdmin && (
                            <TouchableOpacity style={styles.swipeBtn} onPress={() => navigation.navigate('Approve Receipt')}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>Approve Receipts</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>

            <Carousel
                ref={carousel}
                data={banners}
                renderItem={({ item }) => renderBanner(item)}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
                slideStyle={{ marginVertical: 30, }}
                loop={true}
                enableSnap={true}
                autoplay={true}
                autoplayInterval={5000}
            />

            <Section>
                <Card>
                    <View style={{ marginHorizontal: 15, }}>
                        <Text style={defaultStyles.textLight}>Hosting</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                            <Text style={defaultStyles.subtitle} numberOfLines={1}>{beneficiary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            <Text style={defaultStyles.text} numberOfLines={1}>beneficiaries</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={defaultStyles.subtitle} numberOfLines={1}>{chefs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            <Text style={defaultStyles.text} numberOfLines={1}>volunteers</Text>
                        </View>
                    </View>
                </Card>
            </Section>

            <Section>
                <Text style={defaultStyles.h3}>Your {isBeneficiary ? 'collections' : 'activities'} ({isBeneficiary ? reservations.length.toString() : activities.length.toString()})</Text>
                {
                    (isChef || isAdmin) ? (
                        activities.length ? (
                            <FlatList
                                horizontal
                                keyExtractor={(_, index) => index.toString()}
                                data={activities}
                                renderItem={renderProjectItem}
                            />
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingTop: 20,}}>
                                <Text>{isChef ? 'You have not made any activities. Start one now!' : 'There are no activities.'}</Text>
                            </View>
                        )
                    ) : (
                        reservations.length ? (
                            <FlatList
                                horizontal
                                keyExtractor={(_, index) => index.toString()}
                                data={reservations}
                                renderItem={renderProjectItem}
                                ListEmptyComponent={RenderCollectionOnEmpty}
                            />
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingTop: 20,}}>
                                <Text>You have not made any reservation. Make one now!</Text>
                            </View>
                        )
                    )
                }
            </Section>

            <Section style={{ margin: 0, marginHorizontal: 0, marginLeft: 10, }}>
                <Text style={defaultStyles.h3}>Partners</Text>
                <Card style={[ defaultStyles.noBorderRadius, defaultStyles.noMargin, { backgroundColor: '#fff', borderBottomStartRadius: 10, borderTopStartRadius: 10, marginLeft: 10, marginTop: 10, }]}>
                    <PartnerCarousel
                        data={partners}
                    />
                </Card>
            </Section>

            <Section>
                <Text style={defaultStyles.h3}>Latest News</Text>
                {
                    news.map((item, index) => (
                        <Card 
                            key={index} 
                            style={[{ paddingHorizontal: 10, }]} 
                            isPressable 
                            onPress={() => _handlePressButtonAsync(item.url)}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                                <Text style={defaultStyles.h4} selectable>{item.title}</Text>
                                <Text style={defaultStyles.small} selectable>{moment(item.date.seconds * 1000).format('LL')}</Text>
                            </View>
                            <Text style={defaultStyles.textLight} numberOfLines={3} selectable>{item.desc}</Text>
                            <Text style={[defaultStyles.small, { alignSelf: 'flex-end', margin: 5, color: colors.dark }]}>Read More...</Text>
                        </Card>
                    ))
                }
            </Section>

            <TouchableOpacity style={{ margin: 10, justifyContent: 'center', alignItems: 'flex-end' }} onPress={() => _handlePressButtonAsync('https://www.beyond.org.sg/')}>
                <Text style={[defaultStyles.small, { alignSelf: 'flex-end', marginHorizontal: 5, color: colors.dark }]}>View more...</Text>
            </TouchableOpacity>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    greetings: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    header: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 18,
        textTransform: 'capitalize',
        fontWeight: 'bold',
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
    cartBtn: { 
        backgroundColor: '#fff', 
        width: 40, 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 60,
    },
    swipeBtn: { 
        backgroundColor: 'rgba(0,0,0,0.4)', 
        paddingHorizontal: 10, 
        paddingVertical: 3, 
        borderRadius: 50, 
        height: 40,
        justifyContent: 'center', 
        alignItems: 'center',
        margin: 15, 
        minWidth: 120,
    },
})