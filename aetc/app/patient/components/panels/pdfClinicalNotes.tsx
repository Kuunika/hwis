import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
interface Child {
  item: string | { [key: string]: string } | null | undefined;
  children?: Child | Child[] | null | undefined;
}

export interface ClinicalNotesDataType {
  heading?: string | null;
  children?: Child | Child[] | null | undefined;
}

// Styles
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  columnContainer: { display: "flex", flexDirection: "row", gap: 12 },
  column: { flex: 1 },
  sectionGroup: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, marginBottom: 6 },
  item: { marginBottom: 4 },
  title: { fontSize: 18, marginBottom: 12 },
});

// Helper to render children recursively and normalize single objects
const RenderChildrenPDF: React.FC<{
  children?: Child | Child[] | null;
  level?: number;
}> = ({ children = [], level = 1 }) => {
  const normalizedChildren: Child[] = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  if (normalizedChildren.length === 0) return null;

  return (
    <View style={{ paddingLeft: level * 8 }}>
      {normalizedChildren.map((child, idx) => {
        const itemText = !child?.item
          ? ""
          : typeof child.item === "string"
            ? child.item
            : Object.entries(child.item)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");

        return (
          <View key={idx} style={styles.item}>
            {itemText && <Text>- {itemText}</Text>}
            {child?.children && (
              <RenderChildrenPDF children={child.children} level={level + 1} />
            )}
          </View>
        );
      })}
    </View>
  );
};

// Props for MultiColumnNotesPDF
interface MultiColumnNotesPDFProps {
  data?: Array<{
    title: string;
    content: ClinicalNotesDataType[] | null;
  }>;
  columns?: number; // default 2
}

// Main PDF Document
export const MultiColumnNotesPDF: React.FC<MultiColumnNotesPDFProps> = ({
  data = [],
  columns = 2,
}) => {
  if (!data || data.length === 0) return null;

  // Split data evenly across columns
  const columnData: {
    title: string;
    content: ClinicalNotesDataType[] | null;
  }[][] = Array.from({ length: columns }, () => []);

  data.forEach((item, index) => {
    const colIdx = index % columns;
    columnData[colIdx].push(item);
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Clinical Notes</Text>

        <View style={styles.columnContainer}>
          {columnData.map((col, colIdx) => (
            <View key={colIdx} style={styles.column}>
              {col.map((sectionGroup, idx) => (
                <View key={idx} style={styles.sectionGroup}>
                  <Text style={styles.sectionTitle}>{sectionGroup.title}</Text>
                  {sectionGroup.content?.map((section, sIdx) => (
                    <View key={sIdx} style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        - {section.heading || "Untitled Section"}
                      </Text>
                      <RenderChildrenPDF children={section.children} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

// Download link component
export const DownloadClinicalNotesPDF: React.FC<{
  data: MultiColumnNotesPDFProps["data"];
}> = ({ data }) => (
  <PDFDownloadLink
    document={<MultiColumnNotesPDF data={data} columns={2} />}
    fileName="clinical_notes.pdf"
  >
    {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
  </PDFDownloadLink>
);
