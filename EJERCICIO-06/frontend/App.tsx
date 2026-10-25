import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, SafeAreaView, Text, View } from 'react-native';
type Libro={id:number;titulo:string;autor:string;genero:string;leido:boolean};
const API_URL='http://192.168.1.50:3000';

export default function App(){
 const [libros,setLibros]=useState<Libro[]>([]);

 async function cargar(){
   const r=await fetch(API_URL+'/libros');
   setLibros(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 async function marcarLeido(id:number){
   await fetch(API_URL+'/libros/'+id+'/leido',{method:'PATCH'});
   // Volvemos a pedir la lista para reflejar el cambio de PostgreSQL.
   await cargar();
 }

 function confirmar(libro:Libro){
   Alert.alert('Eliminar libro',libro.titulo,[
     {text:'Cancelar',style:'cancel'},
     {text:'Eliminar',style:'destructive',onPress:()=>eliminar(libro.id)},
   ]);
 }
 async function eliminar(id:number){
   await fetch(API_URL+'/libros/'+id,{method:'DELETE'});
   // Sincronizamos el estado local después de borrar en PostgreSQL.
   setLibros(actuales=>actuales.filter(l=>l.id!==id));
 }

 return <SafeAreaView>
   <Text>📚 My Library</Text>
   <FlatList data={libros} keyExtractor={x=>String(x.id)} renderItem={({item})=>
     <View><Text>{item.titulo}</Text>
     <Text>{item.autor} · {item.leido?'Leído ✓':'Sin leer'}</Text>
     {!item.leido && <Button title="Marcar como leído" onPress={()=>marcarLeido(item.id)}/>}
     <Button title="Eliminar" onPress={()=>confirmar(item)}/></View>}/>
 </SafeAreaView>;
}