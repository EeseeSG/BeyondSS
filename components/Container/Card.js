import React from 'react';
import { 
    View, 
    TouchableOpacity, 
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';

export default function Card(props) {
    const {
        isPressable,
        onPress,
        style,
    } = props;
    if(isPressable) {
        return (
            <TouchableOpacity style={[defaultStyles.card, defaultStyles.shadow, style]} onPress={onPress}>
                {props.children}
            </TouchableOpacity>
        )  
    }
    return (
        <View style={[defaultStyles.card, defaultStyles.shadow, style]}>
            {props.children}
        </View>
    )
}