import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
} from 'react-native';
import StoreTags from '../../components/Store/StoreTags';
import ItemCarousel from '../../components/Store/ItemCarousel';

export default function StoreBlock(props) {
    const { index, data, navigation } = props;

    async function handleGoToStore() {
        navigation.navigate('StoreProfile', { store_id: data._id })
    }

    return (
        <View key={index.toString()} style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={handleGoToStore}>
                <Image
                    style={styles.logo}
                    source={{ uri: data.image }}
                />
                <View>
                    <Text style={styles.name}>{data.name}</Text>
                    <StoreTags
                        tags={data.tags}
                    />
                </View>
            </TouchableOpacity>
            <ItemCarousel
                data={data.products}
                navigation={navigation}
                hasMore
                store_id={data._id }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'flex-start',
        height: 'auto',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#DADEE1',
        paddingVertical: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#EBEBEB',
    },
    header: {
        flexDirection: 'row',
        borderColor: '#A0A0A0',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    logo: {
        width: 40,
        aspectRatio: 1,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C2127',
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 14,
        color: '#A0A0A0',
    },
});