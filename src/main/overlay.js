import React, { useState, useCallback } from 'react';

import { View, Switch, Dimensions, Picker, StyleSheet, Text } from 'react-native';

import { ListItem, Overlay, Button, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

// import { Container } from './styles';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var data={ }

const OverlayComponent = (props) => {  
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [date, setDate] = useState(new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear())
  const [combo, setCombo] = useState('0')
  const [categoria, setCategoria] = useState('')
  const [valor, setValor] = useState('')

  onNomeChange = useCallback(e => {
    setNome(e)
  })

  const onDescChange = useCallback(e => {
    setDescricao(e)
  })

  const onDateChange = useCallback(e => {
    setDate(e)
  })

  const onComboChange = useCallback(e => {
    if(e != '0'){
      setCombo(e)      
    }
  })

  const onCatChange = useCallback(e => {
    setCategoria(e)
  })

  const onValChange = useCallback(e => {
    setValor(e)
  })

  const handleCancel = () => {
    props.callback(null)

  }

  const handleSubmit = () => {
    let data = {
      nome:nome,
      date: date,
      tipo: combo,
      categoria: categoria,
      valor: parseFloat(valor)
    }
    props.callback(data)
    data = null
    setNome('')
    setCategoria('')
    setCombo('0')
    setDate(new Date().getDate())
    setValor('')
  }

  return(
    <View >
      <Overlay
          isVisible={props.visible}          
          animationType={"slide"}
          onBackdropPress={handleCancel}
          fullScreen={true}
        >
          <Text style={{alignSelf: "center", fontFamily: 'notoserif', color: '#00C9E1'}}>Nova Ficha</Text>
          <Input
            placeholder="nome"
            onChangeText={(text) => onNomeChange(text)}
            style={{padding: 10}}
            leftIcon={{type: 'evilicon', name: 'user'}}
            maxLength={30}
          />
          <Input
            placeholder="Descrição"
            onChangeText={(text) => onDescChange(text)}
            style={{padding: 10}}
            leftIcon={{type: 'simple-line-icon', name: 'note'}}
          />
         
          <DatePicker
            style={{width: width * .73, padding: 10}}            
            date={date}
            mode="date"
            placeholder={date}
            format="DD-MM-YYYY"            
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }          
            }}
            onDateChange={(d) => onDateChange(d)}
          />
          <Picker
            selectedValue={combo}
            onValueChange={onComboChange}
            style={{padding: 10, alignContent: 'center', width: '45%', alignSelf: "center"}}
          >
            <Picker.Item label="Tipo" value='0'/>
            <Picker.Item label="A Pagar" value="pagar"/>
            <Picker.Item label="A Receber" value="receber"/>
          </Picker>
          <Input
            placeholder="Categoria"
            onChangeText={(text) => onCatChange(text)}            
            style={{padding: 10}}
            leftIcon={{type: 'entypo', name: 'list'}}
            maxLength={20}
          />          
          <Input
            placeholder="Valor"
            onChangeText={(text) => onValChange(text)}
            name="val"
            style={{padding: 10}}
            keyboardType="decimal-pad"
            leftIcon={{type: 'material-community', name: 'cash-multiple'}}
            maxLength={8}
          />
          <View style={styles.buttons}>
            <Button
              onPress={handleCancel}            
              icon={{type: 'font-awesome', name: 'close'}}
              type="clear"
            />
            <Button               
              onPress={handleSubmit.bind(this)}
              icon={{type: 'font-awesome', name:'check'}}
              type="clear"
            />            
          </View>
        </Overlay>
    </View>

  )
}

const styles = StyleSheet.create({
  buttons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between"   ,
    marginTop: 30,
    marginLeft: 40,
    marginRight: 40
  }
})

export default OverlayComponent;
