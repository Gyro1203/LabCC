import {
  getUsuariosRequest,
//   getUsuarioByIdRequest,
//   createUsuariosRequest,
//   updateUsuariosRequest,
//   deleteUsuariosRequest,
} from "../services/usuarios.api.js";
import { useEffect, useState } from "react";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function loadUsuarios() {
      const response = await getUsuariosRequest();
      setUsuarios(response.data);
    }
    loadUsuarios();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Usuarios</h1>
      <div className="row">
         {usuarios.map((usuario) => (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={usuario.id_usuario}>
            <div className="card border-primary h-100">
              <div className="card-header" style={{ backgroundColor: "#007bff", color: "white" }}>
                {usuario.rol}
              </div>
              <div className="card-body">
                <h5 className="card-title">{usuario.nombre_usuario}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {usuario.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Usuarios;
