function IngresosCard({ ingreso }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{ingreso.titulo}</h2>
      <div className="card-body">
        <p className="card-text">Alumno: {ingreso.nombre}</p>
        <p className="card-text">Rut: {ingreso.rut}</p>
        <p className="card-text">Motivo: {ingreso.motivo}</p>
        <p className="card-text">Titulo: {ingreso.titulo}</p>
        <p className="card-text">Profesor Guia: {ingreso.profesor_guia}</p>
        <p className="card-text">Profesor Asignatura: {ingreso.profesor_asignatura}</p>
        <p className="card-text">Semestre: {ingreso.semestre}</p>
        <p className="card-text">Vigente: {ingreso.vigente = (ingreso.vigente) ? "✅" : "❌"}</p>
      </div>
    </div>
  );
}

export default IngresosCard;
