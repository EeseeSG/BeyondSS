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
        paddingVertical: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textColor,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textColor,
    },
    h1: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.textColor,
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.textColor,
    },
    h3: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.textColor,
    },
    h4: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.textColor,
    },
    small: {
        fontSize: 12,
        fontStyle: 'italic',
        color: Colors.textColor,
    },
    text: {
        color: Colors.textColor,
    },
    textLight: {
        color: Colors.textColor,
        opacity: 0.6
    },
    textBold: {
        fontWeight: 'bold'
    },
    buttonPrimary: { 
        padding: 10, 
        margin: 5, 
        borderWidth: 1, 
        borderRadius: 10, 
        borderColor: '#ccc', 
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
        borderRadius: 20, 
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