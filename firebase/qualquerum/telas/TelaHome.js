import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaHome({ navigation }) {
  const fazerLogout = () => {
    signOut(autenticacao);
  };

  const nomeUsuario = autenticacao.currentUser?.displayName || 'Usuário';

  return (
    <SafeAreaView style={estilos.safe}>
      <View style={estilos.container}>
        <View style={estilos.card}>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoText}>DM</Text>
          </View>
          <Text style={estilos.title}>Bem-vindo, {nomeUsuario}!</Text>
          <TouchableOpacity style={estilos.button} onPress={fazerLogout}>
            <Text style={estilos.buttonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.button, {marginTop: 10}]} onPress={()=> navigation.navigate('Perfil')}>
            <Text style={estilos.buttonText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f5f8' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    backgroundColor: '#4f46e5',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 16, color: '#1f2937' },
  button: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontWeight: '600' },
});