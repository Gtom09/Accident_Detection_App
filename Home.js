import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

const HomeScreen = ({ navigation }) => {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkMovement = async () => {
      try {
        const { status } = await DeviceMotion.requestPermissionsAsync();
        if (status !== 'granted') {
          console.error('Motion permission not granted');
          return;
        }

        DeviceMotion.setUpdateInterval(500);

        DeviceMotion.addListener(({ acceleration }) => {
          if (acceleration && (acceleration.x > 13 || acceleration.y > 13 || acceleration.z > 13)) {
            handleHighMovement();
          }
        });

        startRotationAnimation();
      } catch (error) {
        console.error('Error starting motion detection:', error);
      }
    };

    const startRotationAnimation = () => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    checkMovement();

    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const handleHighMovement = () => {
    // Navigate to Main page when significant movement is detected
    navigation.navigate('Main');
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./assets/setting.jpg')} // Replace with the actual path to your logo
        style={[styles.logo, { transform: [{ rotate: rotateInterpolate }] }]}
      />
      <Text style={styles.title}>Scanning for Major Impact...</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>Go to Emergency</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A5ACD',  // Background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ecf0f1',  // Text color
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    paddingRight:10,
    marginTop: 30,
    width: 200,
    alignItems: 'center',
    shadowColor: '#34495e',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
