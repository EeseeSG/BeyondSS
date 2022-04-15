// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    FlatList, 
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import * as WebBrowser from 'expo-web-browser';


export default function PartnerCarousel(props) {
    const { data } = props;

    //=====================================================================================================================
    //==  HANDLE EXTERNAL LINKS ==
    //=====================================================================================================================

    const _handlePressButtonAsync = async (url) => {
        await WebBrowser.openBrowserAsync(url);
    };


    const renderItem = (data) => (
        <TouchableOpacity style={{ marginRight: 30, }} onPress={() => _handlePressButtonAsync(data.item.url)}>
            <View style={{ width: 100, backgroundColor: 'transparent', borderRadius: 15, padding: 5, justifyContent: 'center', alignItems: 'center', }}> 
                <Image
                    style={{ width: 70, height: 45, resizeMode: 'contain' }}
                    source={{ uri: data.item.img }}
                />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, opacity: 0.6, marginTop: 5, }}>{data.item.category}</Text>
        </TouchableOpacity>
    )

    return (
        <FlatList
            horizontal
            data={data}
            renderItem={renderItem}
            style={{ marginTop: 30, }}
            showsHorizontalScrollIndicator={false}
        />
    )
}
