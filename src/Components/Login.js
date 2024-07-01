import { StyleSheet, Text, View,Animated,Easing,TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native-gesture-handler';

const Login = () => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const startAnimation = () => {
        // Reset the animated value before starting the animation
        translateY.setValue(0);
        opacity.setValue(1);
        Animated.parallel
        ([Animated.timing(translateY, {
          toValue: -500, // Adjust this value to control how far up the text moves
          duration: 4000, // Duration of the animation in milliseconds
          easing: Easing.linear, // Easing function for smooth animation
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(opacity, {
            toValue: 0, // Fade out to 0 opacity
            duration: 2000, // Duration of the animation in milliseconds
            easing: Easing.linear, // Easing function for smooth animation
            useNativeDriver: true, // Use native driver for better performance
          }),]).start();
      };

  return (
    <TouchableWithoutFeedback onPress={startAnimation}>
      <View style={styles.container}>
        <Animated.Text style={[styles.text, { transform: [{ translateY }],opacity }]}>
          soora
        </Animated.Text>
        <Animated.Image source={require('../../assets/soora.png')} style={[styles.image, { transform: [{ translateY }],opacity }]}/>
       
        <TextInput style={styles.input} placeholder="Enter Mobile Number" inputMode='numeric' keyboardType='number-pad' maxLength={10} />
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
     
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c710a2',
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 2,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderColor: '#c710a2',
  },
  image: {
    width: 40,
    height: 40,
  },
  button: {
    backgroundColor: '#c710a2',
    height: 40,
    width: 300,
    borderWidth: 1,
    padding: 5,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
},
})