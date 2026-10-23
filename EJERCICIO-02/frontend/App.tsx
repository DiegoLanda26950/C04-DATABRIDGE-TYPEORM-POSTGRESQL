
// App.tsx
// RESPONSABILIDAD: pedir la colección y mostrar una cartelera.

import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
};

const API_URL = 'http://172.17.21.54:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  useEffect(() => {
    fetch(API_URL + '/peliculas')
      .then((respuesta) => respuesta.json())
      .then((datos: Pelicula[]) => setPeliculas(datos))
      .catch((error) => console.error('Error al cargar películas:', error));
  }, []);

  return (
    <SafeAreaView style={styles.fondo}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          CINEBOX · DESPUÉS DEL RETO
        </Text>

        <Text style={styles.title}>Cartelera</Text>

        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.fila}>
                <Text style={styles.movie} numberOfLines={1}>
                  🎬 {item.titulo}
                </Text>

                <Text style={styles.corazon}>
                  {index === 0 ? '♥' : '♡'}
                </Text>
              </View>

              <Text style={styles.details}>
                {item.genero} · {item.anio}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 19,
    paddingTop: 26,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 14,
    color: '#172B4D',
    marginBottom: 33,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE4EF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 17,
    marginBottom: 12,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  movie: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 10,
  },
  corazon: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '700',
  },
  details: {
    fontSize: 14,
    color: '#64748B',
  },
});
