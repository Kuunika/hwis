import { Obs } from "@/interfaces";

type LabTest = { name: string; result: string };
type LabOrder = { specimen: { name: string }; tests: LabTest[] };

export function generatePatientSummaryZPL({
    presentingComplaints,
    diagnosis,
    labOrders,
  }: {
    presentingComplaints: Obs[];
    diagnosis: Obs[];
    labOrders: LabOrder[];
  }): string {
    // Constants
    const MAX_LINES_PER_LABEL = 8; // Small to demonstrate multi-label behavior
    const LINE_HEIGHT = 30;
    const HEADER_HEIGHT = 40;
  
    // Define sections with their content
    const sections = [
      {
        title: "Patient Summary",
        lines: ["Patient Summary"]
      },
      {
        title: "Presenting Complaints",
        lines: [
          "Presenting Complaints:",
          ...(presentingComplaints.length > 0 
            ? presentingComplaints.map(o => `- ${o.value}`)
            : ["- None"])
        ]
      },
      {
        title: "Diagnosis",
        lines: [
          "Final Diagnosis:",
          ...(diagnosis.length > 0 
            ? diagnosis.map(o => `- ${o.value}`)
            : ["- None"])
        ]
      },
      {
        title: "Investigations",
        lines: [
          "Investigations:",
          "Specimen     Test       Result",
          ...(labOrders.length > 0 
            ? labOrders.flatMap(order => 
                order.tests.map(test => {
                  const specimen = (order.specimen?.name || "").padEnd(12, " ");
                  const testName = (test.name || "").padEnd(10, " ");
                  return `${specimen}${testName}${test.result || ""}`;
                })
              )
            : ["- No investigations ordered"])
        ]
      }
    ];
  
    // Group sections into labels
    const labels: Array<Array<{title: string, lines: string[]}>> = [];
    let currentLabel: Array<{title: string, lines: string[]}> = [];
    let currentLineCount = 0;
  
    sections.forEach((section, index) => {
      const sectionLines = section.lines.length;
      const isFirstSection = index === 0;
      const isLastSection = index === sections.length - 1;
  
      // Calculate lines needed: section lines + header (if first in label) + footer (if needed)
      let neededLines = sectionLines;
      if (currentLabel.length === 0) neededLines += 1; // Header
      if (!isLastSection) neededLines += 1; // Footer
  
      if (currentLineCount + neededLines > MAX_LINES_PER_LABEL) {
        // Start new label
        if (currentLabel.length > 0) labels.push(currentLabel);
        currentLabel = [section];
        currentLineCount = sectionLines + 1 + (isLastSection ? 0 : 1);
      } else {
        currentLabel.push(section);
        currentLineCount += neededLines;
      }
    });
  
    // Add final label
    if (currentLabel.length > 0) labels.push(currentLabel);
  
    // Generate ZPL for each label
    return labels.map((labelSections, labelIndex) => {
      let zpl = "^XA\n";
      let y = 30;
      const isFirstLabel = labelIndex === 0;
  
      // Label header
      if (isFirstLabel) {
        zpl += `^CF0,30\n^FO50,${y}^FDPatient Summary^FS\n`;
      } else {
        zpl += `^CF0,30\n^FO50,${y}^FDPatient Summary (Cont.)^FS\n`;
      }
      y += HEADER_HEIGHT;
  
      // Add section content
      labelSections.forEach(section => {
        section.lines.forEach(line => {
          zpl += `^CF0,25\n^FO50,${y}^FD${line}^FS\n`;
          y += LINE_HEIGHT;
        });
      });
  
      // Add continuation notice if needed
      if (labelIndex < labels.length - 1) {
        zpl += `^CF0,20\n^FO50,550^FDContinued on next label...^FS\n`;
      }
  
      return zpl + "^XZ\n";
    }).join("\n");
  }
type Medication = {
    medicationName: string;
    dose: string;
    doseUnits: string;
    frequency: string;
    duration: string;
    formulation: string;
    prescribedBy: string;
  };
  
  export function generateMedicationLabelZPL(medications: Medication[]): string {
    // Constants
    const COLUMN_WIDTH = 300; // Width for each medical record column
    const LEFT_START = 30; // Starting X for left column
    const RIGHT_START = 330; // Starting X for right column
    const LINE_HEIGHT = 30;
    const HEADER_HEIGHT = 60;
    
    let result = "";
  
    // Function to create a single medication entry
    const createMedicationEntry = (med: Medication, x: number, y: number): string => {
      return `
  ^CF0,25
  ^FO${x},${y}^FDName: ${med.medicationName}^FS
  ^FO${x},${y + LINE_HEIGHT}^FDDose: ${med.dose} ${med.doseUnits}^FS
  ^FO${x},${y + LINE_HEIGHT*2}^FDForm: ${med.formulation}^FS
  ^FO${x},${y + LINE_HEIGHT*3}^FDFreq: ${med.frequency}^FS
  ^FO${x},${y + LINE_HEIGHT*4}^FDDuration: ${med.duration}^FS
  ^FO${x},${y + LINE_HEIGHT*5}^FDPrescriber: ${med.prescribedBy}^FS
  `;
    };
  
    // Group medications into pairs
    const labelGroups: Medication[][] = [];
    for (let i = 0; i < medications.length; i += 2) {
      labelGroups.push(medications.slice(i, i + 2));
    }
  
    // Generate ZPL for each label
    labelGroups.forEach((group, index) => {
      let zpl = "^XA\n"; // Start label
      
      // Label header
      const headerText = index === 0 
        ? "Medication Instructions" 
        : `Medication Instructions (${index + 1})`;
      
      zpl += `^CF0,30\n^FO${LEFT_START},30^FD${headerText}^FS\n`;
  
      // Calculate starting Y position for medications
      const medicationStartY = HEADER_HEIGHT;
  
      // Left column medication
      if (group[0]) {
        zpl += createMedicationEntry(group[0], LEFT_START, medicationStartY);
      }
  
      // Right column medication
      if (group[1]) {
        zpl += createMedicationEntry(group[1], RIGHT_START, medicationStartY);
      }
  
      zpl += "^XZ\n"; // End label
      result += zpl;
    });
  
    return result;
  }