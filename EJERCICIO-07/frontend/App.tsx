import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,StyleSheet,Text,View } from 'react-native';

type Sneaker={id:number;marca:string;modelo:string;precio:number;talla:number;stock:number};
const API_URL='http://192.168.1.50:3000';

export default function App(){
 const [items,setItems]=useState<Sneaker[]>([]);
 const [error,setError]=useState('');

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/sneakers');
     setItems(await r.json());
     setError('');
   }catch{
     setError('No se pudo conectar con la API.');
   }
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/sneakers',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         marca:'Nike',
         modelo:'Air Max 1',
         precio:149.99,
         talla:42,
         stock:4,
       }),
     });
     await cargar();
   }catch{setError('Error al crear.');}
 }

 async function rebajar(id:number){
   try{
     await request(API_URL+'/sneakers/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({precio:139.99}),
     });
     await cargar();
   }catch{setError('Error al actualizar.');}
 }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/sneakers/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('Error al eliminar.');}
 }

 return <SafeAreaView style={styles.container}>
   <Text style={styles.title}>👟 Inventario</Text>
   {error!==''&&<Text>{error}</Text>}
   <Button title="Nueva" onPress={crear}/>
   <FlatList
     data={items}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View style={styles.card}>
       <Text style={styles.model}>{item.modelo}</Text>
       <Text>{item.marca} · {item.stock===0?<Text style={styles.soldOut}>AGOTADO</Text>:'Stock '+item.stock} · {Number(item.precio).toFixed(2)} €</Text>
       <Button title="Rebajar" onPress={()=>rebajar(item.id)}/>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#F8FAFC',padding:20},
 title:{fontSize:28,fontWeight:'800',marginBottom:12},
 card:{backgroundColor:'#FFF',padding:16,borderRadius:16,marginTop:12},
 model:{fontSize:18,fontWeight:'700'},
 soldOut:{fontWeight:'800'},
});