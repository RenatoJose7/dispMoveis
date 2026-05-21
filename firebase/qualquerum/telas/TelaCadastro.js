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
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const fazerCadastro = async () => {
    try {
      const usuarioCriado = await createUserWithEmailAndPassword(autenticacao, email, senha);

      await updateProfile(usuarioCriado.user, {
        displayName: nome,
      });

      navigation.navigate('Login');
    } catch (erro) {
      setErro('Erro ao cadastrar. Tente novamente.');
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

          <Text style={estilos.title}>Crie sua conta</Text>

          <TextInput
            placeholder="Nome"
            placeholderTextColor="#9aa4b2"
            style={estilos.input}
            value={nome}
            onChangeText={setNome}
          />

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

          <TouchableOpacity style={estilos.button} onPress={fazerCadastro}>
            <Text style={estilos.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.link} onPress={() => navigation.navigate('Login')}>
            <Text style={estilos.linkText}>Voltar para login</Text>
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