import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { SwitchNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'

import Loading from './src/screens/loading/loading'
import SignUp from './src/screens/signup/signup'
import Login from './src/screens/login/login'
import Main from './src/main/main'
import User from './src/main/user'



import { createStackNavigator } from 'react-navigation-stack';


const Stack = createStackNavigator(
  {
    MainScreen: Main,
    UserScreen: User
  },{
    headerLayoutPreset:'center',
    defaultNavigationOptions: {      
    }
  })

const App = createAppContainer(
  createSwitchNavigator({
    Loading: Loading,
    //Auth: Auth,
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