import { useEffect, useState } from "react";
import { getActividadesRequest } from "../../services/actividades.api.js";
import { getAsistenciasRequest } from "../../services/asistencias.api.js";
import { getCarrerasRequest } from "../../services/carreras.api";
import TotalesPDF from "./TotalesPDF.jsx";

function ReporteTotales() {
  const [carreras, setCarreras] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [totales, setTotales] = useState({});

  const [carreraFiltro, setCarreraFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoFiltroAño, setTipoFiltroAño] = useState("todos");

  useEffect(() => {
    async function fetchData() {
      const dataCarreras = await getCarrerasRequest();
      setCarreras(dataCarreras.data);
      const dataActividades = await getActividadesRequest();
      setActividades(dataActividades.data);
      const dataAsistencias = await getAsistenciasRequest();
      setAsistencias(dataAsistencias.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (actividades.length > 0 && asistencias.length > 0) {
      calcularTotales();
    }
    // eslint-disable-next-line
  }, [
    actividades,
    asistencias,
    carreraFiltro,
    fechaInicio,
    fechaFin,
    tipoFiltroAño,
  ]);

  function calcularTotales() {
    const totalesObj = {};

    // Acumular UF y datos de alumno/periodo
    actividades.forEach((actividad) => {
      if (!actividad || !actividad.id_alumno) return;
      if (!totalesObj[actividad.id_alumno]) {
        totalesObj[actividad.id_alumno] = {
          alumno: actividad.alumno || "",
          periodo: actividad.periodo || "",
          carrera: "",
          totalUF: 0,
          totalHH: 0,
        };
      }
      totalesObj[actividad.id_alumno].totalUF +=
        parseFloat(actividad.total_uf) || 0;
    });
    console.log(asistencias);

    // Acumular HH y carrera
    asistencias.forEach((asistencia) => {
      if (!asistencia || !asistencia.id_alumno) return;
      if (asistencia.salida) {
        const [hEntrada, mEntrada] = asistencia.entrada.split(":").map(Number);
        const [hSalida, mSalida] = asistencia.salida.split(":").map(Number);

        const fechaBase = new Date();
        const dateEntrada = new Date(fechaBase);
        dateEntrada.setHours(hEntrada, mEntrada, 0);
        const dateSalida = new Date(fechaBase);
        dateSalida.setHours(hSalida, mSalida, 0);

        if (dateEntrada > dateSalida) return;
        /* Si la salida es mejor (hora) a la entrada, la salida se marco al día siguiente
        lo que generaría un error de calculo pero resultado negativo*/

        const diffMs = dateSalida - dateEntrada;
        const diffMin = Math.floor(diffMs / 60000);
        const horas = diffMin / 60; // horas con decimales

        if (!totalesObj[asistencia.id_alumno]) {
          totalesObj[asistencia.id_alumno] = {
            alumno: asistencia.alumno || "",
            periodo: asistencia.periodo || "",
            carrera: asistencia.carrera || "",
            totalUF: 0,
            totalHH: 0,
          };
        }
        totalesObj[asistencia.id_alumno].carrera = asistencia.carrera || "";
        totalesObj[asistencia.id_alumno].totalHH += horas;
      }
    });

    // Formatear los totales
    Object.values(totalesObj).forEach((t) => {
      t.totalUF = t.totalUF.toFixed(2);
      t.totalHH = t.totalHH.toFixed(2);
    });

    const totalesArray = Object.values(totalesObj);

    // Filtro de año según tipo
    const filtrados = totalesArray.filter((t) => {
      const cumpleCarrera = !carreraFiltro || t.carrera === carreraFiltro;
      const añoPeriodo = parseInt(t.periodo.split("-")[0]);
      let cumpleFecha = true;

      if (tipoFiltroAño === "especifico") {
        cumpleFecha = fechaInicio && añoPeriodo === parseInt(fechaInicio);
      } else if (tipoFiltroAño === "rango") {
        if (fechaInicio && fechaFin) {
          const inicio = Math.min(parseInt(fechaInicio), parseInt(fechaFin));
          const fin = Math.max(parseInt(fechaInicio), parseInt(fechaFin));
          cumpleFecha = añoPeriodo >= inicio && añoPeriodo <= fin;
        }
      }
      // "todos" muestra todo, así que cumpleFecha queda true
      return cumpleCarrera && cumpleFecha;
    });

    setTotales(filtrados);
  }

  return (
    <div>
      <h2>Reporte de Totales</h2>
      <div className="form-group mb-3">
        <label htmlFor="alumno_carrera" className="form-label">
          Carreras
        </label>
        <select
          name="alumno_carrera"
          className="form-select"
          onChange={(e) => setCarreraFiltro(e.target.value)}
          value={carreraFiltro}
        >
          <option value="">Todas las carreras</option>
          {carreras.map((carrera) => (
            <option key={carrera.id_carrera} value={carrera.carrera}>
              {carrera.carrera}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Filtrar por año</label>
        <select
          value={tipoFiltroAño}
          onChange={(e) => {
            setTipoFiltroAño(e.target.value);
            setFechaInicio("");
            setFechaFin("");
          }}
          className="form-select mb-2"
        >
          <option value="cualquiera">Cualquier año</option>
          <option value="especifico">Año específico</option>
          <option value="rango">Rango de años</option>
        </select>

        <div className="row p-2 justify-content-center">
          {tipoFiltroAño === "especifico" && (
            <input
              className="col"
              type="number"
              min="1900"
              max="2100"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              placeholder="Año"
              maxLength={4}
              style={{ maxWidth: "150px" }}
            />
          )}

          {tipoFiltroAño === "rango" && (
            <>
              <input
                className="col mx-4"
                type="number"
                min="1900"
                max="2100"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                placeholder="Año inicio"
                maxLength={4}
              />
              <input
                className="col mx-4"
                type="number"
                min="1900"
                max="2100"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                placeholder="Año fin"
                maxLength={4}
              />
              <small className="form-text text-muted">
                Dejar estos valores en blanco mostrará todos los años.
              </small>
            </>
          )}
        </div>
      </div>
      {totales && (
        <TotalesPDF 
          totales={totales} 
          carreras={carreraFiltro || "Todas"} 
          periodo={
            tipoFiltroAño === "rango" 
              ? `${fechaInicio} - ${fechaFin}` 
              : tipoFiltroAño === "especifico"
                ? [fechaInicio]
                : "Cualquiera"
          } 
        />
      )}
    </div>
  );
}

export default ReporteTotales;
