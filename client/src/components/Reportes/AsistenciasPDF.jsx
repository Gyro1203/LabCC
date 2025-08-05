import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

function AsistenciasPDF({ alumno, ingreso, asistencias }) {
  console.log("Alumno: ", alumno);
  console.log("Ingreso: ", ingreso);
  console.log("Asistencias: ", asistencias);

  //FECHA -> 0: Año; 1: Semestre
  const date = ingreso.semestre.split("-");

  function formatoFecha(fecha){
    const entrada = new Date(fecha);
    return entrada.toLocaleString("es-CL",{ dateStyle:"medium" });
  }

  const generarPDF = () => {
    const doc = new jsPDF();

    // Esto es para Centrar Texto
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    //Datos Tabla Alumnos
    const alumnosCol = ["Nombre Alumno", "RUT", "Carrera", "Semestre", "Año"];
    const dataAlumnos = [
      [
        `${alumno.nombre}`,
        `${alumno.rut}`,
        `${alumno.carrera}`,
        `${date[1]} Semestre`,
        `${date[0]}`,
      ],
    ];

    //Datos Tabla Ingreso
    const ingresoCol = [
      "Motivo Uso LABCON",
      "Titulo del Proyecto",
      "Profesor Guía",
      "Profesor Asignatura",
    ];
    const dataIngreso = [
      [
        `${ingreso.motivo}`,
        `${ingreso.titulo}`,
        `${ingreso.profesor_guia}`,
        `${ingreso.profesor_asignatura}`,
      ],
    ];

    //Datos Tabla Asistencias
    const asistenciasCol = [
      "Fecha",
      "Actividades y/o Ensayos",
      "Unidad",
      "Cantidad",
      "P Unitario [UF]",
      "Total [UF]",
      "Observaciones",
    ];
    const dataAsistencias = asistencias.map((asis) => [
      formatoFecha(asis.entrada),
      asis.actividad,
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Transponer los datos, manteniendo headers verticales
    const alumnoVerticalHeader = alumnosCol.map((header, i) => {
      const row = [header]; // Simula el "header vertical"
      dataAlumnos.forEach((entry) => row.push(entry[i]));
      return row;
    });

    // Tabla vertical ingreso
    const ingresoVerticalHeader = ingresoCol.map((header, i) => {
      const row = [header]; // Simula el "header vertical"
      dataIngreso.forEach((entry) => row.push(entry[i]));
      return row;
    });

    //Encabezado
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold")
    doc.text("FICHA TRABAJO ALUMNO EN LABCON", centerX, 20, { align: "center" });
    doc.addImage("images/LogoLabcon.png", "JPEG", 15, 22, 50, 10 );

    //Tabla Alumnos
    autoTable(doc, {
      startY: 35,
      body: alumnoVerticalHeader,
      styles: {
        halign: "left",
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        cellPadding: 0.5,
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Reduce el ancho de la primera columna
      },
      didParseCell: function (data) {
        // Resalta la primera celda (esquina superior izquierda)
        if (data.column.index === 0) {
          data.cell.styles.fillColor = [1, 72, 152]; // Azul
          data.cell.styles.textColor = [255, 255, 255]; // Letra blanca para contraste (opcional)
        }
      },
      didDrawPage: function (data) {
        // Guardamos la posición de la tabla para usar como inicio de la siguiente
        doc.lastAutoTableY = data.cursor.y + 5;
      },
    });

    //Tabla Ingreso
    autoTable(doc, {
      startY: doc.lastAutoTableY,
      body: ingresoVerticalHeader,
      styles: {
        halign: "left",
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        cellPadding: 0.5,
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Reduce el ancho de la primera columna
      },
      didParseCell: function (data) {
        // Resalta la primera celda (esquina superior izquierda)
        if (data.column.index === 0) {
          data.cell.styles.fillColor = [1, 72, 152]; // Azul
          data.cell.styles.textColor = [255, 255, 255]; // Letra blanca para contraste (opcional)
        }
      },
      didDrawPage: function (data) {
        doc.lastAutoTableY = data.cursor.y + 5;
      },
    });

    //Tabla Asistencias
    // Primer Header
    autoTable(doc, {
      startY: doc.lastAutoTableY,
      head: [["USO DE RECURSOS Y/O ENSAYOS LABCON"]],
      styles: {
        halign: "center",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        cellPadding: 0.5,
      },
      headStyles: {
        fillColor: [1, 72, 152],
        textColor: [255, 255, 255],
      },
      didDrawPage: function (data) {
        doc.lastAutoTableY = data.cursor.y;
      },
    }); //El resto de la tabla
    autoTable(doc, {
      startY: doc.lastAutoTableY,
      head: [asistenciasCol],
      body: dataAsistencias,
      styles: {
        halign: "center",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        cellPadding: 0.5,
      },
      headStyles: {
        fillColor: [1, 72, 152],
        textColor: [255, 255, 255],
      },
    });

    //Guardar PDF con un nombre especifico
    doc.save("TEST.pdf");
  };

  return (
    <div className="container d-flex justify-content-center">
      <button className="btn btn-success mt-3 mb-3" type="button" onClick={generarPDF}>
        Generar PDF
      </button>
    </div>
  );
}

export default AsistenciasPDF