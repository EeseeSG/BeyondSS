import * as Colors from './Colors';
import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    section: {
        marginHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    h1: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    h3: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    card: {
        flex: 1, 
        margin: 10,
        paddingVertical: 10, 
        borderRadius: 10, 
        backgroundColor: '#fff', 
        borderWidth: 0.5, 
        borderColor: '#ccc',
    },


    // overrides
    noMargin: {
        margin: 0,
        marginHorizontal: 0,
        marginVertical: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginEnd: 0,
        marginStart: 0,
    },
    noPadding: {
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingEnd: 0,
        paddingStart: 0,
    },
    noBorder: {
        borderWidth: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    noBorderRadius: {
        borderRadius: 0,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    }
})