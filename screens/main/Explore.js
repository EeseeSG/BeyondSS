import React, { useEffect, useState } from 'react';
import { 
    View, 
    FlatList, 
    Text,
    StyleSheet,
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import * as ProjectData from '../../database/Project';
import MultiSelect from '../../components/Search/MultiSelect';
import { useIsFocused } from '@react-navigation/native';
import firebase from 'firebase';
require('firebase/firestore');

import ProjectItem from '../../components/Project/ProjectItem';


export default function Explore(props) {
    const { navigation } = props;
    const user_id = firebase.auth().currentUser.uid;
    const [isLoaded, setIsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);
    const [rawProjects, setRawProjects] = useState([]);
    const [category, setCategory] = useState([]);
    const [selected, setSelected] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        return _getProjectData()
    }, [isFocused])


    // ===========================================
    //   DATA
    // ===========================================
    async function _getProjectData() {
        let project_arr = await ProjectData.getOutstandingProjects();

        // set the data
        setProjects(project_arr);
        setRawProjects(project_arr);  // to revert back after release filter

        // set the categories
        let categories_arr = await _getCategories(project_arr);
        let categories_mapped = await _convertToMap(categories_arr)
        setCategory(categories_mapped);

        // load the page
        setIsLoaded(true);
    }

    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = async () => {
        setIsRefreshing(true);

        // reset all values
        setSelected([])

        await _getProjectData();

        setIsRefreshing(false);
    }

    // ===========================================
    //   MULTISELECT
    // ===========================================
    const handleSelect = (val) => {
        setSelected(val)

        if(val.length === 0) {
            setProjects(rawProjects);  // revert to all values
            return
        }

        // filter data
        let filtered_data = rawProjects.filter((d) => {
            for(const v of val) {
                if(d.tags.indexOf(v) !== -1) {
                    return true
                }
            }
            return false
        })

        setProjects(filtered_data)
    } 

    async function _getCategories(arr) {
        let arr_tags = []
        for(const store of arr) {
            let tags = store.tags;
            for(const tag of tags){ 
                if(arr_tags.indexOf(tag) === -1) {
                    arr_tags.push(tag)
                }
            }
        }
        return arr_tags
    }

    async function _convertToMap(arr) {
        let arr_map = [];
        for(const item of arr) {
            arr_map.push({
                label: _capitalText(item),
                value: item
            })
        }
        return arr_map
    }

    function _capitalText(text) {
        let text_arr = text.split('_');
        let final_text = '';
        for(const text of text_arr) {
            final_text = final_text + text.slice(0,1).toUpperCase() + text.slice(1,text.length) + ' '
        }
        return final_text.trim()
    }


    // ===========================================
    //   LIST
    // ===========================================
    const renderItem = ({ item }) => (
        <ProjectItem 
            data={item} 
            user_id={user_id}
            navigation={navigation}
        />
    )

    // ===========================================
    //   DISPLAY
    // ===========================================
    if(!isLoaded) {
        return (
            <View></View>
        )
    }

    return (
        <View style={defaultStyles.container} contentContainerStyle={{ paddingBottom: 90, }}>
            <MultiSelect 
                data={category}
                selected={selected}
                setSelected={handleSelect}
            />
            <View style={{ alignItems: 'flex-end', marginRight: 25, marginBottom: 10, }}>
                <Text style={{ color: 'black', opacity: 0.7, fontStyle: 'italic' }}>Showing {projects.length} of {rawProjects.length} results</Text>
            </View>
            <FlatList
                horizontal={false}
                keyExtractor={(_, index) => index.toString()}
                data={projects}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => null}
                ListFooterComponentStyle={{ paddingBottom: 90, }}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
            />
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