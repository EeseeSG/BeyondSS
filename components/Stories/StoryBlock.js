import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoryBlock = ({
  index,
  width,
  height,
  borderRadius,
  backgroundColor,
}) => {
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width,
        height,
        borderRadius,
        backgroundColor,
      },
    ],
    [width, height, borderRadius, backgroundColor]
  );
  return (
    <View style={containerStyle}>
      <Text style={styles.text}>{index}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default StoryBlock;