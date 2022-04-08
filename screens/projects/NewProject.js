// ESSENTIALS
import React, { useEffect, useState, useContext, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
	ScrollView,
	Image
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// ANIMATION
import * as Animatable from 'react-native-animatable';

// DESIGN
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

// DATA
import * as ProjectData from '../../database/Project';

// COMPONENT
import CustomTextInput from '../../components/Form/TextInput';

export default function SignInScreen({navigation}) {
	const { colors } = useTheme();

    //=====================================================================================================================
    //==  DATA SUMMARY ==
    //=====================================================================================================================
	const [data, setData] = useState({
		title: '',
		location: '',
        message: '',
		isValidName: null,
		isValidLocation: null,
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


    //=====================================================================================================================
    //==  SUBMIT ==
    //=====================================================================================================================
    const checkValidation = () => {
		if(data.email.length == 0 || data.password.length == 0) {
			return false;
		}
        return true
    }

	const submitHandler = async () => {
		// check for email and password field if they have been input
        let validated = checkValidation();
        if(!validated) {
            Popup.show({
                type: 'danger',
                title: 'Wrong Input!',
                textBody: 'Username or password field cannot be empty.',
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
            return;
        }

		let result = await ProjectData.createProject(data);
        if(result.success) {
            Popup.show({
                type: 'success',
                title: 'Success!',
                textBody: 'You have successfully create a food distribution event! Thank you for your contribution!',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
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
                    fontIcon={"user-o"}
                    placeholder={"Enter name of food"}
                    onChangeText={nameHandler}
                    isValidInput={data.isValidName}
                    validationText={"Username must be 4 characters long"}
                />

                <CustomTextInput
                    header={"Collection Location"}
                    fontIcon={"user-o"}
                    placeholder={"Please enter location of collection"}
                    onChangeText={locationHandler}
                    isValidInput={data.isValidLocation}
                    validationText={"Please enter a valid location"}
                />

                <CustomTextInput
                    header={"Message"}
                    fontIcon={"user-o"}
                    placeholder={"Enter any message you would like to convey"}
                    onChangeText={messageHandler}
                    isValidInput={true}
                    numberOfLines={5}
                />



                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={submitHandler}
                    >
                        <LinearGradient
                            colors={[colors.secondary, colors.primary]}
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
        margin: 15,
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
