import { useNavigate } from "react-router-dom";

function IngresosRows({ ingreso, editar, eliminar, registrar }) {
  const navigate = useNavigate();
  return (
    <tr>
      <td
        className="table-cell-hover"
        onClick={() => {
          navigate(`/entry/details/${ingreso.id_ingreso}`);
        }}
      >
        {ingreso.nombre}
      </td>
      <td>{ingreso.rut}</td>
      <td>{ingreso.motivo}</td>
      <td>{ingreso.titulo}</td>
      <td>{ingreso.profesor_guia}</td>
      <td>{ingreso.profesor_asignatura}</td>
      <td>{ingreso.semestre}</td>
      <td>{ingreso.vigente ? "✅" : "❌"}</td>
      <td style={{ width: "150px" }}>
        <div className="btn-group" role="group" aria-label="Option Buttons">
          {editar} {eliminar} {registrar}
        </div>
      </td>
    </tr>
  );
}

export default IngresosRows;
