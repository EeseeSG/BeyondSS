// ESSENTIALS
import React, { useState, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Platform,
    StyleSheet ,
    StatusBar,
	ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// ANIMATION
import * as Animatable from 'react-native-animatable';

// DESIGN
import { LinearGradient } from 'expo-linear-gradient';

// COMPONENTS
import CustomTextInput from '../../components/Form/TextInput';

// FIREBASE
import firebase from 'firebase';
require('firebase/firestore');

export default function ForgetPasswordScreen({navigation}) {
	const { colors } = useTheme();

	const [data, setData] = useState({
		email: '',
		check_textInputChange: false,
	});

    const _forgotPassword = async () => {
		if(!data.check_textInputChange) {
			return;
		}
        await firebase.auth().sendPasswordResetEmail(data.email)
            .then(function () {
                Popup.show({
                    type: 'success',
                    title: 'Verification Email Sent',
                    textBody: `A verification email has been sent to ${data.email}. \n\nPlease check your email to reset your password.`,
                    buttonText: 'Okay',
                    callback: () => Popup.hide()
                })
            }).catch(function (error) {                
                Popup.show({
                    type: 'danger',
                    title: 'An error has occurred. Please try again.',
                    textBody: error.toString(),
                    buttonText: 'Okay',
                    callback: () => Popup.hide()
                })
            })
    }

	const handleEmailChange = (val) => {
		if(_validateEmail(val)) {
			setData({
				...data,
				email: val,
				check_textInputChange: true
			});
		} else {
			setData({
				...data,
				email: val,
				check_textInputChange: false
			});
		}
	}

	const _validateEmail = (email) => {
		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	};

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
		
					<View style={styles.button}>
						<TouchableOpacity
							style={styles.signIn}
							onPress={_forgotPassword}
						>
							<LinearGradient
								colors={[colors.secondary, colors.primary]}
								style={styles.signIn}
							>
								<Text style={[styles.textSign, { color:'#fff' }]}>Reset Password</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => navigation.navigate('SignInScreen')}
							style={[styles.signIn, { borderColor: colors.primary, borderWidth: 1, marginTop: 15 }]}
						>
							<Text style={[styles.textSign, { color: colors.primary }]}>Sign In</Text>
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
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
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
