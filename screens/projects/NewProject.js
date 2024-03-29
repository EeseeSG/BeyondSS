// ESSENTIALS
import React, { useEffect, useState, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet ,
	ScrollView,
	FlatList
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// DESIGN
import { LinearGradient } from 'expo-linear-gradient';

// DATABASE
import * as ProjectData from '../../database/Project';
import * as UserData from '../../database/User';

// COMPONENT
import CustomTextInput from '../../components/Form/TextInput';
import CustomDateTimeInput from '../../components/Form/DateInput';
import CustomCheckBox from '../../components/Form/CheckBox';
import { sendPushNotification } from '../../components/Helper/PushNotifications';
import { uuidv4 } from '../../components/Helper/UUID';
import { defaultStyles } from '../../constants/defaultStyles';


export default function SignInScreen({navigation}) {
	const { colors } = useTheme();

	//=====================================================================================================================
    //==  DATA SUMMARY ==
    //=====================================================================================================================
	const [currentUser, setCurrentUser] = useState([]);
	useEffect(() => {
		async function _getCurrentUser() {
			let current_user = await UserData.currentUserData()
			setCurrentUser(current_user);
		}
		return _getCurrentUser()
	}, [])

    //=====================================================================================================================
    //==  DATA SUMMARY ==
    //=====================================================================================================================
	const [data, setData] = useState({
		title: '',
		count: '',
		location: '',
        message: '',
		tags: {
			isHalal: false,
			isVegetarian: false,
			isVegan: false,
			isKosher: false,
			isGlutenFree: false,
			hasPeanut: false,
			hasDiary: false,
		},
		datetime: new Date(),
		isValidName: null,
		isValidCount: null,
		isValidLocation: null,
		isValidDate: null,
		ref: uuidv4(),
	});
    

    //=====================================================================================================================
    //==  HANDLER ==
    //=====================================================================================================================
	const nameHandler = (val) => {
		if( val.trim().length >= 4 ) {
			setData({
				...data,
				title: val,
				isValidName: true
			});
		} else {
			setData({
				...data,
				title: val,
				isValidName: false
			});
		}
	}

	const numberHandler = (val) => {
		if( val.trim().length >= 1 ) {
			setData({
				...data,
				count: val.replace(/[^0-9]/g, ''),
				isValidCount: true
			});
		} else {
			setData({
				...data,
				count: val.replace(/[^0-9]/g, ''),
				isValidCount: false
			});
		}
	}

    const locationHandler = (val) => {
		if( val.trim().length >= 4 ) {
			setData({
				...data,
				location: val,
				isValidLocation: true
			});
		} else {
			setData({
				...data,
				location: val,
				isValidLocation: false
			});
		}
	}

    const messageHandler = (val) => {
		if( val.trim().length >= 4 ) {
			setData({
				...data,
				message: val,
			});
		} else {
			setData({
				...data,
				message: val,
			});
		}
	}

	const dateHandler = (val) => {
		if(val <= new Date()) {
			setData({
				...data,
				datetime: new Date(),
				isValidDate: false,
			});
			return
		}
		setData({
			...data,
			datetime: val,
			isValidDate: true,
		});
	}

    //=====================================================================================================================
    //==  TAG HANDLER ==
    //=====================================================================================================================
	const preference_tags = [
		{
			value: 'isHalal',
			onChange: (val) => halalHandler(val),
			yes: 'Is Halal',
			no: 'Not Halal',
		},
		{
			value: 'isVegetarian',
			onChange: (val) => vegetarianHandler(val),
			yes: 'Is Vegetarian',
			no: 'Not Vegetarian',
		},
		{
			value: 'isVegan',
			onChange: (val) => veganHandler(val),
			yes: 'Is Vegan',
			no: 'Not Vegan',
		},
		{
			value: 'isKosher',
			onChange: (val) => kosherHandler(val),
			yes: 'Is Kosher',
			no: 'Not Kosher',
		},
	]

	const allergen_tags = [
		{
			value: 'hasPeanut',
			onChange: (val) => peanutHandler(val),
			yes: 'Has Peanut',
			no: 'No Peanut',
		},
		{
			value: 'hasDiary',
			onChange: (val) => diaryHandler(val),
			yes: 'Has Diary',
			no: 'No Diary',
		},
		{
			value: 'isGlutenFree',
			onChange: (val) => glutenHandler(val),
			yes: 'Is Gluten Free',
			no: 'Not Gluten Free',
		},
	]


	const halalHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				isHalal: val,
			}
		});
	}

	const vegetarianHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				isVegetarian: val,
			}
		});
	}

	const veganHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				isVegan: val,
			}
		});
	}

	const kosherHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				isKosher: val,
			}
		});
	}

	const glutenHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				isGlutenFree: val,
			}
		});
	}

	const peanutHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				hasPeanut: val,
			}
		});
	}

	const diaryHandler = (val) => {
		setData({
			...data,
			tags: {
				...data.tags,
				hasDiary: val,
			}
		});
	}



    //=====================================================================================================================
    //==  SUBMIT ==
    //=====================================================================================================================
    const checkValidation = () => {
		if(data.isValidName && data.isValidCount && data.isValidLocation && data.isValidDate) {
			return true;
		}
        return false;
    }

	const submitHandler = async () => {
		// check for email and password field if they have been input
        let validated = checkValidation();
        if(!validated) {
            Popup.show({
                type: 'danger',
                title: 'Incorrect Input!',
                textBody: 'Please fill in all the necessary inputs in the required format.',
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
            return;
        }

		// convert tags into readable format
		const all_tags_mapped = [...preference_tags, ...allergen_tags];
		const presentTags = Object.keys(data.tags).reduce(function(r, e) {
			if (data.tags[e] === true) r[e] = data.tags[e]
			return r;
		}, {});
		const listTags = Object.keys(presentTags).map((key) => key);
		const parsedTags = listTags.map((tag) => {
			let target = all_tags_mapped.filter((t) => t.value === tag);
			if(target.length > 0) {
				return target[0].yes
			}
			return null
		}).filter((i) => i !== null);

		const new_data = {
			...data,
			user: currentUser,
			tags: parsedTags,
			createdAt: new Date(),
		}

		let result = await ProjectData.createProject(new_data);
        if(result.success) {
            Popup.show({
                type: 'success',
                title: 'Success!',
                textBody: 'You have successfully create a food distribution event! Thank you for your contribution!',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })

			// get all user data
			let all_users = await UserData.getAllUsersByDateJoined();
			let all_push_tokens = all_users.map((user) => user.expoPushToken);

			// set message
			let message = {
				title: 'New Food Distribution!',
				body: `New ${data.count} of ${data.title} up for reservation. Reserve yours now!`,
				data: {
					ref: data.ref,
					type: 'new',
				},
			}

			// send push notifications to all
			await sendPushNotification(all_push_tokens, message)

        } else {
            Popup.show({
                type: 'danger',
                title: 'An error has occurred. Please try again.',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }
	}


	// =======================================================================================================================
	// == DISPLAY ==
	// =======================================================================================================================
	return (
		<View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <CustomTextInput
                    header={"Food Name"}
                    fontIcon={null}
                    placeholder={"Enter name of food"}
                    onChangeText={nameHandler}
                    isValidInput={data.isValidName}
                    validationText={"Username must be at least 4 characters long"}
					value={data.name}
                />

				<CustomTextInput
                    header={"How many would you like to distribute?"}
                    fontIcon={null}
                    placeholder={"Enter the amount to be distributed"}
                    onChangeText={numberHandler}
                    isValidInput={data.isValidCount}
					keyboardType={'number-pad'}
					value={data.count}
                />

                <CustomTextInput
                    header={"Collection Location"}
                    fontIcon={null}
                    placeholder={"Please enter location of collection"}
                    onChangeText={locationHandler}
                    isValidInput={data.isValidLocation}
					numberOfLines={3}
                    validationText={"Please enter a valid location"}
					value={data.location}
                />

				<CustomDateTimeInput 
					header={"Date and Time"}
                    fontIcon={null}
					date={data.datetime}
					setDate={dateHandler}
					isValidInput={data.isValidDate}
                    validationText={"Please enter a valid date and time"}
					value={data.datetime}
				/>

                <CustomTextInput
                    header={"Message (optional)"}
                    fontIcon={null}
                    placeholder={"Enter any message you would like to convey"}
                    onChangeText={messageHandler}
                    isValidInput={true}
                    numberOfLines={5}
					value={data.message}
                />

				<Text style={[styles.text_footer, { color: 'black', marginTop: 30, }]}>Dietary Restrictions</Text>
				<FlatList
					numColumns={2}
					data={preference_tags}
					keyExtractor={(_, index) => index.toString()}
					contentContainerStyle={{ marginHorizontal: 20, }}
					renderItem={({item}) => (
						<CustomCheckBox
							data={data}
							item={item}
						/>
					)}
				/>

				
				<Text style={[styles.text_footer, { color: 'black', marginTop: 30, }]}>Allergens</Text>
				<Text style={defaultStyles.small}>Please indicate if the meal contains:</Text>
				<FlatList
					numColumns={2}
					data={allergen_tags}
					keyExtractor={(_, index) => index.toString()}
					contentContainerStyle={{ marginHorizontal: 20, }}
					renderItem={({item}) => (
						<CustomCheckBox
							data={data}
							item={item}
						/>
					)}
				/>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={submitHandler}
                    >
                        <LinearGradient
                            colors={[colors.primary, colors.darkGrey]}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color:'#fff' }]}>Create</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1, 
        padding: 15,
		backgroundColor: 'white',
	},
	text_footer: {
		color: '#05375a',
		fontSize: 18
	},
	button: {
		alignItems: 'center',
		marginVertical: 50,
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10
	},
	textSign: {
		fontSize: 18,
		fontWeight: 'bold'
	},
});
