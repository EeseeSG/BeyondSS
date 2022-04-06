import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export default function SettingsBlock(props) {
    const { icon, text, onPress } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Icon color='black' name={icon} size={20}/>
            <Text style={{ flex: 1, marginHorizontal: 20, color: 'black', fontSize: 16 }}>{text}</Text>
            <Icon color='black' name='ios-chevron-forward' size={20}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        width: '100%', 
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5, 
        marginTop: 10,
        backgroundColor: '#ffffff',
    }
})