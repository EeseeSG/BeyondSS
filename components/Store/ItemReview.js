// ESSENTIALS
import React from 'react';
import { 
    View, 
	Text,
    Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ItemReview(props) {
    const { review } = props;
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', borderRadius: 5, marginBottom: 10, padding: 5, flex: 1, }}>
            <Image
                style={{ width: 50, height: 50, borderRadius: 50/3, backgroundColor: colors.background }}
                source={{ uri: review.user.avatar }}
            />
            <View style={{ marginLeft: 10, flex: 1, }}>
                <Text style={{ fontWeight: 'bold', }} numberOfLines={1}>{review.user.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons name='star' size={14} color={review.rating >= 1 ? 'green' : colors.backdrop}/>
                    <MaterialCommunityIcons name='star' size={14} color={review.rating >= 2 ? 'green' : colors.backdrop}/>
                    <MaterialCommunityIcons name='star' size={14} color={review.rating >= 3 ? 'green' : colors.backdrop}/>
                    <MaterialCommunityIcons name='star' size={14} color={review.rating >= 4 ? 'green' : colors.backdrop}/>
                    <MaterialCommunityIcons name='star' size={14} color={review.rating >= 5 ? 'green' : colors.backdrop}/>
                </View>
                <Text style={{ fontSize: 12, }} numberOfLines={3}>{review.text}</Text>
            </View>
        </View>   
    )
}