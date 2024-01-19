// GifScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Asset } from 'expo-asset';
import { ScrollView } from 'react-native-gesture-handler';

const GifScreen = () => {
  const gifAnimation = Asset.fromModule(require('./assets/animation.gif')).uri;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require('./path/to/pulse-animation.json')} // Replace with your pulsating animation JSON file
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 300,
    height: 300,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default GifScreen;
