import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import {
  deleteAlumnosRequest,
  getAlumnosRequest,
} from "../services/alumnos.api";
import AlumnosDetailCard from "../components/Alumnos/AlumnosDetailCard.jsx";
import { getIngresoByAlumnoRequest } from "../services/ingresos.api";
import {
  deleteDataAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../helpers/sweetAlert.js";

function AlumnosResumen() {
  const navigate = useNavigate();

  const [alumnos, setAlumnos] = useState([]);
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataAlumnos = await getAlumnosRequest();
      setAlumnos(dataAlumnos.data);
    }
    fetchData();
  }, []);

  function GetEntries(id) {
    const fetchEntries = async () => {
      try {
        const dataIngresos = await getIngresoByAlumnoRequest(id);
        setIngresos((prevData) => ({
          ...prevData, //Carga los datos anteriores del objeto para mantenerlos
          [id]:
            dataIngresos.data && dataIngresos.data.length > 0 // actualiza los datos del objeto con ese id
              ? dataIngresos.data
              : [],
        }));
      } catch (error) {
        console.error("Error al obtener el ingreso:", error);
        setIngresos((prevData) => ({ ...prevData, [id]: [] })); // En caso de error el contenido es vacio.
      }
    };
    fetchEntries();
  }

  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if (confirmation.isConfirmed) {
        const response = await deleteAlumnosRequest(id);
        console.log("Alumno eliminado exitosamente:", response.data);
        showSuccessAlert("Alumno eliminado exitosamente");
        setAlumnos(alumnos.filter((a) => a.id_alumno !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar alumno");
      console.error("Error al eliminar alumno:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <Tab.Container id="AlumnosTabContainer" defaultActiveKey="first">
        <div className="d-flex justify-content-center mb-3">
          <Button onClick={() => navigate(`/students/register`)}>
            Registrar Alumno
          </Button>
        </div>
        <Row className="justify-content-md-center">
          <Col sm={3}>
            <Nav variant="pills" className="flex-column text-center ">
              {alumnos.map((alumno, index) => (
                <Nav.Item key={`NavKey-${index}`} className="">
                  <Nav.Link
                    eventKey={`key-${alumno.id_alumno}`}
                    onClick={() => GetEntries(alumno.id_alumno)}
                    className="bg-dark mb-1"
                  >
                    {alumno.nombre}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col sm={6}>
            <Tab.Content>
              {alumnos.map((alumno, index) => (
                <Tab.Pane
                  key={`TabKey-${index}`}
                  eventKey={`key-${alumno.id_alumno}`}
                  unmountOnExit
                >
                  <div className="card">
                    <AlumnosDetailCard
                      key={alumno.id_alumno}
                      alumno={alumno}
                      ingresos={ingresos}
                      eliminar={
                        <button
                          className="btn btn-danger"
                          title="Eliminar"
                          onClick={() => handleDelete(alumno.id_alumno)}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <i className="fa-solid fa-trash-can d-flex justify-content-center"></i>
                        </button>
                      }
                      editar={
                        <button
                          className="btn btn-primary"
                          title="Editar"
                          onClick={() => navigate(`/students/edit/${alumno.id_alumno}`)}
                          style={{ width: "30px", height: "30px" }}
                        >
                          <i className="fa-solid fa-pencil d-flex justify-content-center"></i>
                        </button>
                      }
                    />
                  </div>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default AlumnosResumen;
