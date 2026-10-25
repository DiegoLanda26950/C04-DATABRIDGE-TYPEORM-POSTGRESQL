// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha.
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string;
};

const API_URL = 'http://192.168.1.50:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // En este ejemplo pedimos la mascota con id 1.
    fetch(API_URL + '/mascotas/1')
      .then((r) => {
        // Si NestJS responde 404 (o cualquier error), no seguimos.
        if (!r.ok) throw new Error('La API no ha respondido correctamente');
        return r.json();
      })
      .then((dato: Mascota) => setMascota(dato))
      .catch(() => setError(true));
  }, []);

  if (error) return <Text>No se ha podido cargar la mascota.</Text>;
  if (!mascota) return <Text>Cargando...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🐶</Text>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <Text>{mascota.raza}</Text>
        <Text>{mascota.edad} años · {mascota.ciudad}</Text>
      </View>

      <View style={styles.energyCard}>
        <Text style={styles.energyText}>
          ⚡ Nivel de energía: {mascota.nivelEnergia}
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#EEF6FF'},
 card:{backgroundColor:'#FFF',padding:28,borderRadius:24,alignItems:'center'},
 emoji:{fontSize:56},title:{fontSize:28,fontWeight:'800'},
 energyCard:{backgroundColor:'#FFF',padding:18,borderRadius:24,marginTop:12,alignItems:'center'},
 energyText:{fontSize:16,fontWeight:'700'}
});