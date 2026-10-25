// App.tsx
// RESPONSABILIDAD: mostrar una Playlist relacionada y añadir canciones.
import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Cancion={id:number;titulo:string;artista:string};
type Playlist={id:number;nombre:string;canciones:Cancion[]};
const API_URL='http://192.168.1.50:3000';

export default function App(){
 const [playlist,setPlaylist]=useState<Playlist|null>(null);

 async function cargar(){
   const r=await fetch(API_URL+'/playlists/1');
   setPlaylist(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 async function anadir(){
   await fetch(API_URL+'/playlists/canciones',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({titulo:'Midnight City',artista:'M83',playlistId:1}),
   });
   // Recargamos la playlist para ver la canción nueva.
   await cargar();
 }

 if(!playlist)return <Text>Cargando...</Text>;

 return <SafeAreaView style={styles.container}>
   <Text style={styles.title}>🎵 {playlist.nombre}</Text>
   <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View style={styles.card}><Text style={styles.song}>{item.titulo}</Text><Text style={styles.artist}>{item.artista}</Text></View>}/>
   <Button title="+ Añadir canción" onPress={anadir}/>
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#F8FAFC',padding:20},
 title:{fontSize:28,fontWeight:'800',marginBottom:12},
 card:{backgroundColor:'#FFF',padding:16,borderRadius:16,marginBottom:12},
 song:{fontSize:18,fontWeight:'700'},
 artist:{color:'#64748B',marginTop:4},
});