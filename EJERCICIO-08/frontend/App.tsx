// App.tsx
// RESPONSABILIDAD: mostrar una Playlist relacionada y añadir canciones.
import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, Text, View } from 'react-native';

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

 return <SafeAreaView>
   <Text>🎵 {playlist.nombre}</Text>
   <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View><Text>{item.titulo}</Text><Text>{item.artista}</Text></View>}/>
   <Button title="+ Añadir canción" onPress={anadir}/>
 </SafeAreaView>;
}