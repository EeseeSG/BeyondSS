import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';


export default function MultiSelectComponent(props) {
	const { data, selected, setSelected } = props;
	

	const renderItem = (item) => {
		return (
			<View style={styles.item}>
				<Text style={styles.selectedTextStyle}>{item.label}</Text>
				<Icon style={styles.icon} color="black" name="ios-filter" size={20} />
			</View>
		);
	};

	return (
			<View style={styles.container}>
				<MultiSelect
					style={styles.dropdown}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					inputSearchStyle={styles.inputSearchStyle}
					iconStyle={styles.iconStyle}
					data={data}
					labelField="label"
					valueField="value"
					placeholder="Select item(s)"
					value={selected}
					search
					searchPlaceholder="Search..."
					onChange={item => {
						setSelected(item);
					}}
					renderLeftIcon={() => (
						<Icon
							style={styles.icon}
							color="black"
							name="menu"
							size={20}
						/>
					)}
					renderItem={renderItem}
					renderSelectedItem={(item, unSelect) => (
						<TouchableOpacity onPress={() => unSelect && unSelect(item)}>
							<View style={styles.selectedStyle}>
								<Text style={styles.textSelectedStyle}>{item.label}</Text>
								<Icon color="black" name="close" size={13} />
							</View>
						</TouchableOpacity>
					)}
				/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { padding: 16 },
	dropdown: {
		height: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: {
		width: 0,
		height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	placeholderStyle: {
		fontSize: 16,
		color: 'black',
		opacity: 0.4,
	},
	selectedTextStyle: {
		fontSize: 14,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	selectedStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 14,
		backgroundColor: 'white',
		shadowColor: '#000',
		marginTop: 8,
		marginRight: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	textSelectedStyle: {
		marginRight: 5,
		fontSize: 12,
	},
});