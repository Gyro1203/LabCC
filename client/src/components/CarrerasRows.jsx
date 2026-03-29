function CarrerasRows({ carreras, editar, eliminar }) {
  return (
    <tr>
      <td>{carreras.carrera}</td>
      <td>{carreras.facultad}</td>
      <td>{carreras.departamento}</td>
      <td>
        {editar}
        {eliminar}
      </td>
    </tr>
  );
}

export default CarrerasRows