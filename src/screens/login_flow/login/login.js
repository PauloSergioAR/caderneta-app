import React from 'react'
import { StyleSheet, View, Dimensions, ActivityIndicator, StatusBar, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements'

import { login } from '../../../data_utils/facebook_utils'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import Strings from '../../../res/strings'

export default class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }

    Dimensions.addEventListener('change')
  }

  onDimensionsChange() {
    this.setState({
      ...this.state,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    width = Dimensions.get('window').width,
    height = Dimensions.get('window').height
  }

  handleLogin(result) {
    if (result.error) {
      console.log(error)
    } else if (result.canceled) {
      console.log("Login was canceled")
    } else {
      //navigate to a screen asking for the @ tag of the user
      this.props.navigation.navigate('Loading')
    }
  }

  render() {

    let btn = this.state.loading ?
      <ActivityIndicator style={{ marginBottom: 5, marginTop: 10, alignSelf: 'center' }} size="large" color="#f5f5f5" /> :
      <View>
        <View style={styles.label}>
          <Text style={styles.text}>{Strings.facebook_login_label}</Text>
        </View>
        <View>
          <Button
            onPress={() => login(this.handleLogin.bind(this))}
            title="Continuar com o Facebook"
            color="#4267B2"
          />
        </View>
      </View>

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
            {btn}
          </View>
        </View>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    flexDirection: 'column',
    borderRadius: 6,
  },

  text: {
    color: 'white',
    alignSelf: 'center',
    fontSize: width * .055
  },

  facebook_button: {
    width: width * .7,
    height: height * .04
  }
})