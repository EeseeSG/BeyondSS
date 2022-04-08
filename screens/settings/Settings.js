// ESSENTIALS
import React, { useContext } from 'react';
import { 
    StyleSheet, 
    View, 
    ScrollView,
    Text, 
    TouchableOpacity 
} from 'react-native';
import { useTheme } from 'react-native-paper';

// AUTH PROVIDER
import { AuthContext } from '../../navigation/AuthProvider';
import { currentUserData } from '../../database/User';

// SETTIGNS COMPONENETS
import SettingsBlock from '../../components/Settings/SettingBlocks';
import SettingStatic from '../../components/Settings/SettingStatic';

// WEB
import * as WebBrowser from 'expo-web-browser';

export default function Settings({ navigation }) {
    const { colors } = useTheme();
    
    const { logout } = useContext(AuthContext);

    const handleSignOut = async () => {
        logout()
    };

    const _openWebBrowser = async (link) => {
        await WebBrowser.openBrowserAsync(link)
    }

    const _resetPassword = async () => {
        let current_user = await currentUserData();
        await firebase.auth().sendPasswordResetEmail(current_user.email)
            .then(function () {
                Popup.show({
                    type: 'success',
                    title: 'Verification Email Sent',
                    textBody: `A verification email has been sent to ${email}. \n\nPlease check your email to reset your password.`,
                    buttonText: 'Okay',
                    callback: () => Popup.hide()
                })
            }).catch(function (error) {                
                Popup.show({
                    type: 'danger',
                    title: 'An error has occurred',
                    textBody: error.toString(),
                    buttonText: 'Okay',
                    callback: () => Popup.hide()
                })
            })
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>General</Text>
                <SettingsBlock
                    icon='person-add-outline'
                    text='My Profile'
                    onPress={() => {}}
                />
                <SettingsBlock
                    icon='md-chatbox-outline'
                    text='Feedback'
                    onPress={() => {}}
                />
                <SettingsBlock
                    icon='ios-notifications-outline'
                    text='Notification'
                    onPress={() => {}}
                />
                <SettingsBlock
                    icon='md-key-outline'
                    text='Change Password'
                    onPress={_resetPassword}
                />

                <Text style={styles.header}>About</Text>
                <SettingsBlock
                    icon='ios-information-circle-outline'
                    text='About Us'
                    onPress={() => {}}
                />
                <SettingsBlock
                    icon='ios-document-text-outline'
                    text='Terms and Conditions'
                    onPress={() => _openWebBrowser()}
                />
                <SettingsBlock
                    icon='ios-document-text-outline'
                    text='Privacy Policy'
                    onPress={() => _openWebBrowser()}
                />
                <SettingStatic
                    icon='ios-folder-outline'
                    text='Version'
                    subtext='Version 1.0.0'
                />
            </View>

            <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.signIn, { borderColor: colors.primary, borderWidth: 1, marginTop: 25 }]}
            >
                <Text style={[styles.textSign, { color: colors.primary }]}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        padding: 10,
    },
    header: {
        marginTop: 30,
        fontSize: 18,
    },
    content: {
        flex: 1,
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
	},
})