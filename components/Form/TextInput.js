import React from "react";
import { 
    View, 
    Text, 
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';


export default function CustomTextInput(props) {
    const {
        header,
        fontIcon,
        value,
        placeholder=header,
        placeholderTextColor="#666666",
        keyboardType="default",
        autoCap="sentences",
        textColor="black",
        iconColor="#05375a",
        onChangeText,
        isValidInput,
        validationText='Please enter in the correct format.',
        numberOfLines=1,
        maxLength=1000,
        isPassword=false,
        secureTextEntry=false,
        onSecureTextPress=() => {},
        containerStyle={},
    } = props;
    return (
        <View>
            <Text style={[styles.text_footer, { color: textColor, marginTop: 30, }, containerStyle]}>{header}</Text>
            <View style={styles.action}>
                {
                    numberOfLines === 1 && (
                        <FontAwesome 
                            name={fontIcon}
                            color={iconColor}
                            size={20}
                        />
                    )
                }
                <TextInput 
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={keyboardType}
                    style={[styles.textInput, { color: textColor }, numberOfLines !== 1 && styles.longTextInput]}
                    autoCapitalize={autoCap}
                    onChangeText={(val) => onChangeText(val)}
                    numberOfLines={numberOfLines}
                    multiline={numberOfLines > 1}
                    value={value}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                />
                {
                    isPassword ? (
                        <TouchableOpacity
                            onPress={onSecureTextPress}
                        >
                            {
                                secureTextEntry
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
                    ) : (
                        numberOfLines === 1 && (isValidInput && isValidInput !== null) && (
                            <Animatable.View animation="bounceIn">
                                <Feather name="check-circle" color="green" size={20}/>
                            </Animatable.View>
                        )
                    )
                }
            </View>
            { 
                (!isValidInput && isValidInput !== null) && (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{validationText}</Text>
                    </Animatable.View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
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
		alignItems: 'center',
        justifyContent: 'center',
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
        minHeight: 35,
        textAlignVertical: 'bottom'
	},
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
	},
    longTextInput: {
        textAlignVertical: 'top',
        marginTop: 3,
	},
});
