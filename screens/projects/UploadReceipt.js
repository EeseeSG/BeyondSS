// BASIC IMPORTS
import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, } from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';

// STYLE SPECIFIC IMPORTS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// CAMERA SPECIFIC IMPORTS
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// FIREBASE SPECIFIC IMPORTS
import firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';
require('firebase/firestore');
require("firebase/firebase-storage");


export default function UploadReceipt(props) {

	const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

	// user info
	const [currentUser, setCurrentUser] = useState([]);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [imageCount, setImageCount] = useState(0);

	// Permissions
	const [hasCameraPermission, setCameraPermission] = useState(null);
	const [hasGalleryPermission, setGalleryPermission] = useState(null);
	
	// image handling
	const [selectImage, setSelectImage] = useState(null);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);


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
		firebase.firestore()
			.collection('users')
			.doc(firebase.auth().currentUser.uid)
			.onSnapshot((snapshot) => {
				let _id = snapshot.id;
				let data = snapshot.data();
				setCurrentUser({ _id, ...data })
				if(data.uploadedProof !== undefined) {
					setUploadedImages(data.uploadedProof)
					setImageCount(data.uploadedProof.length)
				}
			})
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
	const saveFirestore = async (snapshot) => {
		firebase.firestore()
			.collection('users')
			.doc(currentUser._id)
			.update({
				uploadedProof: firebase.firestore.FieldValue.arrayUnion(snapshot),
			})
		props.navigation.goBack(); // navigate back
	};
	

	const saveImage = async () => {

		// check if limit of 5 is reached
		if(imageCount >= 5) {
            Popup.show({
                type: 'warning',
                title: 'Limit reached',
                textBody: 'Maximum number of uploads reached. You may only upload up to 5 images.',
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
			return
		}

		// else, continue
		const childPath = `profile_proof/${currentUser._id}/${imageCount}.png`;

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
			task.snapshot.ref.getDownloadURL().then((snapshot) => {
				saveFirestore(snapshot);
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
	if (hasCameraPermission === null || hasGalleryPermission === null) {
		return <View />;
	}

	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={[styles.container, {backgroundColor: 'white'}]}>
			{ 
				!selectImage
				?
					<View style={{ height: Dimensions.get('window').height, width: '100%', }}>
						<View style={{ marginHorizontal: 10, }}>
							<Text style={{ fontSize: 16, fontWeight: 'bold' }}>DISCLAIMER: </Text>
							<Text style={{ color: 'black' }}>Please take note and double check for any <Text style={{ fontWeight: 'bold' }}>sensitive</Text> document / information that you are intending to upload.</Text>
							<Text style={{ color: 'black', marginTop: 10, }}>When you upload any documents, you are deemed to have acknowledged and agree that TutorsSG shall not be responsible or liable, whether directly or indirectly, for any damages or loss caused or sustained by the user (yourself), in connection with any use of the uploaded information.​</Text>
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
						<View style={{ marginTop: 20, alignItems:'center' }}>
							<Text style={{ fontWeight: 'bold', fontSize: 20, }}>Uploaded Images</Text>
							<FlatList
								numColumns={2}
								data={uploadedImages}
								ListEmptyComponent={() => (<Text>No images uploaded.</Text>)}
								keyExtractor={(_, index) => index.toString()}
								renderItem={({item}) => (
									<TouchableOpacity>
										<Image
											source={{ uri: item }}
											style={{ width: Dimensions.get('window').width / 2, aspectRatio: 1, resizeMode: 'cover' }}
										/>
									</TouchableOpacity>

								)}
							/>
						</View>
					</View>
				:
					image
					?
						<View>
							<View style={[styles.cameraContainer, { marginVertical: 10, }]}>
								<Image source={{ uri: image }} style={{ height: '100%', width: '100%', resizeMode: 'center', }}/>
							</View>
							<View>
								<Text style={styles.photoText}>Satisfied with your image?</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									<TouchableOpacity style={styles.confirmButton} onPress={() => _resetAll()}>
										<MaterialCommunityIcons name={"camera-retake-outline"} size={25} color="grey" />
									</TouchableOpacity>
									<TouchableOpacity style={styles.confirmButton} onPress={() => saveImage()}>
										<MaterialCommunityIcons name="check" size={25} color="green" />
									</TouchableOpacity>
								</View>
							</View>
						</View>
					:
						<View style={{ height: Dimensions.get('window').height, width: windowWidth }}>
							<Camera 
								ref={ref => setCamera(ref)}
								style={styles.fixedRatio} 
								type={type}
							>
								<TouchableOpacity style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.5)', width: 35, height: 35, borderRadius: 35/2, justifyContent: 'center', alignItems: 'center', }} onPress={() => setSelectImage(false)}>
									<MaterialCommunityIcons name="arrow-left" size={25} color="#000064" />
								</TouchableOpacity>
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
        borderRadius: 10, 
        backgroundColor: '#9980D3', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: 10,
        height: 50, 
    },

})