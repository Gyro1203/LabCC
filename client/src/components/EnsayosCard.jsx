function EnsayosCard({ ensayo }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{ensayo.nombre}</h2>
      <div className="card-body">
        <p className="card-text">Tipo: {ensayo.tipo}</p>
        <p className="card-text">UF: {ensayo.precio_uf}</p>
        <p className="card-text">$: {ensayo.precio_peso}</p>
      </div>
    </div>
  );
}

export default EnsayosCard;
