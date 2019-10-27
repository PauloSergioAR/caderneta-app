import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, Dimensions } from 'react-native'
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { Input } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class SignUp extends React.Component {
  state = { email: '', password: '', name:'', errorMessage: null }
  handleSignUp = () => {
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
    console.log('handleSignUp')
  }
  render() {
    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
        angle={90}
        angleCenter={{ x: 0.3, y: 0.3 }}
      >
        <Text style={styles.register}>Registro</Text>
        <View style={styles.container}>
          <View style={styles.center}>
            <View style={styles.image} >
              <Image  source={require('../../res/logo_264_c_b.png')} />              
              {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                  {this.state.errorMessage}
                </Text>}
            </View>
            <View style={styles.form}>
              <Input
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Nome"
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                leftIcon={{ type: 'font-awesome', name: 'user' }}
              />
              <Input
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                leftIcon={{ type: 'ionicon', name: 'ios-mail' }}
              />
              <Input
                secureTextEntry
                style={styles.textInput}
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
              <Button
                title="Já tem uma conta? Faça Login"
                onPress={() => this.props.navigation.navigate('Login')}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    //width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,    
  },
  form: {
    width: width * .8,
    marginBottom: 50,
  },
  center: {
    backgroundColor: "#f5f5f5",
    height: '60%',
    width: '81%',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000000",
    shadowOpacity: 10,
    shadowRadius: 5,
    flexDirection: 'column',
    borderRadius: 6,
    elevation: 10
  },
  image: {
    alignItems: 'center',
    marginTop: 10,
  },
  register: {
    alignSelf: "center",
    color: 'white',
    fontWeight: "bold",
    fontSize: 50
  },
  button:{
    borderRadius: 10,
    backgroundColor: 'white',
    width: width * .65,
    marginBottom: 5,
    marginTop: 10,
    alignSelf: 'center'
  }
})