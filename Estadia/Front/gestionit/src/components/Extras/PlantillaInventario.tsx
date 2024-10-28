import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  BlobProvider,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logoImage from "../../assets/images/majestic-resorts-logo.jpg";
import "../../styles/inventario.css";
import { FileDown } from "lucide-react";

interface MaterialData {
  idMaterial: string;
  name: string;
  model: string;
  serial_number: string;
  stock: number;
  expiration_date: string;
  purchase_date: string;
  description: string;
  elementsType?: number;
  status?: number;
  materialtype?: number;
  hotel: {
    idHotel: string;
    name: string;
  };
  proveedor: {
    idProveedor: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    rfc: string;
  };
  departamento: {
    idDepartamento: string;
    name: string;
    description: string;
  };
}

interface AsignacionData {
  idAsignacion: string;
  assignmentDate: string;
  returnDate: string;
  observation: string;
  statusAsig: number;
  material: MaterialData[];
  usuario: {
    idUsuario: string;
    name: string;
    numberColaborador: string;
    email: string;
    roles: number;
  };
  departamento: {
    idDepartamento: string;
    name: string;
    description: string;
  };
  hotel: {
    idHotel: string;
    name: string;
  };
}

interface MaterialCompleto extends MaterialData {
  asignacion?: {
    fechaAsignacion: string;
    nombreColaborador: string;
    numeroColaborador: string;
    departamentoAsignado: string;
  };
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    padding: 30,
  },
  logo: {
    width: 100,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: "auto",
    margin: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    alignItems: "center",
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 4,
    fontSize: 8,
  },
  cell1: { width: "8%" },
  cell2: { width: "8%" },
  cell3: { width: "8%" },
  cell4: { width: "4%" },
  cell5: { width: "8%" },
  cell6: { width: "8%" },
  cell7: { width: "6%" },
  cell8: { width: "6%" },
  cell9: { width: "8%" },
  cell10: { width: "8%" },
  cell11: { width: "6%" },
  cell12: { width: "4%" },
  cell13: { width: "6%" },
  cell14: { width: "6%" },
  cell15: { width: "6%" },
});

const getElementsTypeText = (type?: number) => {
  switch (type) {
    case 0:
      return "Software";
    case 1:
      return "Hardware ";
    default:
      return "N/A";
  }
};

const getStatusText = (status?: number) => {
  switch (status) {
    case 0:
      return "Inactivo";
    case 1:
      return "Activo";
    default:
      return "N/A";
  }
};

