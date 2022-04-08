// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// ANIMATION
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

// DESIGN
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// CONFIG
const { width } = Dimensions.get("screen");
const height_logo = width * 0.55;

export default function SplashScreen({navigation}) {
	const { colors } = useTheme();
	return (
		<View style={[styles.container, { backgroundColor: colors.secondary, }]}>
			<StatusBar backgroundColor={colors.secondary} barStyle="light-content"/>
			<View style={styles.header}>
				<Animatable.View
					animation="bounceIn"
					duration={1500}
				>
					<LottieView
						source={require('../../assets/animation/recipes.json')}
						autoPlay
						loop
						style={styles.logo}
					/>
				</Animatable.View>
			</View>
			<Animatable.View 
				style={[styles.footer, { backgroundColor: 'white' }]}
				animation="fadeInUpBig"
			>
				<Text style={[styles.title, { color: 'black' }]}>Supporting Those In Need</Text>
				<Text style={styles.text}>Sign in with account</Text>
				<View style={styles.button}>
					<TouchableOpacity onPress={()=> navigation.navigate('SignInScreen')}>
						<LinearGradient
							colors={[colors.secondary, colors.primary]}
							style={styles.signIn}
						>
							<View style={styles.textContainer}>
								<Text style={styles.textSign}>Start</Text>
							</View>
							<MaterialCommunityIcons 
								name="arrow-right-drop-circle-outline"
								color="#fff"
								size={28}
							/>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30
	},
	logo: {
		width: height_logo,
		height: height_logo
	},
	title: {
		color: '#05375a',
		fontSize: 30,
		fontWeight: 'bold'
	},
	text: {
		color: 'grey',
		marginTop:5
	},
	button: {
		alignItems: 'flex-end',
		marginTop: 30
	},
	signIn: {
		width: 150,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		flexDirection: 'row',
		padding: 10,
	},
	textContainer: {
		flex: 1,
	},
	textSign: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

