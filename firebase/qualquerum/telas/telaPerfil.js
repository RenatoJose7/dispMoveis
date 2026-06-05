import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { autenticacao, bancoDados } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const camposIniciais = {
  nome: '',
  sobrenome: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  telefone: '',
};

export default function TelaPerfil() {
  const [perfil, setPerfil] = useState(camposIniciais);
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const usuario = autenticacao.currentUser;

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario) {
        setCarregando(false);
        return;
      }

      const storageKey = `@perfil_usuario_${usuario.uid}`;

      try {
        const perfilLocal = await AsyncStorage.getItem(storageKey);

        if (perfilLocal) {
          const dadosLocais = JSON.parse(perfilLocal);

          setPerfil({
            nome: dadosLocais.nome || '',
            sobrenome: dadosLocais.sobrenome || '',
            rua: dadosLocais.rua || '',
            bairro: dadosLocais.bairro || '',
            cidade: dadosLocais.cidade || '',
            estado: dadosLocais.estado || '',
            cep: dadosLocais.cep || '',
            telefone: dadosLocais.telefone || '',
          });

          setEditando(false);
          setCarregando(false);
        }
      } catch (e) {
        console.error('Erro ao carregar dados locais do perfil:', e);
      }

      try {
        const perfilRef = doc(bancoDados, 'users', usuario.uid);
        const perfilSnap = await getDoc(perfilRef);

        if (perfilSnap.exists()) {
          const dados = perfilSnap.data();

          const novosDados = {
            nome: dados.nome || '',
            sobrenome: dados.sobrenome || '',
            rua: dados.rua || '',
            bairro: dados.bairro || '',
            cidade: dados.cidade || '',
            estado: dados.estado || '',
            cep: dados.cep || '',
            telefone: dados.telefone || '',
          };

          setPerfil(novosDados);
          setEditando(false);

          await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
        } else {
          const [primeiroNome, ...resto] = (usuario.displayName || '').split(' ');

          const dadosPadrao = {
            nome: primeiroNome || '',
            sobrenome: resto.join(' ') || '',
            rua: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
            telefone: '',
          };

          setPerfil(dadosPadrao);
          setEditando(true);

          await AsyncStorage.setItem(storageKey, JSON.stringify(dadosPadrao));
        }
      } catch (erro) {
        console.error('Erro ao buscar dados do Firestore:', erro);

        const perfilLocal = await AsyncStorage.getItem(storageKey);

        if (!perfilLocal) {
          Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        }
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [usuario]);

  const salvarPerfil = async () => {
    if (!usuario) {
      return;
    }

    setSalvando(true);

    try {
      const nomeCompleto = `${perfil.nome.trim()} ${perfil.sobrenome.trim()}`.trim();

      if (nomeCompleto) {
        await updateProfile(usuario, {
          displayName: nomeCompleto,
        });
      }

      const perfilRef = doc(bancoDados, 'users', usuario.uid);

      const novosDados = {
        nome: perfil.nome,
        sobrenome: perfil.sobrenome,
        rua: perfil.rua,
        bairro: perfil.bairro,
        cidade: perfil.cidade,
        estado: perfil.estado,
        cep: perfil.cep,
        telefone: perfil.telefone,
        updatedAt: new Date(),
      };

      await setDoc(perfilRef, novosDados, { merge: true });

      const storageKey = `@perfil_usuario_${usuario.uid}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));

      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (erro) {
      console.error('Erro ao salvar perfil:', erro);
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const atualizarCampo = (campo, valor) => {
    setPerfil((anterior) => ({ ...anterior, [campo]: valor }));
  };

  if (carregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Perfil do Usuário</Text>

      <Text>Nome</Text>
      <TextInput
        style={estilos.input}
        value={perfil.nome}
        onChangeText={(valor) => atualizarCampo('nome', valor)}
        editable={editando}
      />

      <Text>Sobrenome</Text>
      <TextInput
        style={estilos.input}
        value={perfil.sobrenome}
        onChangeText={(valor) => atualizarCampo('sobrenome', valor)}
        editable={editando}
      />

      <Text>Rua</Text>
      <TextInput
        style={estilos.input}
        value={perfil.rua}
        onChangeText={(valor) => atualizarCampo('rua', valor)}
        editable={editando}
      />

      <Text>Bairro</Text>
      <TextInput
        style={estilos.input}
        value={perfil.bairro}
        onChangeText={(valor) => atualizarCampo('bairro', valor)}
        editable={editando}
      />

      <Text>Cidade</Text>
      <TextInput
        style={estilos.input}
        value={perfil.cidade}
        onChangeText={(valor) => atualizarCampo('cidade', valor)}
        editable={editando}
      />

      <Text>Estado</Text>
      <TextInput
        style={estilos.input}
        value={perfil.estado}
        onChangeText={(valor) => atualizarCampo('estado', valor)}
        editable={editando}
      />

      <Text>CEP</Text>
      <TextInput
        style={estilos.input}
        value={perfil.cep}
        onChangeText={(valor) => atualizarCampo('cep', valor)}
        editable={editando}
        keyboardType="numeric"
      />

      <Text>Telefone celular</Text>
      <TextInput
        style={estilos.input}
        value={perfil.telefone}
        onChangeText={(valor) => atualizarCampo('telefone', valor)}
        editable={editando}
        keyboardType="phone-pad"
      />

      {editando ? (
        <>
          <Button
            title={salvando ? 'Salvando...' : 'Salvar Perfil'}
            onPress={salvarPerfil}
            disabled={salvando}
          />

          <View style={estilos.espaco} />

          <Button title="Cancelar" onPress={() => setEditando(false)} />
        </>
      ) : (
        <Button title="Editar Perfil" onPress={() => setEditando(true)} />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  espaco: {
    height: 10,
  },
});