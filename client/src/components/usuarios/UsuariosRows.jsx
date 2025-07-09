// import { useNavigate } from "react-router-dom";

function UsuariosRows({ usuario, editar, eliminar }) {
//   const navigate = useNavigate();
  return (
    <tr>
      <td
        // className="table-cell-hover"
        // onClick={() => {
        //   navigate(`/users/details/${usuario.id_usuario}`);
        // }}
      >
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
