// BASIC IMPORTS
import React, { useState, useEffect } from 'react';
import { 
	Text, 
	View, 
	Image, 
	TouchableOpacity, 
	StyleSheet, 
	Dimensions, 
	ScrollView,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';

// STYLE SPECIFIC IMPORTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Colors from '../../constants/Colors';

// CAMERA SPECIFIC IMPORTS
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// FIREBASE SPECIFIC IMPORTS
import * as ProjectData from '../../database/Project';
import firebase from 'firebase';
require('firebase/firestore');
require("firebase/firebase-storage");

import CustomTextInput from '../../components/Form/TextInput';
import ReceiptList from '../../components/Project/ReceiptList';


export default function UploadReceipt(props) {
	const { project, currentUser, } = props.route.params;

	// user info
	const [uploadedReceipts, setUploadedReceipts] = useState([]);

	// Permissions
	const [hasCameraPermission, setCameraPermission] = useState(null);
	const [hasGalleryPermission, setGalleryPermission] = useState(null);
	
	// image handling
	const [selectImage, setSelectImage] = useState(null);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);

	// receipt 
	const [amount, setAmount] = useState(null)
	const [isValidAmount, setIsValidAmount] = useState(null)


	// ## ==================================================================================================================================================== ##
	// ## == HOOKS == ##
	// ## ==================================================================================================================================================== ##
	useEffect(() => {
		(async () => {
			// Check if there is permission to access camera
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setCameraPermission(cameraStatus.status === 'granted');

			// Check if there is permission to access gallery
			const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
			setGalleryPermission(galleryStatus.status === 'granted');
		})();
	}, []);

	useEffect(() => {
		async function _getUploadedReceipts() {
			let receipt_arr = await ProjectData.getUploadedReceipt(project._id)
			let parsed_receipt_arr = receipt_arr.map((receipt, index) => {
				return {
					...receipt,
					index,
				}
			})
			setUploadedReceipts(parsed_receipt_arr)
		}
		return _getUploadedReceipts()
	}, [])



	const _resetAll = () => {
		setImage(null)
		setSelectImage(null)
	}


	// ## ==================================================================================================================================================== ##
	// ## == TAKE PHOTO == ##
	// ## ==================================================================================================================================================== ##
	const takePicture =  async () => {
		if(camera) {
			const data = await camera.takePictureAsync(null);
			setImage(data.uri);
		};
	};

	// ## ==================================================================================================================================================== ##
	// ## == PICK PHOTO FROM GALLEY == ##
	// ## ==================================================================================================================================================== ##
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.cancelled) {
			setImage(result.uri);
			setSelectImage(true)
		};
	};

	// ## ==================================================================================================================================================== ##
	// ## == FILE HANDLING == ##
	// ## ==================================================================================================================================================== ##
	const saveImage = async () => {
		console.log(amount)
		if(amount === '' || amount === null) {
			Popup.show({
				type: 'danger',
				title: 'Invalid Input',
				textBody: "Please enter amount spent inclusive of GST.",
				buttonText: 'Close',
				callback: () => Popup.hide()
			})
			return
		}
		const month_year = moment(project.datetime.seconds * 1000, 'YYYY-MM');
		const image_id = moment()
		const childPath = `receipts/${month_year}/${currentUser._id}-${project._id}/${image_id}.png`;

		// Create blob for image
		const response = await fetch(image); // uri will be the image source
		const blob = await response.blob(); // create a blob to pass into firestore

		// save into firebase storage
		const task = firebase.storage()
			.ref()
			.child(childPath)
			.put(blob);

		// check how much has been transferred
		const taskProgress = snapshot => {
			console.log(`transferred: ${snapshot.bytesTransferred}`);
		}

		// get download url which is publicly accessed by everyone
		const taskCompleted = () => {
			task.snapshot.ref.getDownloadURL().then(async (snapshot) => {
				let data = {
					createdAt: new Date(),
					amount: parseFloat(amount),
					user: currentUser,
					url: snapshot,
					path: childPath,
					project: project,
					project_id: project._id,
					isApproved: null,
					isClaimed: null,
				}
				let result = await ProjectData.uploadReceipt(data)
				if(result.success) {
					Popup.show({
						type: 'success',
						title: 'Success!',
						textBody: 'You have successfully uploaded the receipt. Please give us some time to process and get back to you on the claims.',
						buttonText: 'Close',
						callback: () => {
							Popup.hide()
							props.navigation.goBack()
						}
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
			})
		}

		// see error if there is
		const taskError = snapshot => {
			console.log(snapshot);
		}

		task.on("state_change", taskProgress, taskError, taskCompleted);
	}

	// ## ==================================================================================================================================================== ##
	// ## == RENDER DISPLAY == ##
	// ## ==================================================================================================================================================== ##
	const handleAmoutInput = (val) => {
		if(val !== '') {
			setAmount(val)
			setIsValidAmount(true)
		} else {
			setIsValidAmount(false)
		}
	}


	// ## ==================================================================================================================================================== ##
	// ## == RENDER DISPLAY == ##
	// ## ==================================================================================================================================================== ##
	if (hasCameraPermission === null || hasGalleryPermission === null) {
		return <Text>No access to camera and/or gallery</Text>;
	}

	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera and/or gallery</Text>;
	}

	return (
		<View style={[styles.container, {backgroundColor: 'white'}]}>
			{ 
				!selectImage
				?
					<View style={{ height: Dimensions.get('window').height, width: '100%', }}>
						<View style={{ marginHorizontal: 10, }}>
							<Text style={{ fontSize: 16, fontWeight: 'bold' }}>DISCLAIMER: </Text>
							<Text style={{ color: 'black', fontWeight: 'bold', marginTop: 10, }}>Please take reasonable efforts to mask any sensitive, confidential or private information​, whether yourself or other parties.</Text>
						</View>
						<TouchableOpacity style={[styles.primaryButton, styles.shadow, { margin: 10, }]} onPress={() => pickImage()}>
							<MaterialCommunityIcons name="panorama" size={25} color="white"/>
							<Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'white' }}>Choose from Gallery</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.primaryButton, styles.shadow, { margin: 10, }]} onPress={() => setSelectImage(true)}>
							<MaterialCommunityIcons name="camera" size={25} color="white"/>
							<Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'white' }}>Take a Photo</Text>
						</TouchableOpacity>
						<View style={{ marginTop: 20, alignItems:'center', marginHorizontal: 30, }}>
							<Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 15, }}>Uploaded Receipts</Text>
							<ReceiptList
								data={uploadedReceipts}
							/>
						</View>
					</View>
				:
					image
					?
						<ScrollView>
							<View style={styles.cameraContainer}>
								<Image source={{ uri: image }} style={{ height: '100%', width: '100%', resizeMode: 'center', }}/>
							</View>
							<View style={{ marginHorizontal: 20, }}>
								<CustomTextInput
									header={"Please enter amount"}
									fontIcon={"dollar"}
									placeholder={"Receipt Amount (Grand Total w GST)"}
									onChangeText={handleAmoutInput}
									isValidInput={isValidAmount}
									keyboardType={'number-pad'}
									autoCap={'none'}
									containerStyle={{ marginTop: 0, }}
								/>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									<TouchableOpacity style={styles.confirmButton} onPress={() => _resetAll()}>
										<MaterialCommunityIcons name={"camera-retake-outline"} size={25} color="grey" />
									</TouchableOpacity>
									<TouchableOpacity style={styles.confirmButton} onPress={() => saveImage()}>
										<MaterialCommunityIcons name="check" size={25} color="green" />
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					:
						<View style={{ flex: 1, }}>
							<Camera 
								ref={ref => setCamera(ref)}
								style={styles.fixedRatio} 
								type={type}
							>
								<View style={styles.buttonContainer}>
									<TouchableOpacity style={styles.circularButton} onPress={() => pickImage()}>
										<MaterialCommunityIcons name="panorama" size={25} color="#000064" />
									</TouchableOpacity>
									<TouchableOpacity style={styles.circularButton} onPress={() => takePicture()}>
										<MaterialCommunityIcons name="camera" size={25} color="grey" />
									</TouchableOpacity>
									<TouchableOpacity style={styles.circularButton} onPress={() => {
										setType(
											type === Camera.Constants.Type.back
											? Camera.Constants.Type.front
											: Camera.Constants.Type.back
										);
										}}>
										<MaterialIcons name={Platform.OS === 'android' ? "flip-camera-android" : "flip-camera-ios"} size={25} color="black" />
									</TouchableOpacity>
								</View>
							</Camera>
						</View>
			}

		</View>
	);
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: '100%',
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
    },
	headerText: {
        color: 'white', 
        marginLeft: 20, 
        fontWeight: 'bold', 
        fontSize: 20, 
    },
	cameraContainer: {
        height: (Dimensions.get('window').height - 70) * 0.8,
        width: Dimensions.get('window').width,
    },
	fixedRatio: {
        flex: 1,
    },
    resultContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    circularButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 50,
        margin: 15,
    },
	buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
		backgroundColor: 'transparent',
		position: 'absolute',
		bottom: 0,
		width: '100%'
    },
    photoText: {
        fontSize: 20,
        textAlign: 'center',
    },
    confirmButton: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 50,
        margin: 10,
    },
	shadow: {
        // ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,  
        // android
        elevation: 5,
    },
    primaryButton: {
        width: Dimensions.get('screen').width - 20,
        borderRadius: 30, 
        backgroundColor: Colors.primary, 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: 10,
        height: 50, 
    },
})