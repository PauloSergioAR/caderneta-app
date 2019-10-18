import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { SwitchNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
// import the different screens
import Loading from './src/screens/loading/loading'
import SignUp from './src/screens/signup/signup'
import Login from './src/screens/login/login'
import Main from './src/main/main'
// create our app's navigation stack
const App = createAppContainer(
  createSwitchNavigator({
    Loading,
    SignUp,
    Login,
    Main
    },
    {
      initialRouteName: 'Loading'
    }
  )
)


export default App