const PDFDocument: React.FC<{ data: MaterialCompleto[] }> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={logoImage} />
        <Text>{`Isla Blanca, Q. Roo ${format(
          new Date(),
          "d 'de' MMMM 'de' yyyy",
          { locale: es }
        )}`}</Text>
      </View>

      <Text style={styles.title}>Inventario de Materiales</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.cell1]}>Nombre</Text>
          <Text style={[styles.tableCell, styles.cell2]}>Modelo</Text>
          <Text style={[styles.tableCell, styles.cell3]}>No. Serie</Text>
          <Text style={[styles.tableCell, styles.cell4]}>Stock</Text>
          <Text style={[styles.tableCell, styles.cell5]}>Fecha Exp.</Text>
          <Text style={[styles.tableCell, styles.cell6]}>Fecha Compra</Text>
          <Text style={[styles.tableCell, styles.cell7]}>Tipo</Text>
          <Text style={[styles.tableCell, styles.cell8]}>Status</Text>
          <Text style={[styles.tableCell, styles.cell9]}>Hotel</Text>
          <Text style={[styles.tableCell, styles.cell10]}>Proveedor</Text>
          <Text style={[styles.tableCell, styles.cell11]}>Depto.</Text>
          <Text style={[styles.tableCell, styles.cell12]}>Asig.</Text>
          <Text style={[styles.tableCell, styles.cell13]}>Colaborador</Text>
          <Text style={[styles.tableCell, styles.cell14]}>No.Col</Text>
          <Text style={[styles.tableCell, styles.cell15]}>F.Asig</Text>
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cell1]}>{item.name}</Text>
            <Text style={[styles.tableCell, styles.cell2]}>{item.model}</Text>
            <Text style={[styles.tableCell, styles.cell3]}>
              {item.serial_number}
            </Text>
            <Text style={[styles.tableCell, styles.cell4]}>{item.stock}</Text>
            <Text style={[styles.tableCell, styles.cell5]}>
              {format(new Date(item.expiration_date), "dd/MM/yyyy")}
            </Text>
            <Text style={[styles.tableCell, styles.cell6]}>
              {format(new Date(item.purchase_date), "dd/MM/yyyy")}
            </Text>
            <Text style={[styles.tableCell, styles.cell7]}>
              {getElementsTypeText(item.elementsType)}
            </Text>
            <Text style={[styles.tableCell, styles.cell8]}>
              {getStatusText(item.status)}
            </Text>
            <Text style={[styles.tableCell, styles.cell9]}>
              {item.hotel.name}
            </Text>
            <Text style={[styles.tableCell, styles.cell10]}>
              {item.proveedor.name}
            </Text>
            <Text style={[styles.tableCell, styles.cell11]}>
              {item.departamento.name}
            </Text>
            <Text style={[styles.tableCell, styles.cell12]}>
              {item.asignacion ? "Sí" : "No"}
            </Text>
            <Text style={[styles.tableCell, styles.cell13]}>
              {item.asignacion?.nombreColaborador || "-"}
            </Text>
            <Text style={[styles.tableCell, styles.cell14]}>
              {item.asignacion?.numeroColaborador || "-"}
            </Text>
            <Text style={[styles.tableCell, styles.cell15]}>
              {item.asignacion?.fechaAsignacion
                ? format(
                    new Date(item.asignacion.fechaAsignacion),
                    "dd/MM/yyyy"
                  )
                : "-"}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const PDFDownloadButton: React.FC = () => {
  const [materialesCompletos, setMaterialesCompletos] = useState<
    MaterialCompleto[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [materialesRes, asignacionesRes] = await Promise.all([
        axios.get<MaterialData[]>(`${process.env.REACT_APP_API_URL}/material`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<AsignacionData[]>(`${process.env.REACT_APP_API_URL}/asignacion`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const asignacionesPorMaterial = new Map();
      asignacionesRes.data.forEach((asignacion) => {
        asignacion.material.forEach((mat) => {
          asignacionesPorMaterial.set(mat.idMaterial, {
            fechaAsignacion: asignacion.assignmentDate,
            nombreColaborador: asignacion.usuario.name,
            numeroColaborador: asignacion.usuario.numberColaborador,
            departamentoAsignado: asignacion.departamento.name,
          });
        });
      });

      const materialesConAsignacion = materialesRes.data.map((material) => ({
        ...material,
        asignacion: asignacionesPorMaterial.get(material.idMaterial),
      }));

      setMaterialesCompletos(materialesConAsignacion);
    } catch (err) {
      setError("Error al obtener los datos de inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <button disabled>Error: {error}</button>;
  if (loading) return <button disabled>Cargando datos...</button>;
  if (!materialesCompletos) return <button disabled>No hay datos</button>;

  return (
    <div className="pdf-download-container">
      <BlobProvider document={<PDFDocument data={materialesCompletos} />}>
        {({ blob, url, loading: pdfLoading, error: pdfError }) => {
          if (pdfLoading)
            return (
              <button id="pdf-loading-btn" disabled>
                Generando PDF...
              </button>
            );
          if (pdfError)
            return (
              <button id="pdf-error-btn" disabled>
                Error al generar PDF
              </button>
            );
          return (
            <button
              id="pdf-download-btn"
              onClick={() => {
                if (blob) {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `inventario_materiales.pdf`;
                  link.click();
                }
              }}
            >
              <FileDown size={18} />
              Descargar PDF
            </button>
          );
        }}
      </BlobProvider>
    </div>
  );
};

export { PDFDownloadButton };
