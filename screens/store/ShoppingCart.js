// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';

// DESIGN
import { useTheme } from 'react-native-paper';
import { defaultStyles } from '../../constants/defaultStyles';

// CUSTOM
import CartItems from '../../components/Store/CartItems';

// DATA
import * as UserData from '../../database/User';

// DEMO: PROMO CODE
// const discount_code_parmas = {
//     code: 'EXAMT20',  // EX: Example; AMT: Amount; 20: $20
//     type: 'amount',
//     number: 20,
//     conditions: [
//         {
//             criteria_type: 'amount',
//             param: '>=',
//             criteria: 1000,
//         }
//     ],
//     dateReceived: moment(),
//     dateCreated: moment(),
//     dateStart: moment(),
//     dateExpiry: moment('2025-12-31'),
//     universal: false,  // set this param to true if allow user to reuse
//     targetUserID: 'akCkW3FP9TcB4RfFaKHGnzWsFoj1',  // mandatory if universal = false 
//     used: false,
// }

export default function ShoppingCart({ navigation }) {
    const { colors } = useTheme();
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    //=====================================================================================================================
    //== GET SHOPPING CART ITEMS ==
    //=====================================================================================================================
    useEffect(() => {
        return _getCartItems()
    }, [])

    async function _getCartItems() {
        let cart_items = await UserData.getCartItems();
        setItems(cart_items)
        setIsLoaded(true)
    }

    //=====================================================================================================================
    //== TARGET USER ==
    //=====================================================================================================================
    const [currentUser, setCurrentUser] = useState({});
    useEffect(() => {
        async function _getCurrentUser() {
            let user = await UserData.currentUserData();
            setCurrentUser(user)
        }
        return _getCurrentUser()
    }, [])

    //=====================================================================================================================
    //== TAX RATE - GENERAL ==
    //=====================================================================================================================
    const taxRate = 0.07;  // assign a tax code

    //=====================================================================================================================
    //== CALCULATION ==
    //=====================================================================================================================
    const [totalWithoutTax, setTotalWithoutTax] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalUniqueQuantity, setTotalUniqueQuantity] = useState(0);
    const [serviceFee, setServiceFee] = useState(0)

    useEffect(() => _calculateTotal(), [items])

    const _calculateTotal = () => {
        // total value
        let prices_arr = items.map((item) => item.order_data.quantity * item.order_data.selection.item.price)
        let sum = prices_arr.reduce((a, b) => a + b, 0)
        setTotalWithoutTax(sum)

        // tax
        let tax_amt = (sum - discountAmount) * taxRate
        setTaxAmount(tax_amt)

        // service fee
        // higher of $10 or 3% of (purchased amount (wo tax) and discount)
        let service_amount = Math.max(10, 0.03 * (sum - discountAmount));
        setServiceFee(service_amount)

        // final
        let total_with_tax = sum + tax_amt - discountAmount + serviceFee
        setTotal(total_with_tax)

        // set quantity
        let total_quantity_arr = items.map((item) => item.order_data.quantity);
        let total_quantity = total_quantity_arr.reduce((a, b) => a + b, 0);
        setTotalQuantity(total_quantity)

        // set unique quantity
        let total_unique_quantity = items.length;
        setTotalUniqueQuantity(total_unique_quantity)

        return true
    }


    //=====================================================================================================================
    //== DISCOUNT ==
    //=====================================================================================================================
    const [promoCode, setPromoCode] = useState(null);
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDetails, setPromoDetails]  = useState([]);

    const validatePromoCode = () => {
        // make sure that all '' values are converted to null
        if(promoCode === null) {
            return false
        }
        if(promoCode === '') {
            setPromoCode(null)
            return false
        }
        if(promoCode.length === 0) {
            setPromoCode(null)
            return false
        }
        if(promoCode.trim().length == 0) {
            setPromoCode(null)
            return false
        }
        return true
    }

    const applyPromoCode = async () => {
        
        Keyboard.dismiss() // hide 

        let result = validatePromoCode()

        // check for valid code
        if(!result) {
            Popup.show({
                type: 'warning',
                title: 'Invalid Code',
                textBody: 'No promo code was entered',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return
        }

        // check if promo code exist and is valid
        let promo_codes = await UserData.getPromoCode(promoCode)

        // check if the code is universal or not
        let isUniversal = _checkUniversal(promo_codes)
        if(!isUniversal) {
            // if not universal, filter to see if user can access
            var promo = promo_codes.filter((code) => code.targetUserID === currentUser._id && code.used === false)[0]
        } else {
            var promo = promo_codes[0]
        }

        // check if there are any results
        if(!promo) {
            Popup.show({
                type: 'warning',
                title: 'Invalid Code',
                textBody: 'This promo code is not applicable',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return
        }

        setPromoDetails(promo)  // for future ref --> check again if there is any change

        // check for expiry
        let usage_result = _checkExpiry(promo)
        if(!usage_result) return

        // check for conditions
        let conditions_result = _checkConditions(promo)
        if(!conditions_result) return

        // apply promo code
        if(promo.type === 'rate') {
            let discount = totalWithoutTax * promo.number;
            let discount_lower_of = Math.min(discount, totalWithoutTax)
            setDiscountAmount(discount_lower_of)
            var promo_display_text = `${promo.number * 100}%`;
        } else if(promo.type === 'amount') {
            let discount = promo.number;
            let discount_lower_of = Math.min(discount, totalWithoutTax)
            setDiscountAmount(discount_lower_of);
            var promo_display_text = `$${promo.number}`;
        }

        // toggle that promo code has been applied
        setPromoApplied(true)

        // display notifiation
        Popup.show({
            type: 'success',
            title: 'Success!',
            textBody: `Your promo code of ${promo_display_text} has been applied`,
            buttonText: 'Close',
            callback: () => Popup.hide()
        })
    }

    const _resetPromo = () => {
        setDiscountAmount(0)
        setPromoApplied(false)
        setPromoCode(null)
        _calculateTotal()
    }

    const _checkUniversal = (params) => {
        if(params.universal) {
            return true  // allow reuse
        }
        return false
    }

    const _checkExpiry = (params) => {
        // retain the following order
        if(moment().unix() > params.dateExpiry.seconds) {
            return false  // expired
        }
        if(moment().unix() < params.dateStart.seconds) {
            return false // not yet started
        }
        if(params.universal) {
            return true  // allow reuse
        }
        if(params.used) {
            return false  // no longer valid
        }
        return true
    }

    const _checkConditions = (discount_code_parmas) => {
        let conditions = discount_code_parmas.conditions;
        if(conditions) {
            for(const condition of conditions) {
                let criteria_type = condition.criteria_type;
                let param = condition.param;
                let criteria = condition.criteria;

                if(criteria_type === 'amount') {
                    var param_to_use = totalWithoutTax;
                    var error_text = `Your cart must be ${param === '<=' ? 'at most' : 'at least'} $${criteria.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in value to be eligible for this promo code.`
                } else if(criteria_type === 'quantity') {
                    var param_to_use = totalQuantity;
                    var error_text = `The number of items in your cart must contain ${param === '<=' ? 'at most' : 'at least'} ${criteria.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} items to be eligible for this promo code. \n\nYou currently have ${totalQuantity} items. \n\n${param === '<=' ? `Remove ${totalQuantity - criteria}` : `Add ${criteria - totalQuantity} more`} items to use this code.`
                } else if(criteria_type === 'unique_quantity') {
                    var param_to_use = totalUniqueQuantity;
                    var error_text = `The number of unique items in your cart must contain ${param === '<=' ? 'at most' : 'at least'} ${criteria.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} items to be eligible for this promo code. \n\nYou currently have ${totalUniqueQuantity} items. \n\n${param === '<=' ? `Remove ${totalUniqueQuantity - criteria}` : `Add ${criteria - totalUniqueQuantity} more`}  unique items to use this code.`
                } 

                if(param === '>=') {
                    if(!(param_to_use >= criteria)) {
                        Popup.show({
                            type: 'warning',
                            title: 'Criteria not met',
                            textBody: error_text,
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                        return false
                    }
                } else if(param === '<=') {
                    if(!(param_to_use <= criteria)) {
                        Popup.show({
                            type: 'warning',
                            title: 'Criteria not met',
                            textBody: error_text,
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                        return false
                    }
                }
            }
        }
        return true
    }

    useEffect(() => _calculateTotal(), [promoApplied])

    //=====================================================================================================================
    //== CHANGES ==
    //=====================================================================================================================
    const _changeQuantity = async (itemIndex, new_quantity) => {
        let newArr = await Promise.all(items.map(async (item, index) => {
            if(index === itemIndex) {
                const cart_id = item._id;
                const updated_data = {
                    ...item,
                    order_data: {
                        ...item.order_data,
                        quantity: new_quantity,
                    },
                }
                // update firebase data
                let result = await UserData.updateCartItems({cart_id, updated_data});
                if(result.success) {
                    // silent update
                    return updated_data
                } else {
                    Popup.show({
                        type: 'danger',
                        title: 'Error',
                        textBody: `An error has occurred while updating your cart. \n\n${result.error}`,
                        buttonText: 'Close',
                        callback: () => Popup.hide()
                    })
                    return item
                }
            }
            return item
        }))
        await setItems(newArr)
        _calculateTotal()
    }

    const _deleteItem = async (index) => {
        let new_arr = await Promise.all(items.filter((_, i) => i !== index));
        // update firebase
        let card = await Promise.all(items.filter((_, i) => i === index));
        let card_id = card[0]._id;
        let result = await UserData.deleteCartItemsByID(card_id);
        // update display
        if(result.success) {
            setItems(new_arr)
            _calculateTotal()
        } else {
            Popup.show({
                type: 'danger',
                title: 'Error',
                textBody: `An error has occurred while updating your cart. \n\n${result.error}`,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return
        }
    }

    // check for validity of promo still
    const _checkPromoValidity = async () => {
        if(promoApplied) {
            let result = _checkConditions(promoDetails)  // re-trigger
            if(!result) _resetPromo()
            Popup.show({
                type: 'warning',
                title: 'Criteria no longer met',
                textBody: "Your discount code has been reset as the criteria for using the promo code is no longer met. You may try again.",
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }
    }

    useEffect(() => {
        return _checkPromoValidity()
    }, [totalWithoutTax])


    //=====================================================================================================================
    //== HANDLE PAY ==
    //=====================================================================================================================
    const _handlePay = async () => {
        // TODO: HANDLE PAYMENT

        // once payment has been verified, set payment details
        let payment_id = await __handlePaymentDetails();
        if(!payment_id) return;

        // transfer data
        let transferredData = await __handleSavePaymentData(payment_id);
        if(!transferredData) return;

        // continue to delete data in cart
        let clearedCart = await __handleClearCart();
        if(!clearedCart) return;

        // display that all has been successful
        Popup.show({
            type: 'success',
            title: 'Success',
            textBody: 'Your purchase has been successful! \n\nOn behalf of the vendor, Thank You for your support!',
            buttonText: 'Continue',
            callback: () => {
                Popup.hide()
                _getCartItems()  // refresh cart
            }
        })

        return true
    }

    const __handlePaymentDetails = async () => {
        let payment_id = _generatePaymentID();
        let payment_details = {
            payment_id,
            items,
            createdAt: new Date(),
            currentUser,
            promo: {
                promoApplied,
                promoCode,
                promoDetails,
            },
            amount: {
                totalWithoutTax,
                discountAmount,
                taxAmount,
                total,
                totalQuantity,
                totalUniqueQuantity,
                serviceFee,
            },
        }
        let result = await UserData.setPurchasedDetails(payment_details)
        if(!result.success) {
            // display message and dismiss action
            Popup.show({
                type: 'danger',
                title: 'An error has occurred',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return false
        }
        return payment_id
    }

    const __handleSavePaymentData = async (payment_id) => {
        let result = await UserData.setPurchasedItem({order_arr: items, payment_id})
        if(!result.success) {
            // display message and dismiss action
            Popup.show({
                type: 'danger',
                title: 'An error has occurred',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
            return false
        }
        return true
    }

    const __handleClearCart = async () => {
        for(const order of items) {
            let item_id = order._id;
            let result = await UserData.deleteCartItemsByID(item_id)
            if(!result.success) {
                // display message and dismiss action
                Popup.show({
                    type: 'danger',
                    title: 'An error has occurred',
                    textBody: result.error,
                    buttonText: 'Close',
                    callback: () => Popup.hide()
                })
                return false
            }
        }
        return true
    }

    const _generatePaymentID = () => {
        let prefix = "INV";
        let currentUserID = currentUser._id;
        let suffix = moment().unix().toString();
        return `${prefix}-${currentUserID}-${suffix}`
    }

    //=====================================================================================================================
    //== RENDER DISPLAY ==
    //=====================================================================================================================
    if(!isLoaded) {
        return (<View></View>)
    }
    
    return (
        <View style={[defaultStyles.container, { padding: 10, } ]}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, }}>Your Cart</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    items.length === 0
                    ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Text style={{ marginVertical: 20, }}>No items in cart. Add one now!</Text>
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 10, paddingHorizontal: 20, }]} onPress={() => navigation.navigate('Explore')}>
                                <Text style={{ color: '#fff' }}>Explore</Text>
                            </TouchableOpacity>
                        </View>
                    :
                        items.map((item, index) => (
                            <CartItems
                                key={index}
                                index={index}
                                item={item}
                                onChange={_changeQuantity}
                                removeItem={_deleteItem}
                            />
                        ))
                }
            </ScrollView>
            <View style={{ height: 250, padding: 10, backgroundColor: colors.background, borderTopColor: '#ccc', borderTopWidth: 1, }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 5, flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: '#ccc' }}>
                    <TextInput
                        placeholder='Input promo code (optional)'
                        style={styles.input}
                        value={promoCode}
                        onChangeText={(val) => setPromoCode(val.trim())}
                        maxLength={10}
                        onEndEditing={validatePromoCode}
                        editable={!promoApplied}
                        autoCapitalize={'characters'}
                    />
                    <TouchableOpacity style={[styles.promoCodeBtn, promoApplied ? { backgroundColor: colors.background } : { backgroundColor: colors.primary }]} onPress={applyPromoCode} disabled={promoApplied}>
                        <Text style={[{ fontWeight: 'bold', }, promoApplied ? { color: '#000', opacity: 0.4, } : { color: '#fff' }]}>{promoApplied ? 'Applied' : 'Apply'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Cart Total</Text>
                    <Text style={styles.totalAmount}>${totalWithoutTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Less: Discount</Text>
                    <Text style={styles.totalAmount}>(${discountAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Service Fee</Text>
                    <Text style={styles.totalAmount}>${serviceFee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Tax</Text>
                    <Text style={styles.totalAmount}>${taxAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <View style={[styles.totalContainer, { borderTopWidth: 1, borderTopColor: '#ccc', marginVertical: 2, }]}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalAmount}>${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                </View>
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.dark }]} onPress={_handlePay}>
                    <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Pay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: { 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        flex: 1, 
    },
    promoCodeBtn: { 
        marginLeft: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 5, 
        borderWidth: 0.5, 
        borderColor: '#ccc', 
        margin: 5, 
        paddingHorizontal: 15, 
    },
    primaryBtn: { 
        padding: 10, 
        margin: 5, 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: '#ccc', 
    },
    totalContainer: { 
        flexDirection: 'row', 
        padding: 3, 
    },
    totalText: { 
        fontSize: 14, 
        flex: 1, 
    },
    totalAmount: { 
        fontWeight: 'bold', 
        fontSize: 14, 
        textAlign: 'right', 
        width: 150, 
    },
})