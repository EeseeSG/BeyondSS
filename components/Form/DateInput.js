import React from "react";
import { 
    View, 
    Text, 
    TextInput,
    StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';


function DateInput(props) {
    return (
        <View style={styles.colAuth}>
            <Text style={styles.textAuth}>Date and Time</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.inputAuth, { width: windowWidth - 100 }]} onPress={() => setShowDateTimePicker(true)}>
                    <Text style={[datetimeText !== PLACEHOLDER_DATETIME ? { color: 'black' } : { color: '#D3D3D3' }]}>{datetimeText}</Text>
                </TouchableOpacity>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={'white'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={_toggleHaveDateTime}
                    value={haveDateTime}
                />
            </View>
            <DateTimePickerModal
                isVisible={showDateTimePicker}
                mode="datetime"
                date={new Date(datetime)}
                onConfirm={handleDateTime}
                onCancel={() => setShowDateTimePicker(false)}
            />
        </View>
    )
}

export default DateInput;