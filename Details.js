import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const Details = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [confirmNumber, setConfirmNumber] = useState('');

  const [recording, setRecording] = useState();
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Audio permission not granted');
        return;
      }

      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        setRecording(recording);

        recording.setProgressUpdateInterval(500); // Set interval to update sound level

        recording.setOnRecordingStatusUpdate(({ soundLevels }) => {
          if (soundLevels && soundLevels.length > 0) {
            const avgSoundLevel = soundLevels.reduce((acc, val) => acc + val, 0) / soundLevels.length;
            setSoundLevel(avgSoundLevel);

            // Check if sound level exceeds 30 decibels
            if (avgSoundLevel > 1) {
              handleHighSoundLevel();
            }
          }
        });
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    })();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const handleSubmission = () => {
    // Validation logic
    if (emergencyNumber.length !== 10 || confirmNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit number for both Emergency Number and Confirm Number.');
      return;
    }

    if (emergencyNumber !== confirmNumber) {
      Alert.alert('Error', 'Emergency Number and Confirm Number must match.');
      return;
    }

    // Handle form submission logic here
    console.log('Form submitted:', { name, emergencyNumber, confirmNumber });
  };

  const handleHighSoundLevel = () => {
    // Stop recording when a high sound level is detected
    if (recording) {
      recording.stopAndUnloadAsync();
    }

    // Navigate to Google page
    navigation.navigate('Emergency', { url: 'https://google.com' });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/setting.jpg')} // Replace with the actual path to your image
        style={styles.image}
      />
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Text style={styles.formLabel}>Emergency Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter emergency number"
          value={emergencyNumber}
          onChangeText={(text) => setEmergencyNumber(text)}
          keyboardType="numeric"
        />

        <Text style={styles.formLabel}>Confirm Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm emergency number"
          value={confirmNumber}
          onChangeText={(text) => setConfirmNumber(text)}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmission}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A5ACD', // Light background color
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60, // Circular image style
    tintColor: 'rgba(255, 255, 255, 0.7)',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'white', // White background for the form container
    padding: 20,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold', // Bold label
  },
  input: {
    borderWidth: 4,
    borderColor: 'black',
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'green'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold', // Bold submit button text
  },
});

export default Details;

