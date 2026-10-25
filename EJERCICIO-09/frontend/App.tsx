import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,StyleSheet,Text,View } from 'react-native';

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
 return <SafeAreaView style={styles.container}><Text style={styles.title}>🎟️ Eventos filtrados</Text><Button title="Zaragoza · Tech" onPress={()=>filtrar('Zaragoza','Tecnologia')}/>
 <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View style={styles.card}><Text style={styles.name}>{item.nombre}</Text><Text style={styles.meta}>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#F8FAFC',padding:20},
 title:{fontSize:28,fontWeight:'800',marginBottom:12},
 card:{backgroundColor:'#FFF',padding:16,borderRadius:16,marginTop:12},
 name:{fontSize:18,fontWeight:'700'},
 meta:{color:'#64748B',marginTop:4},
});