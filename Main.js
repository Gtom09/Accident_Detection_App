import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { encode as base64Encode } from 'base-64';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

const EmergencyScreen = () => {
  const navigation = useNavigation();

  const [buttonClicked, setButtonClicked] = useState(false);
  const [timer, setTimer] = useState(10);
  const [stopTimer, setStopTimer] = useState(false);
  const [circleColor, setCircleColor] = useState('red');
  const [circleText, setCircleText] = useState('EMERGENCY');
  const [sound, setSound] = useState();

  const twilioAccountSID = 'AC4dde5e595dc4be61cefd995ee8cce6a2';
  const twilioAuthToken = '83a4c850ada1c2722893c0176787bb5b';
  const twilioPhoneNumber = '+12017541340';

  const handleButtonPress = async (url) => {
    setButtonClicked(true);

    if (url === 'https://bit.ly/retratoone') {
      Linking.openURL(url);
      await getCurrentLocation();
      // await sendEmergencyText();
    } else if (url === 'https://google.com') {
      setStopTimer(true);
      setCircleColor('green');

      if (circleText === 'EMERGENCY') {
        setCircleText('SAFE');
        //await getCurrentLocation();
      }
    }
  };

  const sendEmergencyText = async (latitude, longitude) => {
    const messageBody = `It's an Emergency! Your contact has met with an accident. Current location: ${latitude}, ${longitude} and the last location is: https://maps.app.goo.gl/v13wQqD2wtBtX7qW8 `;
    const toPhoneNumber = '+916361884365'; // Replace with the actual user's phone number

    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + base64Encode(`${twilioAccountSID}:${twilioAuthToken}`),
        },
        body: `From=${twilioPhoneNumber}&To=${toPhoneNumber}&Body=${encodeURIComponent(messageBody)}`,
      });

      if (response.ok) {
        console.log('Emergency text sent successfully');
      } else {
        console.error('Failed to send emergency text');
      }
    } catch (error) {
      console.error('Error sending emergency text:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      console.log('Current coordinates:', latitude, longitude);

      // Uncomment the line below to send the emergency text with current coordinates
      //await sendEmergencyText(latitude, longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  useEffect(() => {
    const playTimerSound = async () => {
      let timeoutId;

      if (!buttonClicked && !stopTimer) {
        // Start the timer sound
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/warning.mp3')
        );
        setSound(sound);
        await sound.playAsync();

        timeoutId = setTimeout(async () => {
          // When the timer reaches zero, call the location function
          await getCurrentLocation();
          Linking.openURL('https://bit.ly/retratoone');
        }, 10000);
      }

      return async () => {
        clearTimeout(timeoutId);
        setTimer(10);
        // Stop the timer sound when the component unmounts
        if (sound) {
          await sound.unloadAsync();
        }
      };
    };

    playTimerSound();
  }, [buttonClicked, stopTimer]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!stopTimer) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [stopTimer]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Details')}>
          <Image
            source={require('./assets/setting.jpg')} 
            style={styles.headerButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>INTEGRATED HEALTH CARE APP</Text>
      </View>
      <View style={styles.content}>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={[styles.glowingCircle, { backgroundColor: circleColor }]}
        >
          <View style={styles.circle}>
            <Text style={styles.emergencyText}>{circleText}</Text>
          </View>
        </Animatable.View>

        <Text style={styles.okText}>LOOKS LIKE AN EMERGENCY!</Text>
        <Text style={styles.okText}>MET WITH AN ACCIDENT?</Text>

        <Text style={styles.timerText}>{`SOS: ${timer}s`}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleButtonPress('https://bit.ly/retratoone');
            }}
          >
            <Text style={styles.buttonText}>EMERGENCY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: circleColor }]}
            onPress={() => handleButtonPress('https://google.com')}
          >
            <Text style={styles.buttonText}>{stopTimer ? '       EXIT       ' : '   CANCEL   '}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#483D8B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#6A5ACD',
    paddingLeft: 8,
    paddingRight: 20,
  },
  headerButtonImage: {
    width: 35,
    height: 35,
    paddingLeft: 10,
    tintColor: 'rgba(255, 255, 255, 0.7)', 
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    paddingRight: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  glowingCircle: {
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderRadius: 115,
  },
  emergencyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  okText: {
    fontSize: 22,
    paddingTop: 30,
    marginBottom: -10,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  button: {
    backgroundColor: 'red',
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 80,
    paddingLeft: 80,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 6,
    borderRadius: 80,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    padding: 15,
    fontSize:16,
  },
  timerText: {
    fontSize: 36,
    marginTop: 10,
    color: '#FF6347',
  },
});

export default EmergencyScreen;
