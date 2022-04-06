// ESSENTIALS
import React, { useState, useContext, } from 'react';
import { 
	View, 
	Text,  
	TouchableOpacity, 
	TextInput,
	Platform,
	StyleSheet,
	ScrollView,
	StatusBar,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// AUTH PROVIDER
import { AuthContext } from '../../navigation/AuthProvider';

// ANIMATION
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

// DESIGN
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


const SignInScreen = ({navigation}) => {
	const { colors } = useTheme();

	const { register } = useContext(AuthContext);

	const [data, setData] = useState({
		email: '',
		username: '',
		password: '',
		confirm_password: '',
		check_textInputChange: false,
		secureTextEntry: true,
		confirm_secureTextEntry: true,
	});

	// Data validation
	const [emailValidated, setEmailValidated] = useState(false);
	const [usernameValidated, setUsernameValidated] = useState(false);
	const [passwordValidated, setPasswordValidated] = useState(false);

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

	const _validateEmail = (email) => {
		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	};

	const handleUsernameChange = (val) => {
		if( val.length >= 4 ) {
			setData({
				...data,
				username: val,
				check_usernameChange: true
			});
			setUsernameValidated(true)
		} else {
			setData({
				...data,
				username: val,
				check_usernameChange: false
			});
			setUsernameValidated(false)
		}
	}

	const handlePasswordChange = (val) => {
		setData({
			...data,
			password: val
		});
	}

	const handleConfirmPasswordChange = (val) => {
		setData({
			...data,
			confirm_password: val
		});
	}

	const checkPasswordSame = () => {
		if(data.password.length === 0 || data.confirm_password === 0) {
			setPasswordValidated(false);
			return
		}
		if(data.password === data.confirm_password) {
			setPasswordValidated(true);
			return
		}
		setPasswordValidated(false);
	}

	const updateSecureTextEntry = () => {
		setData({
			...data,
			secureTextEntry: !data.secureTextEntry
		});
	}

	const updateConfirmSecureTextEntry = () => {
		setData({
			...data,
			confirm_secureTextEntry: !data.confirm_secureTextEntry
		});
	}

	const handleRegistration = () => {
		let errorType = 'An error has occurred.';
		if(!passwordValidated) {
			errorType = 'Passwords does not match!'
		}
		if(!emailValidated) {
			errorType = 'Please enter a valid email.'
		}
		if(!usernameValidated) {
			errorType = 'Please enter a username that is at least 4 characters long'
		}
		if(emailValidated && usernameValidated && passwordValidated) {
			registerUser();
			return;
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
		register(data.username, data.email, data.password)
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
						<FontAwesome 
							name="user-o"
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

					<Text style={[styles.text_footer, {marginTop: 35}]}>Username</Text>
					<View style={styles.action}>
						<FontAwesome 
							name="user-o"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Your Username"
							style={styles.textInput}
							onChangeText={(val) => handleUsernameChange(val.trim())}
							autoComplete='username'
						/>
						{
							data.check_usernameChange 
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

					<Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
					<View style={styles.action}>
						<Feather 
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Your Password"
							secureTextEntry={data.secureTextEntry}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => handlePasswordChange(val)}
							onEndEditing={checkPasswordSame}
						/>
						<TouchableOpacity
							onPress={updateSecureTextEntry}
						>
							{
								data.secureTextEntry 
								? 
									<Feather 
										name="eye-off"
										color="grey"
										size={20}
									/>
								:
									<Feather 
										name="eye"
										color="grey"
										size={20}
									/>
							}
						</TouchableOpacity>
					</View>

					<Text style={[styles.text_footer, {marginTop: 35}]}>Confirm Password</Text>
					<View style={styles.action}>
						<Feather 
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput 
							placeholder="Confirm Your Password"
							secureTextEntry={data.confirm_secureTextEntry}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => handleConfirmPasswordChange(val)}
							onEndEditing={checkPasswordSame}
						/>
						<TouchableOpacity
							onPress={updateConfirmSecureTextEntry}
						>
							{
								data.secureTextEntry 
								? 
									<Feather 
										name="eye-off"
										color="grey"
										size={20}
									/>
								:
									<Feather 
										name="eye"
										color="grey"
										size={20}
									/>
							}
						</TouchableOpacity>
					</View>
					<View style={styles.textPrivate}>
						<Text style={styles.color_textPrivate}>
							By signing up you agree to our {" "}
						</Text>
						<TouchableOpacity style={[styles.color_textPrivate, {fontWeight: 'bold'}]} onPress={() => null}>
							<Text>Terms of service</Text>
						</TouchableOpacity>
						<Text style={styles.color_textPrivate}>{" "}and{" "}</Text>
						<TouchableOpacity style={[styles.color_textPrivate, {fontWeight: 'bold'}]} onPress={() => null}>
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
								<Text style={[styles.textSign, {color:'#fff'}]}>Sign Up</Text>
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
		color: '#05375a'
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
