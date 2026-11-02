import Header from './components/Header';
import ProductList from './components/ProductList';
import { initialProducts } from './data/products';
import './App.css';

export default function App() {
  return (
    <main className="container">
      <Header />
      <ProductList products={initialProducts} />
    </main>
  );
}
