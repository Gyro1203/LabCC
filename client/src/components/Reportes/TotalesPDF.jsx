import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

function TotalesPDF({ totales }) {
  //FECHA -> 0: Año; 1: Semestre
  // const date = totales.semestre.split("-");

  console.log("Totales recibidos:", totales);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Esto es para Centrar Texto
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    //Datos Tabla Alumnos
    const tablaInicial = ["Periodo", "Carreras"];
    const datosInicio = [[`2025`, ``]];

    //Datos Tabla Asistencias
    const totalesCol = [
      "Nombre Alumno",
      "Carrera",
      "Semestre",
      "Total UF",
      "Total HH",
    ];
    let totalUF = 0;
    let totalHH = 0;

    const dataTotales = totales
      ? [
          ...Object.values(totales).map((total) => {
            totalUF += parseFloat(total.totalUF) || 0;
            totalHH += parseFloat(total.totalHH) || 0;
            return [
              total.alumno  || "",
              total.carrera || "",
              total.periodo || "",
              total.totalUF || "0.00",
              total.totalHH || "0.00",
            ];
          }),
          [
            {
              content: "Total",
              colSpan: 3,
              styles: { halign: "center", lineWidth: 0.1 },
            },
            {
              content: totalUF.toFixed(2) + " UF",
              colSpan: 1,
              styles: { halign: "center", lineWidth: 0.1 },
            },
            {
              content: totalHH.toFixed(2) + " HH",
              colSpan: 1,
              styles: { halign: "center", lineWidth: 0.1 },
            },
          ],
        ]
      : [
          [
            {
              content: "Sin UF ni HH",
              colSpan: 5,
              styles: { halign: "center" },
            },
          ],
        ];

    // Transponer los datos, manteniendo headers verticales
    const tablaVertical = tablaInicial.map((header, i) => {
      const row = [header]; // Simula el "header vertical"
      datosInicio.forEach((entry) => row.push(entry[i]));
      return row;
    });

    //Encabezado
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE TOTALES UF Y HH EN LABCON", centerX, 20, {
      align: "center",
    });
    doc.addImage("images/LogoLabcon.png", "JPEG", 15, 22, 50, 10);

    //Tabla Alumnos
    autoTable(doc, {
      startY: 35,
      body: tablaVertical,
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

    //Tabla Asistencias
    // Primer Header
    autoTable(doc, {
      startY: doc.lastAutoTableY,
      head: [["USO DE RECURSOS EN LABCON"]],
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
      head: [totalesCol],
      body: dataTotales,
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
    doc.save(`Reporte_Totales_Lab.pdf`);
  };

  return (
    <div className="container d-flex justify-content-center">
      <button
        className="btn btn-success mt-3 mb-3"
        type="button"
        onClick={generarPDF}
      >
        Generar PDF
      </button>
    </div>
  );
}

export default TotalesPDF;
