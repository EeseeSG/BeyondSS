// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    FlatList, 
} from 'react-native';
import { useTheme } from 'react-native-paper';

export default function CategoryCarousel(props) {
    const { data } = props;
    const { colors } = useTheme();

    const renderItem = (data) => (
        <TouchableOpacity style={{ marginRight: 30, }}>
            <View style={{ width: 55, height: 55, backgroundColor: '#fff', borderRadius: 15, padding: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.primary }}> 
                <Image
                    style={{ width: 35, height: 35, }}
                    // source={{ uri: data.item.image }}
                    source={data.item.image}
                />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, opacity: 0.6, marginTop: 5, }}>{data.item.category}</Text>
        </TouchableOpacity>
    )

    return (
        <FlatList
            horizontal
            data={data}
            renderItem={renderItem}
            style={{ marginTop: 30, }}
            showsHorizontalScrollIndicator={false}
        />
    )
}
