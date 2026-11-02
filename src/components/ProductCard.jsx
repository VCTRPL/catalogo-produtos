export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h2>{product.nome}</h2>
      <p>{product.categoria}</p>
      <strong>
        {product.preco.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}
      </strong>
    </article>
  );
}
