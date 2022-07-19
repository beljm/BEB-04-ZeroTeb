import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/homeTab/Home'
import SignIn from '../screens/auth/SignIn'
import { HomeStackParamList } from '../models/Navigations'
import EventDetail from '../screens/common/EventDetail'

export default function HomeStackScreen() {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>()

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerBackButtonMenuEnabled: true }}
      />
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  )
}
