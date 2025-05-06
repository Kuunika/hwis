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
  const MAX_CONTENT_HEIGHT = 600; // Maximum height available for content on a label
  
  let result = "";
  let currentLabelGroup: Medication[] = [];
  let currentLabelHeight = HEADER_HEIGHT;
  let medCounter = 0; // Counter for medication numbering
  
  // Process each medication and create new labels as needed
  for (let i = 0; i < medications.length; i++) {
    const med = medications[i];
    medCounter++;
    
    // Make sure to escape any special characters in the medication data
    const medName = med.medicationName?.replace(/[\\^]/g, '') || '';
    const dose = med.dose?.toString() || '';
    const doseUnits = med.doseUnits?.replace(/[\\^]/g, '') || '';
    const frequency = med.frequency?.replace(/[\\^]/g, '') || '';
    const duration = med.duration?.replace(/[\\^]/g, '') || '';
    const formulation = med.formulation?.replace(/[\\^]/g, '') || '';
    const prescriber = med.prescribedBy?.replace(/[\\^]/g, '') || '';
    
    // Format the medication line
    const medLine = `${medCounter}. ${medName}|${dose} ${doseUnits}|${frequency}|${duration}|${formulation}|(${prescriber})`;
    
    // Estimate the height this medication will take
    // Longer text may need more lines (wrapped), so estimate space requirements
    const textLength = medLine.length;
    const estimatedLines = Math.ceil(textLength / 50); // Rough estimate: 50 chars per line
    const estimatedHeight = estimatedLines * LINE_HEIGHT + 10; // Add small gap between meds
    
    // Check if this medication would fit on the current label
    if (currentLabelHeight + estimatedHeight > MAX_CONTENT_HEIGHT && currentLabelGroup.length > 0) {
      // Generate the current label before starting a new one
      result += generateLabel(currentLabelGroup, result.length === 0 ? 0 : Math.ceil(medCounter / 6));
      // Reset for new label
      currentLabelGroup = [];
      currentLabelHeight = HEADER_HEIGHT;
    }
    
    // Add medication to current group
    currentLabelGroup.push(med);
    currentLabelHeight += estimatedHeight;
  }
  
  // Generate the final label if there are any remaining medications
  if (currentLabelGroup.length > 0) {
    result += generateLabel(currentLabelGroup, result.length === 0 ? 0 : Math.ceil(medCounter / 6));
  }
  
  return result;
  
  // Helper function to generate a label with a group of medications
  function generateLabel(medGroup: Medication[], labelIndex: number): string {
    let zpl = "^XA\n"; // Start label
    
    // Label header
    const headerText = labelIndex === 0 
      ? "Medication Instructions" 
      : `Medication Instructions (${labelIndex + 1})`;
    
    zpl += `^CF0,30\n^FO${LEFT_MARGIN},30^FD${headerText}^FS\n`;
    
    // Track current Y position
    let currentY = HEADER_HEIGHT;
    
    // Add each medication in horizontal format with automatic wrapping
    medGroup.forEach((med, index) => {
      // Calculate the global medication number
      const medNumber = medCounter - (medGroup.length - 1 - index);
      
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
      
      // Estimate number of lines needed
      const textLength = medLine.length;
      const estimatedLines = Math.ceil(textLength / 50); // Rough estimate: 50 chars per line
      const maxLines = Math.max(1, Math.min(5, estimatedLines)); // Between 1 and 5 lines
      
      // Use ZPL's built-in text wrapping with maximum line width
      zpl += `^CF0,25\n^FO${LEFT_MARGIN},${currentY}^FB${MAX_LINE_WIDTH},${maxLines},0,L,0^FD${medLine}^FS\n`;
      
      // Move to next position, accounting for wrapped lines
      currentY += LINE_HEIGHT * maxLines + 10; // Add a small gap between medications
    });
    
    zpl += "^XZ\n"; // End label
    return zpl;
  }
}