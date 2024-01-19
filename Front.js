// Front.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const FrontPage = () => {
  const translateY = useSharedValue(0);

  const onGestureEvent = (event) => {
    translateY.value = event.nativeEvent.translationY;
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <ImageBackground
          source={require('./assets/setting.jpg')} // Replace with your background image
          style={styles.backgroundImage}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome to My App</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log('Login pressed')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => console.log('Register pressed')}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FrontPage;
