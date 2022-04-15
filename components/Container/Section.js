import React from 'react';
import { 
    View, 
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';

export default function Section(props) {
    const {
        style,
    } = props;
    return (
        <View style={[defaultStyles.section, style]}>
            {props.children}
        </View>
    )
}