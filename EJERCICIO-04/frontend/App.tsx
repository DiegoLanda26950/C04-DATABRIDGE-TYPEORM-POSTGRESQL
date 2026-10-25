// App.tsx — formulario POST
import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';

const API_URL = 'http://192.168.1.50:3000';

export default function App() {
  const [nombre,setNombre]=useState('');
  const [tipo,setTipo]=useState('');
  const [ciudad,setCiudad]=useState('');
  const [precioMedio,setPrecioMedio]=useState('');
  const [mensaje,setMensaje]=useState('');

  async function guardar() {
    const respuesta=await fetch(API_URL+'/restaurantes',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        nombre,
        tipo,
        ciudad,
        puntuacion:9,
        precioMedio:Number(precioMedio.replace(',','.')) || 0,
      }),
    });

    setMensaje(respuesta.ok?'Restaurante guardado ✓':'Error al guardar');
  }

  return <SafeAreaView style={styles.container}>
    <Text style={styles.title}>🍜 Food Spots</Text>
    <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre}/>
    <TextInput style={styles.input} placeholder="Tipo" value={tipo} onChangeText={setTipo}/>
    <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
    <TextInput
      style={styles.input}
      placeholder="Precio medio (€)"
      keyboardType="numeric"
      value={precioMedio}
      onChangeText={setPrecioMedio}
    />
    <Button title="Guardar restaurante" onPress={guardar}/>
    <Text>{mensaje}</Text>
  </SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,padding:24,backgroundColor:'#FFF7ED'},
 title:{fontSize:30,fontWeight:'800',marginBottom:20},
 input:{backgroundColor:'#FFF',padding:14,borderRadius:12,marginBottom:12}
});