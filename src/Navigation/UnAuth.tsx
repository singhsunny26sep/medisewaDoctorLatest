import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/Login';
import Register from '../screen/Register';
import { NavigationString } from '../const/NavigationString';
import Dashboard from '../screen/Dashboard';
import { colors } from '../const/Colors';
import ChooseRole from '../screen/ChooseRole';
import ForgotPassword from '../screen/ForgotPassword';
import MobileLogin from '../screen/MobileLogin';
import MobileVerify from '../screen/MobileVerify';

const Stack = createStackNavigator();


const UnAuth = (): React.JSX.Element => {
    return (
        <Stack.Navigator initialRouteName={NavigationString.MobileLogin}>
            {/* <Stack.Screen name={NavigationString.ChooseRole} component={ChooseRole} options={{ title: 'Choose Role', headerShown: false, headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, }} /> */}
            {/* <Stack.Screen name={NavigationString.Dashboard} component={Dashboard} options={{ title: 'Dashboard', headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, }} /> */}
            <Stack.Screen name={NavigationString.Login} component={Login} options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name={NavigationString.MobileLogin} component={MobileLogin} options={{ title: 'Mobile Login', headerShown: false }} />
            <Stack.Screen name={NavigationString.MobileVerify} component={MobileVerify} options={{ title: 'Mobile Verify', headerShown: false }} />
            <Stack.Screen name={NavigationString.Register} component={Register} options={{ title: 'Register', headerShown: false }} />
            <Stack.Screen name={NavigationString.ForgotPassword} component={ForgotPassword} options={{ title: 'Forgot Password', headerShown: true, headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
        </Stack.Navigator>
    )
}

export default UnAuth