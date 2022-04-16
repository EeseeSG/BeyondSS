import React, { useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
    Dimensions,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import moment from 'moment';
import { Popup } from 'react-native-popup-confirm-toast';
import * as Colors from '../../constants/Colors';
import { defaultStyles } from '../../constants/defaultStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as ProjectData from '../../database/Project';


export default function ApproveReceipts(props) {
    const [selection, setSelection] = useState(0);
    const [receipts, setReceipts] = useState([]);
    const [rawReceipts, setRawReceipts] = useState([]);
    const [approvedReceipts, setApprovedReceipts] = useState(null);
    const [rawApprovedReceipts, setRawApprovedReceipts] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isActivated, setIsActivated] = useState(false);
    const [infoModal, setInfoModal] = useState(null);
    const [searchText, setSearchText] = useState(null);

    // receipt
    const [imageReceipt, setImageReceipt] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);


	// =======================================================================================================================
	// == FETCH DATA ==
	// =======================================================================================================================
    useEffect(() => {
        return _getOutstandingReceipts()
    }, [])

    async function _getOutstandingReceipts() {
        let receipts_arr = await ProjectData.getOutstandingReceipts();
        setReceipts(receipts_arr)
        setRawReceipts(receipts_arr)
    }

    async function _getApprovedReceipts() {
        let approved_receipts_arr = await ProjectData.getApprovedReceipts();
        setApprovedReceipts(approved_receipts_arr)
        setRawApprovedReceipts(approved_receipts_arr)
    }


	// =======================================================================================================================
	// == APPROVE RECEIPT ==
	// =======================================================================================================================
    const _approveReceipt = (item) => {
        Popup.show({
            type: 'confirm',
            title: 'Confirmation',
            textBody: 'Are you sure you would like to accept this receipt? This action cannot be undone.',
            buttonText: 'Confirm and submit',
            confirmText: 'Close',
            callback: () => _submitApproveReceipt(item),
            cancelCallback: () => Popup.hide(),
        })
    }

    const _submitApproveReceipt = async (item) => {
        let status = await ProjectData.approveReceipt(item._id);
        _removeOutstandingReceiptFromList(item._id)
        if(status.success) {
            Popup.show({
                type: 'success',
                title: 'Success',
                textBody: 'You have approved the receipt. This will be routed for review and subsequent approval before disbursement.',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        } else {
            Popup.show({
                type: 'danger',
                title: 'Error. Please try again.',
                textBody: status.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }
    }


	// =======================================================================================================================
	// == REJECT RECEIPT ==
	// =======================================================================================================================
    const _rejectReceipt = (item) => {
        Popup.show({
            type: 'confirm',
            title: 'Confirmation',
            textBody: 'Are you sure you would like to reject this receipt? This action cannot be undone.',
            buttonText: 'Confirm and submit',
            confirmText: 'Close',
            callback: () => _submitRejectReceipt(item),
            cancelCallback: () => Popup.hide(),
        })
    }

    const _submitRejectReceipt = async (item) => {
        let status = await ProjectData.rejectReceipt(item._id);
        _removeOutstandingReceiptFromList(item._id)
        if(status.success) {
            Popup.show({
                type: 'success',
                title: 'Success',
                textBody: 'You have rejeced this receipt.',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        } else {
            Popup.show({
                type: 'danger',
                title: 'Error. Please try again.',
                textBody: status.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }   
    }


	// =======================================================================================================================
	// == HELPERS ==
	// =======================================================================================================================
    const handleSearch = (text) => {
        if(selection === 0) {
            var hook = setReceipts;
            var target = rawReceipts;
        } else {
            var hook = setApprovedReceipts;
            var target = rawApprovedReceipts;
        }
        if(text.length === 0) {
            hook(target);
            return
        }
        let filtered_results = target.filter((receipt) => receipt.user.contact.indexOf(text) !== -1);
        hook(filtered_results);
    }

    const handleOutstandingReceiptsRefresh = async () => {
        setIsRefreshing(true);
        await _getOutstandingReceipts();
        setIsRefreshing(false);
    }

    const handleApprovedReceiptRefresh = async () => {
        setIsRefreshing(true);
        await _getApprovedReceipts();
        setIsRefreshing(false);
    }

    const openInfoModal = (item) => {
        setIsActivated(true)
        setInfoModal(item)
    }

    const _closeModal = () => {
        setIsActivated(false)
        setInfoModal(null)
    }

    const _removeOutstandingReceiptFromList = (receipt_id) => {
        let new_arr = rawReceipts.filter((i) => i._id != receipt_id);
        setRawReceipts(new_arr);

        if(searchText) {
            handleSearch(searchText)
        } else {
            setReceipts(new_arr);
        }
    }

	// =======================================================================================================================
	// == RENDERERS ==
	// =======================================================================================================================
    const renderHeader = () => (
        <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 20, }}>
            <TouchableOpacity style={[selection === 0 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(0)}>
                <Text style={{ color: 'black' }}>Outstanding</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[selection === 1 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(1)}>
                <Text style={{ color: 'black' }}>Approved</Text>
            </TouchableOpacity>
        </View>
    )

    const renderApprovedReceipts = ({item}) => {
        return (
            <TouchableOpacity style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white' }} onPress={() => openInfoModal(item)}>
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="info" color={'black'} size={20} />
                        <Text style={[defaultStyles.small, { marginLeft: 5, }]}>Tap for more details...</Text>
                    </View>
                    <Text style={{ marginTop: 20, }}>Claimant: {item.user.name}</Text>
                    <Text>Claimant Contact: {item.user.contact}</Text>
                </View>
                <Text style={{ marginTop: 20, }}>Approval made: {moment(item.approvedAt.seconds * 1000).format('LLL')}</Text>
            </TouchableOpacity>
        )
    }

    const renderOutstandingReceipts = ({item}) => {
        return (
            <TouchableOpacity style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white', flexDirection: 'row' }} onPress={() => openInfoModal(item)}>
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="info" color={'black'} size={20} />
                        <Text style={[defaultStyles.small, { marginLeft: 5, }]}>Tap for more details...</Text>
                    </View>
                    <Text style={{ marginTop: 20, }}>Claimant: {item.user.name}</Text>
                    <Text>Claimant Contact: {item.user.contact}</Text>
                    
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _approveReceipt(item)}>
                        <Feather name="check-square" color={'green'} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _rejectReceipt(item)}>
                        <Feather name="x-square" color={'red'} size={30} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    const renderEmpty = () => {
        if(selection === 1 && approvedReceipts === null) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderWidth: 0.5, borderColor: '#ccc', borderRadius: 10, backgroundColor: Colors.primary }} onPress={_getApprovedReceipts}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Get list of approved receipts</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20, }}>
                <Text style={{ fontWeight: 'bold' }}>{selection === 0 ? 'There are no outstanding receipts requiring approval' : 'There are no approved receipts'}</Text>
            </View>
        )
    }

	// =======================================================================================================================
	// == DISPLAY ==
	// =======================================================================================================================
    return (
        <View>
            <View style={styles.action}>
                <Feather 
                    name="search"
                    color={'black'}
                    size={20}
                />
                <TextInput 
                    placeholder="Search by contact number..."
                    style={styles.textInput}
                    onChangeText={(val) => handleSearch(val)}
                    keyboardType={'phone-pad'}
                    maxLength={8}
                />
            </View>
            <FlatList
                horizontal={false}
                keyExtractor={(_, index) => index.toString()}
                data={selection === 0 ? receipts : approvedReceipts}
                ListHeaderComponent={renderHeader}
                ListHeaderComponentStyle={{ marginTop: 10, }}
                renderItem={selection === 0 ? renderOutstandingReceipts : renderApprovedReceipts}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                onRefresh={selection === 0 ? handleOutstandingReceiptsRefresh : handleApprovedReceiptRefresh}
                refreshing={isRefreshing}
            />
            {
                isActivated && (
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.7)', position: 'absolute', flex: 1, top: 0, left: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginTop: -100, width: Dimensions.get('window').width * 0.95, height: Dimensions.get('window').height * 0.8, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 10, }} onPress={_closeModal}>
                                <View style={{ flex: 1, }} >
                                    <Text style={{ fontWeight: 'bold' }}>Details</Text>
                                </View>
                                <Feather name="x" color={'black'} size={20} />
                            </TouchableOpacity>
                            <View style={{ marginBottom: 20, }}>
                                <Text selectable>Receipt ID: {infoModal._id}</Text>
                                <Text selectable>Project ID: {infoModal.project._id}</Text>
                            </View>
                            <Image 
                                source={{ uri: infoModal.url }}
                                style={{ width: '75%', height: '75%', resizeMode: 'contain', borderWidth: 0.5, borderColor: '#ccc' }}
                            />
                            <View style={{ marginTop: 20, }}>
                                <Text style={defaultStyles.h2}>Amount entered: ${infoModal.amount}</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    action: {
		flexDirection: 'row',
		marginTop: 10,
        paddingVertical: 7,
        paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#c2c2c2', // #f2f2f2
		alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 5,
	},
    text_footer: {
		color: '#05375a',
		fontSize: 18
	},
    textInput: {
		flex: 1,
		paddingLeft: 10,
		color: '#05375a'
	},
    modalButton: {
        flex: 1,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 8,
        backgroundColor: '#702c91',
    },
    modalTextButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontStyle: 'normal',
        textAlign: 'center',
        lineHeight: 20,
    },
})