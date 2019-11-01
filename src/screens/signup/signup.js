import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, Dimensions, Keyboard } from 'react-native'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { Input } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import { string } from 'prop-types';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class SignUp extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null, showImage: true }

  constructor(props){
    super(props)
    //this.emailField, this.nameField, this.passField = null
  }

  componentWillUnmount(){
    Keyboard.removeAllListeners('keyboardDidHide')
  }

  componentDidMount(){    
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>{
      this.emailField.blur()
      this.nameField.blur()
      this.passField.blur()
    })
  }

  handleSignUp = () => {
    let errorMessage;
    let emailEmpty, nameEmpty, passEmpty = false

    if (this.state.email === '') {
      errorMessage = "Email não pode estar vazio"
      emailEmpty = true
    }

    if (this.state.name === '') {
      nameEmpty = true
      if (emailEmpty)
        errorMessage += "\nNome não pode estar vazio"
      else
        errorMessage = "Nome não pode estar vazio"
    }

    if (this.state.password === '') {
      if (emailEmpty || nameEmpty)
        errorMessage += "\nSenha não pode estar vazia"
      else
        errorMessage = "Senha não pode estar vazia"
    }    

    if (!errorMessage) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.props.navigation.navigate('Stack')
          firebase.firestore().collection('users').add({
            name: this.state.name,
            email: this.state.email,
            debitos: []
          })
        })
        .catch(error => this.setState({ errorMessage: error.message }))
    } else {
      this.setState({
        errorMessage: errorMessage
      })
    }

    console.log('handleSignUp')
  }
  render() {

    let image = this.state.showImage ?
      (
        <View style={styles.image} >
          <Image source={require('../../res/logo_264_c_b.png')} />
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
        </View>
      ) : 
      <></>

    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
        angle={90}
        angleCenter={{ x: 0.3, y: 0.3 }}
      >
        <View style={styles.container}>
          <View style={styles.center}>
            <View style={styles.tabcontainer}>
              <View style={styles.logincontainer}>
                <Text
                  style={styles.register}
                  onPress={() => this.props.navigation.navigate('Login')}
                >Login</Text>
              </View>
              <View style={styles.registercontainer}>
                <Text
                  onPress={() => this.props.navigation.navigate('SignUp')}
                  style={styles.register}>Registro</Text>
                <View
                  style={{ backgroundColor: '#00C9E1', height: 3, width: 150, borderRadius: 100 }} />
              </View>
            </View>
            {image}
            <View style={styles.form}>
              <Input
                ref={(ref) => this.nameField = ref}
                onFocus={() => this.setState({ showImage: false })}
                onBlur={() => this.setState({ showImage: true })}
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                autoCapitalize="none"
                placeholder="Nome"
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                leftIcon={{ type: 'font-awesome', name: 'user' }}
              />
              <Input
                ref={(ref) => this.emailField = ref}
                onFocus={() => this.setState({ showImage: false })}
                onBlur={() => this.setState({ showImage: true })}
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                leftIcon={{ type: 'ionicon', name: 'ios-mail' }}
              />
              <Input
                ref={(ref) => this.passField = ref}
                onFocus={() => this.setState({ showImage: false })}
                onBlur={() => this.setState({ showImage: true })}
                secureTextEntry
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                autoCapitalize="none"
                placeholder="Senha"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
              />
              <Button
                title="Registrar"
                onPress={this.handleSignUp}
                buttonStyle={styles.button}
                type={"outline"}
              />
            </View>
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
    width: width * .8,
  },

  center: {
    flexDirection: 'column',
  },

  image: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  register: {
    alignSelf: "center",
    color: 'white',
    fontSize: 40,
    fontFamily: 'notoserif'
  },

  button: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: width * .65,
    marginBottom: 5,
    marginTop: 30,
    alignSelf: 'center'
  }
})