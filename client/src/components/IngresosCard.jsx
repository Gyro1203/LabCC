function IngresosCard({ ingreso }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{ingreso.nombre}</h2>
      <div className="card-body">
        <p className="card-text">Rut: {ingreso.rut}</p>
        <p className="card-text">Motivo de uso: {ingreso.motivo}</p>
        <p className="card-text">Titulo del proyecto: {ingreso.titulo}</p>
        <p className="card-text">Profesor Guia: {ingreso.profesor_guia}</p>
        <p className="card-text">Profesor Asignatura: {ingreso.profesor_asignatura}</p>
        <p className="card-text">Semestre: {ingreso.semestre}</p>
        <p className="card-text">Vigente: {ingreso.vigente ? "✅" : "❌"}</p>
      </div>
    </div>
  );
}

export default IngresosCard;
