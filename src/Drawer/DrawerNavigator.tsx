import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Home from '../screen/Home';
import CustomDrawer from './CustomDrawer';
import {colors} from '../const/Colors';
import Profile from '../screen/Profile';
import {NavigationString} from '../const/NavigationString';
import MyPatient from '../screen/MyPatient';
import Appointments from '../screen/Appointments';
import AppointmentView from '../components/AppointmentView';

const Drawer = createDrawerNavigator();

const DrawerNavigator = (): React.JSX.Element => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="Home"
      screenOptions={{
        drawerActiveBackgroundColor: '#3448a4',
        drawerActiveTintColor: colors.white,
        headerTintColor: colors.white,
        drawerInactiveBackgroundColor: '#5c6fae',
        drawerInactiveTintColor: colors.black,
        drawerStyle: {width: 280},
        headerStyle: {backgroundColor: colors.greenCustom},
        headerTitleStyle: {
          color: colors.white,
          fontSize: 20,
          fontWeight: 'bold',
        },
        drawerItemStyle: {marginVertical: 3},
        drawerLabelStyle: {fontSize: 16, fontWeight: 'normal'},
      }}>
      <Drawer.Screen
        name={NavigationString.Home}
        component={Home}
        options={{
          drawerIcon: ({color}) => (
            <SimpleLineIcons name="home" size={20} color="white" />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationString.MyDoctors}
        component={MyPatient}
        options={{
          title: 'My Patient',
          drawerIcon: ({color}) => (
            <SimpleLineIcons name="star" size={20} color="white" />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationString.Appointments}
        component={Appointments}
        options={{
          title: 'Appointment',
          drawerIcon: ({color}) => (
            <SimpleLineIcons name="credit-card" size={20} color="white" />
          ),
        }}
      />
      <Drawer.Screen
        name={NavigationString.Profile}
        component={Profile}
        options={{
          drawerIcon: ({color}) => (
            <AntDesign name="user" size={20} color="white" />
          ) /* headerRight: () => <ButtonTopRight icon={"more-vertical"} text={null} navigatoinName={'addChangeLocation'} image={false} />, */,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
