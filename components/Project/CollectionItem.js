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


export default function ProjectItem(props) {
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const { data: item, style={}, navigation } = props;
    return (
        <View key={item._id} style={{ width: windowWidth, ...style }}>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: 'green', margin: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }} onPress={() => navigation.navigate('ProjectDetail', { data: item.project })}>
                <View style={{ flexDirection: 'row', marginRight: 15, }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, flex: 1, }}>{item.project.title}</Text>
                    {
                        item.project.tags.length > 0 && (
                            <View style={{ justifyContent: 'center', alignContent: 'center', paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderRadius: 5, borderColor: 'green' }}>
                                <Text style={{ color: 'green', fontWeight: 'bold', }}>
                                    + {item.project.tags.length} preference
                                </Text>
                            </View>
                        )
                    }
                </View>
                <View style={{ marginHorizontal: 7, }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginVertical: 10, }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{item.project.location}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{moment(item.project.datetime.seconds * 1000).format('LLL')}</Text>
                            <Text>({moment(item.project.datetime.seconds * 1000).fromNow()})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 22, marginRight: 5, color: Colors.primary, fontWeight: 'bold', marginRight: 10, }}>{item.reserved.toString()}</Text>
                            <Text style={{ fontSize: 17, fontStyle: 'italic', justifyContent: 'flex-end', color: 'black', opacity: 0.7, }}>reserved</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, }}>
                        <Text style={{ color: '#000' }} numberOfLines={5}>{item.project.message}</Text>
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