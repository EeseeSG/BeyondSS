import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import moment from 'moment';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const ORDER_CARD_WIDTH =  windowWidth * 0.7;
export default function CartItem(props) {
    const { cart, index, style={} } = props;
    const { colors } = useTheme();
    return (
        <View key={index} style={styles.container}>
            <View style={{ flexDirection: 'row', flex: 1, }}>
                <Image
                    style={{ width: 70, height: 70, borderRadius: 5, backgroundColor: '#A9A9A9', margin: 10, }}
                    source={{ uri: cart.product_data.image }}
                />
                <View style={{ flex: 1, }}>
                    <View style={{ margin: 10, flex: 1, }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }} numberOfLines={2}>{cart.product_data.text}</Text>
                        <Text style={{ fontSize: 12, }} numberOfLines={1}>({cart.order_data.selection.item.size})</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end'}}>
                            <Text style={{ fontSize: 13, }} numberOfLines={1}>{cart.order_data.quantity}x</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10, }} numberOfLines={1}>${cart.order_data.selection.item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        </View>
                    </View>
                    <View style={[styles.cartTotalPrice, { backgroundColor: colors.dark, }]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#fff', opacity: 0.9, }} numberOfLines={1}>${(cart.order_data.quantity * cart.order_data.selection.item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#fff', 
        marginRight: 20, 
        width: ORDER_CARD_WIDTH, 
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 0.5, 
    },
    cartTotalPrice: { 
        alignSelf: 'flex-end', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        borderColor: '#ccc', 
        borderTopWidth: 0.5, 
        borderLeftWidth: 0.5, 
        borderTopStartRadius: 10, 
        borderBottomEndRadius: 10, 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
    },
    primaryBtn: { 
        padding: 10, 
        margin: 5, 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: '#ccc', 
    },
})