import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable, Image, TextInput, ScrollView, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from '../../constants/defaultStyles';
import OrderItem from '../../components/User/OrderItem';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');
const containerPadding = 10;
const itemPadding = 10;
const itemBorderWidth = 1;
const cardWidth = windowWidth - containerPadding * 2 - itemPadding * 2 - itemBorderWidth * 2;
export default function PaymentHistory(props) {
    const { data } = props.route.params;
    const [isLoaded, setIsLoaded] = useState(false);
    const [displayAllData, setDisplayAllData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showCancel, setShowCancel] = useState(false);

    useEffect(() => {
        function _setupData() {
            let data_to_show = data.map((payment, _) => {
                let payment_items = payment.items.map((order, _) => {
                    return {
                        ...order,
                        show: true,
                    }
                })
                return {
                    ...payment,
                    items: payment_items
                }
            })
            setDisplayData(data_to_show);
            setDisplayAllData(data_to_show);
            setIsLoaded(true);
        }
        return _setupData()
    }, [])

    const onSearch = (val) => {
        setSearchText(val)
        if(val.length !== 0) {
            setShowCancel(true)
            _handleSearch(val)
        } else {
            setShowCancel(false)
            setDisplayData(displayAllData)
        }
    }

    const _clearSearchText = () => {
        onSearch('');
    }

    const _handleSearch = async (val) => {
        let search_text_arr = val.trim().split(' ');
        let data_to_show = await Promise.all(data.map(async (payment, _) => {
            let payment_items = await Promise.all(payment.items.map((order, _) => {
                // define which to return
                let attribute_text_join = order.product_data.attributes.join(' ');
                let product_title = order.product_data.text;
                let product_desc = order.product_data.description;
                let concat_all = `${product_title} ${attribute_text_join} ${product_desc}`;
                let concat_all_lower = concat_all.toLowerCase();
                for(const text of search_text_arr) {
                    if(concat_all_lower.indexOf(text.toLowerCase()) !== -1) {
                        return {
                            ...order,
                            show: true,
                        }
                    }
                }
                return {
                    ...order,
                    show: false,
                }
            }))
            return {
                ...payment,
                items: payment_items
            }
        }))
        setDisplayData(data_to_show)
    }

    if(!isLoaded) {
        return (<></>)
    }
    return (
        <View style={defaultStyles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder='Search...'
                    style={{ flex: 1, }}
                    value={searchText}
                    onChangeText={(val) => onSearch(val)}
                />
                {
                    showCancel && 
                    <TouchableOpacity onPress={_clearSearchText}>
                        <MaterialCommunityIcons color='#A9A9A9' name='close' size={20}/>
                    </TouchableOpacity>
                }
            </View>
            <ScrollView style={[{ padding: containerPadding,}]}>
                {
                    displayData.map((payment, paymentIndex) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemHeaderText}>Payment {paymentIndex + 1}</Text>
                                <Text style={styles.itemHeaderTotal}>${payment.amount.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <View style={{ marginHorizontal: 5, marginTop: 3, marginBottom: 15, }}>
                                <Text style={styles.subPaymentText}>Discount: ${payment.amount.discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                <Text style={styles.subPaymentText}>Service Fee: ${payment.amount.serviceFee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                <Text style={styles.subPaymentText}>Tax: ${payment.amount.taxAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            <ScrollView>
                                {
                                    payment.items.map((order, index) => {
                                        if(order.show) {
                                            return (
                                                <OrderItem
                                                    key={index}
                                                    order={order}
                                                    index={index}
                                                    style={{ flex: 1, marginBottom: 5, width: cardWidth }}
                                                />
                                            )
                                        }
                                        return null
                                    })
                                }
                            </ScrollView>
                            {
                                searchText.length !== 0 && 
                                <View style={{ flex: 1, }}>
                                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#000', opacity: 0.7, }}>Displaying results for "{searchText}"</Text>
                                </View>
                            }
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: { 
        marginBottom: 20, 
        padding: itemPadding, 
        borderWidth: itemBorderWidth, 
        borderColor: '#ccc', 
        borderRadius: 4, 
    },
    itemHeader: { 
        flexDirection: 'row', 
        marginBottom: 5, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    itemHeaderText: { 
        fontSize: 20,
        flex: 1, 
        color: '#000', 
        opacity: 0.8, 
    },
    itemHeaderTotal: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#000', 
        opacity: 0.9, 
    },
    subPaymentText: { 
        fontSize: 12, 
        color: '#000',
        opacity: 0.7, 
    },
    searchContainer: { 
        margin: 10, 
        borderRadius: 5, 
        borderColor: '#ccc', 
        borderWidth: 0.5, 
        height: 50, 
        padding: 10, 
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})