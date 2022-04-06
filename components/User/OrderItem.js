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
export default function OrderItem(props) {
    const { order, index, style={} } = props;
    const { colors } = useTheme();
    return (
        <View key={index} style={[styles.container, style]}>
            <View style={{ flexDirection: 'row', margin: 10, flex: 1, }}>
                <Image
                    style={styles.image}
                    source={{ uri: order.product_data.image}}
                />
                <View style={{ marginLeft: 10, flex: 1, }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }} numberOfLines={1}>{order.product_data.text}</Text>
                    <Text style={{ fontSize: 12, }} numberOfLines={3}>{order.product_data.description}</Text>
                </View>
            </View>
            <View style={[styles.deliveryContainer, { backgroundColor: colors.dark, }]}>
                <Icon color='#fff' name='timer-outline' size={20}/>
                <Text style={{ color: '#fff', opacity: 0.9, fontWeight: 'bold', marginLeft: 5, flex: 1, }}>{moment(order.deliveryDate.seconds * 1000).format('LL')}</Text>
                <Text style={{ color: '#fff', fontSize: 12, opacity: 0.7, }}>{moment(order.deliveryDate.seconds * 1000).fromNow()}</Text>
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
    image: { 
        width: 70, 
        height: 70, 
        borderRadius: 5, 
        backgroundColor: '#A9A9A9',
    },
    deliveryContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderBottomEndRadius: 10, 
        borderBottomStartRadius: 10, 
        paddingVertical: 5, 
        paddingHorizontal: 10,
    },
})