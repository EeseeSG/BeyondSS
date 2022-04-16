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
import { defaultStyles } from '../../constants/defaultStyles';


export default function ProjectItem(props) {
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const { data: item, user_id, style={}, navigation, } = props;
    const checkApplied = item.reservation_data.filter((i) => i.user._id === user_id)
    const hasApplied = checkApplied.length != 0;

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
        <View style={{ width: windowWidth - 20, ...style }}>
            <TouchableOpacity style={[(hasApplied || user_id === item.user._id) ? { borderWidth: 2, borderColor: 'green'} : { borderWidth: 0.5, borderColor: '#ccc' }, { margin: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }]} onPress={() => navigation.navigate('ProjectDetail', { data: item })}>
                {
                    hasApplied && (
                        <View style={{ width: 25, height: 25, borderWidth: 1, borderColor: 'green', borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: -10, }}>
                            <Text style={{ fontSize: 12, color: 'green', fontWeight: 'bold' }}>{checkApplied[0].reserved}</Text>
                        </View>
                    )
                }
                <View style={{ flexDirection: 'row', }}>
                    <Text style={[defaultStyles.h3, { flex: 1, marginRight: 5, }]}>{item.title}</Text>
                    {
                        item.tags.length > 0 && (
                            <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', height: 30, width: 30, borderWidth: 0.5, borderRadius: 5, borderColor: 'green', }} onPress={onPressNote}>
                                <Text style={[defaultStyles.small, { color: 'green', textAlign: 'center' }]}>
                                    +{item.tags.length}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
                <View style={{ marginHorizontal: 7, }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginVertical: 10, }}>
                        <View style={{ flex: 1, marginRight: 5, }}>
                            <Text style={[defaultStyles.text, defaultStyles.textBold, defaultStyles.textLight]} numberOfLines={3}>{item.location.trim()}</Text>
                            <Text style={[defaultStyles.text, defaultStyles.textLight]}>{moment(item.datetime.seconds * 1000).format('LLL')}</Text>
                            <Text style={defaultStyles.textLight}>({moment(item.datetime.seconds * 1000).fromNow()})</Text>
                        </View>
                        <View style={{ marginRight: 10, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Text style={[defaultStyles.h2, defaultStyles.noMargin, { color: Colors.primary }]}>{item.reserved} / {item.count}</Text>
                            <Text style={defaultStyles.small}>reserved</Text>
                        </View>
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