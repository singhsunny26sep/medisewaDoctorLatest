import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from '../Drawer/DrawerNavigator';
import { colors } from '../const/Colors';
import { NavigationString } from '../const/NavigationString';
import FindDoctor from '../screen/FindDoctor';
import FindConcern from '../screen/FindConcern';
import DoctorDetails from '../screen/DoctorDetails';
import ProfileUpdate from '../screen/ProfileUpdate';
import UploadPrecription from '../screen/UploadPrecription';
import AllAppoinment from '../screen/AllAppointment';
import AllPatients from '../screen/AllPatients';
import ForgotPassword from '../screen/ForgotPassword';
import PdfViewerScreen from '../screen/PdfViewerScreen';
import VideoCallScreen from '../screen/VideoCallScreen';
import TimingSlot from '../screen/TimingSlot';

const Stack = createStackNavigator();

const Auth = (): React.JSX.Element => {
    return (
        <Stack.Navigator initialRouteName={NavigationString.Drawer}>

            <Stack.Screen name={NavigationString.Drawer} component={DrawerNavigator} options={{ headerShown: false, }} />

            <Stack.Screen name={NavigationString.FindDoctor} component={FindDoctor} options={{ headerShown: true, title: "Find Doctor", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.FindConcern} component={FindConcern} options={{ headerShown: true, title: "Find your Health Concern", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.DoctorDetails} component={DoctorDetails} options={{ headerShown: false, title: "Doctor Details", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            {/* <Stack.Screen name={NavigationString.ProfileUpdate} component={ProfileUpdate} options={{ headerShown: true, title: "Profile Update", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} /> */}
            <Stack.Screen name={NavigationString.ProfileUpdate} component={ProfileUpdate} options={{ headerShown: true, title: "Profile Update", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.UploadPrecription} component={UploadPrecription} options={{ headerShown: true, title: "Upload Precription", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.AllAppoinment} component={AllAppoinment} options={{ headerShown: true, title: "Appoinment", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.AllPatients} component={AllPatients} options={{ headerShown: true, title: "Patients", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.ForgotPassword} component={ForgotPassword} options={{ headerShown: true, title: "Patients", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.PdfViewerScreen} component={PdfViewerScreen as any} options={{ headerShown: false }} />
            <Stack.Screen name={NavigationString.VideoCallScreen} component={VideoCallScreen} options={{ headerShown: true, title: "Video Call", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />
            <Stack.Screen name={NavigationString.TimingSlot} component={TimingSlot} options={{ headerShown: true, title: "Timing Slot", headerStyle: { backgroundColor: colors.greenCustom, }, headerTintColor: colors.white, headerTitleStyle: { color: colors.white } }} />

        </Stack.Navigator>
    )
}

export default Auth