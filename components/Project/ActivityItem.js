import React from 'react';
import { 
    View, 
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import moment from 'moment';
import * as Colors from '../../constants/Colors';


export default function ActivityItem(props) {
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const { data: item, style={}, navigation } = props;
    return (
        <View key={item._id} style={{ width: windowWidth - 20, ...style }}>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: 'green', margin: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }} onPress={() => navigation.navigate('ProjectDetail', { data: item })}>
                <View style={{ flexDirection: 'row', marginRight: 15, }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, flex: 1, }}>{item.title}</Text>
                    {
                        item.tags.length > 0 && (
                            <View style={{ justifyContent: 'center', alignContent: 'center', paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderRadius: 5, borderColor: 'green' }}>
                                <Text style={{ color: 'green', fontWeight: 'bold', }}>
                                    + {item.tags.length}
                                </Text>
                            </View>
                        )
                    }
                </View>
                <View style={{ marginHorizontal: 7, }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginVertical: 10, }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{item.location}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{moment(item.datetime.seconds * 1000).format('LLL')}</Text>
                            <Text>({moment(item.datetime.seconds * 1000).fromNow()})</Text>
                        </View>
                        <View style={{ marginRight: 10, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Text style={{ fontSize: 22, marginRight: 5, color: Colors.primary, fontWeight: 'bold', }}>{item.reserved} / {item.count}</Text>
                            <Text style={{ fontSize: 17, fontStyle: 'italic', justifyContent: 'flex-end', color: 'black', opacity: 0.7, }}>reserved</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, }}>
                        <Text style={{ color: '#000' }} numberOfLines={5}>{item.message}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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