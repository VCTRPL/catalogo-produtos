import { useEffect, useState } from 'react';
import Header from './components/Header';
import ProductSearch from './components/ProductSearch';
import ProductList from './components/ProductList';
import { getProducts } from './services/productsApi';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError('');

      try {
        const data = await getProducts({ signal: controller.signal });
        if (!Array.isArray(data)) {
          throw new Error('A API não retornou uma lista de produtos.');
        }
        setProducts(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  // Na API da turma, o nome do produto está no campo "descricao" (não existe "nome")
  const filteredProducts = products.filter((product) =>
    product.descricao.toLocaleLowerCase('pt-BR').includes(
      search.toLocaleLowerCase('pt-BR')
    )
  );

  return (
    <main className="container">
      <Header />
      <ProductSearch value={search} onSearchChange={setSearch} />
      {loading && <p role="status">Carregando produtos...</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && (
        <>
          <p>{filteredProducts.length} produto(s) encontrado(s).</p>
          <ProductList products={filteredProducts} />
        </>
      )}
    </main>
  );
}
