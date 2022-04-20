// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text,
    Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';


export default function CustomCheckBox(props) {
    const { data, item } = props;
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' , flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 15, }}>
            <Checkbox
                onValueChange={item.onChange}
                value={data.tags[item.value]}
                style={{ marginRight: 10, }}
            />
            <Text style={[{ fontWeight: 'bold',}, Platform.OS === 'ios' && { marginLeft: 7, }]}>{data.tags[item.value] ? item.yes : item.no}</Text>
        </View>
    )
}