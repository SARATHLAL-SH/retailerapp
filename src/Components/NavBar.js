import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../Global/styles';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const NavBar = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    // Display the confirmation alert
    Alert.alert(
      'Confirmation',
      `Are you sure change status to ${isOpen ? 'close' : 'open'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setIsOpen(!isOpen);
          },
        },
      ],
    );
  };
  const animationHandler = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animationHandler();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{scale: scaleAnim}],
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.GRADIENT}
        style={[
          styles.gradientContainer,
          {borderBottomColor: isOpen ? 'green' : 'red'},
        ]}>
        <TouchableOpacity onPress={animationHandler}>
          <View style={styles.textContainer}>
            <Animated.Text style={[styles.text, animatedStyle]}>
              SURA APP
            </Animated.Text>
          </View>
        </TouchableOpacity>
        <View>
          <Icon name="notifications" color="#4F8EF7" size={30} />
        </View>
        <View>
          <TouchableOpacity
            style={[
              styles.btnContainer,
              {borderColor: isOpen ? 'green' : 'red'},
            ]}
            onPress={toggleIsOpen}>
            <Text style={[styles.status, {color: isOpen ? 'green' : 'red'}]}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {},
  gradientContainer: {
    height: Dimensions.get('screen').height * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    elevation: 10,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    // semi-transparent white background
  },
  text: {
    color: colors.WHITE,
    fontWeight: '700',
    fontSize: 20,
    paddingLeft: 40,
  },
  btnContainer: {
    borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginRight: 40,
    height: 20,
    width: 70,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontWeight: '700',
  },
});
