import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  BlobProvider,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logoImage from "../../assets/images/majestic-resorts-logo.jpg";
import { Download } from "lucide-react";
import "../../styles/inventario.css"

interface AssignmentData {
  idAsignacion: string;
  assignmentDate: string;
  returnDate: string;
  observation: string;
  statusAsig: number;
  material: {
    idMaterial: string;
    name: string;
    model: string;
    serial_number: string;
  }[];
  usuario: {
    idUsuario: string;
    name: string;
    email: string;
    numberColaborador: string;
    companyname: string;
  };
  departamento: {
    idDepartamento: string;
    name: string;
  };
  hotel: {
    idHotel: string;
    name: string;
  };
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
  },
  logo: {
    width: 150,
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
  section: {
    margin: 10,
  },
  text: {
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  signature: {
    marginTop: 50,
    borderTop: "1 solid black",
    paddingTop: 10,
    width: 200,
    alignSelf: "center",
  },
});

const PDFDocument: React.FC<{ data: AssignmentData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={logoImage} />
        <Text
          style={[styles.text, { alignSelf: "flex-end" }]}
        >{`Isla Blanca, Q. Roo ${format(
          new Date(data.assignmentDate),
          "d 'de' MMMM 'de' yyyy",
          { locale: es }
        )}`}</Text>
      </View>

      <Text style={styles.title}>Responsiva de Equipo</Text>

      <Text>Departamento de IT, Majestic-resorts</Text>

      <View style={styles.section}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{data.usuario.name}</Text>, de col:{" "}
          {data.usuario.numberColaborador} en mi calidad de empleado de la
          empresa <Text style={styles.boldText}>{data.usuario.companyname},</Text>{" "}
          reconozco haber recibido los siguientes equipos de la empresa en
          perfectas condiciones, los cuales se detallan a continuación:
        </Text>

        {data.material.map((item, index) => (
          <Text key={index} style={styles.text}>
            {`${item.name} (Modelo: ${item.model}, Serie: ${item.serial_number})`}
          </Text>
        ))}

        <Text style={styles.text}>
          Declaro que he recibido el/los equipo(s) en buen estado y me
          comprometo a utilizarlo(s) de manera responsable y exclusivamente para
          actividades relacionadas con mis funciones. Además, entiendo que son
          propiedad de la empresa y que debo devolverlo(s) en las mismas
          condiciones en las que lo(s) recibí al finalizar mi empleo o cuando se
          me solicite por parte de la empresa.
        </Text>

        <Text style={styles.text}>
          Asumo toda la responsabilidad por el cuidado y uso adecuado durante el
          período en que esté(n) bajo mi custodia. En caso de pérdida, robo o
          daño, debido a negligencia o mal uso por mi parte, me comprometo a
          reemplazarlo(s) o a cubrir los costos de reparación, de una suma de
          $__________ MX. + IVA por cada equipo.
        </Text>

        <Text style={styles.text}>
          Asimismo, me comprometo a informar de inmediato a mi supervisor o jefe
          inmediato en caso de cualquier incidente relacionado con el/los
          equipo(s), como pérdida, robo o daño.
        </Text>

        <Text style={styles.text}>
          {`Fecha de devolución: ${format(
            new Date(data.returnDate),
            "d 'de' MMMM 'de' yyyy",
            { locale: es }
          )}`}
        </Text>

        <Text style={styles.text}>{`Observaciones: ${data.observation}`}</Text>
      </View>

      <Text style={[styles.text, { alignSelf: "center" }]}>Atentamente</Text>

      <Text style={[styles.text, { alignSelf: "center" }]}>
        Departamento de IT
      </Text>

      <View style={styles.signature}>
        <Text>Nombre y Firma de quien Recibe</Text>
      </View>
    </Page>
  </Document>
);

const PDFDownloadButton: React.FC<{ assignmentId: string }> = ({
  assignmentId,
}) => {
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  const fetchAssignmentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AssignmentData>(
        `http://localhost:3001/asignacion/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignmentData(response.data);
    } catch (err) {
      setError("Error al obtener los datos de la asignación");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  if (error) return <button disabled>Error: {error}</button>;
  if (loading) return <button disabled>Cargando datos...</button>;
  if (!assignmentData) return <button disabled>No hay datos</button>;

  return (
    <div id="unique-pdf-button">
      <BlobProvider document={<PDFDocument data={assignmentData} />}>
        {({ blob, url, loading: pdfLoading, error: pdfError }) => {
          if (pdfLoading) {
            return <button disabled>Generando PDF...</button>;
          }
          if (pdfError) {
            return <button disabled>Error al generar PDF</button>;
          }
          return (
            <button
              onClick={() => {
                if (blob) {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `responsiva_${assignmentId}.pdf`;
                  link.click();
                }
              }}
            >
              <Download size={18} />
              Descargar
            </button>
          );
        }}
      </BlobProvider>
    </div>
  );
};

export { PDFDownloadButton };
