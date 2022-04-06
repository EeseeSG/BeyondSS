// ESSENTIALS
import React, { useRef, useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    Image, 
    ScrollView, 
    FlatList,
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
import moment from 'moment';

const carousel_data = [
    {
        title: 'Wok Hey Delights',
        image: require('../../assets/sample/food_banner_example/chinese-wok.jpg'),
    },
    {
        title: 'Indian Delights',
        image: require('../../assets/sample/food_banner_example/indian-food.jpg'),
    },
    {
        title: 'Weekend Brunch Special',
        image: require('../../assets/sample/food_banner_example/western.jpg'),
    }
]

const news = [
    {
        id: 1,
        title: 'Another Week Beyond - 2213',
        date: 1648862568*1000,
        desc: 'Dear friends, On Sunday evening at 8 pm, a colleague received a text from a mother of 3, I will refer to as Donna. Donna wrote that she was in pain, feeling extremely anxious and frightened. She was texting from the hospital and requested for my colleague to meet her there. A few minutes later, a nurse from the hospital called …',
        url: 'https://www.beyond.org.sg/another-week-beyond-2213/',
    },
    {
        id: 2,
        title: 'Another Week Beyond - 2212',
        date: 1648171368*1000,
        desc: 'Dear friends, This week’s sharing is co-written with Felice, an intern who was moved to pen down her experience after helping with a recent conversation among mothers on the theme of “Health and Dreams”.  Felice was struck by the genuine care and concern people accorded each other even though they did not really know each other well and importantly, how people …',
        url: 'https://www.beyond.org.sg/another-week-beyond-2212/',
    },
    {
        id: 3,
        title: 'Another Week Beyond - 2211',
        date: 1647566568*1000,
        desc: 'Dear friends, “We are here to create a safe and brave space. What do you think that is?” This was how we began our very first session for 4 youth to explore if they would like to nurture a small community where members help each other learn strategies for psychological and emotional wellbeing.  A safe space is one where people feel …',
        url: 'https://www.beyond.org.sg/another-week-beyond-2213/',
    },
]

const partners = [
    {
        id: 1,
        img: require('../../assets/partners/FourJs.jpg'),
        url: 'https://4js.com/',
    },
    {
        id: 2,
        img: require('../../assets/partners/kuehne-nagel1.jpg'),
        url: 'https://home.kuehne-nagel.com/',
    },
    {
        id: 3,
        img: require('../../assets/partners/logoVistalegre_empresa.png'),
        url: 'https://www.vistalegre.com/',
    },
    {
        id: 4,
        img: require('../../assets/partners/nuevo_logo_alhambra_color_web-300x85.png'),
        url: 'https://www.alhambrait.com/',
    },
    {
        id: 5,
        img: require('../../assets/partners/ucalsa.jpg'),
        url: 'https://www.ucalsa.com/',
    },
]

const in_need_fed = 1000;
const orders_fulfilled = 100000;


export default function Home({ navigation }) {
    const { colors } = useTheme();
    const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

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
    //==  GET ADV BANNER ==
    //=====================================================================================================================
    const carousel = useRef(null);

    const renderBanner = (data) => (
        <View>
            <Image 
                source={data.image}
                style={{ height: 150, width: 300, borderRadius: 10 }}
            />
        </View>
    )


    //=====================================================================================================================
    //==  GET PROJECT DETAILS ==
    //=====================================================================================================================

    // useEffect(() => {
    //     async function _getProducts() {
    //         // TEMP
    //         let products = await ProductData.getAllProductData();
    //         let popular_item = products.slice(0,4);
    //         let offer_item = products.slice(4,7);
    //         let sold_item = products.slice(7, products.length);

    //         setPopularItem(popular_item);
    //         setOfferItem(offer_item);
    //         setSoldItem(sold_item);
    //     }
    //     return _getProducts()
    // }, [])

    //=====================================================================================================================
    //==  HANDLE EXTERNAL LINKS ==
    //=====================================================================================================================

    const _handlePressButtonAsync = async (url) => {
        await WebBrowser.openBrowserAsync(url);
    };

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
                    {/* <Image 
                        style={{ width: 40, height: 40, borderRadius: 40, borderWidth: 0.5, borderColor: '#ccc', }}
                        source={{ uri: currentUser.avatar }}
                    /> */}
                    <Text style={[styles.greetings, { color: colors.primary, marginBottom: 5, }]}>
                        {"  "}Hi {currentUser.username} 
                    </Text>
                </View>
                <Text style={[styles.title, { marginBottom: 10, }]}>What are your cravings?</Text>
            </View>

            <View>
                <Carousel
                    ref={carousel}
                    data={carousel_data}
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


            <View style={{ marginTop: 50, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopStartRadius: 60, borderBottomEndRadius: 60, borderTopEndRadius: 25, borderBottomStartRadius: 25, }}>
                <Image
                    source={require('../../assets/home_chef_transparent.png')}
                    style={{ width: windowWidth * 0.55, height: windowWidth * 0.45, marginTop: -20 }}
                    resizeMode='cover'
                />
                <TouchableOpacity style={styles.swipeBtn} onPress={() => navigation.navigate('Explore')}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>Start Giving!</Text>
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
                            <Text style={{ color: 'rgba(0,0,0,0.6)', fontStyle: 'italic'}} selectable>{moment(item.date).format('LL')}</Text>
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