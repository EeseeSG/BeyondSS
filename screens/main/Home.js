// ESSENTIALS
import React, { useRef, useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    FlatList,
    ScrollView, 
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// DESIGN
import { defaultStyles } from '../../constants/defaultStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import UserAvatar from 'react-native-user-avatar';

// DISPLAY
import Carousel from 'react-native-snap-carousel';
import PartnerCarousel from '../../components/Store/PartnerCarousel';

// DATA
import { currentUserData } from '../../database/User';
import { getPartnerData, getNewsData, getBannerData } from '../../database/Index';
import * as ProjectData from '../../database/Project';
import moment from 'moment';

// DATABASE
import firebase from 'firebase';
require('firebase/firestore');

// COMPONENTS
import ProjectItem from '../../components/Project/ProjectItem';

const in_need_fed = 1000;
const orders_fulfilled = 100000;


export default function Home({ navigation }) {
    const { colors } = useTheme();
    const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

    //=====================================================================================================================
    //==  GET DATA ==
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

    const [news, setNews] = useState([]);
    useEffect(() => {
        async function _getNews() {
            let news_arr = await getNewsData()
            setNews(news_arr)
            return;
        }
        return _getNews();
    }, [])

    const [partners, setPartners] = useState([]);
    useEffect(() => {
        async function _getPartners() {
            let partner_arr = await getPartnerData()
            setPartners(partner_arr)
            return;
        }
        return _getPartners();
    }, [])

    const [banners, setBanners] = useState([]);
    useEffect(() => {
        async function _getBanners() {
            let banner_arr = await getBannerData()
            setBanners(banner_arr)
            return;
        }
        return _getBanners();
    }, [])

    const [reservations, setReservations] = useState([]);
    useEffect(() => {
        if(currentUser) {
            async function _getReservations() {
                firebase.firestore()
                    .collection('reservations')
                    .where('user_id', '==', currentUser._id)
                    .where('project.datetime', '>', new Date())
                    .onSnapshot(async (snapshot) => {
                        let project_arr = await Promise.all(snapshot.docs.map((snap) => {
                            let _id = snap.id;
                            let data = snap.data();
                            return { ...data, _id }
                        }));

                        let reservations_arr = await ProjectData.getUserUpcomingReservations(currentUser._id);
                        let parsedArr = await ProjectData._parseDetailedProjectData(project_arr, reservations_arr)
                        setReservations(parsedArr);
                    })
            }
            return _getReservations()
        }
    }, [currentUser])

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
    const renderItem = ({ item }) => {
        return (
            <ProjectItem 
                data={item.project} 
                user_id={currentUser._id}
                navigation={navigation}
                style={{ width: windowWidth - 20 }}
            />
        )
    }


    //=====================================================================================================================
    //==  RENDER DISPLAY ==
    //=====================================================================================================================
    if(!currentUser) {
        return(<></>)
    }

    return (
        <ScrollView style={defaultStyles.container} contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 10, paddingTop: 10, }}>
            <View style={{ marginTop: 5, marginBottom: 5, marginHorizontal: 5, flexDirection: 'row-reverse',}}>
                <TouchableOpacity style={[styles.cartBtn, styles.shadow]} onPress={() => navigation.navigate('Cart')}>
                    <MaterialCommunityIcons name="cart-outline" size={24} color={colors.dark}/>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 10, }}>
                <View style={{ flexDirection: 'row' }}>
                    <UserAvatar name={currentUser.username}/>
                    <Text style={[styles.greetings, { color: colors.primary, marginBottom: 5, }]}>
                        {"  "}Hi {currentUser.username} 
                    </Text>
                </View>
                <Text style={[styles.title, { marginBottom: 10, }]}>{currentUser.type === 'chef' ? 'How would you like to help?' : 'How can we help?'}</Text>
            </View>

            <View>
                <Carousel
                    ref={carousel}
                    data={banners}
                    renderItem={({ item }) => renderBanner(item)}
                    sliderWidth={Dimensions.get('window').width - 20}
                    itemWidth={300}
                    slideStyle={{ marginTop: 20, }}
                    loop={true}
                    enableSnap={true}
                    autoplay={true}
                    autoplayInterval={5000}
                />
            </View>

            <View style={{ flex: 1, marginHorizontal: 20, marginTop: 35, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc' }}>
                <View style={{ marginHorizontal: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontSize: 14, color: 'black', opacity: 0.4, flex: 1, }}>This Month</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 10, }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
                        <Text style={{ fontSize: 26, color: 'black', opacity: 0.8, fontWeight: 'bold' }}>{in_need_fed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text style={{ color: 'black', opacity: 0.6, }}>in-need fed</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{orders_fulfilled.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text style={{ color: 'black', opacity: 0.6, }}>orders fulfilled</Text>
                    </View>
                </View>
            </View>

            {
                reservations && (
                    <FlatList
                        horizontal
                        keyExtractor={(_, index) => index.toString()}
                        data={reservations}
                        renderItem={renderItem}
                    />
                )
                
            }

            <View style={{ marginTop: 50, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 60, borderBottomEndRadius: 60, borderTopEndRadius: 25, borderBottomStartRadius: 25, }}>
                <Image
                    source={require('../../assets/home_chef_transparent.png')}
                    style={{ width: windowWidth * 0.55, height: windowWidth * 0.45, marginTop: -20 }}
                    resizeMode='cover'
                />
                <TouchableOpacity style={styles.swipeBtn} onPress={() => navigation.navigate('Explore')}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>{currentUser.type === 'chef' ? 'Start Giving!' : 'Explore!'}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.header}>Partners</Text>
            <View style={{ backgroundColor: '#fff', borderRadius: 5, }}>
                <PartnerCarousel
                    data={partners}
                />
            </View>


            <Text style={styles.header}>Latest News</Text>
            {
                news.map((item, index) => (
                    <TouchableOpacity key={index} style={{ marginVertical: 10, marginHorizontal: 5, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 0.5, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' }} onPress={() => _handlePressButtonAsync(item.url)}>
                        <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, }} selectable>{item.title}</Text>
                            <Text style={{ color: 'rgba(0,0,0,0.6)', fontStyle: 'italic', fontSize: 12,}} selectable>{moment(item.date.seconds * 1000).format('LL')}</Text>
                        </View>
                        <Text style={{ fontSize: 12, }} selectable>{item.desc}</Text>
                        <Text style={{ flex: 1, alignSelf: 'flex-end', margin: 3, color: 'rgba(0,0,255,0.5)', fontSize: 12, fontWeight: 'bold' }}>Read More...</Text>
                    </TouchableOpacity>
                ))
            }


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
        backgroundColor: 'rgba(0,0,0,0.6)', 
        paddingHorizontal: 10, 
        paddingVertical: 3, 
        borderRadius: 50, 
        height: 40, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: 15, 
    },
})