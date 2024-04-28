import {View, Text} from 'react-native';
import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import NavBar from '../Components/NavBar';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ReceivedOrder from '../Screens/ReceivedOrder';
import ConfirmedOrders from '../Screens/ConfirmedOrders';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AddDeliveryBoy from '../Screens/AddDeliveryBoy';
import Settings from '../Screens/Settings';

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
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color="blue" size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Recieved Orders"
        component={ReceivedOrder}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="check" color="blue" size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Confirmed Orders"
        component={ConfirmedOrders}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="bell" color="blue" size={30} />
          ),
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
