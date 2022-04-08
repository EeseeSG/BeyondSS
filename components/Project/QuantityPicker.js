import React, { useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, Image, Alert, ScrollView, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../constants/defaultStyles';
import { Popup } from 'react-native-popup-confirm-toast';

export default function QuantityPicker(props) {
    const { quantity, setQuantity } = props;

    const checkQuantity = (val) => {
        if(!Number.isInteger) {
            Popup.show({
                type: 'danger',
                title: 'Error',
                textBody: "Please enter whole numbers",
                buttonText: 'Okay',
                callback: () => Popup.hide()
            })
            return
        }
        if(val.length === 0 || val === 0) {
            setQuantity("")
        } else {
            setQuantity(parseInt(val))
        }
        return
    }

    const _lessQuantity = () => {
        if(quantity > 1) {
            setQuantity(quantity-1)
        }
        return
    }

    const _addQuantity = () => setQuantity(quantity+1)

    const checkEndQuantity = () => {
        if(quantity.length === 0 || quantity === 0) {
            setQuantity(1)
        }
    }

    return (
        <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={_lessQuantity}>
                <MaterialCommunityIcons name="minus" size={20} color={'black'}/>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={quantity.toString()}
                keyboardType={'numeric'}
                onChangeText={(val) => checkQuantity(val.trim())}
                onEndEditing={checkEndQuantity}
            />
            <TouchableOpacity style={styles.qtyBtn} onPress={_addQuantity}>
                <MaterialCommunityIcons name="plus" size={20} color={'black'}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    qtyContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 10, 
    },
    qtyBtn: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        width: 30, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 30, 
        backgroundColor: '#F9F9F9'
    },
    input: { 
        marginHorizontal: 10, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        width: 80,
        padding: 5,
        textAlign: 'center',
    },
})