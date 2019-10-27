import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'

import firebase from 'react-native-firebase'

import Icon from 'react-native-vector-icons'
import {Input} from 'react-native-elements'

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {

    const { email, password } = this.state
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Stack'))
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleLogin')
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <Input
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          leftIcon={{ type: 'font-awesome', name: 'mail' }}
        />
        <Input
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})