import React, { useState, useEffect, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList,
} from 'react-native';
import { Popup } from 'react-native-popup-confirm-toast';
import moment from 'moment';
import { getAllApplications } from '../../database/User';
import Feather from 'react-native-vector-icons/Feather';
import { createNewUser, deleteApplication } from '../../database/User';


export default function NewProject(props) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        return _getApplications()
    }, [])

    const _getApplications = async () => {
        let applications_arr = await getAllApplications();
        setApplications(applications_arr);
    }

    const handleRefresh = () => {
        _getApplications()
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
                    _removeApplicationFromList(data._id);
                    console.log(status)
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
                    console.log(status)
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
                        <Text style={{ fontStyle: 'italic', marginVertical: 5, }}>{item.email}</Text>
                        <Text style={{ fontWeight: 'bold', marginVertical: 5, }}>+65 {item.contact}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _approveApplication(item)}>
                            <Feather 
                                name="check-square"
                                color={'green'}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => _declineApplication(item)}>
                            <Feather 
                                name="x-square"
                                color={'red'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontWeight: 'bold', marginVertical: 5, }}>Date Applied: {moment(item.createdAt.seconds * 1000).format('LLL')}</Text>
                <Text>Device Brand: {item.device.brand}</Text>
                <Text>Device Model: {item.device.model}</Text>
                <Text>Device OS: {item.device.platform}</Text>
            </View>
        )
    }


    return (
        <FlatList
            horizontal={false}
            keyExtractor={(_, index) => index.toString()}
            data={applications}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => null}
            ListFooterComponentStyle={{ paddingBottom: 90, }}
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
        />
    )
}