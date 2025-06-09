function EnsayosCard({ ensayo }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{ensayo.actividad}</h2>
      <div className="card-body">
        <p className="card-text">Tipo: {ensayo.tipo}</p>
        <p className="card-text">Norma: {ensayo.norma}</p>
        <p className="card-text">Unidad: {ensayo.unidad}</p>
        <p className="card-text">{ensayo.precio_uf} UF</p>
        <p className="card-text">${ensayo.precio_peso}</p>
      </div>
    </div>
  );
}

export default EnsayosCard;
