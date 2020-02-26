import React from 'react'
import {createSwitchNavigator, createAppContainer } from 'react-navigation'

import Loading from './src/screens/login_flow/loading/loading'
import Login from './src/screens/login_flow/login/login'
import Tag from './src/screens/login_flow/tag/tag'
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
    Login: Login,
    Tag: Tag,
    Stack: Stack
  },
    {
      initialRouteName: 'Loading'
    }
  )
)

export default App