// ESSENTIALS
import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Modal,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENTS
import ImageViewer from 'react-native-image-zoom-viewer';
import ReceiptItem from '../../components/Project/ReceiptItem';

// DATA
import * as ProjectData from '../../database/Project';


export default function ReceiptList(props) {
    const { data: receipts } = props;
    
    //=====================================================================================================================
    //==  RECEIPTS ==
    //=====================================================================================================================
    const [expandImage, setExpandImage] = useState(false);
    const [imgSel, setImgSel] = useState(0);
    const _enlargeImg = (item) => {
        setImgSel(item.index)
        setExpandImage(true)
    }

    const _renderExpandHeader = () => (
        <TouchableOpacity style={[styles.iconContainer, { position: 'absolute', margin: 10, zIndex: 999, elevation: 999, }]} onPress={() => setExpandImage(false)}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={'black'} />
        </TouchableOpacity>
    )

    const _renderExpandFooter = () => {
        if(!receipts[imgSel].isClaim && !receipts[imgSel].isApproved) {
            return (
                <TouchableOpacity style={[styles.primaryButton, styles.shadow, { margin: 10, backgroundColor: 'red' }]} onPress={() => _modelDelete(imgSel)}>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'white' }}>Delete</Text>
                </TouchableOpacity>
            )
        }
        return null
    } 
    
    const _modelDelete = (index) => {
        let selection = receipts.filter((item) => item.index === index)[0]
        _promptDeleteReceipt(selection)
    }

    const _promptDeleteReceipt = (item) => {
        setExpandImage(false)
        Popup.show({
            type: 'confirm',
            title: 'Caution!',
            textBody: 'You are about to delete this receipt. \n\nAre you sure you would like to proceed? This action cannot be undone.',
            buttonText: 'Delete',
            confirmText:'Cancel',
            callback: () => {
                _deleteReceipt(item)
            }
        })
    }

    const _deleteReceipt = async (item) => {
        let result = await ProjectData.deleteReceipt(item._id)
        if(result.success) {
            Popup.show({
                type: 'success',
                title: 'Success!',
                textBody: 'You have removed this receipt.',
                buttonText: 'Close',
                callback: () => Popup.hide()
            })

            // remove from the page
            let new_receipt_arr = receipts.filter((receipt) => receipt._id !== item._id)
            setUploadedReceipts(new_receipt_arr);

        } else {
            Popup.show({
                type: 'danger',
                title: 'Error. Please try again.',
                textBody: result.error,
                buttonText: 'Close',
                callback: () => Popup.hide()
            })
        }  
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' , flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 15, justifyContent: 'space-between'}}>
                {
                    receipts.length === 0 ? (
                        <Text>You have no receipts uploaded.</Text>
                    ) : (
                        receipts.map((item, index) => (
                            <ReceiptItem 
                                key={index}
                                data={item}
                                onClickImg={_enlargeImg}
                                onClickDelete={_promptDeleteReceipt}
                            />
                        ))
                    )
                }
            </View>
            <Modal visible={expandImage} transparent={true}>
                <ImageViewer 
                    imageUrls={receipts}
                    index={imgSel}
                    onChange={(ev) => setImgSel(ev)}
                    renderHeader={_renderExpandHeader}
                    renderFooter={_renderExpandFooter}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 7, 
        marginBottom: 3, 
    },
    primaryButton: {
        width: Dimensions.get('screen').width - 20,
        borderRadius: 30, 
        backgroundColor: '#9980D3', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 20,
        height: 50, 
    },
})