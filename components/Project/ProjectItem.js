import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import moment from 'moment';
import { Popup } from 'react-native-popup-confirm-toast';

// DESIGN
import * as Colors from '../../constants/Colors';
import { defaultStyles } from '../../constants/defaultStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function ProjectItem(props) {
    const { width: windowWidth, } = Dimensions.get('window');
    const { data: item, user_id, style={}, navigation, } = props;
    const checkApplied = item.reservation_data.filter((i) => i.user._id === user_id)
    const hasApplied = checkApplied.length != 0;
    const isOwner = user_id === item.user._id;

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

    // COLOR OF CARD
    let itemColor;
    let itemStatus;
    let itemStatusColor;
    if(isOwner || hasApplied) {
        if(new Date() <= new Date(item.datetime.seconds * 1000)) {
            itemColor = Colors.primary;
            itemStatus = 'ONGOING';
            itemStatusColor = Colors.error;
        } else {
            itemColor = Colors.error;
            itemStatus = 'OVER';
            itemStatusColor = Colors.success;
        }
    } else if ((new Date() <= new Date(item.datetime.seconds * 1000)) && (item.reserved !== item.count)) {
        itemColor = Colors.success;
        itemStatus = 'ONGOING';
        itemStatusColor = Colors.error;
    } else if (item.reserved === item.count) {
        itemColor = Colors.error;
        itemStatus = 'FULL';
        itemStatusColor = Colors.error;
    } else {
        itemColor = Colors.pending;
        itemStatus = 'ONGOING';
        itemStatusColor = Colors.error;
    }  


    return (
        <View style={{ width: windowWidth - 20, ...style }}>
            <View style={[defaultStyles.shadow, { margin: 10, borderRadius: 20, backgroundColor: '#fff' }]}>

                {/** ===========================================================================================
                 * ==== STATUS HEADER
                 =========================================================================================== */}
                <View style={[{ height: 20, borderTopStartRadius: 20, borderTopEndRadius: 20, justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20, }, { backgroundColor: itemColor }]}>
                    <View style={[{ position: 'absolute', height: 35, justifyContent: 'center', alignItems: 'center', width: '70%', borderRadius: 20, }, { backgroundColor: itemColor }]}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {
                                isOwner ? (  // CHEF
                                    'YOUR SESSION'  
                                ) : (
                                    hasApplied ? (
                                        'RESERVED ' + checkApplied[0].reserved + ' PORTIONS' // BENEFICIARY
                                    ) : (
                                        (item.reserved === item.count) ? (
                                            'FULLY RESERVED'
                                        ) : (
                                            'AVAILABLE'
                                        )
                                    )
                                )
                            }
                        </Text>
                    </View>

                    {/** ----------------------------------
                     * ----- TAGS (IF ANY)
                     ---------------------------------- */
                        item.tags.length > 0 && (
                            <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 30, justifyContent: 'center', alignItems: 'center', height: 30, alignSelf: 'flex-end', margin: 10, zIndex: 999, elevation: 999, }} onPress={onPressNote}>
                                <MaterialCommunityIcons 
                                    name={'information-outline'}
                                    color={Colors.darkGrey}
                                    size={30}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>

                {/** ===========================================================================================
                 * ==== DETAILED DATA
                 =========================================================================================== */}
                <TouchableOpacity style={{ padding: 15, }}  onPress={() => navigation.navigate('ProjectDetail', { data: item })}>

                    {/** ----------------------------------
                     * ----- DATE TIME
                     ---------------------------------- */}
                    <View style={{ flexDirection: 'row', marginBottom: 5, }}>
                        <MaterialCommunityIcons 
                            name={'calendar-month'}
                            color={Colors.primary}
                            size={24}
                        />
                        <Text style={[defaultStyles.h4, defaultStyles.textBold, { color: Colors.primary, marginLeft: 20, }]}>{moment(item.datetime.seconds * 1000).format('LLL')}</Text>
                    </View>

                    {/** ----------------------------------
                     * ----- MENU AND RESERVATIONS
                     ---------------------------------- */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2, }}>
                            <Text style={[defaultStyles.h4, defaultStyles.textBold, defaultStyles.noMargin]}>Menu</Text>
                            <Text style={[defaultStyles.text, defaultStyles.noMargin,]} numberOfLines={2}>{item.title}</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                            <Text style={[defaultStyles.h4, defaultStyles.textBold, defaultStyles.noMargin]}>Reservations</Text>
                            <Text style={[defaultStyles.h4, defaultStyles.textBold]} numberOfLines={1}>{item.reserved} / {item.count}</Text>
                            <View style={{ backgroundColor: itemStatusColor, opacity: 0.5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, }}>
                                <Text style={[defaultStyles.small, defaultStyles.textBold]}>{itemStatus}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}


{/* <View style={{ width: windowWidth - 20, ...style }}>
<TouchableOpacity style={[defaultStyles.shadow, (hasApplied || user_id === item.user._id) ? { borderWidth: 2, borderColor: 'green'} : { borderWidth: 0.5, borderColor: '#ccc' }, { margin: 10, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }]} onPress={() => navigation.navigate('ProjectDetail', { data: item })}>
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
</View> */}