function AlumnosCardContent({ alumno, eliminar, editar }) {
  return (
    <>
      <div
        className="list-group-item"
        style={{ 
          color: "#fff",
          backgroundColor: "#014898"
        }}
      >
        <h1 className="m-0 p-0">{alumno.nombre}</h1>
        
      </div>
      <div className="list-group-item position-relative text-center">
        <li className="">RUT: {alumno.rut}</li>
        <div className="position-absolute end-0 top-50 translate-middle-y me-3">
          {editar} {eliminar}
        </div>
      </div>
      <li className="list-group-item">Carrera: {alumno.carrera}</li>
      <li className="list-group-item">Facultad: {alumno.facultad}</li>
      <li className="list-group-item">Departamento: {alumno.departamento}</li>
    </>
  );
}

export default AlumnosCardContent;
