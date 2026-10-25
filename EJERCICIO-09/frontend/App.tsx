import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,View } from 'react-native';
type Evento={id:number;nombre:string;ciudad:string;categoria:string;fecha:string};
const API_URL='http://192.168.1.50:3000';

export default function App(){

 const [eventos,setEventos]=useState<Evento[]>([]);

 async function filtrar(ciudad?:string,categoria?:string){

   const partes:string[]=[];
   if(ciudad) partes.push('ciudad='+encodeURIComponent(ciudad));
   if(categoria) partes.push('categoria='+encodeURIComponent(categoria));
   const url=API_URL+'/eventos'+(partes.length>0?'?'+partes.join('&'):'');
   const r=await fetch(url);setEventos(await r.json());
 }
 useEffect(()=>{filtrar();},[]);
 
 return <SafeAreaView><Text>🎟️ Event Radar</Text><Button title="Zaragoza · Tech" onPress={()=>filtrar('Zaragoza','Tecnologia')}/>
 <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.nombre}</Text><Text>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>;
}