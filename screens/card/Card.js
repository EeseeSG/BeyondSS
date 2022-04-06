// ESSENTIALS
import React, { useState, useRef, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    TouchableOpacity,
    Image,
	Text,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// ANIMATION
import * as Animatable from 'react-native-animatable';

// SWIPER
import Swiper from 'react-native-deck-swiper';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';

// DATA
import * as ProductData from '../../database/Product';

import ItemRatingBreakdown from '../../components/Store/ItemRatingBreakdown';
import ItemRating from '../../components/Store/ItemRating';

function randomArray(max) {
	let max_length = Math.round(Math.random() * max);
	let array = [];
	for(var i = 0; i < max_length; i++) {
		array.push(Math.round(Math.random() * max));
	}
	return array
}

const PHONE_OFFSET = Platform.OS === 'ios' ? 44 : 0;
export default function Card({ navigation }) {
	const { colors } = useTheme();
	const [data, setData] = useState([]);
	const cardSwiper = useRef(null);
	const [isIntro, setIsIntro] = useState(true);
	const [isLoaded, setIsLoaded] = useState(false);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		async function _getCardData() {
			let product_data = await ProductData.getAllProductData()
			// get and append review
			let product_data_w_ratings = product_data.map((p) => {
				var ratings = [
					{
						rating: 5,
						data: randomArray(20)
					},
					{
						rating: 4,
						data: randomArray(20)
					},
					{
						rating: 3,
						data: randomArray(20)
					},
					{
						rating: 2,
						data: randomArray(20)
					},	
					{
						rating: 1,
						data: randomArray(20)
					}
				]
				return { ...p, ratings}		
			})
			setData(product_data_w_ratings)
			setIsLoaded(true)
		}
		return _getCardData()
	}, [])

	const _goToProduct = (product) => {
		navigation.navigate('FoodItem', { data: product })
	}

	const renderCards = (card) => {
		return (
			<Animatable.View 
				style={styles.card}
				animation="slideInDown"
			>
				<Image
					style={styles.image}
					source={{ uri: card.image }}
				/>
				<View style={{ height: '50%', flex: 1, margin: 10, }}>
					<Text style={{ fontSize: 24, fontWeight: 'bold', }} numberOfLines={2}>{card.text}</Text>
					<ItemRating 
						ratings={card.ratings}
					/>
					<Text style={styles.textDesc} numberOfLines={5}>{card.description}</Text>
					<View style={{ flexDirection: 'row', }}>
						<View style={{ flex: 1, marginRight: 15, }}>
							{
								card.ratings.map((r, i) => (
									<ItemRatingBreakdown 
										key={i} 
										ratingData={r}
										ratings={card.ratings}
									/>
								))
							}
						</View>
						<View>
							<Text style={styles.textPrice} numberOfLines={1}>${card.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
							<TouchableOpacity style={[styles.itemBtn, { backgroundColor: colors.dark, }]} onPress={() => _goToProduct(card)}>
								<MaterialCommunityIcons name="chevron-right" size={25} color={'#fff'}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Animatable.View>
		)
	} 

	const onComplete = () => {
		Popup.show({
			type: 'success',
			title: 'Congratulations!',
			textBody: "You have completed this exercise! We look forward to providing you with more meaningful selections specially curated to suit your tastes!",
			buttonText: 'Go back',
			callback: () => {
				Popup.hide();
				navigation.goBack();
			}
		})
	}

	const _chooseLike = () => {
		setIndex(i => i+1)
		console.log('right')
	}


	const _chooseNope = () => {
		setIndex(i => i+1)
		console.log('left')
	}

	//=====================================================================================================================
	//==  PRESS BUTTON ==
	//=====================================================================================================================
	const _pressLike = () => {
		setIndex(i => i+1)
		_chooseLike()
		cardSwiper.current?.swipeRight()
	}

	const _pressNope = () => {
		setIndex(i => i+1)
		_chooseNope()
		cardSwiper.current?.swipeLeft()
	}

	const _pressViewDetails = () => {
		_goToProduct(data[index])
	}

	const _pressRetry = () => {
		setIndex(i => i-1)
		cardSwiper.current?.swipeBack()
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
		// FIND YOUR COMFORT FOOD
		<View style={styles.container}>
			{
				isIntro &&
				<TouchableOpacity 
					style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 3, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}
					onPress={() => setIsIntro(false)}
				>
					<View style={styles.introContainer}>
						<MaterialCommunityIcons name="gesture-swipe-right" size={40} color={'#fff'}/>
						<Text style={styles.introText}>Swipe right to</Text>
						<Text style={[styles.introTextHighlight, { color: 'green' }]}>LIKE</Text>
					</View>
					<View style={styles.introContainer}>
						<MaterialCommunityIcons name="gesture-swipe-left" size={40} color={'#fff'}/>
						<Text style={styles.introText}>Swipe left to</Text>
						<Text style={[styles.introTextHighlight, { color: colors.primary }]}>DISLIKE</Text>
					</View>
					<Text style={[styles.introText, { marginTop: 50, fontSize: 20, opacity: 0.8, }]}>Tap anywhere to start</Text>								
				</TouchableOpacity>
			}
			<View style={styles.topButtonContainers}>
				<TouchableOpacity style={[styles.iconContainer, styles.shadow]} onPress={() => navigation.goBack()}>
					<MaterialCommunityIcons name="chevron-left" size={24}/>
				</TouchableOpacity>
				<View style={{ flex: 1, }}/>
			</View>
			<Swiper
				ref={cardSwiper}
				cards={data}
				renderCard={renderCards}
				onSwipedLeft={_chooseNope}
				onSwipedRight={_chooseLike}
				disableBottomSwipe
				disableTopSwipe
				onSwipedAll={onComplete}
				cardIndex={index}
				cardVerticalMargin={100 + PHONE_OFFSET}
				backgroundColor={colors.background}
				stackSize={3}
				stackSeparation={-20}
				overlayLabels={{
					left: {
						title: 'NOPE',
						style: {
							label: {
								backgroundColor: colors.primary,
								borderColor: 'black',
								color: 'white',
								borderWidth: 1
							},
							wrapper: {
								flexDirection: 'column',
								alignItems: 'flex-end',
								justifyContent: 'flex-start',
								marginTop: 30,
								marginLeft: -30
							}
						}
					},
					right: {
						title: 'LIKE',
						style: {
							label: {
								backgroundColor: 'green',
								borderColor: 'black',
								color: 'white',
								borderWidth: 1
							},
							wrapper: {
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								marginTop: 30,
								marginLeft: 30
							}
						}
					},
				}}
				animateOverlayLabelsOpacity
				animateCardOpacity
				swipeBackCard
			>
				<Animatable.View 
					style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center',}}
					animation="fadeInUpBig"
				>
					<LinearGradient
						colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
						style={{ flexDirection: 'row', paddingBottom: 20, }}
					>
						<View style={styles.btnWrapper}>
							<TouchableOpacity style={[styles.btnSmall, styles.toggleBtn]} onPress={_pressRetry}>
								<AntDesign name="reload1" size={25} color={colors.secondary}/>
							</TouchableOpacity>
						</View>

						<View style={styles.btnWrapper}>
							<TouchableOpacity style={[styles.btnLarge, styles.toggleBtn]} onPress={_pressNope}>
								<MaterialCommunityIcons name="close" size={34} color={colors.primary}/>
							</TouchableOpacity>
						</View>

						<View style={styles.btnWrapper}>
							<TouchableOpacity style={[styles.btnLarge, styles.toggleBtn]} onPress={_pressLike}>
								<MaterialCommunityIcons name="heart-outline" size={34} color={'green'}/>
							</TouchableOpacity>
						</View>

						<View style={styles.btnWrapper}>
							<TouchableOpacity style={[styles.btnSmall, styles.toggleBtn]} onPress={_pressViewDetails}>
								<MaterialCommunityIcons name="chevron-right" size={25} color={colors.dark}/>
							</TouchableOpacity>
						</View>
					</LinearGradient>
				</Animatable.View>

			</Swiper>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	card: {
		flex: 1,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#E8E8E8",
		justifyContent: "center",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 10,
	},
	text: {
		textAlign: "center",
		fontSize: 50,
		backgroundColor: "transparent"
	},
	topButtonContainers: { 
		position: 'absolute', 
		top: 10, 
		left: 10, 
		right: 10, 
		zIndex: 2, 
		flexDirection: 'row', 
	},
	iconContainer: { 
		width: 35, 
		height: 35, 
		backgroundColor: '#fff', 
		borderRadius: 35, 
		justifyContent: 'center', 
		alignItems: 'center', 
		alignContent: 'center' 
	},
	btnWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnLarge: {
		height: 60, 
		width: 60,
	},
	btnSmall: {
		height: 40, 
		width: 40,
	},
	toggleBtn: { 
		borderRadius: 50, 
		backgroundColor: '#fff', 
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
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
	introContainer: { 
		flexDirection: 'row', 
		justifyContent: 'center', 
		alignItems: 'center',
		marginVertical: 15, 
	},
	introText: { 
		fontWeight: 'bold', 
		fontSize: 24, 
		color: '#fff', 
		marginLeft: 15, 
		opacity: 0.9 
	},
	introTextHighlight: {
		fontSize: 26,
		backgroundColor: '#fff',
		marginLeft: 5, 
		paddingHorizontal: 10,
		borderRadius: 5,
		fontWeight: 'bold'
	},
	image: { 
		height: '50%', 
		width: '100%', 
		borderTopLeftRadius: 5, 
		borderTopRightRadius: 5, 
		backgroundColor: '#A9A9A9',
	},
	textDesc: { 
		textAlign: 'justify', 
		marginTop: 5, 
		flex: 1, 
	},
	textPrice: { 
		textAlign: 'right', 
		marginTop: 5, 
		fontSize: 26,
		marginBottom: 20, 
		marginTop: 5, 
		fontWeight: 'bold', 
		color: '#000', 
		opacity: 0.8, 
	},
	itemBtn: { 
		paddingHorizontal: 20, 
		paddingVertical: 5, 
		borderWidth: 0.5,
		borderColor: '#ccc',
		borderRadius: 10, 
		justifyContent: 'center',
		alignItems: 'center',
	},
});