import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


export default function ReceiptItem(props) {
    const { data: item, onClickImg=() => {}, onClickDelete=() => {} } = props;
    return (
        <View style={{ marginBottom: 15, marginHorizontal: 5, }}>
            <TouchableOpacity key={item._id} style={[item.isClaimed ? { borderColor: 'blue' } : item.isApproved ? { borderColor: 'green' } : { borderColor: 'grey' }, { borderWidth: 3, borderRadius: 5, }]} onPress={() => onClickImg(item)}>
                {
                    (!item.isClaimed && item.isApproved === null) && (
                        <TouchableOpacity style={{ position: 'absolute', left: -2, top: -2, zIndex: 2, width: 25, height: 25, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}  onPress={() => onClickDelete(item)}>
                            <Feather 
                                name={'x-octagon'}
                                color={'red'}
                                size={20}
                            />
                        </TouchableOpacity>
                    )
                }

                <View style={{ position: 'absolute', right: -2, top: -2, zIndex: 2, width: 25, height: 25, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <Feather 
                        name={item.isClaimed ? 'check-circle' : item.isApproved === true ? 'check-circle' : item.isApproved === false ? 'x-octagon' : 'loader'}
                        color={item.isClaimed ? 'blue' : item.isApproved === true ? 'green' : item.isApproved === false ? 'red' : 'grey'}
                        size={20}
                    />
                </View>
                <Image
                    source={{ uri: item.url }}
                    style={{ width: (Dimensions.get('window').width - 100) / 2, aspectRatio: 1, resizeMode: 'cover', }}
                />
                <View style={{ position: 'absolute', right: -2, bottom: -2, zIndex: 2, height: 25, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, }}>
                    <Text 
                        style={[
                            { fontSize: 12, fontWeight: 'bold' }, 
                            item.isClaimed 
                            ? { color: 'blue' } 
                            : item.isApproved === true 
                                ? { color: 'green' } 
                                : item.isApproved === false 
                                    ? { color: 'red' }
                                    : { color: 'grey' }
                        ]}
                    >
                        {
                            item.isClaimed 
                            ? 'Paid' 
                            : item.isApproved === true 
                                ? 'Approved' 
                                : item.isApproved === false  
                                    ? 'Rejected' 
                                    : 'Pending'
                        }
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 5, }}>
                <Text style={{ fontWeight: 'bold' }}>${item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 7, 
        marginBottom: 3, 
    }
})