import {
  getUsuariosRequest,
  //   getUsuarioByIdRequest,
  //   createUsuariosRequest,
  //   updateUsuariosRequest,
  deleteUsuariosRequest,
} from "../services/usuarios.api.js";
import useEdit from "../hooks/usuarios/useEdit.jsx";
import { useEffect, useState } from "react";
import UsuariosRows from "../components/usuarios/UsuariosRows.jsx";
import Filter from "../components/Filter.jsx";
// import { useNavigate } from "react-router-dom";
import Caret from "../components/Caret.jsx";
import { deleteDataAlert, showSuccessAlert, showErrorAlert } from "../helpers/sweetAlert.js";
import Popup from "../components/usuarios/PopupUsuarios.jsx";
import PopupCreate from "../components/usuarios/PopupCreateUsuarios.jsx";
import useCreate from "../hooks/usuarios/useCreate.jsx";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sort, setSort] = useState({
    keyToSort: "nombre_usuario",
    direction: "asc",
  });
  const nonSortableKeys = ["opciones"];

  const camposFiltro = ["nombre_usuario", "rol", "email"];
  const usuariosFiltrados = Filter(usuarios, filterText, camposFiltro);

  const headers = [
    { id: 1, key: "nombre_usuario", label: "Nombre de Usuario" },
    { id: 2, key: "rol", label: "Rol" },
    { id: 3, key: "email", label: "Email" },
    { id: 4, key: "opciones", label: "Opciones" },
  ];



  // hooks
  useEffect(() => {
    async function loadUsuarios() {
      const response = await getUsuariosRequest();
      setUsuarios(response.data);
    }
    loadUsuarios();
  }, []);

 // llama al hook de editar
    const {isPopupOpen,
    setIsPopupOpen,
    dataUser,
    handleClickUpdate,
    handleUpdate,} = useEdit(setUsuarios);
  // llama al hook de crear

    const {
       isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataCreateUser,
        handleClickCreate,
        handleCreate,
    } = useCreate(setUsuarios);

  
  // handlers
  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if (confirmation.isConfirmed) {
        const response = await deleteUsuariosRequest(id);
        console.log("Usuario eliminado exitosamente:", response.data);
        showSuccessAlert("Usuario eliminado exitosamente");
        setUsuarios(usuarios.filter((u) => u.id_usuario !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar el usuario");
      console.error("Error al eliminar usuario:", error);
    }
  };

  function handleHeaderClick(header) {
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  }

  function getSortedArray(arrayToSort) {
    if (nonSortableKeys.includes(sort.keyToSort)) {
      return arrayToSort;
    }
    return arrayToSort.slice().sort((a, b) => {
      const aValue = a[sort.keyToSort] ?? "";
      const bValue = b[sort.keyToSort] ?? "";
      if (aValue === bValue) return 0;
      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

 function renderUsuarios() {

    if (usuarios.length === 0) {
      return (
        <>
          <p>No hay usuarios registrados</p>
          {/* <button onClick={() => navigate(`/students/register`)}>Registrar Alumno</button> */}
        </>
      );
    }


 return (
   <div className="container text-center mt-4 mb-5">
     <button onClick={handleClickCreate}>Registrar Alumno</button>
     <div className="d-flex justify-content-end mt-4">
       <div className="input-group" style={{ maxWidth: "300px" }}>
         <input
           id="input-search"
           type="search"
           onChange={(e) => setFilterText(e.target.value)}
           className="form-control"
           placeholder="Buscar"
           style={{ maxWidth: "200px" }}
         />
       </div>
     </div>
     <table className="table table-striped table-hover table-bordered mt-4">
       <thead>
         <tr>
           {headers.map((header) => (
             <th
               key={header.id}
               onClick={
                 !nonSortableKeys.includes(header.key)
                   ? () => handleHeaderClick(header)
                   : undefined
               }
               style={{
                 ...(nonSortableKeys.includes(header.key)
                   ? { cursor: "default" }
                   : { cursor: "pointer" }),
                 userSelect: "none",
               }}
             >
               <span>{header.label}</span>
               {!nonSortableKeys.includes(header.key) &&
                 header.key === sort.keyToSort && (
                   <span className="float-end">
                     <Caret
                       direction={
                         header.key === sort.keyToSort ? sort.direction : "asc"
                       }
                     />
                   </span>
                 )}
             </th>
           ))}
         </tr>
       </thead>
       <tbody>
         {getSortedArray(usuariosFiltrados).map((usuario) => (
           <UsuariosRows
             key={usuario.id_usuario}
             usuario={usuario}
             eliminar={
               <button
                 className="btn btn-danger"
                 title="Eliminar"
                 onClick={() => handleDelete(usuario.id_usuario)}
               >
                 <i className="fa-solid fa-trash-can"></i>
               </button>
             }
             editar={
               <button
                 className="btn btn-primary"
                 title="Editar"
                 onClick={() => handleClickUpdate(usuario)}
               >
                 <i className="fa-solid fa-pencil"></i>
               </button>
             }
           />
         ))}
       </tbody>
     </table>
     <Popup
       show={isPopupOpen}
       setShow={setIsPopupOpen}
       data={dataUser}
       action={handleUpdate}
     />
     <PopupCreate
       show={isCreatePopupOpen}
       setShow={setIsCreatePopupOpen}
       data={dataCreateUser}
       action={handleCreate}
      />
   </div>
 );
};

return (
    <div>
      <h1>Lista de Usuarios</h1>
      {renderUsuarios()}
    </div>
  );

}
export default Usuarios;
