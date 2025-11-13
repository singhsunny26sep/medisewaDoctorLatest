import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DrawerNavigator from './src/Drawer/DrawerNavigator'
import MainNavigation from './src/Navigation/MainNavigation'
import LoginProvider from './src/context/LoginProvider'
import CallProvider from './src/context/CallProvider'
import { navigationRef } from './src/Navigation/navigationRef'

const App = (): React.JSX.Element => {

  return (
    <NavigationContainer ref={navigationRef}>
      <LoginProvider>
        <CallProvider>
          <MainNavigation />
        </CallProvider>
      </LoginProvider>
    </NavigationContainer>
  )
}

export default App