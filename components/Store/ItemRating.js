// ESSENTIALS
import React from 'react';
import { 
    View, 
	Text,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ItemRating(props) {
    const { ratings } = props;
    const { colors } = useTheme();
    let total_count = ratings.map((r) => r.data).flat().length;
    let total_count_value = ratings.map((r) => r.data.length * r.rating).flat().reduce((a, b) => a + b, 0);
    let average_ratings = total_count_value / total_count;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <MaterialCommunityIcons name='star' size={14}/>
            <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: 'bold', color: colors.darkGrey, }}>{average_ratings.toFixed(1)}</Text>
        </View>
    )
}