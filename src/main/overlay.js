import React, { useState, useCallback } from 'react';

import { View, Switch, Dimensions, Picker } from 'react-native';

import { ListItem, Overlay, Button, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

// import { Container } from './styles';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var data={ }

const OverlayComponent = (props) => {  
  const [descricao, setDescricao] = useState('')
  const [date, setDate] = useState(new Date().getDate())
  const [combo, setCombo] = useState('0')
  const [categoria, setCategoria] = useState('')
  const [valor, setValor] = useState('')

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

  const handleSubmit = () => {
    let data = {
      descricao: descricao,
      date: date,
      tipo: combo,
      categoria: categoria,
      valor: parseFloat(valor)
    }
    props.callback(data)
    data = null
    setCategoria('')
    setCombo('0')
    setDate(new Date().getDate())
    setDescricao('')
    setValor('')
  }

  return(
    <View>
      <Overlay
          isVisible={props.visible}
          width={width * .8}
          height={height * .8}
        >
          <Input
            placeholder="Descrição"
            onChangeText={(text) => onDescChange(text)}            
          />
          <DatePicker
            style={{width: width * .73}}
            date={data.date}
            mode="date"
            placeholder={data.date}
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
          >
            <Picker.Item label="..." value='0'/>
            <Picker.Item label="A Pagar" value="pagar"/>
            <Picker.Item label="A Receber" value="receber"/>
          </Picker>
          <Input
            placeholder="Categoria"
            onChangeText={(text) => onCatChange(text)}            
          />          
          <Input
            placeholder="Valor"
            onChangeText={(text) => onValChange(text)}
            name="val"
          />          
          <Button onPress={handleSubmit.bind(this)} title="Close"></Button>
        </Overlay>
    </View>

  )
}

export default OverlayComponent;
