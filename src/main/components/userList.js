import React, { Component } from 'react';

import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { ListItem, Button, SearchBar } from 'react-native-elements';


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const UserList = (props) => {

  function renderItens ({ item }, i)  {
    title = "R$ " + item.valor.toFixed(2)        
    console.log(item.tipo)
    return (
      <ListItem        
        ref={React.createRef()}
        style={{ alignSelf: "stretch" }}
        leftIcon={item.tipo == 'receber' ? {type:'evilicon', name:'arrow-up'} : {type:'evilicon', name:'arrow-down'}}
        title={item.descricao}
        subtitle={item.date}
        rightTitle={title}
        rightTitleStyle={item.tipo == 'receber' ? styles.listPositive : styles.listNegative}
        bottomDivider={true}
        topDivider={true}        
      />
    )
  }

  return (
    <View>
      <FlatList
        data={props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItens}
        style={{ flexGrow: 0, height: height * .70 }}
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
  }
})