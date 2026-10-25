import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,StyleSheet,Text,TextInput,View } from 'react-native';

type Destino={id:number;ciudad:string;pais:string;descripcion:string;visitado:boolean};
const API_URL='http://192.168.1.50:3000';

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');
 const [error,setError]=useState('');

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/destinos');
     setDestinos(await r.json());
     setError('');
   }catch{setError('No se pudieron cargar los destinos.');}
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/destinos',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         ciudad,
         pais,
         descripcion:'Nuevo destino',
       }),
     });
     setCiudad('');
     setPais('');
     await cargar();
   }catch{setError('No se pudo crear.');}
 }

 async function editar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({descripcion:'Destino actualizado'}),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

 async function alternarVisitado(destino:Destino){
   try{
     await request(API_URL+'/destinos/'+destino.id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({visitado:!destino.visitado}),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('No se pudo eliminar.');}
 }

 return <SafeAreaView style={styles.container}>
   <Text style={styles.title}>🌍 Wander</Text>
   {error!==''&&<Text>{error}</Text>}
   <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
   <TextInput style={styles.input} placeholder="País" value={pais} onChangeText={setPais}/>
   <Button title="Crear destino" onPress={crear}/>
   <FlatList
     data={destinos}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View style={styles.card}>
       <Text style={styles.name}>{item.ciudad}</Text>
       <Text style={styles.meta}>{item.pais} · {item.descripcion}</Text>
       <Text style={styles.status}>{item.visitado?'✓ Visitado':'Pendiente'}</Text>
       <Button title={item.visitado?'Desmarcar visitado':'Marcar como visitado'} onPress={()=>alternarVisitado(item)}/>
       <Button title="Editar" onPress={()=>editar(item.id)}/>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#F8FAFC',padding:20},
 title:{fontSize:28,fontWeight:'800',marginBottom:12},
 input:{backgroundColor:'#FFF',padding:12,borderRadius:12,marginBottom:8},
 card:{backgroundColor:'#FFF',padding:16,borderRadius:16,marginTop:12},
 name:{fontSize:18,fontWeight:'700'},
 meta:{color:'#64748B',marginTop:4},
 status:{fontWeight:'700',marginVertical:8},
});