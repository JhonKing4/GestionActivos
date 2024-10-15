import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const MyDocument: React.FC = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Mi primer PDF con React PDF</Text>
        <Text style={styles.subtitle}>Introducción</Text>
        <Text style={styles.text}>
          Este es un ejemplo básico de cómo crear un PDF utilizando
          @react-pdf/renderer.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Contenido</Text>
        <Text style={styles.text}>
          Puedes agregar textos, imágenes, tablas y otros elementos con la
          flexibilidad que brinda esta librería.
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
