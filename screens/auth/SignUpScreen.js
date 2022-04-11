// ESSENTIALS
import React, { useState, useContext, useEffect, } from 'react';
import { 
	View, 
	Text,  
	TouchableOpacity, 
	TextInput,
	Platform,
	StyleSheet,
	ScrollView,
	StatusBar,
	Picker,
	ActionSheetIOS,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// WEB
import * as WebBrowser from 'expo-web-browser';

// AUTH PROVIDER
import { AuthContext } from '../../navigation/AuthProvider';

// USER
import { getUserByPhone, getApplicationByPhone } from '../../database/User';

// ANIMATION
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

// DESIGN
import Feather from 'react-native-vector-icons/Feather';

// PUSH NOTIFICATION
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// COMPONENT
import Dropdown from '../../components/Form/Dropdown';


const SignInScreen = ({navigation}) => {
	const { colors } = useTheme();
	const { register } = useContext(AuthContext);
	const [data, setData] = useState({
		email: '',
		name: '',
		contact: '',
		type: '',
	});
	const choices = [
        {
            label: "Chef (providing food)",
            value: "chef",
        },
        {
            label: "Beneficiary (receiving food)",
            value: "beneficiary",
        }
    ]

	useEffect(() => {
		async function registerForPushNotificationsAsync() {
			let token;
			if (Device.isDevice) {
				const { status: existingStatus } = await Notifications.getPermissionsAsync();
				let finalStatus = existingStatus;
				if (existingStatus !== 'granted') {
					const { status } = await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}
				if (finalStatus !== 'granted') {
					alert('Failed to get push token for push notification!');
					return;
				}
				token = (await Notifications.getExpoPushTokenAsync()).data;
				setData({
					...data,
					expoPushToken: token
				})
			} else {
			  	alert('Must use physical device for Push Notifications');
			}
		}
		return registerForPushNotificationsAsync()
	}, [])

	// Data validation
	const [emailValidated, setEmailValidated] = useState(false);
	const [nameValidated, setNameValidated] = useState(false);
	const [contactValidated, setContactValidated] = useState(false);
	const [typeValidated, setTypeValidated] = useState(false);

	const handleEmailChange = (val) => {
		if(_validateEmail(val)) {
			setData({
				...data,
				email: val,
				check_textInputChange: true
			});
			setEmailValidated(true)
		} else {
			setData({
				...data,
				email: val,
				check_textInputChange: false
			});
			setEmailValidated(false)
		}
	}

	const handleNameChange = (val) => {
		if( val.length >= 4 ) {
			setData({
				...data,
				name: val,
				check_nameChange: true
			});
			setNameValidated(true)
		} else {
			setData({
				...data,
				name: val,
				check_nameChange: false
			});
			setNameValidated(false)
		}
	}

	const handleContactChange = (val) => {
		if(_validateContact(val)) {
			setData({
				...data,
				contact: val,
				check_contactChange: true
			});
			setContactValidated(true)
		} else {
			setData({
				...data,
				contact: val,
				check_contactChange: false
			});
			setContactValidated(false)
		}
	}

	const handleTypeChange = (val) => {
		if(val !== '') {
			setData({
				...data,
				type: val,
				check_typeChange: true
			});
			setTypeValidated(true)
		} else {
			setData({
				...data,
				type: val,
				check_typeChange: false
			});
			setTypeValidated(false)
		}
	}

	const _validateEmail = (email) => {
		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	};

	const _validateContact = (contact) => {
		return contact.match(
			/^(6|8|9)[0-9]{7}$/
		);
	};

	const handleRegistration = async () => {
		let errorType = 'An error has occurred.';

		const existingUser = await getUserByPhone(data.contact);
		const existingApplication = await getApplicationByPhone(data.contact);
		
		const exists = existingUser.length > 0 || existingApplication.length > 0;

		if(existingUser.length > 0) {
			errorType = 'An account under your phone number has already been registered. Please log in.';
		} else if(existingApplication.length > 0) {
			errorType = 'You have already submitted an application. Please wait for us to revert.';
		} else if(!emailValidated) {
			errorType = 'Please enter a valid email.'
		} else if(!contactValidated) {
			errorType = 'Please enter your phone number correctly. (without +65)';
		} else if(!nameValidated) {
			errorType = 'Please enter a name that is at least 4 characters long';
		} else if(!typeValidated) {
			errorType = 'Please select your role.';
		}

		if(nameValidated && contactValidated && emailValidated && typeValidated) {
			if(!exists) {
				registerUser();
				return;
			}
		}
		Popup.show({
			type: 'danger',
			title: 'Wrong Input!',
			textBody: errorType,
			buttonText: 'Okay',
			callback: () => Popup.hide()
		})
	}

	const registerUser = async () => {
		register(data)
	}

	const _openWebBrowser = async (link) => {
        await WebBrowser.openBrowserAsync(link)
    }

	const onIOSTypePress = () => {
		const optionsList = ["Cancel", "Chef", "Beneficiary"]
		return (
			ActionSheetIOS.showActionSheetWithOptions(
				{
					options: optionsList,
					cancelButtonIndex: 0,
					userInterfaceStyle: 'dark'
				},
				buttonIndex => {
					if (buttonIndex === 0) {
					// cancel action
					} else {
						handleTypeChange(optionsList[buttonIndex])
					}
				}
			)
		)
	}
		

	return (
		<View style={[styles.container, { backgroundColor: colors.secondary, }]}>
			<StatusBar backgroundColor={colors.secondary} barStyle="light-content"/>
			<View style={styles.header}>
					<Text style={styles.text_header}>Register Now!</Text>
			</View>
			<Animatable.View 
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					
					<Text style={styles.text_footer}>Email</Text>
					<View style={styles.action}>
						<Feather 
							name="mail"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Your Email"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => handleEmailChange(val.trim())}
							autoComplete='email'
							keyboardType='email-address'
						/>
						{
							data.check_textInputChange 
							&&
							<Animatable.View
								animation="bounceIn"
							>
								<Feather 
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
						}
					</View>

					<Text style={[styles.text_footer, {marginTop: 35}]}>Full Name</Text>
					<View style={styles.action}>
						<Feather 
							name="user"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Your Name"
							style={styles.textInput}
							onChangeText={(val) => handleNameChange(val.trim())}
							autoComplete='name'
						/>
						{
							data.check_nameChange 
							&&
							<Animatable.View
								animation="bounceIn"
							>
								<Feather 
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
						}
					</View>

					<Text style={[styles.text_footer, {marginTop: 35}]}>Phone Number</Text>
					<View style={styles.action}>
						<Feather 
							name="phone"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Your Phone Number"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => handleContactChange(val)}
							keyboardType={'phone-pad'}
							maxLength={8}
						/>
						{
							data.check_contactChange
							&&
							<Animatable.View
								animation="bounceIn"
							>
								<Feather 
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
						}
					</View>


					<Dropdown
						title={"User Type"}
						selected={data.type}
						onChange={handleTypeChange}
						isValid={data.check_typeChange}
						choices={choices}
					/>

					<View style={styles.textPrivate}>
						<Text style={styles.color_textPrivate}>
							By signing up you agree to our {" "}
						</Text>
						<TouchableOpacity style={[styles.color_textPrivate, {fontWeight: 'bold'}]} onPress={() => _openWebBrowser('https://www.beyond.org.sg/privacypolicyandstatutoryinfo/')}>
							<Text>Terms of service</Text>
						</TouchableOpacity>
						<Text style={styles.color_textPrivate}>{" "}and{" "}</Text>
						<TouchableOpacity style={[styles.color_textPrivate, {fontWeight: 'bold'}]} onPress={() => _openWebBrowser('https://www.beyond.org.sg/privacypolicyandstatutoryinfo/')}>
							<Text>Privacy policy</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.button}>
						<TouchableOpacity
							style={styles.signIn}
							onPress={handleRegistration}
						>
							<LinearGradient
								colors={[colors.secondary, colors.primary]}
								style={styles.signIn}
							>
								<Text style={[styles.textSign, {color:'#fff'}]}>Register</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => navigation.goBack()}
							style={[styles.signIn, {
								borderColor: colors.primary,
								borderWidth: 1,
								marginTop: 15
							}]}
						>
							<Text style={[styles.textSign, {color: colors.primary}]}>Sign In</Text>
						</TouchableOpacity>
					</View>

				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		backgroundColor: '#009387'
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 50
	},
	footer: {
		flex: Platform.OS === 'ios' ? 3 : 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 10,
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 30
	},
	text_footer: {
		color: '#05375a',
		fontSize: 18
	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#c2c2c2', // #f2f2f2
		paddingBottom: 5,
		alignItems: 'flex-end'
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
		minHeight: 25,
	},
	button: {
		alignItems: 'center',
		marginTop: 50
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
	textPrivate: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 20
	},
	color_textPrivate: {
		color: 'grey'
	}
});
