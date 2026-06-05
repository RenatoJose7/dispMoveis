import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
      <SafeAreaView style={estilos.safe}>
        <View style={estilos.centralizado}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe}>
      <ScrollView contentContainerStyle={estilos.container} keyboardShouldPersistTaps="handled">
        <View style={estilos.card}>
          <View style={estilos.headerPerfil}>
            <View style={estilos.avatar}>
              <Text style={estilos.avatarText}>
                {perfil.nome?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={estilos.headerTexts}>
              <Text style={estilos.titulo}>Perfil do Usuário</Text>
              <Text style={estilos.subtituloPerfil}>Atualize seus dados para manter o perfil completo.</Text>
            </View>
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Nome</Text>
            <TextInput
              style={estilos.input}
              value={perfil.nome}
              onChangeText={(valor) => atualizarCampo('nome', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Sobrenome</Text>
            <TextInput
              style={estilos.input}
              value={perfil.sobrenome}
              onChangeText={(valor) => atualizarCampo('sobrenome', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Rua</Text>
            <TextInput
              style={estilos.input}
              value={perfil.rua}
              onChangeText={(valor) => atualizarCampo('rua', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Bairro</Text>
            <TextInput
              style={estilos.input}
              value={perfil.bairro}
              onChangeText={(valor) => atualizarCampo('bairro', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Cidade</Text>
            <TextInput
              style={estilos.input}
              value={perfil.cidade}
              onChangeText={(valor) => atualizarCampo('cidade', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Estado</Text>
            <TextInput
              style={estilos.input}
              value={perfil.estado}
              onChangeText={(valor) => atualizarCampo('estado', valor)}
              editable={editando}
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>CEP</Text>
            <TextInput
              style={estilos.input}
              value={perfil.cep}
              onChangeText={(valor) => atualizarCampo('cep', valor)}
              editable={editando}
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.campoBloco}>
            <Text style={estilos.label}>Telefone celular</Text>
            <TextInput
              style={estilos.input}
              value={perfil.telefone}
              onChangeText={(valor) => atualizarCampo('telefone', valor)}
              editable={editando}
              keyboardType="phone-pad"
            />
          </View>

          <View style={estilos.botoesContainer}>
        {editando ? (
          <>
            <TouchableOpacity
              style={[estilos.botaoPrincipal, salvando && estilos.botaoDesativado]}
              onPress={salvarPerfil}
              disabled={salvando}
            >
              <Text style={estilos.botaoTexto}>
                {salvando ? 'Salvando...' : 'Salvar Perfil'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botaoSecundario} onPress={() => setEditando(false)}>
              <Text style={estilos.botaoSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={estilos.botaoPrincipal} onPress={() => setEditando(true)}>
            <Text style={estilos.botaoTexto}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </ScrollView>
</SafeAreaView>
);
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5f8',
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  headerTexts: {
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtituloPerfil: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  campoBloco: {
    marginBottom: 14,
  },
  label: {
    color: '#4b5563',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
  },
  botoesContainer: {
    marginTop: 16,
  },
  botaoPrincipal: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  botaoSecundario: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  botaoSecundarioTexto: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 15,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesativado: {
    opacity: 0.65,
  },
});