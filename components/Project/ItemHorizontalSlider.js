// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Dimensions
} from 'react-native';
import { useTheme } from 'react-native-paper';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default function ItemHorizontalSlider(props) {
    const { header, renderItems, data, onPressViewAll=null, renderIfEmpty=() => (<Text>No items</Text>), style } = props;
    const { colors } = useTheme();
    return (
        <View style={[{ marginLeft: 20, borderTopStartRadius: 10, borderBottomStartRadius: 10, borderWidth: 0.5, borderColor: '#ccc', backgroundColor: '#fff', }, style]}>
            <View style={{ flexDirection: 'row', marginHorizontal: 10, paddingVertical: 10, }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, }}>{header}</Text>
                {
                    data.length !== 0 &&
                    <TouchableOpacity style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 30, backgroundColor: colors.primary, height: 20, }} onPress={onPressViewAll}>
                        <Text style={{ fontSize: 11, color: 'white', opacity: 0.9, }}>View All</Text>
                    </TouchableOpacity>
                }
            </View>
            {
                data.length !== 0 
                ?
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ margin: 10, minWidth: windowWidth - 20, }}
                        showsHorizontalScrollIndicator={false}
                    >
                    {
                        data.map((d, i) => renderItems(d, i))
                    }
                    </ScrollView>
                :
                    renderIfEmpty()
            }

        </View>
    )
}