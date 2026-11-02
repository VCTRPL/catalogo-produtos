import { useState } from 'react';
import Header from './components/Header';
import ProductSearch from './components/ProductSearch';
import ProductList from './components/ProductList';
import { initialProducts } from './data/products';
import './App.css';

export default function App() {
  const [search, setSearch] = useState('');

  const filteredProducts = initialProducts.filter((product) =>
    product.nome.toLocaleLowerCase('pt-BR').includes(
      search.toLocaleLowerCase('pt-BR')
    )
  );

  return (
    <main className="container">
      <Header />
      <ProductSearch value={search} onSearchChange={setSearch} />
      <p>{filteredProducts.length} produto(s) encontrado(s).</p>
      <ProductList products={filteredProducts} />
    </main>
  );
}
