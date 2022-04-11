import React from 'react';
import { 
	View, 
	Text,  
	TouchableOpacity, 
	Platform,
	StyleSheet,
	Picker,
	ActionSheetIOS,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';


export default function Dropdown(props) {
    const { title, selected, onChange, isValid, choices, } = props;

	const onIOSTypePress = () => {
        const optionsList = ['Close', ...choices.map((choice) => choice.label)];

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
						onChange(choices[buttonIndex - 1].value)
					}
				}
			)
		)
	}

    return (
        <>
            <Text style={[styles.text_footer, {marginTop: 35}]}>{title}</Text>
            <View style={styles.action}>
                {
                    Platform.OS === 'ios' ? (
                        <TouchableOpacity style={styles.textInput} onPress={onIOSTypePress}>
                            <Text>
                                {
                                    selected == '' ? (
                                        'Please select an option...'
                                    ) : ( 
                                        choices.filter((choice) => choice.value === selected)[0].label
                                    )
                                }
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <Picker
                            selectedValue={selected}
                            style={styles.textInput}
                            onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
                        >
                            <Picker.Item label='Please select an option...' value='' />
                            {
                                choices.map((choice) => (
                                    <Picker.Item label={choice.label} value={choice.value} />
                                ))
                            }
                        </Picker>
                    )
                }

                {
                    isValid && (
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather 
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                    )
                }
            </View>
        </>
    )
}


const styles = StyleSheet.create({
	footer: {
		flex: Platform.OS === 'ios' ? 3 : 5,
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
		alignItems: 'flex-end'
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
		minHeight: 25,
	},
});
