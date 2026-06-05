import React, { useEffect, useState } from 'react';
import {
SafeAreaView,
ScrollView,
View,
Text,
TextInput,
TouchableOpacity,
Image,
StyleSheet,
FlatList,
ActivityIndicator,
Alert,
KeyboardAvoidingView,
StatusBar,
Platform,
} from 'react-native';
import { bancoDados } from '../config/firebaseConfig';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const camposIniciais = {
Produto: '',
Preço: '',
Descrição: '',
Foto: '',
Foto2: '',
Foto3: '',
ValorNormal: '',
ValorDesconto: '',
Desconto: '',
};export default function TelaAdm({ navigation }) {
const [produtos, setProdutos] = useState([]);
const [carregando, setCarregando] = useState(true);
const [salvando, setSalvando] = useState(false);
const [novoProduto, setNovoProduto] = useState(camposIniciais);
const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [editandoId, setEditandoId] = useState(null);// Buscar produtos em tempo real do Firestore
useEffect(() => {
const produtosRef = collection(bancoDados, 'produtos');
const desinscrever = onSnapshot(produtosRef, (querySnapshot) => {
const lista = [];
querySnapshot.forEach((docSnap) => {
lista.push({ id: docSnap.id, ...docSnap.data() });
});
setProdutos(lista);
setCarregando(false);
}, (erro) => {
console.error("Erro ao buscar produtos:", erro);
Alert.alert("Erro", "Não foi possível carregar os produtos.");
setCarregando(false);
});return desinscrever;
}, []);// Popular com produtos padrão se estiver vazio
const popularProdutosPadrao = async () => {
setCarregando(true);
try {
const produtosRef = collection(bancoDados, 'produtos');
const produtosExemplo = [
{
Produto: 'Smartphone Quantum X',
Preço: '1599.90',
Descrição: 'Smartphone com tela AMOLED de 6.7 polegadas, 128GB de armazenamento e câmera quádrupla de 64MP.',
Foto: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
ValorNormal: '1999.90',
ValorDesconto: '400.00',
Desconto: '20%',
},
{
Produto: 'Notebook Gamer Pro',
Preço: '4599.00',
Descrição: 'Processador de última geração, 16GB RAM, SSD 512GB e placa de vídeo dedicada de 4GB.',
Foto: 'https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
ValorNormal: '5499.00',
ValorDesconto: '900.00',
Desconto: '16%',
},
{
Produto: 'Fone Noise Cancelling',
Preço: '299.90',
Descrição: 'Fones de ouvido over-ear sem fio com cancelamento de ruído ativo e bateria de 40 horas.',
Foto: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
ValorNormal: '499.90',
ValorDesconto: '200.00',
Desconto: '40%',
},
{
Produto: 'Smartwatch Sport Fit',
Preço: '189.90',
Descrição: 'Monitor de ritmo cardíaco, GPS integrado, resistente à água e múltiplos modos esportivos.',
Foto: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
ValorNormal: '269.90',
ValorDesconto: '80.00',
Desconto: '30%',
}
];for (const prod of produtosExemplo) {
await addDoc(produtosRef, prod);
}
Alert.alert('Sucesso', 'Produtos padrão criados no Firestore para demonstração!');
} catch (erro) {
console.error("Erro ao popular produtos:", erro);
Alert.alert('Erro', 'Falha ao gerar produtos padrão.');
} finally {
setCarregando(false);
}
};const atualizarCampo = (campo, valor) => {
setNovoProduto((anterior) => ({ ...anterior, [campo]: valor }));
};const toggleFormulario = () => {
if (mostrarFormulario) {
setNovoProduto(camposIniciais);
setEditandoId(null);
}
setMostrarFormulario(!mostrarFormulario);
};const iniciarEdicao = (produto) => {
setEditandoId(produto.id);
setNovoProduto({
Produto: produto.Produto || '',
Preço: produto.Preço || '',
Descrição: produto.Descrição || '',
Foto: produto.Foto || '',
Foto2: produto.Foto2 || '',
Foto3: produto.Foto3 || '',
ValorNormal: produto.ValorNormal || '',
ValorDesconto: produto.ValorDesconto || '',
Desconto: produto.Desconto || '',
});
setMostrarFormulario(true);
};const salvarProduto = async () => {
const { Produto, Preço } = novoProduto;
if (!Produto.trim() || !Preço.trim()) {
Alert.alert('Atenção', 'Nome do produto e Preço são obrigatórios.');
return;
}setSalvando(true);
try {
const fotoFinal = novoProduto.Foto.trim()
? novoProduto.Foto
: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
const foto2Final = novoProduto.Foto2.trim();
const foto3Final = novoProduto.Foto3.trim();if (editandoId) {
// Atualizar produto existente
const produtoRef = doc(bancoDados, 'produtos', editandoId);
await updateDoc(produtoRef, {
...novoProduto,
Foto: fotoFinal,
Foto2: foto2Final,
Foto3: foto3Final,
updatedAt: new Date(),
});
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto atualizado com sucesso!');
} else {
Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
}
} else {
// Cadastrar novo produto
const produtosRef = collection(bancoDados, 'produtos');
await addDoc(produtosRef, {
...novoProduto,
Foto: fotoFinal,
Foto2: foto2Final,
Foto3: foto3Final,
createdAt: new Date(),
});
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto cadastrado com sucesso!');
} else {
Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
}
}setNovoProduto(camposIniciais);
setEditandoId(null);
setMostrarFormulario(false);
} catch (erro) {
console.error("Erro ao salvar produto:", erro);
if (Platform.OS === 'web') {
window.alert('Erro: Não foi possível salvar o produto.');
} else {
Alert.alert('Erro', 'Não foi possível salvar o produto.');
}
} finally {
setSalvando(false);
}
};const deletarProduto = (id, nome) => {
const acaoExcluir = async () => {
try {
await deleteDoc(doc(bancoDados, 'produtos', id));
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto removido com sucesso.');
} else {
Alert.alert('Sucesso', 'Produto removido com sucesso.');
}
} catch (erro) {
console.error("Erro ao deletar produto:", erro);
if (Platform.OS === 'web') {
window.alert('Erro: Não foi possível remover o produto.');
} else {
Alert.alert('Erro', 'Não foi possível remover o produto.');
}
}
};if (Platform.OS === 'web') {
const confirmou = window.confirm(`Deseja realmente deletar o produto "${nome}"?`);
if (confirmou) {
acaoExcluir();
}
} else {
Alert.alert(
'Confirmar Exclusão',
`Deseja realmente deletar o produto "${nome}"?`,
[
{ text: 'Cancelar', style: 'cancel' },
{
text: 'Excluir',
style: 'destructive',
onPress: acaoExcluir
}
]
);
}
};const formatarMoeda = (valor) => {
if (!valor) return 'R$ 0,00';
const num = parseFloat(valor.toString().replace(',', '.'));
if (isNaN(num)) return `R$ ${valor}`;
return `R$ ${num.toFixed(2).replace('.', ',')}`;
};const renderItem = ({ item }) => {
// Calcular desconto percentual se não estiver preenchido mas termos ValorNormal e Preço
let descontoTexto = item.Desconto;
if (!descontoTexto && item.ValorNormal && item.Preço) {
const normal = parseFloat(item.ValorNormal.toString().replace(',', '.'));
const preco = parseFloat(item.Preço.toString().replace(',', '.'));
if (!isNaN(normal) && !isNaN(preco) && normal > preco) {
const perc = Math.round(((normal - preco) / normal) * 100);
descontoTexto = `${perc}%`;
}
}return (
<View style={estilos.card}>
<TouchableOpacity
style={estilos.cardPressArea}
activeOpacity={0.85}
onPress={() => navigation.navigate('Detalhes', { produto: item })}
>
<Image source={{ uri: item.Foto }} style={estilos.imagemProduto} resizeMode="cover" />
{descontoTexto ? (
<View style={estilos.badgeDesconto}>
<Text style={estilos.textoBadgeDesconto}>{descontoTexto} OFF</Text>
</View>
) : null}
<View style={estilos.infoContainer}>
<Text numberOfLines={2} style={estilos.nomeProduto}>{item.Produto}</Text>
{item.Descrição ? (
<Text numberOfLines={1} style={estilos.descricaoProduto}>{item.Descrição}</Text>
) : null}
<View style={estilos.precosContainer}>
{item.ValorNormal ? (
<Text style={estilos.precoNormal}>{formatarMoeda(item.ValorNormal)}</Text>
) : null}
<Text style={estilos.precoVenda}>{formatarMoeda(item.Preço)}</Text>
{item.ValorDesconto ? (
<Text style={estilos.valorDescontoDescricao}>
Economize {formatarMoeda(item.ValorDesconto)}
</Text>
) : null}
</View>
</View>
</TouchableOpacity>
<TouchableOpacity
style={estilos.botaoDeletar}
onPress={() => deletarProduto(item.id, item.Produto)}
>
<Text style={estilos.textoBotaoDeletar}>🗑️</Text>
</TouchableOpacity>
<View style={estilos.infoContainerBottom}>
<TouchableOpacity style={estilos.botaoEditar} onPress={() => iniciarEdicao(item)}>
<Text style={estilos.textoBotaoEditar}>✏️ Editar</Text>
</TouchableOpacity>
</View>
</View>
);
};return (
<SafeAreaView style={estilos.safe}>
<StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={estilos.container}
>
<ScrollView contentContainerStyle={estilos.scrollContainer} keyboardShouldPersistTaps="handled">
<View style={estilos.headerCard}>
<View>
<Text style={estilos.tituloPagina}>Painel de Admin</Text>
<Text style={estilos.subtitulo}>
{produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
</Text>
</View>
<TouchableOpacity
style={estilos.botaoToggleForm}
onPress={toggleFormulario}
>
<Text style={estilos.textoBotaoToggleForm}>
{mostrarFormulario
? (editandoId ? 'Fechar edição' : 'Fechar cadastro')
: 'Novo produto'}
</Text>
</TouchableOpacity>
</View>{mostrarFormulario && (
<View style={estilos.formulario}>
<Text style={estilos.tituloFormulario}>
{editandoId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
</Text>
<TextInput
placeholder="Nome do Produto *"
style={estilos.input}
value={novoProduto.Produto}
onChangeText={(v) => atualizarCampo('Produto', v)}
/><TextInput
placeholder="Descrição (Opcional)"
style={estilos.input}
value={novoProduto.Descrição}
onChangeText={(v) => atualizarCampo('Descrição', v)}
/><View style={estilos.inputLinha}>
<TextInput
placeholder="Preço Venda (ex: 89.90) *"
keyboardType="numeric"
style={[estilos.input, { flex: 1, marginRight: 8 }]}
value={novoProduto.Preço}
onChangeText={(v) => atualizarCampo('Preço', v)}
/>
<TextInput
placeholder="Preço Normal (ex: 120.00)"
keyboardType="numeric"
style={[estilos.input, { flex: 1 }]}
value={novoProduto.ValorNormal}
onChangeText={(v) => atualizarCampo('ValorNormal', v)}
/>
</View><View style={estilos.inputLinha}>
<TextInput
placeholder="Valor Desconto R$"
keyboardType="numeric"
style={[estilos.input, { flex: 1, marginRight: 8 }]}
value={novoProduto.ValorDesconto}
onChangeText={(v) => atualizarCampo('ValorDesconto', v)}
/>
<TextInput
placeholder="Desconto (ex: 25%)"
style={[estilos.input, { flex: 1 }]}
value={novoProduto.Desconto}
onChangeText={(v) => atualizarCampo('Desconto', v)}
/>
</View><TextInput
placeholder="URL da Foto Principal (Opcional)"
style={estilos.input}
value={novoProduto.Foto}
onChangeText={(v) => atualizarCampo('Foto', v)}
/><TextInput
placeholder="URL da Foto 2 (Opcional)"
style={estilos.input}
value={novoProduto.Foto2}
onChangeText={(v) => atualizarCampo('Foto2', v)}
/><TextInput
placeholder="URL da Foto 3 (Opcional)"
style={estilos.input}
value={novoProduto.Foto3}
onChangeText={(v) => atualizarCampo('Foto3', v)}
/><TouchableOpacity
style={[estilos.botaoSalvar, salvando && estilos.botaoDesativado]}
onPress={salvarProduto}
disabled={salvando}
>
{salvando ? (
<ActivityIndicator color="#fff" />
) : (
<Text style={estilos.textoBotaoSalvar}>
{editandoId ? 'Salvar Alterações' : 'Salvar Produto no Firestore'}
</Text>
)}
</TouchableOpacity>
</View>
)}{carregando ? (
<View style={estilos.centralizado}>
<ActivityIndicator size="large" color="#007BFF" />
<Text style={estilos.textoCarregando}>Carregando produtos...</Text>
</View>
) : produtos.length === 0 ? (
<View style={estilos.semProdutos}>
<Text style={estilos.textoSemProdutos}>Nenhum produto cadastrado no Firestore.</Text>
<TouchableOpacity style={estilos.botaoPopular} onPress={popularProdutosPadrao}>
<Text style={estilos.textoBotaoPopular}>✨ Gerar Produtos de Exemplo</Text>
</TouchableOpacity>
</View>
) : (
<FlatList
data={produtos}
keyExtractor={(item) => item.id}
renderItem={renderItem}
numColumns={2}
columnWrapperStyle={estilos.linhaGrid}
contentContainerStyle={estilos.lista}
/>
)}
</ScrollView>
</KeyboardAvoidingView>
</SafeAreaView>
);
}

const estilos = StyleSheet.create({
safe: {
flex: 1,
backgroundColor: '#f5f7fa',
},
container: {
flex: 1,
backgroundColor: '#f5f7fa',
},
scrollContainer: {
paddingBottom: 20,
},
headerCard: {
backgroundColor: '#fff',
borderRadius: 16,
padding: 18,
margin: 16,
marginBottom: 8,
shadowColor: '#000',
shadowOpacity: 0.08,
shadowRadius: 12,
elevation: 4,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
tituloPagina: {
fontSize: 18,
fontWeight: '700',
color: '#111827',
marginBottom: 4,
},
subtitulo: {
fontSize: 14,
color: '#6b7280',
fontWeight: '600',
},
botaoToggleForm: {
backgroundColor: '#4f46e5',
paddingVertical: 10,
paddingHorizontal: 14,
borderRadius: 999,
},
textoBotaoToggleForm: {
color: '#fff',
fontSize: 13,
fontWeight: '700',
},
formulario: {
backgroundColor: '#fff',
padding: 18,
borderRadius: 16,
marginHorizontal: 16,
marginVertical: 8,
shadowColor: '#000',
shadowOpacity: 0.06,
shadowRadius: 12,
elevation: 3,
},
tituloFormulario: {
fontSize: 16,
fontWeight: '700',
marginBottom: 16,
color: '#111827',
},
input: {
backgroundColor: '#f8f9fa',
borderWidth: 1,
borderColor: '#e1e8ed',
borderRadius: 8,
padding: 10,
marginBottom: 10,
fontSize: 14,
},
inputLinha: {
flexDirection: 'row',
justifyContent: 'space-between',
},
botaoSalvar: {
backgroundColor: '#28a745',
padding: 12,
borderRadius: 8,
alignItems: 'center',
marginTop: 6,
},
botaoDesativado: {
backgroundColor: '#94d3a2',
},
textoBotaoSalvar: {
color: '#fff',
fontWeight: 'bold',
fontSize: 14,
},
centralizado: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
textoCarregando: {
marginTop: 10,
color: '#657786',
fontSize: 14,
},
semProdutos: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 40,
},
textoSemProdutos: {
fontSize: 16,
color: '#657786',
textAlign: 'center',
marginBottom: 20,
},
botaoPopular: {
backgroundColor: '#007BFF',
paddingVertical: 12,
paddingHorizontal: 20,
borderRadius: 25,
elevation: 2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
},
textoBotaoPopular: {
color: '#fff',
fontSize: 14,
fontWeight: 'bold',
},
lista: {
padding: 8,
},
linhaGrid: {
justifyContent: 'space-between',
},
card: {
backgroundColor: '#fff',
width: '48%',
borderRadius: 12,
marginBottom: 16,
overflow: 'hidden',
borderWidth: 1,
borderColor: '#e1e8ed',
elevation: 3,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
position: 'relative',
},
cardPressArea: {
flex: 1,
},
botaoDeletar: {
position: 'absolute',
top: 8,
left: 8,
zIndex: 10,
backgroundColor: 'rgba(255, 255, 255, 0.9)',
width: 28,
height: 28,
borderRadius: 14,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 1,
borderColor: '#e1e8ed',
},
textoBotaoDeletar: {
fontSize: 12,
},
badgeDesconto: {
position: 'absolute',
top: 8,
right: 8,
zIndex: 10,
backgroundColor: '#e0245e',
paddingVertical: 4,
paddingHorizontal: 8,
borderRadius: 12,
},
textoBadgeDesconto: {
color: '#fff',
fontSize: 10,
fontWeight: 'bold',
},
imagemProduto: {
width: '100%',
height: 140,
backgroundColor: '#f8f9fa',
},
infoContainer: {
padding: 10,
flex: 1,
justifyContent: 'space-between',
},
infoContainerBottom: {
paddingHorizontal: 10,
paddingBottom: 12,
},
nomeProduto: {
fontSize: 14,
fontWeight: 'bold',
color: '#14171a',
marginBottom: 4,
lineHeight: 18,
},
descricaoProduto: {
fontSize: 12,
color: '#657786',
marginBottom: 8,
},
precosContainer: {
marginBottom: 10,
},
precoNormal: {
fontSize: 12,
color: '#657786',
textDecorationLine: 'line-through',
marginBottom: 2,
},
precoVenda: {
fontSize: 16,
fontWeight: 'bold',
color: '#1a1a1a',
},
valorDescontoDescricao: {
fontSize: 10,
color: '#28a745',
fontWeight: '600',
marginTop: 2,
},
botaoEditar: {
backgroundColor: '#FF9F43',
paddingVertical: 8,
borderRadius: 6,
alignItems: 'center',
marginTop: 4,
},
textoBotaoEditar: {
color: '#fff',
fontSize: 13,
fontWeight: 'bold',
},
});