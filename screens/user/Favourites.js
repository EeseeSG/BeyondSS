import React from 'react';
import { 
    StyleSheet, 
    ScrollView, 
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import Item from '../../components/Store/Item';

export default function Favourites(props) {
    const { navigation } = props;
    const { data } = props.route.params;

    return (
        <ScrollView style={[defaultStyles.container]} contentContainerStyle={[styles.flexContainer]} showsVerticalScrollIndicator={false}>
            {
                data.map((product, i) => (
                    <Item
                        key={i}
                        item={product}
                        navigation={navigation}
                    />
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
    },
})