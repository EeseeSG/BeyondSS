import React, { useEffect, useState, } from 'react';
import { 
    View, 
    ScrollView, 
} from 'react-native';
import { defaultStyles } from '../../constants/defaultStyles';
import StoreBlock from '../../components/Store/StoreBlock';
import MultiSelect from '../../components/Search/MultiSelect';
import * as StoreData from '../../database/Store';


export default function Explore(props) {
    const { navigation } = props;
    const [isLoaded, setIsLoaded] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [displayStoreData, setDisplayStoreData] = useState([]);
    const [category, setCategory] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        async function _getStoreData() {
            let store_data = await StoreData.getAllStoreDataLimit(10);  // max 10 entries for subsequent query
            let arr_store_id = store_data.map(store => store._id)
            let store_product_data = await StoreData.getStoreProductDataByGroup(arr_store_id);
            let mapped_store_data = await StoreData._mapProductToStore({arr_store: store_data, arr_products: store_product_data})
            setStoreData(mapped_store_data);  // basic data
            setDisplayStoreData(mapped_store_data);  //  data to display for filtered items

            // set categories
            let flat_categories = await _getCategories(mapped_store_data);
            let categories_map = await _convertToMap(flat_categories);
            setCategory(categories_map)

            setIsLoaded(true)
        }   
        return _getStoreData()
    }, [])

    const handleSelect = (val) => {
        setSelected(val)

        if(val.length === 0) {
            setDisplayStoreData(storeData);  // revert to all values
            return
        }

        // filter data
        let filtered_data = storeData.filter((d) => {
            for(const v of val) {
                if(d.tags.indexOf(v) !== -1) {
                    return true
                }
            }
            return false
        })

        setDisplayStoreData(filtered_data)
    } 

    // ===========================================
    // CATEGORIES
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
    // END CATEGORIES
    // ===========================================

    if(!isLoaded) {
        return (
            <View></View>
        )
    }
    return (
        <ScrollView style={defaultStyles.container} contentContainerStyle={{ paddingBottom: 90, }}>
            <MultiSelect 
                data={category}
                selected={selected}
                setSelected={handleSelect}
            />
            { 
                displayStoreData.map((data, i) => (
                    <StoreBlock 
                        key={i}
                        index={i} 
                        data={data}
                        navigation={navigation}
                    />
                ))
            }
        </ScrollView>
    )
}
