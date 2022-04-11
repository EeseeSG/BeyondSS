// ESSENTIALS
import React, { useState, useContext, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
	ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// AUTH PROVIDER
import { AuthContext } from '../../navigation/AuthProvider';

// ANIMATION
import * as Animatable from 'react-native-animatable';

// DESIGN
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

// COMPONENTS
import CustomTextInput from '../../components/Form/TextInput';

// FIREBASE
import firebase from 'firebase';
require('firebase/firestore');

export default function SignInScreen({navigation}) {
	const { colors } = useTheme();

	const { login } = useContext(AuthContext);

	const [data, setData] = useState({
		email: '',
		password: '',
		check_textInputChange: false,
		secureTextEntry: true,
		isValidUser: true,
		isValidPassword: true,
	});
    
	const handleEmailChange = (val) => {
		if( val.trim().length >= 4 ) {
			setData({
				...data,
				email: val.trim().toLowerCase(),
				check_textInputChange: true,
				isValidUser: true
			});
		} else {
			setData({
				...data,
				email: val.trim().toLowerCase(),
				check_textInputChange: false,
				isValidUser: false
			});
		}
	}

	const handlePasswordChange = (val) => {
		if( val.trim().length >= 6 ) {
			setData({
				...data,
				password: val,
				isValidPassword: true
			});
		} else {
			setData({
				...data,
				password: val,
				isValidPassword: false
			});
		}
	}

	const updateSecureTextEntry = () => {
		setData({
			...data,
			secureTextEntry: !data.secureTextEntry
		});
	}

	const handleValidUser = (val) => {
		if( val.trim().length >= 4 ) {
			setData({
				...data,
				isValidUser: true
			});
		} else {
			setData({
				...data,
				isValidUser: false
			});
		}
	}

	const loginHandle = () => {
		// check for email and password field if they have been input
		if(data.email.length == 0 || data.password.length == 0) {
			Popup.show({
				type: 'danger',
				title: 'Wrong Input!',
				textBody: 'Username or password field cannot be empty.',
				buttonText: 'Okay',
				callback: () => Popup.hide()
			})
			return;
		}
		signIn();
	}

	const signIn = async () => {
		// check firebase
		let results = await firebase.firestore()
			.collection('users')
			.where('email', '==', data.email)
			.get()
			.then((snapshot) => snapshot)

		if(results.docs.length !== 0) {
			login(data.email, data.password)
		} else {
			Popup.show({
				type: 'danger',
				title: 'Access Error',
				textBody: 'No such user found.',
				buttonText: 'Close',
				callback: () => Popup.hide()
			})
		}
	}

	// =======================================================================================================================
	// == DISPLAY ==
	// =======================================================================================================================
	return (
		<View style={[styles.container, { backgroundColor: colors.secondary, }]}>
			<StatusBar backgroundColor={colors.secondary} barStyle="light-content"/>
			<View style={styles.header}>
				<Text style={styles.text_header}>Welcome!</Text>
			</View>
			<Animatable.View 
				animation="fadeInUpBig"
				style={[styles.footer, { backgroundColor: colors.background }]}
			>
				<ScrollView showsVerticalScrollIndicator={false}>

					<CustomTextInput
						header={"Email"}
						fontIcon={"envelope"}
						placeholder={"Your Email"}
						onChangeText={handleEmailChange}
						isValidInput={data.check_textInputChange}
						keyboardType={'email-address'}
						autoCap={'none'}
						validationText={'Please enter email in the correct format.'}
					/>

					
					<CustomTextInput
						header={"Password"}
						fontIcon={"lock"}
						placeholder={"Your Password"}
						onChangeText={handlePasswordChange}
						isValidInput={data.isValidPassword}
						keyboardType={'email-address'}
						autoCap={'none'}
						validationText={'Password must be 6 characters long.'}
						isSecureText={data.secureTextEntry}
						onSecureTextPress={updateSecureTextEntry}
					/>

					<TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
						<Text style={{color: '#333333', marginTop:15}}>Forgot password?</Text>
					</TouchableOpacity>
					<View style={styles.button}>
						<TouchableOpacity
							style={styles.signIn}
							onPress={loginHandle}
						>
							<LinearGradient
								colors={[colors.secondary, colors.primary]}
								style={styles.signIn}
							>
								<Text style={[styles.textSign, { color:'#fff' }]}>Sign In</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => navigation.navigate('SignUpScreen')}
							style={[styles.signIn, { borderColor: colors.primary, borderWidth: 1, marginTop: 15 }]}
						>
							<Text style={[styles.textSign, { color: colors.primary }]}>Register</Text>
						</TouchableOpacity>
					</View>

				</ScrollView>
			</Animatable.View>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1, 
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 50
	},
	footer: {
		flex: 3,
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
	actionError: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		paddingBottom: 5
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
	},
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
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
});
