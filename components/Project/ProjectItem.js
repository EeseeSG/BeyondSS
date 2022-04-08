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
import { Popup } from 'react-native-popup-confirm-toast';


export default function ProjectItem(props) {
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const { data: item, user_id, style={}, navigation } = props;

    console.log(item.beneficiaries)
    console.log(user_id)

    const hasApplied = item.beneficiaries.indexOf(user_id) !== -1;

    const onPressNote = () => {
        const parseTags = item.tags.join(',\n')
        Popup.show({
            type: 'info',
            title: parseTags,
            textBody: '',
            buttonText: 'Close',
            callback: () => Popup.hide()
        })
    }

    return (
        <View style={{ width: windowWidth, ...style }}>
            <TouchableOpacity style={[hasApplied ? { borderWidth: 2, borderColor: 'green'} : { borderWidth: 0.5, borderColor: '#ccc' }, { margin: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }]} onPress={() => navigation.navigate('ProjectDetail', { data: item })}>
                {
                    hasApplied && (
                        <View style={{ width: 25, height: 25, borderWidth: 1, borderColor: 'green', borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: -10, }}>
                            <Text style={{ fontSize: 12, color: 'green', fontWeight: 'bold' }}>{item.reservation_data.filter((i) => i.user._id === user_id)[0].reserved}</Text>
                        </View>
                    )
                }
                <View style={{ flexDirection: 'row', marginRight: 15, }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, flex: 1, }}>{item.title}</Text>
                    {
                        item.tags.length > 0 && (
                            <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderRadius: 5, borderColor: 'green' }} onPress={onPressNote}>
                                <Text style={{ color: 'green', fontWeight: 'bold', }}>
                                    + {item.tags.length} preference
                                </Text>
                            </TouchableOpacity>
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
                        <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 22, marginRight: 5, color: Colors.primary, fontWeight: 'bold', marginRight: 10, }}>{(item.count - item.reserved).toString()}</Text>
                            <Text style={{ fontSize: 17, fontStyle: 'italic', justifyContent: 'flex-end', color: 'black', opacity: 0.7, }}>left</Text>
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