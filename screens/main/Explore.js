import React, { useEffect, useState, } from 'react';
import { 
    View, 
    FlatList, 
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import * as ProjectData from '../../database/Project';
import MultiSelect from '../../components/Search/MultiSelect';
import moment from 'moment';
import * as Colors from '../../constants/Colors';


export default function Explore(props) {
    const { navigation } = props;
    const [isLoaded, setIsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);
    const [rawProjects, setRawProjects] = useState([]);
    const [category, setCategory] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        async function _getProjectData() {
            let project_arr = await ProjectData.getAllUpcomingProjectData();
            setProjects(project_arr);
            setRawProjects(project_arr);  // to revert back after release filter

            // set the categories
            let categories_arr = await _getCategories(project_arr);
            let categories_mapped = await _convertToMap(categories_arr)
            setCategory(categories_mapped);

            // load the page
            setIsLoaded(true);
        }
        return _getProjectData()
    }, [])

    const handleSelect = (val) => {
        setSelected(val)

        if(val.length === 0) {
            setProjects(rawProjects);  // revert to all values
            return
        }

        // filter data
        let filtered_data = projects.filter((d) => {
            for(const v of val) {
                if(d.tags.indexOf(v) !== -1) {
                    return true
                }
            }
            return false
        })

        setProjects(filtered_data)
    } 

    // ===========================================
    // CATEGORIES
    // ===========================================
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

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ margin: 10, borderWidth: 0.5, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#fff' }} onPress={() => navigation.navigate('ProjectDetail', { data: item })}>
                <View style={{ flexDirection: 'row', marginRight: 15, }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, flex: 1, }}>{item.title}</Text>
                    <Text 
                        style={[
                            item.tags.indexOf('halal') !== -1 ? 
                            { color: 'green', borderColor: 'green' } : 
                            { color: Colors.primary, borderColor: Colors.primary }, 
                            { fontWeight: 'bold', borderWidth: 0.5, justifyContent: 'center', alignContent: 'center', textAlignVertical: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, }
                        ]}
                    >
                        {item.tags.indexOf('halal') !== -1 ? 'Halal' : 'Non-Halal'}
                    </Text>
                </View>
                <View style={{ marginHorizontal: 7, }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginVertical: 10, }}>
                        <View style={{ flex: 1, }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{item.location}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.dark }}>{moment(item.datetime.seconds * 1000).format('LLL')}</Text>
                            <Text>({moment(item.datetime.seconds * 1000).fromNow()})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 22, marginRight: 5, color: Colors.primary, fontWeight: 'bold', marginRight: 10, }}>{item.count.toString()}</Text>
                            <Text style={{ fontSize: 17, fontStyle: 'italic', justifyContent: 'flex-end', color: 'black', opacity: 0.7, }}>left</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, }}>
                        <Text style={{ color: '#000' }} numberOfLines={5}>{item.message}</Text>
                    </View>
                </View>
            </TouchableOpacity>    
        )
    }


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