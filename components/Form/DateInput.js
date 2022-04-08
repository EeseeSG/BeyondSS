import React, { useState } from "react";
import { 
    View, 
    Text, 
    Button,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';


export default function CustomTextInput(props) {
    const {
        header,
        fontIcon,
        date,
        textColor="black",
        iconColor=textColor,
        setDate,
        isValidInput,
        validationText='Please enter in the correct format.',
    } = props;

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);

        if(mode === 'date') {
            showTimepicker()
            return
        } else {
            setShow(false);
            return
        }
    };
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
    };
    
    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View>
            <Text style={[styles.text_footer, { color: textColor, marginTop: 30, }]}>Date and Time</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name={fontIcon}
                    color={iconColor}
                    size={20}
                />
                <TouchableOpacity style={[styles.textInput, { color: textColor }]} onPress={showDatepicker}>
                    <Text>{moment(date).format('LLL')}</Text>
                </TouchableOpacity>               
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        onChange={onChange}
                    />
                )}
                {
                    (isValidInput && isValidInput !== null) && (
                        <Animatable.View animation="bounceIn">
                            <Feather name="check-circle" color="green" size={20}/>
                        </Animatable.View>
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
		alignItems: 'flex-end'
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
    longTextInput: {
        textAlignVertical: 'top',
        marginTop: 3,
	},
});
