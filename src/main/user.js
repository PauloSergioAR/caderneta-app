import React, { Component } from 'react';

import { View, Text, StyleSheet, Dimensions, NativeMethodsMixin, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import List from './components/userList'
import UserList from './components/userList';
import Balanco from './components/balanco'
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements'
import OverlayComponent from './userOverlay'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class User extends Component {

  static navigationOptions = {
    headerTransparent: true
  }

  constructor(props) {
    super(props)
    let name = props.navigation.getParam('name', '')
    this.docRef = this.props.navigation.getParam('docRef', '')
    let dadosusr
    this.docRef.data().debitos.forEach((item) => {
      if (item.nome === name)
        dadosusr = item
      return
    })
    this.state = {
      name: name,
      dados: dadosusr,
      visible: false
    }

    this.ref = firebase.firestore().collection('users')

    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc
      })
    })

    this.update = this.update.bind(this)

    firebase.firestore().collection('users').
      where('email', '==', firebase.auth().currentUser.email)
      .onSnapshot(
        {
          includeMetadataChanges: true
        },
        this.update
      )
  }

  open() {
    this.setState({
      visible: true
    })
  }

  excluir(i) {
    let array = this.userRef.data().debitos
    let user
    let userIndex        

    let newContasArray = []

    array.forEach((item, index) => {
      user = item
      userIndex = index
      if (item.nome === this.state.name) {
        item.contas.forEach((item, ind) => {
          if (ind != i) {
            newContasArray.push(item)
          }
        })
      }
    })

    user.contas = newContasArray
    array[userIndex] = user

    this.userRef.ref.update({
      debitos: array
    }).then(() => this.update())
      .catch(e => console.log(e.message))    
  }

  quitar(i) {
    let array = this.userRef.data().debitos
    let user
    let userIndex
    let conta
    let contaIndex

    array.forEach((item, index) => {
      if (item.nome === this.state.name) {
        user = item        
        userIndex = index
        item.contas.forEach((item, ind) => {
          if (ind === i) {
            item = {
              ...item,
              quitado: true
            }
            conta = item
            contaIndex = ind            
          }
        })
      }
    })

    user.contas[contaIndex] = conta    
    array[userIndex] = user    

    this.userRef.ref.update({
      debitos: array
    }).then(() => this.update())
      .catch(e => console.log(e.message))

  }

  update = () => {    
    let data
    firebase.firestore().collection('users')
      .where("email", "==", firebase.auth().currentUser.email).get().then((snap) => {
        snap.forEach((doc) => {
          data = doc.data()
          data.debitos.forEach((item) => {
            if(item.nome === this.state.name){
              this.setState({
                dados: item
              })
            }
          })          
          this.userRef =  doc                 
        })
      }).catch(e => console.log(e))
  }

  modalCallback(data) {
    this.setState({
      visible: false
    })
    if (data) {
      let usr
      let usrIndex
      this.userRef.data().debitos.forEach((item, index) => {
        if (item.nome === this.state.name) {
          usr = item
          usrIndex = index
          return
        }
      })
      let contasArr = usr.contas
      contasArr.push(data)
      let newdeb = this.userRef.data().debitos
      newdeb[usrIndex] = usr
      this.userRef.ref.update({ debitos: newdeb })
        .then(() => this.update())
        .catch(e => console.log(e.message))
    }
  }

  render() {
    let list = <></>
    let val = 0;        
    if (this.state.dados && this.state.dados.contas) {        
      this.state.dados.contas.forEach(item => {
        if(!item.quitado)
          val = item.tipo == 'receber' ? val + item.valor : val - item.valor
      })
       list =
        (
          <UserList
            data={this.state.dados.contas}
            quitar={this.quitar.bind(this)}
            excluir={this.excluir.bind(this)} />
        )
    } else {      
    }

    return (
      <LinearGradient
        colors={['#9831F7', '#00C9E1']}
        style={{ flex: 1 }}
        start={{ x: 0.7, y: 0.7 }}
        useAngle={true}
        angle={90}
        angleCenter={{ x: 0.3, y: 0.3 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0CA2F7"/>
        <OverlayComponent
          callback={this.modalCallback.bind(this)}
          visible={this.state.visible}
        />
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
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
              onPress={() => this.open()}
              buttonStyle={{ height: 70, width: 70, alignSelf: 'flex-end' }}
            />
            {list}
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
    height: height * .15,
    marginTop: 45
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
