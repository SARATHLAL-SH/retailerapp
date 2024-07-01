import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Accelerometer,gyroscope  } from 'react-native-sensors';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../Global/styles';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOrders} from '../redux/slices/orderSlice';
import Sound from 'react-native-sound';
import axios from 'axios';
import { API } from '../utils/ApiUtils';
import { combineSlices } from '@reduxjs/toolkit';

const NavBar = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isOpen, setIsOpen] = useState(false);
  
  const dispatch = useDispatch();
  const orders = useSelector(state => state.Order.data);

  const [orderData, setOrderData] = useState();
  const [notificationCount, setNotificationCount] = useState();
   const [isnotification, setIsNotification] = useState(false);

  const [rotateX] = useState(new Animated.Value(0));
  const [rotateY] = useState(new Animated.Value(0));
  const [rotateZ] = useState(new Animated.Value(0));
  const shopID = '661597712a93792d53b32449';

  useEffect(() => {
    dispatch(fetchOrders());
    
  },[dispatch]);

  
    const notificationSound = useRef(new Sound('../../assets/notification_ding.mp3'));
   

  useEffect(()=>{
     const playNotificationSound = async () => {
    try {
      const dataArray = orders?.data;
      setOrderData(dataArray);
      setNotificationCount(dataArray?.length || 0);
      const hasNewNotifications = dataArray?.length > 0 ;

      if (hasNewNotifications && notificationCount < hasNewNotifications) { // Play only when count increases
        await notificationSound.current.play(); // Play the sound using async/await
      }
      setIsNotification(hasNewNotifications);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  playNotificationSound();
  return () => {
    if (notificationSound.current) {
      notificationSound.current.stop?.();
      notificationSound.current.release?.();
    }
  };
  },[orders])
  const fetchShopStatus = async () => {
    console.log("Fetching shop status...");
    try {
      const response = await axios.put(`${API}update/wineshop/satatus/open/closed/${shopID}`);
      if (response.data) {
        const { data } = response.data;
        console.log(data);
        if (data.status === 'open') {
          setIsOpen(true);
          console.log('Shop is open');
        } else {
          setIsOpen(false);
          console.log('Shop is closed');
        }
      }
    } catch (error) {
      console.error('Error fetching shop status:', error);
    }
  };

useEffect(()=>{
 try{
  const fetchShopInitialStatus = async () => {
const response = await axios.get(`${API}get/wineshop/${shopID}`);
if(response.data){
const {status} =response.data;
if(status === 'open'){
setIsOpen(true);
} else{
setIsOpen(false);
}
}
}
fetchShopInitialStatus();
 } catch (error) {
 console.log('error in fetching shop status',error);
 }
 
},[])


 
  useEffect(() => {
    const subscription = gyroscope.subscribe(({ x, y, z }) => {
      // Update the animated values based on the gyroscope data
      rotateX.setValue(x);
      rotateY.setValue(y);
      rotateZ.setValue(z);
    });

    return () => subscription.unsubscribe();
  }, [rotateX, rotateY, rotateZ]);

  const rotationStyle = {
    transform: [
      {
        rotateX: rotateX.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-1rad', '1rad'],
        }),
      },
      {
        rotateY: rotateY.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-1rad', '1rad'],
        }),
      },
      {
        rotateZ: rotateZ.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-1rad', '1rad'],
        }),
      },
    ],
  };


  const toggleIsOpen = () => {
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
            fetchShopStatus();
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
          <Animated.Image source={require('../../assets/soora.png')} style={[styles.image, rotationStyle]}/>
            <Animated.Text style={[styles.text, animatedStyle]}>
              SURA APP
            </Animated.Text>
          </View>
        </TouchableOpacity>
        <View>
          <Icon
            name="notifications"
            color={isnotification ? 'red' : '#4F8EF7'}
            size={25}
          />
          <Text style={styles.notificationCount}>{notificationCount}</Text>
        </View>
        {/* <Text style={{color:'red'}}>x:{x}</Text> */}
        <View>
          <TouchableOpacity
            style={[
              styles.btnContainer,
              {borderColor: isOpen ? 'green' : 'red'},
            ]}
            onPress={toggleIsOpen}>
            <Text style={[styles.status, {color: isOpen ? 'green' : 'red'}]}>
              {isOpen?'OPEN' : 'CLOSED'}
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
    height: Dimensions.get('screen').height * 0.08,
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
   flexDirection: 'row',
  },
  text: {
    color: colors.WHITE,
    fontWeight: '700',
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 5,
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
  notificationCount: {
    position: 'absolute',
    right: -10,
    color: colors.WHITE,
    fontWeight: '700',
    fontSize: 16,
    top: -8,
  },
  image: {
    width: 40,
    height: 40,
  },
});
