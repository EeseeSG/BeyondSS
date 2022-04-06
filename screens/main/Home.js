// ESSENTIALS
import React, { useRef, useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    Dimensions, 
    Image, 
    ScrollView, 
} from 'react-native';

// DESIGN
import { defaultStyles } from '../../constants/defaultStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import UserAvatar from 'react-native-user-avatar';

// DISPLAY
import StickyItemFlatList from '@gorhom/sticky-item';
import StoryBlock from '../../components/Stories/StoryBlock';
import FacebookStickyStory from '../../components/Stories/StickyStories';
import Carousel from 'react-native-snap-carousel';
import ItemCarousel from '../../components/Store/ItemCarousel';
import CategoryCarousel from '../../components/Store/CategoryCarousel';

// DATA
import { currentUserData } from '../../database/User';
import * as ProductData from '../../database/Product';


// dummy data
const data = [...Array(20)]
.fill(0)
.map((_, index) => ({ id: `item-${index}` }));

// configs
export const STORY_WIDTH = 90;
export const STORY_HEIGHT = 150;
const STICKY_ITEM_WIDTH = 34;
const STICKY_ITEM_HEIGHT = 34;
const SEPARATOR_SIZE = 8;
const BORDER_RADIUS = 10;

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

const categories = [
    {
        id: 1,
        category: 'Burger',
        image: require('../../assets/sample/categories/burger.png'),
    },
    {
        id: 2,
        category: 'Cake',
        image: require('../../assets/sample/categories/cake.png'),
    },
    {
        id: 3,
        category: 'Dessert',
        image: require('../../assets/sample/categories/dessert.png'),
    },
    {
        id: 4,
        category: 'Noodle',
        image: require('../../assets/sample/categories/noodles.png'),
    },    
    {
        id: 5,
        category: 'Rice',
        image: require('../../assets/sample/categories/rice-bowl.png'),
    }
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
    //==  GET PRODUCT DETAILS ==
    //=====================================================================================================================
    const [popularItem, setPopularItem] = useState([]);
    const [offerItem, setOfferItem] = useState([]);
    const [soldItem, setSoldItem] = useState([]);

    useEffect(() => {
        async function _getProducts() {
            // TEMP
            let products = await ProductData.getAllProductData();
            let popular_item = products.slice(0,4);
            let offer_item = products.slice(4,7);
            let sold_item = products.slice(7, products.length);

            setPopularItem(popular_item);
            setOfferItem(offer_item);
            setSoldItem(sold_item);
        }
        return _getProducts()
    }, [])



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
            <CategoryCarousel
                data={categories}
            />

            <Text style={styles.header}>Latest News</Text>
            <ItemCarousel
                data={popularItem}
                navigation={navigation}
            />

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