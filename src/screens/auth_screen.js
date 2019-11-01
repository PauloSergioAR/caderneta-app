import React, { Component } from 'react';

import { View, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import Login from './login/login'
import SignUp from './signup/signup';

// import { Container } from './styles';

export default class Auth extends Component {
  state = {
    indexes: 0,
    routes:[
      {key: 'login', title: 'Login'},
      {key: 'register', title: 'Register'}
    ]
  }
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={
          SceneMap({
            login: Login,
            register: SignUp
          })
        }
        onIndexChange={index => this.setState({index})}
        initialLayout={{ width: Dimensions.get('window').width }}       
      />
      
    );
  }
}
