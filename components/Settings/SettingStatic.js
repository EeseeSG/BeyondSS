import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export default function SettingsBlock(props) {
    const { icon, text, subtext } = props;
    return (
        <View style={{ width: '100%', paddingHorizontal: 30, marginTop: 25, }}>
            <View style={{ flexDirection: 'row', }}>
                <Icon color='black' name={icon} size={20}/>
                <View>
                    <Text style={{ marginHorizontal: 20, color: 'black', fontSize: 16 }}>{text}</Text>
                    <Text style={{ marginHorizontal: 20, color: '#aaa', fontSize: 12 }}>{subtext}</Text>
                </View>
            </View>
        </View>
    )
}