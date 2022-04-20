import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity, 
} from 'react-native';
import * as Colors from '../../constants/Colors';
import { defaultStyles } from '../../constants/defaultStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function RoundCTA(props) {
    const {
        onPress,
        style,
        iconName,
        iconColor='#fff',
        iconSize=40,
        iconPadding=30,
        text='',
    } = props;

    return (
        <TouchableOpacity style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, alignSelf: 'flex-start' }, style]} onPress={onPress}>
            <View style={{ width: iconSize + iconPadding, height: iconSize + iconPadding, borderRadius: iconSize + iconPadding, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary, marginBottom: 10, }}>
                <MaterialCommunityIcons 
                    name={iconName}
                    color={iconColor}
                    size={iconSize}
                />
            </View>
            <Text style={[defaultStyles.small, { textAlign: 'center', }]}>{text}</Text>
        </TouchableOpacity>
    )
}