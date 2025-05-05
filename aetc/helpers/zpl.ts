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
          ...(diagnosis?.length > 0 
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
  const LEFT_MARGIN = 30; // Starting X position
  const HEADER_HEIGHT = 60;
  const LINE_HEIGHT = 30;
  const MAX_LINE_WIDTH = 750; // Maximum width for a single line in dots
  const CHARS_PER_LINE = 60; // Estimated characters per line before wrapping
  
  let result = "";
  
  // Group medications into sets per label
  const MEDS_PER_LABEL = 6; // Adjust as needed based on your label size
  const labelGroups: Medication[][] = [];
  for (let i = 0; i < medications.length; i += MEDS_PER_LABEL) {
    labelGroups.push(medications.slice(i, i + MEDS_PER_LABEL));
  }
  
  // Generate ZPL for each label
  labelGroups.forEach((group, groupIndex) => {
    let zpl = "^XA\n"; // Start label
    
    // Label header
    const headerText = groupIndex === 0 
      ? "Medication Instructions" 
      : `Medication Instructions (${groupIndex + 1})`;
    
    zpl += `^CF0,30\n^FO${LEFT_MARGIN},30^FD${headerText}^FS\n`;
    
    // Track current Y position
    let currentY = HEADER_HEIGHT;
    
    // Add each medication in horizontal format with automatic wrapping
    group.forEach((med, index) => {
      const medNumber = index + 1 + (groupIndex * MEDS_PER_LABEL);
      
      // Make sure to escape any special characters in the medication data
      const medName = med.medicationName?.replace(/[\\^]/g, '') || '';
      const dose = med.dose?.toString() || '';
      const doseUnits = med.doseUnits?.replace(/[\\^]/g, '') || '';
      const frequency = med.frequency?.replace(/[\\^]/g, '') || '';
      const duration = med.duration?.replace(/[\\^]/g, '') || '';
      const formulation = med.formulation?.replace(/[\\^]/g, '') || '';
      const prescriber = med.prescribedBy?.replace(/[\\^]/g, '') || '';
      
      // Format the medication line
      const medLine = `${medNumber}. ${medName}|${dose} ${doseUnits}|${frequency}|${duration}|${formulation}|(${prescriber})`;
      
      // Use ZPL's built-in text wrapping with maximum line width
      // FB command enables automatic text wrapping
      zpl += `^CF0,25\n^FO${LEFT_MARGIN},${currentY}^FB${MAX_LINE_WIDTH},3,0,L,0^FD${medLine}^FS\n`;
      
      // Move to next position, accounting for potential wrapped lines
      // Allow up to 3 lines for each medication entry
      const lineCount = Math.ceil(medLine.length / CHARS_PER_LINE);
      const linesNeeded = Math.min(3, Math.max(1, lineCount)); // At least 1 line, max 3 lines
      currentY += LINE_HEIGHT * linesNeeded + 10; // Add a small gap between medications
    });
    
    zpl += "^XZ\n"; // End label
    result += zpl;
  });
  
  return result;
}