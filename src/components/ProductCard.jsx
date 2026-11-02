// Adaptado à API da turma: o nome do produto vem em "descricao".
export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h2>{product.descricao}</h2>
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
