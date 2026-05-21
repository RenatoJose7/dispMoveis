import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { autenticacao } from '../config/firebaseConfig';

export default function TelaHome() {
  const fazerLogout = () => {
    signOut(autenticacao);
  };

  return (
    <View style={estilos.container}>
      <Text>Bem-vindo, {autenticacao.currentUser?.email}</Text>
      <Button title="Sair" onPress={fazerLogout} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 20 },
});