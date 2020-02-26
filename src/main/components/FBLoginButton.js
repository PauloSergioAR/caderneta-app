import React, { Component } from 'react';
import { View } from 'react-native';

import { Button } from 'react-native-elements'

import { LoginManager } from 'react-native-fbsdk'

export default class FBLoginButton extends Component {

  handleFacebookLogin(){
    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        this.props.callback(result)
      },
      function(error) {
        this.props.callback({error: error})
      }
    );
  }

  render() {
    return (
      <View>
        <Button
          onPress={this.handleFacebookLogin}
          title="Continuar com o Facebook"
          color="#4267B2"
        />
      </View>
    );
  }
};

module.exports = FBLoginButton;