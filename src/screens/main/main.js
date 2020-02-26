import React from 'react'
import { StyleSheet, View, ActivityIndicator, Dimensions, StatusBar } from 'react-native'
import { ListItem, Button } from 'react-native-elements';

import LinearGradient from 'react-native-linear-gradient';

import OverlayComponent from '../../main/components/overlays/overlay'
import List from '../../main/components/list'
import Balanco from '../../main/components/balanco'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const { getTransactions } = require('../../data_utils/connection')

export default class Main extends React.Component {
  static navigationOptions  = ({ navigation }) => {
    return (
      {        
        headerRight: () => (
          <Button
            type="clear"
            onPress={() => navigation.getParam('gotoSearch')()}
            icon={{type: "ionicon", name: "md-search", color: 'white', size: height * 0.03}}
          />
        ),
    
        headerTransparent: true
      }
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }    

    this.itemCallback = this.itemCallback.bind(this)    

    Dimensions.addEventListener('change', this.onDimensionsChange.bind(this))
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

  componentDidMount() {
    getTransactions('paulo.sergio.ar@gmail.com')
    this.props.navigation.setParams({
      gotoSearch: this.gotoSearch.bind(this)
    })
  }

  gotoSearch(){
    //The seccond param is an object that retrieves the data
    this.props.navigation.navigate('SearchScreen')
  }

  renderItem = ({ item }, i) => {
    let value = 0;
    item.contas.forEach((c) => {
      value = value + c.valor
    })

    title = "R$ " + value.toFixed(2)

    return (
      <ListItem
        ref={React.createRef()}
        style={{ alignSelf: "stretch" }}
        leftIcon={{ type: 'evilicon', name: 'user' }}
        title={item.nome}
        rightTitle={title}
        rightTitleStyle={value > 0 ? styles.listPositive : styles.listNegative}
        bottomDivider={true}
        topDivider={true}
      />
    )
  }

  close() {
    this.setState({
      visible: false,
    })
  }

  open() {
    this.setState({
      visible: true
    })
  }

  getByName(arr, text) {
    let itemRet
    arr.forEach((item) => {
      if (item.nome === text) {
        itemRet = item
      }
    })

    return itemRet ? itemRet : false
  }

  itemCallback(name) {
    this.props.navigation.navigate('UserScreen', {
      name: name,
      docRef: this.userRef,    
    })
  }

  modalCallback(data) {
    this.setState({
      visible: false
    })
  }

  excluir(i) {
   
  }

  render() {

    let load = this.state.updating ? 
    <ActivityIndicator style={{ alignSelf: "center" }} color="#f5f5f5" size="large"/> :
    <></>

    let view
    if (this.state.dados && !this.state.dados.debitos) {
      console.log("sem lista")
      view =
        <>
          <View style={styles.top}>
            <OverlayComponent
              callback={this.modalCallback.bind(this)}
              visible={this.state.visible}
            />
            <View style={styles.container}>
              <Balanco valor={0} showBal={false} />
            </View>
            {load}
          </View>
          <View style={styles.listContainer}>
            <Button
              type="clear"
              icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
              onPress={() => this.open()}
              buttonStyle={{ height: 70, width: 70, alignSelf: 'flex-end' }}
            />
          </View>
        </>
    } else if (this.state.dados && this.state.dados.debitos) {      
      let value = 0;
      this.state.dados.debitos.forEach((item) => {
        item.contas.forEach((conta) => {
          if (!conta.quitado)
            value = conta.tipo == 'receber' ? value + conta.valor : value - conta.valor
        })
      })

      view =
        <>
          <View style={styles.master}>
            <View style={styles.top}>
              <OverlayComponent
                callback={this.modalCallback.bind(this)}
                visible={this.state.visible}
              />
              <View style={styles.container}>
                <Balanco valor={value} showBal={false} />
              </View>              
            </View>
            <View style={styles.listContainer}>              
              <List  data={this.state.dados.debitos} itemCallback={this.itemCallback} excluir={this.excluir.bind(this)} />
              <Button                
                type="clear"
                icon={{ type: 'material-community', name: 'plus-circle-outline', size: 40 }}
                onPress={() => this.open()}
                buttonStyle={{ height: 70, width: 70, marginBottom: 50, flex:.05, alignSelf: 'flex-end' }}
              />
            </View>
          </View>
        </>
    } else {
      console.log('carregando')
      view =
        <View style={styles.loading}>
          <ActivityIndicator style={{ alignSelf: "center" }} color="#f5f5f5" size="large" />
        </View>
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
        <StatusBar barStyle="light-content" backgroundColor="#0CA2F7" />        
        {view}        
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  loading:{
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  master: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
  },

  top: {
    flexDirection: 'column',
    flex: .20,    
    marginTop: height * 0.03,
    marginBottom: height * 0.02    
  },
  
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20
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

  list: {    
    flex: .50
  },  
})