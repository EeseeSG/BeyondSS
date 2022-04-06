// ESSENTIALS
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
} from 'react-native';


export default function StoreTags(props) {
    const { tags, wrapped=false, style } = props;

    if(wrapped) {
        return (
            <View style={styles.wrapped}>
                {
                    tags.map((tag, i) => (
                        <View key={i} style={styles.tags}>
                            <Text style={{ fontSize: 12, color: '#000', opacity: 0.7, }}>{tag}</Text>
                        </View>
                    ))
                }
            </View>
        )
    }

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={style}
        >
            {
                tags.map((tag, i) => (
                    <View key={i} style={styles.tags}>
                        <Text style={{ fontSize: 12, color: '#000', opacity: 0.7, }}>{tag}</Text>
                    </View>
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    tags: { 
        paddingHorizontal: 5, 
        paddingVertical: 3, 
        borderRadius: 10, 
        borderWidth: 0.5, 
        borderColor: '#ccc',
        marginRight: 5, 
        marginVertical: 3,
    },
    wrapped: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }, 
})