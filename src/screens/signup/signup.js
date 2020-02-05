import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { Input } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class SignUp extends React.Component {  

  constructor(props){
    super(props)

    this.state = {
      email: '',
      password: '',
      name: '',
      nameError: '',
      emailErr: '',
      passErr: '',
      loading: false,
      errorMessage: null,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }

    Dimensions.addEventListener('change', this.onDimensionsChange.bind(this))
  }  

  onDimensionsChange(){
    this.setState({
      ...this.state,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    width = Dimensions.get('window').width
    height = Dimensions.get('window').height
  }

  handleSignUp = () => {
    this.setState({ loading: true })
    let errorMessage;
    let emailEmpty, nameEmpty, passEmpty = false

    if (this.state.email === '') {
      this.setState({ emailErr: "Email não pode estar vazio" })
      emailEmpty = true
    }

    if (this.state.name === '') {
      this.setState({ nameError: "Nome não pode estar vazio" })
      nameEmpty = true
    }

    if (this.state.password === '') {
      this.setState({ passErr: "Senha não pode estar vazia" })
      passEmpty = true
    }

    if (!emailEmpty && !nameEmpty && !passEmpty) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.setState({ loading: false })
          this.props.navigation.navigate('Stack')
          firebase.firestore().collection('users').add({
            name: this.state.name,
            email: this.state.email,
            debitos: []
          })
        })
        .catch(error => {
          this.setState({ errorMessage: error.message, loading: false })
        })
    } else {
      this.setState({
        loading: false
      })
    }

    console.log('handleSignUp')
  }
  render() {
    let btn = this.state.loading ?
      <ActivityIndicator style={{ marginBottom: 5, marginTop: 10, alignSelf: 'center' }} size="large" color="#f5f5f5" /> :
      <Button
        title="Registrar"
        onPress={this.handleSignUp}
        buttonStyle={styles.button}
        type={"outline"}
      />
    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0CA2F7" />
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
                  style={{ backgroundColor: '#00C9E1', height: 3, width: 120, borderRadius: 100 }} />
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
            <View style={styles.form}>
              <Input
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                autoCapitalize="none"
                placeholder="Nome"
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                leftIcon={{ type: 'font-awesome', name: 'user' }}
                errorMessage={this.state.nameError}
              />
              <Input
                containerStyle={styles.textInput}
                leftIconContainerStyle={{ marginBottom: 10, marginTop: 8 }}
                autoCapitalize="none"
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
                autoCapitalize="none"
                placeholder="Senha"
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                errorMessage={this.state.passErr}
              />
              {btn}
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
    marginTop: 64,
    width: width * .8,
    alignSelf: 'center'
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
    fontSize: 30,
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