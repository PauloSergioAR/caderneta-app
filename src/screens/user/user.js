import React, { Component } from 'react';

import { View, Text, StyleSheet, Dimensions, NativeMethodsMixin, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import UserList from '../../main/components/userList'
import Balanco from '../../main/components/balanco'
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements'
import OverlayComponent from '../../main/components/overlays/userOverlay'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var unsubscribe

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
    })

    this.state = {
      name: name,
      dados: dadosusr,
      visible: false,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,      
    }

    this.ref = firebase.firestore().collection('users')

    this.ref.where('email', "==", firebase.auth().currentUser.email).get().then(snap => {
      snap.forEach(doc => {
        this.userRef = doc
      })
    })

    this.update = this.update.bind(this)    
  }

  componentWillMount(){
    /*
    * In this function we start the listeners for both, firebase document changes and changes on the screen size
    */

    Dimensions.addEventListener('change', this.onDimensionsChange.bind(this))

    unsubscribe = firebase.firestore().collection('users').
      where('email', '==', firebase.auth().currentUser.email)
      .onSnapshot(
        {
          includeMetadataChanges: true
        },
        this.update
      )
  }

  componentWillUnmount(){
    /*
    * In this function we remove the listeners for both, firebase document changes and changes on the screen size
    * This has to be done because when the component is unmounted, it keeps listening for the registered events
    * and executing the funcions without even beeing instantiated
    */

    Dimensions.removeEventListener('change', this.onDimensionsChange)
    unsubscribe && unsubscribe()
    unsubscribe = null
  }

  onDimensionsChange(){
    /*
    * This function is executed every time the dimensions of the window changes,
    * in theory it should prevent errors in the exibition of the app when the
    * user tweaks Android's display size and comes back to the app right away
    */
    this.setState({
      ...this.state,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })

    height = Dimensions.get('window').height
    width = Dimensions.get('window').width
  }

  open() {
    /*
    * This function opens the new entry modal
    */
    this.setState({
      ...this.state,
      visible: true
    })
  }

  excluir(i) {
    /*
    * This function retrieves the whole array of data, filters it by "contas" (which contains the data specific to each "conta")
    * copies that array without the element that's suposed to be deleted and uptades the firebase document
    */
    let debitosArray = this.userRef.data().debitos
    let user
    let userIndex        

    let newContasArray = []

    debitosArray.forEach((item, index) => {      
      if (item.nome === this.state.name) {
        user = item
        userIndex = index
        newContasArray = item.contas.slice(0, i).concat(item.contas.slice(i + 1, item.contas.length))
      }
    })
        
    user.contas = newContasArray
    debitosArray[userIndex] = user
    
    this.userRef.ref.update({
      debitos: debitosArray
    }).then(() => this.update())
      .catch(e => console.log(e.message))    
  }

  quitar(i) {

    /*
    * This function retrieves the whole array of data, filters for the current user, gets the current users's "contas" array,
    * filters the "contas" array for the item that was selected. It then changes a property on that object that informs if that
    * entry was paid. It then updates the the firebase object.
    */

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
    /*
    * This function is executed everytime something changes in the data, it then updated all the information the current
    * screen displays
    */

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
    /*
    * This function is called when the "new entry" modal is closed.
    * It recieves as an argument all the data that was filled into the modal's form
    * and creates a new entry on the "contas" array of the firebase object
    */
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
              <Icon style={styles.icon} name="user" size={height * 0.06} />
              <Text style={styles.username}>{this.state.name}</Text>
            </View>
            <View style={styles.container}>
              <Balanco valor={val} showBal={false} />
            </View>
          </View>
          <View style={styles.listContainer}>            
            {list}
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
              onPress={() => this.open()}
              buttonStyle={{ height: 70, width: 70, alignSelf: 'flex-end' }}
            />
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
    marginTop: height * 0.045,
    flex: .20,    
    marginTop: height * 0.03,
    marginBottom: height * 0.02  
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  listContainer: {
    flex: .80,
    justifyContent: 'space-around',
    flexDirection: 'column',
    width: width * .95,    
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    elevation: 10,
  },
  user: {
    paddingTop: 15,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  username: {
    alignSelf: 'center',
    fontSize: RFPercentage(5),
    color: 'white'
  },
  icon: {
    alignSelf: 'flex-start',
    color: 'white'
  }
})
