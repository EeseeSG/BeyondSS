// ESSENTIALS
import React, { useState, useEffect, } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Image,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';

// DESIGN
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from '../../constants/defaultStyles';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

// CHAT
import { kitty } from '../../constants/ChatKitty';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FlatList } from 'react-native-gesture-handler';
import firebase from 'firebase';
require('firebase/firestore');

import * as UserData from '../../database/User';


const CHAT_DATA = {
    title: `title`,
    data: [
        {
            key: 1,
            text: 'Chat 1',
            message: 'Test',
            user: {
                _id: 1,
                username: 'User 1',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2020-11-25')
        },
        {
            key: 2,
            text: 'Chat 2',
            message: 'Test',
            user: {
                _id: 2,
                username: 'User 2',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-03-22')
        },
        {
            key: 3,
            text: 'Chat 3',
            message: 'Test',
            user: {
                _id: 3,
                username: 'User 3',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-09-20')
        },
        {
            key: 4,
            text: 'Chat 4',
            message: 'Test',
            user: {
                _id: 4,
                username: 'User 4',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 5,
            text: 'Chat 5',
            message: 'Test',
            user: {
                _id: 5,
                username: 'User 5',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 6,
            text: 'Chat 6',
            message: 'Test',
            user: {
                _id: 6,
                username: 'User 6',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 7,
            text: 'Chat 7',
            message: 'Test',
            user: {
                _id: 7,
                username: 'User 7',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 8,
            text: 'Chat 8',
            message: 'Test',
            user: {
                _id: 8,
                username: 'User 8',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 9,
            text: 'Chat 9',
            message: 'Test',
            user: {
                _id: 9,
                username: 'User 9',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 10,
            text: 'Chat 10',
            message: 'Test',
            user: {
                _id: 10,
                username: 'User 10',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 11,
            text: 'Chat 11',
            message: 'Test',
            user: {
                _id: 11,
                username: 'User 11',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        },
        {
            key: 12,
            text: 'Chat 12',
            message: 'Test',
            user: {
                _id: 12,
                username: 'User 12',
                avatar: require('../../assets/sample/default_avatar.png')
            },
            dateCreated: moment('2021-12-01')
        }
    ], 
}

export default function Chats({ navigation }) {
    const { colors } = useTheme();
    const isFocused = useIsFocused();

    //=====================================================================================================================
    //==  CURRENT USERS  ==
    //====================================================================================================================
    const [currentUser, setCurrentUser] = useState([]);
    useEffect(() => {
        async function _getCurrentUser() {
            let current_user = await UserData.currentUserData();
            setCurrentUser(current_user)
        }
        return _getCurrentUser()
    }, [])


    //=====================================================================================================================
    //==  CHANNELS  ==
    //=====================================================================================================================
    const [channels, setChannels] = useState([]);
    const [loadedChannels, setLoadedChannels] = useState(false);
    useEffect(() => {
        async function initChatKitty() {
            console.log('hit')
            const result = await kitty.startSession({
                username: currentUser._id
            });
            console.log(result)
            if (result.succeeded) {
                await getChannels()
            }
            if (result.failed) {
                const error = result.error; // Handle error
                Popup.show({
                    type: 'danger',
                    title: 'Access Error',
                    textBody: error,
                    buttonText: 'Close',
                    callback: () => Popup.hide()
                })
            }
        }
        return initChatKitty()
    }, [isFocused])


    const getChannels = async () => {
        const result = await kitty.getChannels();

        if (result.succeeded) {
            const channels = result.paginator.items; // Handle channels
            setChannels(channels)
            console.log(channels)
        }

        if (result.failed) {
            const error = result.error; // Handle error
            console.log(error)
        }

        setLoadedChannels(true)
    }

    console.log(loadedChannels)

    const renderChannels = (data) => {
        return (
            <TouchableOpacity style={styles.channelPreview} onPress={() => handleJoinChannel(data.item)}>
                <View style={{ flex: 1}} />
                <View style={styles.channelInfo}>
                    <Text style={{ fontSize: 20, textTransform: 'capitalize', color: 'white' }}>{data.item.name}</Text>
                    <Text style={{ color: 'white', opacity: 0.7, }}>{data.item.type}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderLoadingChannels = (data) => {
        return (
            <TouchableOpacity style={[styles.channelPreview, { backgroundColor: '#A9A9A9' }]} onPress={() => handleJoinChannel(data.item)}>
                <View style={{ flex: 1}} />
                <View style={styles.channelInfo}>
                    <Text style={{ fontSize: 20, textTransform: 'capitalize', color: 'white' }}></Text>
                    <Text style={{ color: 'white', opacity: 0.7, }}>Loading...</Text>
                </View>
            </TouchableOpacity>
        )
    }

    async function handleJoinChannel(channel) {
        const result = await kitty.joinChannel({ channel: channel });
        navigation.navigate('Channel', { channel: result.channel });
    }


    //=====================================================================================================================
    //==  CHATS  ==
    //=====================================================================================================================
    const [listData, setListData] = useState([CHAT_DATA])

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const [section] = rowKey.split('.');
        const newData = [...listData];
        const prevIndex = listData[section].data.findIndex(
            item => item.key === rowKey
        );
        newData[section].data.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderItem = data => (
        <TouchableOpacity style={[styles.row, styles.rowFront]} onPress={() => navigation.navigate('Room')}>
            <View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
                <Image source={data.item.user.avatar} style={styles.chatImage}/>
                <View style={{ marginLeft: 10, flex: 1, }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', opacity: 0.8, }}>{data.item.user.username}</Text>
                    <Text style={{ color: 'black', opacity: 0.7, }}>{data.item.message}</Text>
                </View>
                <Text style={{ fontSize: 12, color: 'black', opacity: 0.6, marginTop: 5, }}>{moment(data.item.dateCreated).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={[styles.row, styles.rowBack]}>
            <Text>Left</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    //=====================================================================================================================
    //==  RENDER DISPLAY  ==
    //=====================================================================================================================
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Channels</Text>
                {
                    loadedChannels 
                    ?
                        <FlatList
                            horizontal
                            keyExtractor={(item) => item.id.toString()}
                            data={channels}
                            renderItem={renderChannels}
                            showsHorizontalScrollIndicator={false}
                        />
                    :
                        <FlatList
                            horizontal
                            keyExtractor={(item) => item.id.toString()}
                            data={[{id: 1}, {id: 2}]}
                            renderItem={renderLoadingChannels}
                            showsHorizontalScrollIndicator={false}
                        />
                }

            </View>

            <View style={[styles.section, { flex: 1, }]}>
                <Text style={styles.title}>Chats</Text>
                <SwipeListView
                    useSectionList
                    sections={listData}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowDidOpen}
                    renderSectionFooter={() => <View style={{ height: 150, }}/>}  // buffer at bottom
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.dark, }]} onPress={() => navigation.navigate('Create Room', { currentUser })}>
                <Icon size={30} name={'md-color-wand-outline'} color={'#fff'}/>
            </TouchableOpacity>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    channelPreview: {
        height: 150, 
        width: 120,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    channelInfo: {
        height: 70,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
    },
    section: {
        marginTop: 10,
    },
    backTextWhite: {
        color: '#FFF',
    },
    row: {
        height: 60, 
        marginHorizontal: 5,
        marginTop: 5,
        paddingVertical: 5,
        borderBottomWidth: 0.5, 
        borderBottomColor: '#A9A9A9', 
        flex: 1, 
    },
    rowFront: {
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        height: '100%'
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: '100%'
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    createBtn: { 
        position: 'absolute', 
        bottom: 90, 
        right: 20, 
        width: 50, 
        height: 50, 
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatImage: { 
        height: 50,
        width: 50,
        borderRadius: 50/3, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        backgroundColor: '#A9A9A9',
    },
});