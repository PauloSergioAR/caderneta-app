import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { SwitchNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'

import Loading from './src/screens/loading/loading'
import SignUp from './src/screens/signup/signup'
import Login from './src/screens/login/login'
import Main from './src/screens/main/main'
import User from './src/screens/user/user'
import Search from './src/screens/search/search'



import { createStackNavigator } from 'react-navigation-stack';


const Stack = createStackNavigator(
  {
    MainScreen: Main,
    UserScreen: User,
    SearchScreen: Search
  }, {
    transparentCard: true,
    headerTranparent: true
  })

const App = createAppContainer(
  createSwitchNavigator({
    Loading: Loading,    
    SignUp: SignUp,
    Login: Login,
    Stack: Stack
  },
    {
      initialRouteName: 'Loading'
    }
  )
)


export default App

// SignUp: SignUp,
// Login: Login,