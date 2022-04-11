import React, { useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
    Platform,
    StyleSheet,
    TextInput
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import * as ProjectData from '../../database/Project';


export default function ApproveReceipts(props) {
    const [selection, setSelection] = useState(0);
    const [receipts, setReceipts] = useState([]);
    const [rawReceipts, setRawReceipts] = useState([]);
    const [approvedReceipts, setApprovedReceipts] = useState(null);
    const [rawApprovedReceipts, setRawApprovedReceipts] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // only get outstanding receipts requiring approvals
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

    const renderEmpty = () => {
        if(selection === 1 && approvedReceipts === null) {
            return (
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20, }} onPress={_getApprovedReceipts}>
                    <Text style={{ fontWeight: 'bold' }}>Get list of approved receipts</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20, }}>
                <Text style={{ fontWeight: 'bold' }}>{selection === 0 ? 'There are no outstanding receipts requiring approval' : 'There are no approved receipts'}</Text>
            </View>
        )
    }

    const renderOutstandingReceipts = ({item}) => {
        return (
            <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white' }}>
                <Text>Receipt ID: {item._id}</Text>
                <Text>Project ID: {item.project._id}</Text>
                <Text style={{ marginTop: 20, }}>Claimant: {item.user.name}</Text>
                <Text>Claimant Contact: {item.user.contact}</Text>
            </View>
        )
    }

    const renderApprovedReceipts = ({item}) => {
        return (
            <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white' }}>
                <Text>Receipt ID: {item._id}</Text>
                <Text>Project ID: {item.project._id}</Text>
                <Text style={{ marginTop: 20, }}>Claimant: {item.user.name}</Text>
                <Text>Claimant Contact: {item.user.contact}</Text>
                {/* <Text style={{ marginTop: 20, }}>Approval Date: {moment(item.approvalAt.seconds * 1000).format('LLL')}</Text> */}
            </View>
        )
    }

    const handleSearch = (text) => {
        if(text.length === 0) {
            setUsers(rawUsers);
            return
        }
        let filtered_results = rawUsers.filter((user) => user.contact.indexOf(text) !== -1);
        setUsers(filtered_results);
    }

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


    return (
        <View>
            <View style={styles.action}>
                <Feather 
                    name="search"
                    color={'black'}
                    size={20}
                />
                <TextInput 
                    placeholder="Search by ..."
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
})