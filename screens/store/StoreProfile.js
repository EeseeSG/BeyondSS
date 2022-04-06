// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import {
    Animated, 
    View, 
    StatusBar,
    Text, 
    Image, 
    Platform, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
} from 'react-native';
import { useTheme } from 'react-native-paper';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// DATA
import * as StoreData from '../../database/Store';

// CUSTOM
import StoreTags from '../../components/Store/StoreTags';
import StoreMenu from '../../components/Store/StoreMenu';

const HEADER_IMAGE_HEIGHT = 250;
const APPBAR_HEIGHT = 56;
const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');
const PROFILE_WIDTH = 150;
const PROFILE_HEIGHT = PROFILE_WIDTH;
const PROFILE_IMAGE_TOP = HEADER_IMAGE_HEIGHT - PROFILE_HEIGHT / 2;

export default function StoreProfile(props) {
    const { store_id, currentUser } = props.route.params;
    const { colors } = useTheme();
    const scrollY = new Animated.Value(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [storeData, setStoreData] = useState(null);

    //=====================================================================================================================
    //==  GET STORE DETAILS ==
    //=====================================================================================================================
    useEffect(() => {
        if(!isLoaded) {
            async function _getStoreData() {
                let store_data = await StoreData.getStoreByID(store_id);
                let store_product_data = await StoreData.getStoreProductDataByGroup([store_id]);
                let mapped_store_data = await StoreData._mapProductToStore({arr_store: [store_data], arr_products: store_product_data})
                setStoreData(mapped_store_data[0])
                setIsLoaded(true)
            }
            return _getStoreData()
        }
    }, [])

    //=====================================================================================================================
    //==  RENDER MENU ==
    //=====================================================================================================================
    const renderProductCard = (item, index) => {
        return (
            <StoreMenu
                key={index}
                item={item}
                navigation={props.navigation}
            />
        );
    };

    //=====================================================================================================================
    //==  SETUP ANIMATION ==
    //=====================================================================================================================
    //For header background color from transparent to header color
    _getHeaderBackgroundColor = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: ['rgba(0,0,0,0.0)', colors.dark],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //For header image opacity
    _getHeaderImageOpacity = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: [1, 0],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image position from left
    _getImageLeftPosition = () => {
        return scrollY.interpolate({
            inputRange: [0, 80, 140],
            outputRange: [windowWidth / 2 - PROFILE_WIDTH / 2 , 146, 58],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image position from top
    _getImageTopPosition = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: [PROFILE_IMAGE_TOP, 10],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image width
    _getImageWidth = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: [PROFILE_WIDTH, APPBAR_HEIGHT - 20],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image height
    _getImageHeight = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: [PROFILE_WIDTH, APPBAR_HEIGHT - 20],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image border width
    _getImageBorderWidth = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: [StyleSheet.hairlineWidth * 3, StyleSheet.hairlineWidth],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist profile image border color
    _getImageBorderColor = () => {
        return scrollY.interpolate({
            inputRange: [0, 140],
            outputRange: ['#fff', 'rgba(0,0,0,0.0)'],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //Song list container position from top
    _getListViewTopPosition = () => {
        return scrollY.interpolate({
            inputRange: [0, 250],
            outputRange: [380 - APPBAR_HEIGHT - 10, 0],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //header title opacity
    _getHeaderTitleOpacity = () => {
        return scrollY.interpolate({
            inputRange: [0, 20, 50],
            outputRange: [0, 0.5, 1],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    //artist name opacity
    _getNormalTitleOpacity = () => {
        return scrollY.interpolate({
            inputRange: [0, 20, 50],
            outputRange: [1, 0.5, 0],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
    };

    // setup
    const headerBackgroundColor = _getHeaderBackgroundColor();
    const headerImageOpacity = _getHeaderImageOpacity();
    const profileImageWidth = _getImageWidth();
    const profileImageHeight = _getImageHeight();
    const profileImageLeft = _getImageLeftPosition();
    const profileImageTop = _getImageTopPosition();
    const profileImageBorderWidth = _getImageBorderWidth();
    const profileImageBorderColor = _getImageBorderColor();
    const listViewTop = _getListViewTopPosition();
    const headerTitleOpacity = _getHeaderTitleOpacity();
    const normalTitleOpacity = _getNormalTitleOpacity();


    //=====================================================================================================================
    //==  RENDER DISPLAY ==
    //=====================================================================================================================
    if(!isLoaded) {
        return (<View></View>)
    }

    return (
        <View style={styles.container}>

            <StatusBar backgroundColor={colors.dark}/>

            <Animated.Image
                style={[styles.headerImageStyle, { opacity: headerImageOpacity,}]}
                source={{ uri: storeData.banner }}
                resizeMode={'cover'}
            />

            <Animated.View style={[styles.headerStyle, { backgroundColor: headerBackgroundColor }]}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => props.navigation.goBack()}>
                    <MaterialCommunityIcons name="chevron-left" size={26} color={'#fff'}/>
                </TouchableOpacity>
                <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity,}]}>
                    {storeData.name}
                </Animated.Text>
                <TouchableOpacity style={styles.headerIcon}>
                    <MaterialCommunityIcons name="heart-outline" size={22} color={'#fff'}/>
                </TouchableOpacity>
            </Animated.View>

            <Animated.Image
                style={[styles.profileImage, {
                    borderWidth: profileImageBorderWidth,
                    borderColor: profileImageBorderColor,
                    borderRadius: ( APPBAR_HEIGHT - 20) / 2,
                    height: profileImageHeight,
                    width: profileImageWidth,
                    transform: [
                        {translateY: profileImageTop},
                        {translateX: profileImageLeft},
                    ],
                    zIndex: 2,
                }]}
                source={{ uri: storeData.image }}
            />

            <Animated.ScrollView
                style={{ zIndex: 10, }}
                contentContainerStyle={{ paddingBottom: 200 }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: {contentOffset: {y: scrollY}},}], 
                    { listener: (event) => {}, useNativeDriver: false,}
                )}
            >
                <Animated.Text style={[ styles.profileTitle, { opacity: normalTitleOpacity, },]}>
                    {storeData.name}
                </Animated.Text>
                <Animated.View style={{ transform: [{ translateY: listViewTop,}],}}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={{ textAlign: 'justify' }}>{storeData.about}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Menu</Text>
                        {storeData.products.map((item, index) => renderProductCard(item, index))}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tags</Text>
                        <StoreTags
                            tags={storeData.tags}
                            wrapped
                        />
                    </View>
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "auto", 
        maxHeight: Dimensions.get('window').height
    },
    /*header style*/
    headerIcon: {
        zIndex: 3,
        width: 40, 
        height: 40, 
        borderRadius: 40, 
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerStyle: {
        height:  APPBAR_HEIGHT,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    headerTitle: {
        textAlign: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize:  14,
        flex: 1,
    },
    /*Top Image Style*/
    headerImageStyle: {
        height: HEADER_IMAGE_HEIGHT,
        width: '100%',
        top: 0,
        alignSelf: 'center',
        position: 'absolute',
        backgroundColor: '#A9A9A9',
    },
    /*profile image style*/
    profileImage: {
        position: 'absolute',
        zIndex: 2,
        backgroundColor: '#A9A9A9',
    },
    /*profile title style*/
    profileTitle: {
        position: 'absolute',
        zIndex: 100,
        textAlign: 'center',
        color: '#000',
        top: PROFILE_IMAGE_TOP + PROFILE_HEIGHT - 40,
        left: 0,
        right: 0,
        fontSize:  20
    },
    /*song count text style*/
    songCountStyle: {
        position: 'absolute',
        textAlign: 'center',
        fontWeight: '400',
        top: 340,
        left: 0,
        right: 0,
        fontSize: 14,
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
    section: {
        paddingHorizontal: 20, 
        marginTop: 10,
        marginBottom: 20,
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 5, 
    },
})