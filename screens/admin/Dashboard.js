import React, { useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import { getAllApplicationsActive, createNewUser, deleteApplication, getAllUsersByDateJoined } from '../../database/User';

export default function NewProject() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [applications, setApplications] = useState([]);
    const [selection, setSelection] = useState(0);
    const [users, setUsers] = useState([]);
    const [rawUsers, setRawUsers] = useState([]);

    useEffect(() => {
        return _getApplications()
    }, [])

    useEffect(() => {
        return _getAllUser()
    }, [])

    const _getAllUser = async () => {
        let users = await getAllUsersByDateJoined();
        setUsers(users);
        setRawUsers(users);  // for filtering
    }

    const _getApplications = async () => {
        let applications_arr = await getAllApplicationsActive();
        setApplications(applications_arr);
    }

    const handleApplicationsRefresh = async () => {
        setIsRefreshing(true);
        await _getApplications();
        setIsRefreshing(false);
    }

    const handleUsersRefresh = async () => {
        setIsRefreshing(true);
        await _getAllUser();
        setIsRefreshing(false);
    }

    const _approveApplication = async (data) => {
        Popup.show({
            type: 'confirm',
            title: 'WARNING!',
            textBody: 'Are you sure you like to approve this application?',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await createNewUser(data);
                    console.log(status)
                    if(status.success) {
                        Popup.show({
                            type: 'success',
                            title: 'User successfully created',
                            textBody: 'The user has been created and password is set to the LAST SIX (6) digitals of thier registered phone number. They may change password once they login, under "Settings"',
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                        _removeApplicationFromList(data._id);
                    } else {
                        Popup.show({
                            type: 'danger',
                            title: 'Error. Please try again.',
                            textBody: status.error,
                            buttonText: 'Close',
                            callback: () => Popup.hide()
                        })
                    }
                } catch(err) {
                    Popup.show({
                        type: 'danger',
                        title: 'Error. Please try again.',
                        textBody: err,
                        buttonText: 'Close',
                        callback: () => Popup.hide()
                    })
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }

    const _removeApplicationFromList = (application_id) => {
        let new_arr = applications.filter((application) => application._id !== application_id);
        setApplications(new_arr)
    }

    const _declineApplication = async (data) => {
        Popup.show({
            type: 'confirm',
            title: 'WARNING!',
            textBody: 'Are you sure you like to reject this application? This action cannot be undone.',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await deleteApplication(data._id);
                    _removeApplicationFromList(data._id);
                } catch(err) {
                    console.log(err)
                } finally {
                    Popup.hide();
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }

    const _deleteUser = async (data) => {
        Popup.show({
            type: 'confirm',
            title: 'WARNING!',
            textBody: 'Are you sure you like to delete this application? This action cannot be undone.',
            buttonText: 'Confirm',
            confirmText: 'Cancel',
            callback: async () => {
                try {
                    let status = await deleteApplication(data._id);
                    _removeApplicationFromList(data._id);
                } catch(err) {
                    console.log(err)
                } finally {
                    Popup.hide();
                }
            },
            cancelCallback: () => {
                Popup.hide();
            },
        })
    }

    const renderItem = ({item}) => {
        return (
            <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, }}>{item.name}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, marginVertical: 5, color: 'blue' }}>Applying as: {item.type.toUpperCase()}</Text>
                        <View style={{ marginVertical: 5, borderWidth: 0.5, borderColor: '#ccc', padding: 5, borderRadius: 5, }}>
                            <Text style={{ fontStyle: 'italic', }}>{item.email}</Text>
                            <Text style={{ fontStyle: 'italic', }}>+65 {item.contact}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _approveApplication(item)}>
                            <Feather 
                                name="check-square"
                                color={'green'}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _deleteUser(item)}>
                            <Feather 
                                name="x-square"
                                color={'red'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontWeight: 'bold', }}>Date Applied: {moment(item.createdAt.seconds * 1000).format('LLL')}</Text>
                <Text>Device OS: {item.device}</Text>
            </View>
        )
    }

    const renderUser = ({item}) => {
        return (
            <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, borderColor: '#ccc', borderWidth: 0.5, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, }}>{item.name}</Text>
                        <Text style={{ fontStyle: 'italic', marginVertical: 5, }}>{item.email}</Text>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5, }}>+65 {item.contact}</Text>
                        <Text style={{ fontWeight: 'bold', marginVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 15,}}>
                            Initial Password: <Text style={{ color: 'red' }}>{item.initial_password}</Text>
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _declineApplication(item)}>
                            <Feather 
                                name="x-square"
                                color={'red'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginVertical: 5, }}>
                    <Text style={{ fontWeight: 'bold', }}>Date Accepted: {moment(item.createdAt.seconds * 1000).format('LLL')}</Text>
                    <Text style={{ fontWeight: 'bold', }}>Date Applied: {moment(item.appliedAt.seconds * 1000).format('LLL')}</Text>
                </View>
                <Text>Device OS: {item.device}</Text>
            </View>
        )
    }

    const handleSearch = (text) => {
        if(text.trim().length === 0) {
            setUsers(rawUsers);
            return
        }
        let filtered_results = rawUsers.filter((user) => user.contact.indexOf(text) !== -1);
        setUsers(filtered_results);
    }

    const renderHeader = () => (
        <View style={{ flexDirection: 'row', marginBottom: 10, paddingHorizontal: 20, }}>
            <TouchableOpacity style={[selection === 0 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(0)}>
                <Text style={{ color: 'black' }}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[selection === 1 ? { borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10,} : {  }, { flex: 1, justifyContent: 'center', alignItems: 'center' }]} onPress={() => setSelection(1)}>
                <Text style={{ color: 'black' }}>Search Approved</Text>
            </TouchableOpacity>
        </View>
    )


    return (
        <FlatList
            horizontal={false}
            keyExtractor={(_, index) => index.toString()}
            data={selection === 0 ? applications : users}
            ListHeaderComponent={renderHeader}
            ListHeaderComponentStyle={{ marginTop: 10, }}
            renderItem={selection === 0 ? renderItem : renderUser}
            showsVerticalScrollIndicator={false}
            onRefresh={selection === 0 ? handleApplicationsRefresh : handleUsersRefresh}
            refreshing={isRefreshing}
        />
    )
}
