import React, { useEffect, useState, } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity, 
    Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QuantityPicker from '../../components/Store/QuantityPicker';

export default function CartItems(props) {
    const { item, index, onChange, removeItem, } = props;
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(item.order_data.quantity);
    }, [item])

    const quantityChange = (val) => {
        setQuantity(val);
        onChange(index, val)  // register the change
    }

    const _deleteItem = () => removeItem(index)

    return (
        <View key={index} style={{ flexDirection: 'row', padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc', marginBottom: 10, alignItems: 'center', backgroundColor: '#fff' }}>
            <Image
                source={{ uri: item.product_data.image }}
                style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: '#A9A9A9' }}
            />
            <View style={{ marginLeft: 10, flex: 1, }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.product_data.text}</Text>
                <Text style={{ fontSize: 12, opacity: 0.6, }} numberOfLines={1}>({item.order_data.selection.item.size})</Text>
                <QuantityPicker
                    quantity={quantity}
                    setQuantity={quantityChange}
                />
            </View>
            <View style={{ alignItems: 'flex-end', marginHorizontal: 10, width: 70, }}>
                <TouchableOpacity onPress={_deleteItem}>
                    <MaterialCommunityIcons name='trash-can-outline' size={24} color={'red'}/>
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, }}>${(item.order_data.selection.item.price * quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
            </View>
        </View>
    )
}