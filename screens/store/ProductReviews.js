import React, { useEffect, useState, } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    FlatList,
    Alert,
	ScrollView,
	Image
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Popup } from 'react-native-popup-confirm-toast';

// ANIMATION
import * as Animatable from 'react-native-animatable';


import ItemReview from '../../components/Store/ItemReview';
import ItemRatingBreakdown from '../../components/Store/ItemRatingBreakdown';

export default function ProductReviews({ navigation, route }) {
    const { ratings } = route.params;
    const [isFiltered, setIsFiltered] = useState(false);
    const [reviews, setReviews] = useState(ratings.map((r) => r.data).flat());

    const _loadAllReviews = () => {
        let all_reviews = ratings.map((r) => r.data).flat();
        setReviews(all_reviews);
        setIsFiltered(false);
    }

    const _handleFilterRatings = (rating_info) => {
        let filtered = ratings.filter((r) => r.rating === parseInt(rating_info.rating));
        let filtered_review = filtered.map((r) => r.data).flat();
        setReviews(filtered_review)
        setIsFiltered(rating_info.rating)
    }

    const _renderRatings = () => {
        return ratings.map((r, i) => (
            <ItemRatingBreakdown 
                key={i} 
                ratingData={r}
                ratings={ratings}
                marginBottom={10}
                interactive
                onInteraction={_handleFilterRatings}
                interactedIndex={isFiltered}
            />
        ))
    }

    const _renderReviews = ({item, index}) => (
        <ItemReview
            key={index}
            review={item}
        />
    )

    const _renderFooter = () => (
        <View style={{ flex: 1, marginVertical: 30, }}>
            <Text style={{ fontSize: 12, color: '#000', opacity: 0.8, textAlign: 'center', }}>- You have reached the end of the reviews -</Text>
        </View>
    )

    const _renderOnEmpty = () => (
        <View style={{ flex: 1, marginVertical: 30, }}>
            <Text style={{ fontSize: 12, color: '#000', opacity: 0.8, textAlign: 'center', }}>- There are no reviews currently -</Text>
        </View>
    )


    return (
        <View style={styles.container}>
            {
                isFiltered && 
                <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 7, marginTop: 10, borderWidth: 0.5, borderRadius: 10, borderColor: '#ccc', marginRight: 20, }} onPress={_loadAllReviews}>
                    <Text style={{ fontSize: 12, }}>Select All</Text>
                </TouchableOpacity>
            }
            <FlatList
                horizontal={false}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={_renderRatings}
                data={reviews}
                renderItem={_renderReviews}
                contentContainerStyle={{ margin: 15, paddingBottom: 30, }}
                ListFooterComponent={_renderFooter}
                ListEmptyComponent={_renderOnEmpty}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1, 
	},
});