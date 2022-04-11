// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
	Switch,
    Platform,
} from 'react-native';
import * as Colors from '../../constants/Colors';


export default function SwitchInput(props) {
    const { data, item } = props;
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' , flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 15, }}>
            <Switch
                trackColor={{ false: '#767577', true: Colors.dark }}
                thumbColor={Colors.base}
                ios_backgroundColor={"#3e3e3e"}
                onValueChange={item.onChange}
                value={data.tags[item.value]}
            />
            <Text style={[{ fontWeight: 'bold',}, Platform.OS === 'ios' && { marginLeft: 7, }]}>{data.tags[item.value] ? item.yes : item.no}</Text>
        </View>
    )
}