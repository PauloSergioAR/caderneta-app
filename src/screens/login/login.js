import React from 'react'
import { StyleSheet, Text, TextInput, View, Dimensions, Image, KeyboardAvoidingView, Keyboard } from 'react-native'

import firebase from 'react-native-firebase'

import Icon from 'react-native-vector-icons'
import LinearGradient from 'react-native-linear-gradient';
import { Input } from 'react-native-elements'
import { Button } from 'react-native-elements';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {

    let errorMessage
    let emptyEmail = false
    let { email, password } = this.state

    if (email === '') {
      errorMessage = "Email não pode estar vazio"
      emptyEmail = true
    }

    if (password === '') {
      if (emptyEmail)
        errorMessage += "\nSenha não pode estar vazia"
      else
        errorMessage = "Senha não pode estar vazia"
    }
    if (!errorMessage) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Stack'))
        .catch(error => this.setState({ errorMessage: error.message }))
    } else {
      this.setState({ errorMessage: errorMessage })
    }
    console.log('handleLogin')
  }
  render() {

    let image = this.state.showImage ? 
      (<View style={styles.image} >
        <Image source={require('../../res/logo_264_c_b.png')} />
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
      </View>) :
      <></>

    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}      
      >
        <View style={styles.container}>
          <View style={styles.center}>
            <View style={styles.tabcontainer}>
              <View style={styles.logincontainer}>
                <Text
                  style={styles.register}
                  onPress={() => this.props.navigation.navigate('Login')}
                >Login</Text>
                <View style={{ backgroundColor: '#00C9E1', height: 3, width: 100, borderRadius: 100 }} />
              </View>
              <View style={styles.registercontainer}>
                <Text
                  onPress={() => this.props.navigation.navigate('SignUp')}
                  style={styles.register}>Registro</Text>
              </View>
            </View>            
            <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
              <Input
                ref={(ref) => this.emailField = ref}                              
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                leftIcon={{ type: 'ionicon', name: 'ios-mail' }}
              />
              <Input
                secureTextEntry                
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                placeholder="Senha"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
              />
              <Button
                title="Login"
                onPress={this.handleLogin}
                buttonStyle={styles.button}
                type={"outline"}
              />
            </KeyboardAvoidingView>
          </View>
        </View>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  logincontainer: {
    marginRight: 10,
  },

  registercontainer: {
    marginLeft: 10
  },

  tabcontainer: {
    marginTop: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    marginBottom: 20,
    marginTop: 8,
  },
  form: {
    marginTop: 64,
    width: width * .8,
  },
  center: {
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 6,
  },
  image: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  register: {
    alignSelf: "center",
    color: 'white',
    fontSize: 30,
    fontFamily: 'notoserif'
  },
  button: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: width * .65,
    marginBottom: 5,
    marginTop: 10,
    alignSelf: 'center'
  }
})