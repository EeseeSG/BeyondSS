// ESSENTIALS
import React from 'react';
import { 
    View, 
	Text,
    TouchableOpacity
} from 'react-native';
import { useTheme } from 'react-native-paper';

// DESIGN
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ItemRatingBreakdown(props) {
    const { ratings, ratingData, marginBottom=0, interactive=false, onInteraction=()=>null, interactedIndex=null, } = props;
    const { colors } = useTheme();
    let total_ratings = ratings.map((r) => r.data).flat().length;
    let current_ratings = ratingData.data.length;
    let display_rating = current_ratings / total_ratings;
    let rating_percent = `${(display_rating*100).toFixed(0)}%`;

    const RenderInnerContent = () => (
        <>
            <MaterialCommunityIcons name='star' size={14}/>
            <Text style={{ fontSize: 13, }} numberOfLines={1}>{ratingData.rating}</Text>
            <View style={{ flex: 1, backgroundColor: colors.background, height: 10, borderRadius: 50, marginHorizontal: 10, zIndex: 1, borderWidth: 0.5, borderColor: '#ccc' }}>
                <View style={[
                    { position: 'absolute',height: 10, borderRadius: 10, zIndex: 2, width: rating_percent }, 
                    interactive // only if it is interactive
                    ?  
                        interactedIndex  // if any grading is selected
                        ?
                            ratingData.rating === interactedIndex  // differentiate color for those that selected and non-selected
                            ?
                                { backgroundColor: 'green', }
                            :
                                { backgroundColor: colors.darkGrey, }
                        :
                            { backgroundColor: 'green', }
                    : 
                        { backgroundColor: 'green', }
                ]}></View>
            </View>
            <Text style={{ fontSize: 10, color: colors.darkGrey, opacity:  0.6, width: 35, }} numberOfLines={1}>({current_ratings})</Text>
        </>
    )

    if(!interactive) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom, }}>
                <RenderInnerContent/>
            </View>
        )
    }
    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom, }} onPress={() => onInteraction(ratingData)}>
            <RenderInnerContent/>
        </TouchableOpacity>
    )
}