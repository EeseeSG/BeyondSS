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

// DISPLAY
import QuantityPicker from '../../components/Store/QuantityPicker';
import ItemCarousel from '../../components/Store/ItemCarousel';
import ItemRating from '../../components/Store/ItemRating';
import ItemRatingBreakdown from '../../components/Store/ItemRatingBreakdown';
import ItemReview from '../../components/Store/ItemReview';
import StoreTags from '../../components/Store/StoreTags';

// DATA
import * as StoreData from '../../database/Store';
import * as UserData from '../../database/User';


const IMAGE_HEIGHT = 300;
const PHONE_OFFSET = Platform.OS === 'ios' ? 44 : 0;

export default function FoodItem(props) {
    const { navigation, route } = props;
    const { colors } = useTheme();
    const [isLoaded, setIsLoaded] = useState(false);

    const [data, setData] = useState(route.params.data);
    const image = data.image;
    const [selection, setSelection] = useState(0); // init with 0
    const [quantity, setQuantity] = useState(1);

    //=====================================================================================================================
    //== INITIATE ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        async function _init() {
            await _getCurrentUser()
            await _getStoreProduct()
            await _checkIfFavourite()
            await _getCurrentProductReviews()
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
    //==  CURRENT PRODUCTS ==
    //=====================================================================================================================
    const [isFavourite, setIsFavourite] = useState(false);
    useEffect(() => {
        return _checkIfFavourite()
    }, [data])

    async function _getStoreProduct() {
        let store_products = await StoreData.getProductDataByID(data._id);
        setData(store_products)
        return
    }

    async function _checkIfFavourite() {
        if(data.favourites === undefined) {
            // in event where there is no favourites yet
            setIsFavourite(false);
            return
        }
        if(data.favourites.indexOf(currentUser._id) !== -1) {
            setIsFavourite(true)
        } else {
            setIsFavourite(false)
        }
    }

    //=====================================================================================================================
    //==  CURRENT PRODUCT REVIEW ==
    //=====================================================================================================================
    const [ratings, setRatings] = useState([]);
    const [reviews, setReviews] = useState([]);
    async function _getCurrentProductReviews() {
        let ratings = [
            randomRating(5),
            randomRating(4),
            randomRating(3),
            randomRating(2),
            randomRating(1),
        ];
        setRatings(ratings);

        let reviews = ratings.map((r) => r.data).flat().slice(0, 5); // take first 5
        setReviews(reviews);
    }

    function randomRating(rating_grade) {
        return {
            rating: rating_grade,
            data: randomArray(rating_grade, 20)
        }
    }
    
    function randomArray(rating_grade, max) {
        let max_length = Math.round(Math.random() * max);
        let array = [];
        for(var i = 0; i < max_length; i++) {
            array.push({
                _id: Math.round(Math.random() * max),
                text: 'Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review',
                user: {
                    name: 'user_01',
                    avatar: 'https://firebasestorage.googleapis.com/v0/b/sg-eesee.appspot.com/o/default%2Fdefault_avatar.png?alt=media&token=928854a5-f4ec-4792-b4a9-ae2e671f3f15',
                },
                createdAt: new Date(),
                rating: rating_grade,
            })
        }
        return array
    }


    //=====================================================================================================================
    //==  OTHER PRODUCTS ==
    //=====================================================================================================================
    const [otherProducts, setOtherProducts] = useState([]);
    useEffect(() => {
        return _getStoreOtherProducts()
    }, [])

    async function _getStoreOtherProducts() {
        let store_products = await StoreData.getStoreProductDataByID(data.store_id);
        let other_products = store_products.filter((product) => product._id !== data._id);
        setOtherProducts(other_products)
    }

    //=====================================================================================================================
    //==  ADD TO CART ==
    //=====================================================================================================================
    const _addToCart = async () => {
        // check if it is available yet
        let avail = checkAvailability();
        if(!avail) return

        // post the data
        let delivery_date = new Date('2022-02-20'); // temp data
        let data_to_store = { 
            user_id: currentUser._id, 
            product_data: data, 
            order_data: {
                selection: {
                    index: selection,
                    item: data.sizes[selection],
                },
                quantity,
                item_price: data.price,
                total_price: (data.sizes[selection].price * quantity),
            },
            createdAt: new Date(),
            deliveryDate: delivery_date,
        };
        let result = await StoreData.setShoppingCart(data_to_store);
        if(result.success) {
            Popup.show({
                type: 'success',
                title: 'Success!',
                textBody: 'Item has been added into your shopping cart.',
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
        if(!data.limitedTime) {
            return null
        }
        if(data.limitedStart.seconds > moment().unix()) {
            return (
                <View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10, }}>Available soon!</Text>
                    <CountDown
                        until={data.limitedStart.seconds - moment().unix()}
                        onPress={checkAvailability}
                        size={20}
                    />
                </View>
            )
        }
        if(data.limitedTill.seconds > moment().unix()) {
            return (
                <View>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10, }}>Limited time only!</Text>
                    <CountDown
                        until={data.limitedTill.seconds - moment().unix()}
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
    //==  FAVOURITE ==
    //=====================================================================================================================
    const _handleFavourites = async () => {
        let product_id = data._id;
        if(isFavourite) {
            var result = await UserData.removeItemFromFavourite({product_id, currentUser})
        } else {
            var result = await UserData.addItemToFavourite({product_id, currentUser})
        }
        if(!result.success) {
            Popup.show({
                type: 'danger',
                title: 'Error, unable to favourite item. Please try again.',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return
        }
        return _getStoreProduct() // refresh
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
        <ScrollView style={defaultStyles.container} contentContainerStyle={{ paddingBottom: 90, height: '100%' }}>
            <View style={styles.topButtonContainers}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={24}/>
                </TouchableOpacity>
                <View style={{ flex: 1, }}/>
                <TouchableOpacity style={[styles.iconContainer, isFavourite && { backgroundColor: colors.primary }]} onPress={_handleFavourites}>
                    <MaterialCommunityIcons name="heart-outline" size={20} color={isFavourite ? '#fff' : '#000'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconContainer, { marginLeft: 10, }]} onPress={() => navigation.navigate('Cart')}>
                    <MaterialCommunityIcons name="cart-outline" size={20}/>
                </TouchableOpacity>
            </View>
            <Animatable.Image
                source={{ uri: image }}
                style={styles.backgroundImage}
                resizeMode='cover'
                animation="fadeInDownBig"
            />
            <Animatable.View 
                animation="fadeInUpBig" 
                style={[styles.detailsContainer, styles.shadow]}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 100, }} showsVerticalScrollIndicator={false}>
                    <View style={[styles.categoryContainer, styles.shadow, { backgroundColor: colors.background, }]}>
                        {
                            data.attributes.map((attr, index) => {
                                if(index !== 0) {
                                    return (
                                        <Text key={index} style={{ flex: 1, textAlign: 'center', borderLeftWidth: 0.5, borderLeftColor: colors.dark, fontWeight: 'bold', }} numberOfLines={1}>{attr}</Text>
                                    )
                                }
                                return (
                                    <Text key={index} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', }} numberOfLines={1}>{attr}</Text>
                                )
                            })
                        }
                    </View>
                    <DisplayTimer />
                    <View style={{ marginLeft: 30, }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 5, flex: 1, marginRight: 30, }}>{data.text}</Text>
                        <ItemRating
                            ratings={ratings}
                        />
                        <StoreTags
                            tags={data.tags}
                            style={{ marginTop: 5, }}
                        />
                        <Text style={styles.header}>Size</Text>
                        <FlatList
                            horizontal
                            keyExtractor={(_, index) => index.toString()}
                            data={data.sizes}
                            style={{ height: 40, marginTop: 15, }}
                            renderItem={({item, index}) => (
                                <TouchableOpacity key={index} style={[styles.sizeButton, selection === index ? { backgroundColor: colors.primary, } : { backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc' }]} onPress={() => setSelection(index)}>
                                    <Text style={[selection === index ? { color: 'white', paddingHorizontal: 10, } : { color: 'black', paddingHorizontal: 10, }]}>{item.size} - ${data.sizes[index].price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                </TouchableOpacity>
                            )}
                            showsHorizontalScrollIndicator={false}
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
                        <Text style={styles.header}>About</Text>
                        <Text style={{ textAlign: 'justify' }}>{data.description}</Text>
                    </View>
                    <View style={{ marginHorizontal: 30, }}>
                        <Text style={[styles.header, { marginBottom: 15, }]}>Ratings</Text>
                        {
                            ratings.map((r, i) => (
                                <ItemRatingBreakdown 
                                    key={i} 
                                    ratingData={r}
                                    ratings={ratings}
                                />
                            ))
                        }
                        <View style={{ marginTop: 20, }}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 10, }} onPress={() => navigation.navigate('ProductReviews', { ratings: ratings })}>
                                <Text style={{ fontSize: 11, }}>View More</Text>
                            </TouchableOpacity>
                            {
                                reviews.map((r, i) => (
                                    <ItemReview
                                        key={i}
                                        review={r}
                                    />
                                ))
                            }
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, }}>
                        <Text style={[styles.header, { marginBottom: 10, }]}>More from this store</Text>
                        <ItemCarousel
                            data={otherProducts}
                            navigation={navigation}
                            hasMore
                            store_id={data.store_id}
                        />
                    </View>
                </ScrollView>
                
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                    style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}
                >
                    <TouchableOpacity style={[styles.cardButton, { backgroundColor: colors.primary, }]} onPress={_addToCart}>
                        <Text style={[{ color: 'white', fontWeight: 'bold', textAlign: 'center', flex: 1, }]}>Add to cart</Text>
                        <Text style={[{ color: 'white', fontWeight: 'bold', paddingHorizontal: 30, borderLeftWidth: 0.5, borderLeftColor: colors.background }]}>${(data.sizes[selection].price * quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </Text>
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
        backgroundColor: '#A9A9A9'
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