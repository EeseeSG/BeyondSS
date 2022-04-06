// ESSENTIALS
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image,
    TouchableOpacity, 
} from 'react-native';
import ItemRating from './ItemRating';


export default function StoreMenu(props) {
    const { item, navigation } = props;

    // TEMP: ADD RANDOM RATING
    const [ratings, setRatings] = useState([]);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        return _getCurrentProductReviews()
    }, [])

    async function _getCurrentProductReviews() {
        let ratings = [
            randomRating(5),
            randomRating(4),
            randomRating(3),
            randomRating(2),
            randomRating(1),
        ];
        setRatings(ratings);

        let reviews = ratings.map((r) => r.data).flat().slice(0, 5); // take first 5
        setReviews(reviews);
    }

    function randomRating(rating_grade) {
        return {
            rating: rating_grade,
            data: randomArray(rating_grade, 20)
        }
    }
    
    function randomArray(rating_grade, max) {
        let max_length = Math.round(Math.random() * max);
        let array = [];
        for(var i = 0; i < max_length; i++) {
            array.push({
                _id: Math.round(Math.random() * max),
                text: 'Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review Test Review',
                user: {
                    name: 'user_01',
                    avatar: 'https://firebasestorage.googleapis.com/v0/b/sg-eesee.appspot.com/o/default%2Fdefault_avatar.png?alt=media&token=928854a5-f4ec-4792-b4a9-ae2e671f3f15',
                },
                createdAt: new Date(),
                rating: rating_grade,
            })
        }
        return array
    }

    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.productCardContainer} onPress={() => navigation.navigate('FoodItem', { data: item })}>
            <Image source={{ uri: item.image }} style={styles.productImage}/>
            <View style={styles.cardTextContainer}>
                <Text numberOfLines={1} style={styles.title}>{item.text}</Text>
                <ItemRating 
                    ratings={ratings}
                />
            </View>
            <View>
                <Text style={{ color: '#000', opacity: 0.8, fontSize: 12, }}>From</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', opacity: 0.8, }}>${item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productCardContainer: {
        backgroundColor: '#fff',
        elevation: 5,
        shadowRadius: 3,
        shadowOffset: {
            width: 3,
            height: 3
        },
        padding: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    productImage: {
        height: 60,
        width: 60,
        borderRadius: 10,
        backgroundColor: '#A9A9A9'
    },
    title: {
        fontSize:  14,
        color: '#000'
    },
    cardTextContainer: {
        flex: 1,
        margin: 12
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})