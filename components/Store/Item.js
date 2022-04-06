// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
} from 'react-native';


export default function Item(props) {
    const { item, navigation } = props;

    return (
        <TouchableOpacity style={[styles.card, styles.shadow]} onPress={() => navigation.navigate('FoodItem', { data: item, })}>
            <View style={{ padding: 5, height: 150, }}>
                <Image
                    style={{ width: '100%', height: '100%', borderRadius: 15, backgroundColor: '#A9A9A9' }}
                    source={{ uri: item.image }}
                    resizeMethod='auto'
                    resizeMode='cover'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={{ fontSize: 12, flex: 1, }} numberOfLines={2}>{item.text}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', }} numberOfLines={1}>${item.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: { 
        height: 200, 
        width: 160,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 15, 
    },
    textContainer: { 
        width: '100%', 
        flexDirection: 'row', 
        paddingHorizontal: 10, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})