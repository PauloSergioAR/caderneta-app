import React, { Component } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';

import { ListItem, Button, SearchBar } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const List = (props) => {

  function renderItens (item , index)  {
    let value = 0;
    item.contas.forEach((c) => {
      if(!c.quitado)
        value = c.tipo == 'receber' ? value + c.valor : value - c.valor
    })

    title = "R$ " + value.toFixed(2)

    let swipeleft = [
      {
        text: "Excluir",
        backgroundColor: 'red',
        onPress: () => {          
          props.excluir(index)
        } 
      }
    ]

    return (
      <Swipeout left={swipeleft} backgroundColor="#f5f5f5">
        <ListItem          
          ref={React.createRef()}
          style={{ alignSelf: "stretch", marginBottom: 2, marginLeft: 10, marginRight: 10, borderRadius: 100, elevation: 10 }}
          leftIcon={{ type: 'evilicon', name: 'user' }}
          title={item.nome}
          rightTitle={title}
          rightTitleStyle={value > 0 ? styles.listPositive : styles.listNegative}        
          onPress={() => props.itemCallback(item.nome)}
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
        style={{ flexGrow: 0, height: height * .68 }}
      />
    </View>
  )
};

export default List;


const styles = StyleSheet.create({
  listPositive: {
    color: 'green'
  },
  listNegative: {
    color: 'red'
  }
})