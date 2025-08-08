function UsuariosRows({ usuario, editar, eliminar }) {

  return (
    <tr>
      <td >
        {usuario.nombre_usuario}
      </td>
      <td>{usuario.rol}</td>
      <td>{usuario.email}</td>
      <td>
        <div className="btn-group" role="group" aria-label="Option Buttons">
          {editar} {eliminar}
        </div>
      </td>
    </tr>
  );
}

export default UsuariosRows;
