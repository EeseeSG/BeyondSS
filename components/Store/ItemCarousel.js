// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    FlatList, 
} from 'react-native';
import Item from './Item';


export default function ItemCarousel(props) {
    const { data, navigation, hasMore=false, store_id=null } = props;

    const renderItem = (data) => (
        <Item
            item={data.item}
            navigation={navigation}
        />
    )
    
    const renderViewMore = () => (
        <TouchableOpacity style={[styles.shadow, styles.container, styles.viewMore]} onPress={_goToStore}>
            <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
    )

    const _goToStore = () => {
        navigation.navigate('StoreProfile', { store_id })
    }

    return (
        <FlatList
            horizontal
            keyExtractor={(_, index) => index.toString()}
            data={data}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={hasMore && renderViewMore}
        />
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: { 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    viewMore: {
        width: 'auto', 
        padding: 10, 
        backgroundColor: '#D3D3D3',
        borderRadius: 15, 
        margin: 10, 
        marginRight: 20,
    },
    viewMoreText: {
        fontSize: 12,
    },
})