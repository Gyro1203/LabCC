function IngresosCard({ ingreso }) {
  return (
    <>
      <h1
        className="list-group-item text-center"
        style={{
          color: "#fff",
          backgroundColor: "#014898",
        }}
      >
        {ingreso.nombre}
      </h1>
      <ul className="list-group">
        <li className="list-group-item">Motivo de uso: {ingreso.motivo}</li>
        <li className="list-group-item">
          Titulo del proyecto: {ingreso.titulo}
        </li>
        <li className="list-group-item">
          Profesor Guia: {ingreso.profesor_guia}
        </li>
        <li className="list-group-item">
          Profesor Asignatura: {ingreso.profesor_asignatura}
        </li>
        <li className="list-group-item">Semestre: {ingreso.semestre}</li>
        <li className="list-group-item">
          Vigente: {ingreso.vigente ? "✅" : "❌"}
        </li>
      </ul>
    </>
  );
}

export default IngresosCard;
