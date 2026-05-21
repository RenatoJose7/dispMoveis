import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const fazerLogin = async () => {
    setErro('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(autenticacao, email, senha);
    } catch (e) {
      setErro('Erro ao fazer login. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={estilos.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={estilos.container}
      >
        <View style={estilos.card}>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoText}>DM</Text>
          </View>

          <Text style={estilos.title}>Bem-vindo de volta</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9aa4b2"
            style={estilos.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#9aa4b2"
            style={estilos.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity style={estilos.button} onPress={fazerLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={estilos.buttonText}>Entrar</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={estilos.link} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={estilos.linkText}>Criar uma conta</Text>
          </TouchableOpacity>

          {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
        </View>
      </KeyboardAvoidingView>
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
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12, color: '#1f2937' },
  input: {
    borderWidth: 1,
    borderColor: '#e6eef6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fbfdff',
  },
  button: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#4f46e5' },
  erro: { color: 'red', marginTop: 10, textAlign: 'center' },
});