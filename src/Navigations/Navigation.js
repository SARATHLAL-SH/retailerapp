import {View, Text} from 'react-native';
import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import NavBar from '../Components/NavBar';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ReceivedOrder from '../Screens/ReceivedOrder';
import ConfirmedOrders from '../Screens/ConfirmedOrders';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AddDeliveryBoy from '../Screens/AddDeliveryBoy';
import Settings from '../Screens/Settings';
import CancelledOrders from '../Screens/CancelledOrders';
import AddProducts from '../Screens/AddProducts';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home Screen"
      screenOptions={{headerShown: false}}
      drawerStyle={{backgroundColor: 'red'}}>
      <Drawer.Screen name="Home Screen" component={AppTab} />
      <Drawer.Screen name="Add Delivery" component={AddDeliveryBoy} />
      <Drawer.Screen name="Add Product" component={AddProducts} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Received',
          tabBarIcon: () => (
            <MaterialIcons name="move-to-inbox" color="#5e0587" size={30} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#750253',
          },
        }}
      />
      <Tab.Screen
        name="Recieved Orders"
        component={ConfirmedOrders}
        options={{
          tabBarLabel: 'Confirmed',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="checkbox-multiple-marked"
              color="green"
              size={30}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'green',
          },
        }}
      />
      <Tab.Screen
        name="Sent Items"
        component={ReceivedOrder}
        options={{
          tabBarLabel: 'Sent Items',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="send-check"
              color="#05877a"
              size={30}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#05877a',
          },
        }}
      />
      <Tab.Screen
        name="delivered"
        component={ReceivedOrder}
        options={{
          tabBarLabel: 'delivered',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="truck-delivery"
              color="#759404"
              size={30}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#759404',
          },
        }}
      />
      <Tab.Screen
        name="rejected Orders"
        component={CancelledOrders}
        options={{
          tabBarLabel: 'Rejected',
          tabBarIcon: () => (
            <Entypo name="squared-cross" color="red" size={30} />
          ),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'red',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default Navigation;
