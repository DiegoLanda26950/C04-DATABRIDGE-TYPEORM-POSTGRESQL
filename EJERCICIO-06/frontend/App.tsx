import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Libro = { id: number; titulo: string; autor: string; genero: string; leido: boolean };
const API_URL = 'http://192.168.1.50:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);

  async function cargar() {
    const r = await fetch(API_URL + '/libros');
    setLibros(await r.json());
  }
  useEffect(() => { cargar(); }, []);

  async function marcarLeido(id: number) {
    await fetch(API_URL + '/libros/' + id + '/leido', { method: 'PATCH' });
    // Volvemos a pedir la lista para reflejar el cambio de PostgreSQL.
    await cargar();
  }

  function confirmar(libro: Libro) {
    Alert.alert('Eliminar libro', libro.titulo, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(libro.id) },
    ]);
  }
  async function eliminar(id: number) {
    await fetch(API_URL + '/libros/' + id, { method: 'DELETE' });
    // Sincronizamos el estado local después de borrar en PostgreSQL.
    setLibros((actuales) => actuales.filter((l) => l.id !== id));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>MY LIBRARY</Text>
      <Text style={styles.title}>Biblioteca</Text>

      <FlatList
        data={libros}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bookTitle}>📚 {item.titulo}</Text>
            <Text style={styles.meta}>
              {item.autor} ·{' '}
              <Text style={item.leido ? styles.read : undefined}>
                {item.leido ? 'Leído ✓' : 'Sin leer'}
              </Text>
            </Text>

            {!item.leido && (
              <TouchableOpacity style={styles.button} onPress={() => marcarLeido(item.id)}>
                <Text style={styles.buttonText}>Marcar como leído</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => confirmar(item)}>
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  eyebrow: { fontSize: 12, letterSpacing: 1, color: '#0F172A', marginTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginVertical: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  bookTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  meta: { color: '#64748B', marginTop: 6 },
  read: { fontWeight: '700', color: '#475569' },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  delete: { color: '#DC2626', textAlign: 'center', marginTop: 12 },
});