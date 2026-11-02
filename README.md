# Catálogo de Produtos

Aplicação em React (criada com Vite) que lista produtos de uma API REST, pesquisa por nome e mostra os detalhes de cada produto.

**Aluno:** Victor Reis

## Como executar

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais novo.

### 1. Subir a API de produtos

A aplicação usa a API REST de produtos da turma (repositório `APIRESTful`, feita com Express). Em outro terminal:

```bash
cd APIRESTful
npm install
npm start
```

A API fica em `http://localhost:3000`. Para conferir, abra `http://localhost:3000/produtos` no navegador.

### 2. Subir o catálogo

```bash
cd catalogo-produtos
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Configuração da API

O arquivo `.env`, na raiz do projeto, tem duas variáveis:

| Variável | Valor | Para que serve |
|---|---|---|
| `VITE_API_URL` | `/api` | Endereço que o front-end usa nas chamadas (`fetch`) |
| `API_TARGET` | `http://localhost:3000` | Endereço real da API, usado pelo proxy do Vite |

Se a API estiver em outro endereço, altere `API_TARGET` e reinicie o `npm run dev`.

**Por que existe um proxy?** A API da turma não envia os cabeçalhos de CORS. Por isso, o navegador bloquearia as chamadas feitas de `localhost:5173` para `localhost:3000`. Em vez de alterar o back-end, o `vite.config.js` configura um proxy: o front-end chama `/api/produtos` no próprio servidor do Vite, que repassa a chamada para `http://localhost:3000/produtos`. Para o navegador, tudo vem da mesma origem.

### Contrato da API usado

| Rota | Retorno |
|---|---|
| `GET /produtos` | Array de produtos |
| `GET /produtos/:id` | Um produto, ou `404` se não existir |

Cada produto tem `id`, `descricao`, `preco`, `categoria` e `estoque`.

**Adaptação ao roteiro:** na API real, o nome do produto vem no campo `descricao` (não existe `nome`), e há o campo `estoque`. Por isso, os componentes usam `product.descricao` como título, a pesquisa filtra por `descricao` e o painel de detalhes mostra o estoque. O back-end não foi alterado.

## Árvore de componentes

```text
App                (estados: products, search, loading, error,
│                   selectedId, selectedProduct, detailsLoading, detailsError)
├── Header
├── ProductSearch  ← props: value, onSearchChange
├── ProductList    ← props: products (já filtrados), onViewDetails
│   └── ProductCard  ← props: product, onViewDetails   (um para cada produto)
└── ProductDetails ← props: product, loading, error, onClose   (só aparece com um produto selecionado)
```

Estrutura de arquivos:

```text
src/
├── main.jsx
├── App.jsx
├── App.css
├── components/
│   ├── Header.jsx
│   ├── ProductSearch.jsx
│   ├── ProductList.jsx
│   ├── ProductCard.jsx
│   └── ProductDetails.jsx
├── data/
│   └── products.js        (dados locais usados na Parte 1)
└── services/
    └── productsApi.js     (chamadas à API)
```

## Fluxo de dados

O `App` guarda todos os estados da aplicação e os passa para os outros componentes por props. Quando o `App` é montado, um `useEffect` chama `GET /produtos` e guarda o resultado em `products`. O texto da pesquisa fica no estado `search` e chega ao `ProductSearch` pela prop `value`. Quando o usuário digita, o `onChange` chama `onSearchChange`, que atualiza `search` no `App`. Com `products` e `search`, o `App` calcula `filteredProducts` (sem precisar de outro estado) e envia a lista ao `ProductList`, que cria um `ProductCard` para cada produto, usando o `id` como `key`. O botão "Ver detalhes" do `ProductCard` chama `onViewDetails(id)`, que na verdade é o `setSelectedId` do `App`, recebido por props. A mudança de `selectedId` dispara um segundo `useEffect`, que chama `GET /produtos/:id` e envia o resultado ao `ProductDetails`. Assim, os dados descem por props e os eventos sobem por funções de callback.

## Testes manuais

Testes feitos com a API `APIRESTful` rodando em `localhost:3000` e o catálogo em `localhost:5173`, observando o Console e a aba Rede (Network) do navegador.

| # | Teste | Resultado | Evidência |
|---|---|---|---|
| 1 | A aplicação abre sem erros no console | ✅ Console sem erros | [01](docs/evidencias/01-lista-da-api.jpg) |
| 2 | Os produtos são carregados da API | ✅ `GET /api/produtos` com status 200 e os 5 produtos da API na tela | [01](docs/evidencias/01-lista-da-api.jpg) |
| 3 | A busca por nome funciona | ✅ "mouse" mostra só "Mouse sem fio" e o contador muda para 1 | [02](docs/evidencias/02-pesquisa-mouse.jpg) |
| 4 | A mensagem de lista vazia aparece | ✅ "xyz" mostra "0 produto(s)" e "Nenhum produto encontrado." | [03](docs/evidencias/03-lista-vazia.jpg) |
| 5 | Uma falha na API exibe mensagem de erro | ✅ Com a API desligada, aparece "Erro HTTP 502" em vermelho; ao religar e recarregar, a lista volta | [06](docs/evidencias/06-erro-api-fora-do-ar.jpg) |
| 6 | "Ver detalhes" consulta o produto por ID | ✅ `GET /api/produtos/3` com status 200 e painel com o Monitor 24 polegadas; outro produto gera `GET /api/produtos/4` | [04](docs/evidencias/04-detalhes-produto.jpg) |
| 7 | "Fechar detalhes" oculta o painel | ✅ O painel some e a lista continua | [05](docs/evidencias/05-detalhes-fechados.jpg) |
| 8 | A navegação acontece sem recarregar a página | ✅ Depois de pesquisar, abrir e fechar detalhes, o navegador registrou 1 único carregamento de página; as demais requisições foram só à API | — |

**Observação:** na aba Rede, cada `GET /api/produtos` aparece duas vezes, a primeira como "cancelada". Isso é o Strict Mode do React em desenvolvimento: ele monta o componente, desmonta e monta de novo para testar se o efeito sabe se limpar. O `AbortController` cancela a primeira requisição. Em produção (`npm run build`), a chamada acontece uma vez só.

## Respostas da discussão

- **Onde estão os estados?** Todos estão no `App`. Os outros componentes não têm estado: só recebem props e mostram o que recebem.
- **Por que a pesquisa é controlada pelo `App`?** Porque o texto digitado é usado por dois componentes irmãos: o `ProductSearch` mostra o texto e o `ProductList` precisa da lista filtrada. Componentes irmãos não trocam dados diretamente, então o estado fica no pai em comum (é o que se chama de "elevar o estado").
- **Como um clique no `ProductCard` atualiza o `ProductDetails`?** O `App` passa a função `setSelectedId` como prop até o `ProductCard`. O clique chama essa função, o estado `selectedId` do `App` muda, o `useEffect` busca o produto na API e o resultado desce como prop para o `ProductDetails`.
- **Diferença entre props, `useState` e `useEffect`:**
  - **props** são dados que o pai entrega ao filho e que o filho não altera.
  - **`useState`** guarda dados do próprio componente que mudam com o uso; quando mudam, a tela é desenhada de novo.
  - **`useEffect`** sincroniza o componente com algo de fora do React, como uma API. Ele roda depois da renderização e de novo quando as dependências mudam.
