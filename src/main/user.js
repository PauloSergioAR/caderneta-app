import React, { Component } from 'react';

import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import List from './components/userList'
import UserList from './components/userList';
import Balanco from './components/balanco'
import { bold } from 'ansi-colors';
import LinearGradient from 'react-native-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class User extends Component {
  constructor(props) {
    super(props)
    let name = props.navigation.getParam('name', '')
    this.docRef = this.props.navigation.getParam('docRef', '')
    let data
    this.docRef.data().debitos.forEach((item) => {
      if (item.nome === name)
        data = item
      return
    })
    console.log(data)
    this.state = {
      name: name,
      data: data,
    }
  }

  render() {
    let val = 0;
    this.state.data.contas.forEach(item => {
      val = item.tipo == 'receber' ? val + item.valor : val - item.valor
    })

    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
        angle={90}
        angleCenter={{ x: 0.3, y: 0.3 }}
      >
        <View style={styles.master}>
          <View style={styles.top}>
            <View style={styles.user}>
              <Icon style={styles.icon} name="user" size={60} />
              <Text style={styles.username}>{this.state.name}</Text>
            </View>
            <View style={styles.container}>
              <Balanco valor={val} showBal={false} />
            </View>
          </View>
          <View style={styles.listContainer}>
            <UserList data={this.state.data.contas} />
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    width: width * .95
  },
  top: {
    height: height * .15
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,    
  },

  listContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column-reverse',
    height: height * .60,
    marginTop: 55,
    backgroundColor: '#f5f5f5',
    width: width * .96,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    elevation: 10
  },
  user: {
    paddingTop: 15,
    alignSelf: 'center',
    flexDirection: 'row',
    //width: width *.5
  },
  username: {
    alignSelf: 'center',
    fontSize: 40,
    color: 'white'
  },
  icon: {
    alignSelf: 'flex-start',
    color: 'white'
  }
})
