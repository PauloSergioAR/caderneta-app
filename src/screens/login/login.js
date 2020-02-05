import React from 'react'
import { StyleSheet, Text, TextInput, View, Dimensions, Image, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native'

import firebase from 'react-native-firebase'

import Icon from 'react-native-vector-icons'
import LinearGradient from 'react-native-linear-gradient';
import { Input } from 'react-native-elements'
import { Button } from 'react-native-elements';
import FBLoginButton from '../../main/components/FBLoginButton'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Login extends React.Component {

  constructor(props){
    super(props)
    
    this.state = {
      email: '',
      password: '',
      emailErr: '',
      passErr: '',
      loading: false,
      errorMessage: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }

    Dimensions.addEventListener('change', )
  }

  onDimensionsChange(){
    this.setState({
      ...this.state,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    width = Dimensions.get('window').width,
    height = Dimensions.get('window').height
  }

  handleLogin = () => {
    this.setState({ loading: true })
    let errorMessage
    let emptyEmail = false
    let emptyPass = false
    let email = this.state.email
    let password = this.state.password

    if (email === '') {
      this.setState({ emailErr: "Email não pode estar vazio" })
      emptyEmail = true
    }

    if (password === '') {
      this.setState({ passErr: "Senha não pode estar vazia" })
      emptyPass = true
    }
    if (!emptyEmail && !emptyPass) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ loading: false })
          this.props.navigation.navigate('Stack')
        })
        .catch(error => {
          console.log(error.message)
          this.setState({ errorMessage: error.message, loading: false })
        })
    } else {
      this.setState({ errorMessage: errorMessage, loading: false })
    }    
  }
  render() {

    let btn = this.state.loading ?
      <ActivityIndicator style={{ marginBottom: 5, marginTop: 10, alignSelf: 'center' }} size="large" color="#f5f5f5" /> :
      <FBLoginButton/>

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
            {this.state.errorMessage &&
                <Text 
                  style={{ color: 'red', alignSelf: 'center'}}
                  adjustsFontSizeToFit
                  numberOfLines={1}>
                  {this.state.errorMessage}
                </Text>
              }
            <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
              <Input
                ref={(ref) => this.emailField = ref}
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                leftIcon={{ type: 'ionicon', name: 'ios-mail' }}
                errorMessage={this.state.emailErr}
              />
              <Input
                secureTextEntry
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                placeholder="Senha"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                errorMessage={this.state.passErr}
              />
            </KeyboardAvoidingView>
            {btn}
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
    alignSelf: 'center'
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