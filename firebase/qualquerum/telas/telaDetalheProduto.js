import React, { useState } from 'react';
import {
View,
Text,
Image,
StyleSheet,
ScrollView,
TouchableOpacity,
Dimensions,
Alert,
SafeAreaView,
} from 'react-native';const { width } = Dimensions.get('window');export default function TelaDetalheProduto({ route, navigation }) {
const { produto } = route.params;
const [quantidade, setQuantidade] = useState(1);
const [imagemAtiva, setImagemAtiva] = useState(0);// Garantir que temos 3 fotos para o carrossel usando fallbacks se necessário
const fotos = [
produto.Foto,
produto.Foto2 || produto.Foto,
produto.Foto3 || produto.Foto,
];const aoMudarSlide = (event) => {
const scrollOffset = event.nativeEvent.contentOffset.x;
const slide = Math.round(scrollOffset / width);
setImagemAtiva(slide);
};const incrementar = () => {
setQuantidade((antigo) => antigo + 1);
};const decrementar = () => {
if (quantidade > 1) {
setQuantidade((antigo) => antigo - 1);
}
};const formatarMoeda = (valor) => {
if (!valor) return 'R$ 0,00';
const num = parseFloat(valor.toString().replace(',', '.'));
if (isNaN(num)) return `R$ ${valor}`;
return `R$ ${num.toFixed(2).replace('.', ',')}`;
};const precoNumerico = parseFloat(produto.Preço.toString().replace(',', '.'));
const precoNormalNumerico = produto.ValorNormal
? parseFloat(produto.ValorNormal.toString().replace(',', '.'))
: 0;const total = isNaN(precoNumerico) ? 0 : precoNumerico * quantidade;const adicionarAoCarrinho = () => {
Alert.alert(
'Adicionado ao Carrinho!',
`Sucesso! Adicionado ao carrinho:\n\n🛍️ ${produto.Produto}\n🔢 Quantidade: ${quantidade}x\n💰 Valor Total: ${formatarMoeda(total)}`,
[
{
text: 'Continuar Comprando',
onPress: () => navigation.goBack(),
style: 'cancel',
},
{
text: 'Ir para o Carrinho',
onPress: () => {
Alert.alert('Funcionalidade Futura', 'O fluxo do carrinho está em desenvolvimento!');
},
},
]
);
};// Calcular desconto percentual se não estiver preenchido mas temos ValorNormal e Preço
let descontoTexto = produto.Desconto;
if (!descontoTexto && precoNormalNumerico > 0 && precoNumerico > 0 && precoNormalNumerico > precoNumerico) {
const perc = Math.round(((precoNormalNumerico - precoNumerico) / precoNormalNumerico) * 100);
descontoTexto = `${perc}%`;
}return (
<SafeAreaView style={estilos.container}>
<ScrollView contentContainerStyle={estilos.scrollContainer}>
{/* Carrossel de Imagens */}
<View style={estilos.carouselContainer}>
<ScrollView
horizontal
pagingEnabled
showsHorizontalScrollIndicator={false}
onScroll={aoMudarSlide}
scrollEventThrottle={16}
style={estilos.carousel}
>
{fotos.map((foto, index) => (
<Image
key={index}
source={{ uri: foto }}
style={estilos.imagemSlide}
resizeMode="cover"
/>
))}
</ScrollView>{/* Indicador de Páginas (Dots) */}
<View style={estilos.paginacaoContainer}>
{fotos.map((_, index) => (
<View
key={index}
style={[
estilos.dot,
imagemAtiva === index ? estilos.dotAtivo : estilos.dotInativo,
]}
/>
))}
</View>{/* Selo de desconto */}
{descontoTexto ? (
<View style={estilos.badgeDesconto}>
<Text style={estilos.textoBadgeDesconto}>{descontoTexto} OFF</Text>
</View>
) : null}
</View>{/* Detalhes do Produto */}
<View style={estilos.detalhesContainer}>
<Text style={estilos.nome}>{produto.Produto}</Text>
{produto.Descrição ? (
<Text style={estilos.descricao}>{produto.Descrição}</Text>
) : (
<Text style={[estilos.descricao, estilos.semDescricao]}>
Nenhuma descrição disponível para este produto.
</Text>
)}{/* Linha de Preços */}
<View style={estilos.blocoPreco}>
{produto.ValorNormal ? (
<Text style={estilos.precoNormal}>{formatarMoeda(produto.ValorNormal)}</Text>
) : null}
<View style={estilos.linhaPrecoVenda}>
<Text style={estilos.precoVenda}>{formatarMoeda(produto.Preço)}</Text>
{produto.ValorDesconto ? (
<Text style={estilos.economizeBadge}>
Economize {formatarMoeda(produto.ValorDesconto)}
</Text>
) : null}
</View>
</View><View style={estilos.divisor} />{/* Seletor de Quantidade */}
<View style={estilos.secaoQuantidade}>
<View>
<Text style={estilos.tituloQuantidade}>Quantidade</Text>
<Text style={estilos.subtituloQuantidade}>Selecione quantas unidades deseja</Text>
</View>
<View style={estilos.contadorContainer}>
<TouchableOpacity
style={[estilos.botaoContador, quantidade === 1 && estilos.botaoContadorDesativado]}
onPress={decrementar}
disabled={quantidade === 1}
>
<Text style={estilos.textoBotaoContador}>-</Text>
</TouchableOpacity>
<Text style={estilos.quantidadeTexto}>{quantidade}</Text>
<TouchableOpacity style={estilos.botaoContador} onPress={incrementar}>
<Text style={estilos.textoBotaoContador}>+</Text>
</TouchableOpacity>
</View>
</View><View style={estilos.divisor} />{/* Resumo e Botão de Comprar */}
<View style={estilos.footer}>
<View style={estilos.blocoTotal}>
<Text style={estilos.tituloTotal}>Subtotal</Text>
<Text style={estilos.valorTotal}>{formatarMoeda(total)}</Text>
</View><TouchableOpacity style={estilos.botaoCarrinho} onPress={adicionarAoCarrinho}>
<Text style={estilos.textoBotaoCarrinho}>🛒 Adicionar ao Carrinho</Text>
</TouchableOpacity>
</View>
</View>
</ScrollView>
</SafeAreaView>
);
}const estilos = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
},
scrollContainer: {
flexGrow: 1,
backgroundColor: '#f5f7fa',
},
carouselContainer: {
position: 'relative',
height: 320,
backgroundColor: '#000',
},
carousel: {
width: width,
height: 320,
},
imagemSlide: {
width: width,
height: 320,
},
paginacaoContainer: {
position: 'absolute',
bottom: 20,
width: '100%',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
zIndex: 10,
},
dot: {
width: 8,
height: 8,
borderRadius: 4,
marginHorizontal: 4,
},
dotAtivo: {
backgroundColor: '#007BFF',
width: 12,
height: 12,
borderRadius: 6,
},
dotInativo: {
backgroundColor: 'rgba(255, 255, 255, 0.6)',
},
badgeDesconto: {
position: 'absolute',
top: 20,
right: 20,
zIndex: 10,
backgroundColor: '#e0245e',
paddingVertical: 6,
paddingHorizontal: 12,
borderRadius: 20,
elevation: 3,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.15,
shadowRadius: 4,
},
textoBadgeDesconto: {
color: '#fff',
fontSize: 12,
fontWeight: 'bold',
},
detalhesContainer: {
backgroundColor: '#fff',
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
marginTop: -16,
paddingHorizontal: 20,
paddingTop: 24,
paddingBottom: 40,
flex: 1,
shadowColor: '#000',
shadowOffset: { width: 0, height: -3 },
shadowOpacity: 0.05,
shadowRadius: 10,
elevation: 5,
},
nome: {
fontSize: 22,
fontWeight: 'bold',
color: '#14171a',
marginBottom: 10,
lineHeight: 28,
},
descricao: {
fontSize: 15,
color: '#657786',
lineHeight: 22,
marginBottom: 20,
},
semDescricao: {
fontStyle: 'italic',
color: '#aab8c2',
},
blocoPreco: {
backgroundColor: '#f8f9fa',
padding: 16,
borderRadius: 12,
marginBottom: 20,
},
precoNormal: {
fontSize: 14,
color: '#657786',
textDecorationLine: 'line-through',
marginBottom: 4,
},
linhaPrecoVenda: {
flexDirection: 'row',
alignItems: 'center',
},
precoVenda: {
fontSize: 26,
fontWeight: 'bold',
color: '#1a1a1a',
marginRight: 12,
},
economizeBadge: {
fontSize: 12,
color: '#28a745',
fontWeight: 'bold',
backgroundColor: '#e6f4ea',
paddingVertical: 4,
paddingHorizontal: 8,
borderRadius: 6,
},
divisor: {
height: 1,
backgroundColor: '#f1f3f5',
marginVertical: 16,
},
secaoQuantidade: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
tituloQuantidade: {
fontSize: 16,
fontWeight: 'bold',
color: '#14171a',
},
subtituloQuantidade: {
fontSize: 12,
color: '#657786',
marginTop: 2,
},
contadorContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#f8f9fa',
borderRadius: 30,
padding: 4,
borderWidth: 1,
borderColor: '#e1e8ed',
},
botaoContador: {
width: 36,
height: 36,
borderRadius: 18,
backgroundColor: '#fff',
justifyContent: 'center',
alignItems: 'center',
elevation: 1,
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2,
},
botaoContadorDesativado: {
backgroundColor: '#e1e8ed',
opacity: 0.5,
},
textoBotaoContador: {
fontSize: 20,
fontWeight: 'bold',
color: '#14171a',
},
quantidadeTexto: {
fontSize: 18,
fontWeight: 'bold',
paddingHorizontal: 16,
color: '#14171a',
minWidth: 44,
textAlign: 'center',
},
footer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginTop: 10,
},
blocoTotal: {
flex: 1,
},
tituloTotal: {
fontSize: 13,
color: '#657786',
fontWeight: '600',
},
valorTotal: {
fontSize: 24,
fontWeight: 'bold',
color: '#28a745',
marginTop: 2,
},
botaoCarrinho: {
backgroundColor: '#007BFF',
paddingVertical: 14,
paddingHorizontal: 24,
borderRadius: 30,
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
elevation: 3,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.15,
shadowRadius: 4,
},
textoBotaoCarrinho: {
color: '#fff',
fontSize: 15,
fontWeight: 'bold',
},
});