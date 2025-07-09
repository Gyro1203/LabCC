import Home from "./pages/Home.jsx";
import RegistAlumnos from "./pages/RegistAlumnos.jsx";
import RegistEnsayos from "./pages/RegistEnsayos.jsx";
import RegistIngresos from "./pages/RegistIngresos.jsx";
import RegistActividades from "./pages/RegistActividades.jsx";
import RegistAsistencias from "./pages/RegistAsistencias.jsx";
import Alumnos from "./pages/Alumnos.jsx";
import Ensayos from "./pages/Ensayos.jsx";
import Ingresos from "./pages/Ingresos.jsx";
import Actividades from "./pages/Actividades.jsx";
import Asistencias from "./pages/Asistencias.jsx"; //Cambiar
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import IngresoDetalles from "./pages/IngresoDetalles.jsx";
import AlumnoDetalles from "./pages/AlumnoDetalles.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/students" element={<Alumnos />} />
        <Route path="/students/register" element={<RegistAlumnos />} />
        <Route path="/students/edit/:id" element={<RegistAlumnos />} />
        <Route path="/students/details/:id" element={<AlumnoDetalles />} />

        <Route path="/essay" element={<Ensayos />} />
        <Route path="/essay/register" element={<RegistEnsayos />} />
        <Route path="/essay/edit/:id" element={<RegistEnsayos />} />

        <Route path="/entry" element={<Ingresos />} />
        <Route path="/entry/register" element={<RegistIngresos />} />
        <Route path="/entry/edit/:id" element={<RegistIngresos />} />
        <Route path="/entry/details/:id" element={<IngresoDetalles />} />

        <Route path="/activity" element={<Actividades />} />
        <Route path="/activity/register" element={<RegistActividades />} />
        <Route path="/activity/edit/:id" element={<RegistActividades />} />

        <Route path="/attendance" element={<Asistencias />} />
        <Route path="/attendance/register" element={<RegistAsistencias />} />
        <Route path="/attendance/edit/:id" element={<RegistAsistencias />} />
      </Routes>
    </>
  );
}
