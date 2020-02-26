import React, { Component } from 'react';

import { View, Text, StatusBar, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements'

import LinearGradient from 'react-native-linear-gradient';
import Strings from '../../../res/strings'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import { getUserByTag, createUser } from '../../../data_utils/handle_user'

export default class Tag extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      inputText: '',
      checkingUser: false,
      createdUser: false,
      errorMessage: ''
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

  handleTextChange(text) {  
    let condition = /[&\/\\#,+()$~%'":*?<>{}]/g
    if (!condition.test(text)) {

      if (text.length > 20) {
        return
      }
      this.setState({
        ...this.state,
        inputText: text,
        errorMessage: ''
      })
    }
  }

  handlePress(result) {
    if (result.message == "User not found") {
      //id available
      let facebook_info = this.props.navigation.getParam("facebook_info", '')
      let user_obj = {
        "facebook_id": facebook_info.id,
        "tag": this.state.inputText,
        "name": facebook_info.name,
        "avatar_url": "https://static.zerochan.net/Sengoku.Nadeko.full.188022.jpg"
      }

      createUser(user_obj, this.createUserCallback.bind(this))
    } else if (result._id) {
      //id not available
      this.setState({
        ...this.state,
        checkingUser: false,
        errorMessage: Strings.tag_taken
      })
    } else {
      console.log(result)
    }    
  }

  createUserCallback(createdUser){
    this.setState({
      ...this.state,
      checkingUser: false
    })
    if(createdUser._id){
      console.log("Created Successfully")
      this.setState({
        ...this.state,
        createdUser: true
      })      
    }
  }

  render() {
    let btn
    if(this.state.createdUser){
      console.log("change")
      btn = 
      <View style={styles.successView}>
        <Text style={styles.successText}>{Strings.user_created}</Text>
        <Button
          title={Strings.continue}
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate("Stack")}
        />
      </View>
    } else{
      btn = this.state.checkingUser ?
      <ActivityIndicator color="white"/> :
      <Button
        buttonStyle={styles.button}
        title="Submit"
        backgroundColor="white"
        onPress={() => {
          getUserByTag(this.state.inputText, this.handlePress.bind(this))
          this.setState({
            ...this.state,
            checkingUser: true
          })
        }}
      />
    }
    
    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0CA2F7" />
        <View style={styles.mainContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{Strings.tag_label}</Text>
            <Text style={styles.description}>{Strings.tag_description}</Text>
            <View style={styles.input}>
              <Input
                placeholder="@tag"
                placeholderTextColor="#a0aec0"
                spellCheck={false}
                containerStyle={styles.inputContainer}
                autoCompleteType="off"
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ color: 'white' }}
                autoCapitalize="none"
                onChangeText={(text) => {
                  let newText = text.replace(/@/g, '')
                  this.handleTextChange('@' + newText)
                }}
                value={this.state.inputText}
                keyboardType="email-address"
                errorMessage={this.state.errorMessage}
              />
              <View style={styles.buttonContainer}>
                {btn}
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: height * .002,
    backgroundColor: "#1355ea"
  },

  buttonContainer: {
    marginTop: height * 0.035,
  },

  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * .05
  },

  description: {
    color: 'white',
  },

  textContainer: {
    alignSelf: "center",
    alignItems: "center",
  },

  input: {
    width: width * 0.7,
    paddingBottom: height * .007
  },

  mainContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center"
  },

  inputContainer: {
    paddingTop: height * 0.007,
    height: height * 0.03
  },

  successText:{
    alignSelf: 'center',
    color: 'white',    
  },
})