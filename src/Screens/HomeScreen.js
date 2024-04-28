import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../Components/NavBar';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar />
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
