function IngresosCard({ ingreso }) {
  return (
    <div className="card">
      <h2 className="card-header text-center">{ingreso.nombre}</h2>
      <ul className="list-group">
        <li className="list-group-item">Rut: {ingreso.rut}</li>
        <li className="list-group-item">Motivo de uso: {ingreso.motivo}</li>
        <li className="list-group-item">Titulo del proyecto: {ingreso.titulo}</li>
        <li className="list-group-item">Profesor Guia: {ingreso.profesor_guia}</li>
        <li className="list-group-item">Profesor Asignatura: {ingreso.profesor_asignatura}</li>
        <li className="list-group-item">Semestre: {ingreso.semestre}</li>
        <li className="list-group-item">Vigente: {ingreso.vigente ? "✅" : "❌"}</li>
      </ul>
    </div>
  );
}

export default IngresosCard;
