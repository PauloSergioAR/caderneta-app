import React, { Component } from 'react';

import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { ListItem, Button, SearchBar } from 'react-native-elements';

import Swipeout from 'react-native-swipeout'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const UserList = (props) => {

  function renderItens (item, index)  {
    let swiperight = [      
      {
        text: 'Quitar',
        backgroundColor: 'green',
        onPress: () => {          
          props.quitar(index)
        }
      }
    ]
  
    let swipeleft = [
      {
        text: "Excluir",
        backgroundColor: 'red',
        onPress: () => {
          console.log(index)
          props.excluir(index)
        } 
      }
    ]

    title = "R$ " + item.valor.toFixed(2)        
    console.log(item.tipo)
    return (
      <Swipeout left={swipeleft} right={swiperight} backgroundColor="#f5f5f5" autoClose={true}>
        <ListItem        
          ref={React.createRef()}
          style={styles.list}
          leftIcon={item.tipo == 'receber' ? {type:'evilicon', name:'arrow-up'} : {type:'evilicon', name:'arrow-down'}}
          title={item.descricao}
          titleStyle={item.quitado ? {textDecorationLine: 'line-through'} : {textDecorationStyle: 'solid'}}
          subtitle={item.date}
          rightTitle={title}
          rightTitleStyle=
          {[
            item.tipo == 'receber' ? styles.listPositive : styles.listNegative,
            item.quitado ? {textDecorationLine: 'line-through'} : {textDecorationStyle: 'solid'}
          ]}
          bottomDivider={true}
          topDivider={true}        
        />
      </Swipeout>
    )
  }

  return (
    <View>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index, separators}) => renderItens(item, index)}
        style={{ flexGrow: 0, height: height * .62 }}
      />
    </View>
  )
};

export default UserList;

const styles = StyleSheet.create({
  listPositive: {
    color: 'green'
  },
  listNegative: {
    color: 'red'
  },

  list: { 
    alignSelf: "stretch", 
    marginBottom: 2, 
    marginLeft: 10, 
    marginRight: 10, 
    borderRadius: 100, 
    elevation: 10, 
    marginTop: height * 0.01
  }
})