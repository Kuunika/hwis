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
    // Force multiple labels by limiting lines per label
    const maxLinesPerLabel = 8; // Intentionally small to force pagination
    
    // Collect all the content as simple text lines
    const allLines = [];
    
    // Title
    allLines.push("Patient Summary");
    
    // Presenting complaints
    allLines.push("Presenting Complaints:");
    if (presentingComplaints && presentingComplaints.length > 0) {
      presentingComplaints.forEach(obs => {
        allLines.push(`- ${obs.value}`);
      });
    } else {
      allLines.push("- None");
    }
    
    // Diagnosis
    allLines.push("Final Diagnosis:");
    if (diagnosis && diagnosis.length > 0) {
      diagnosis.forEach(obs => {
        allLines.push(`- ${obs.value}`);
      });
    } else {
      allLines.push("- None");
    }
    
    // Investigations
    allLines.push("Investigations:");
    allLines.push("Specimen     Test       Result");
    
    if (labOrders && labOrders.length > 0) {
      labOrders.forEach(order => {
        if (order.tests && order.tests.length > 0) {
          order.tests.forEach(test => {
            const specimen = (order.specimen && order.specimen.name ? order.specimen.name : "").padEnd(12, " ");
            const testName = (test.name || "").padEnd(10, " ");
            const result = test.result || "";
            allLines.push(`${specimen}${testName}${result}`);
          });
        }
      });
    } else {
      allLines.push("- No investigations ordered");
    }
    
    // Split lines into chunks for multiple labels
    const chunks = [];
    for (let i = 0; i < allLines.length; i += maxLinesPerLabel) {
      chunks.push(allLines.slice(i, i + maxLinesPerLabel));
    }
    
    // Generate ZPL for each chunk/label
    const zplLabels:any = [];
    
    chunks.forEach((chunk, index) => {
      let zpl = "^XA\n"; // Start label
      
      // Add continuation header if not the first label
      let y = 30;
      if (index > 0) {
        zpl += `^CF0,30\n^FO50,${y}^FDPatient Summary (Continued)^FS\n`;
        y += 40; // Extra space after header
      }
      
      // Add content lines
      chunk.forEach(line => {
        zpl += `^CF0,25\n^FO50,${y}^FD${line}^FS\n`;
        y += 30; // Line height
      });
      
      // Add continuation footer if not the last label
      if (index < chunks.length - 1) {
        zpl += `^CF0,20\n^FO50,550^FDContinued on next label...^FS\n`;
      }
      
      zpl += "^XZ"; // End label
      zplLabels.push(zpl);
    });
    
    // Return all labels joined with newlines
    return zplLabels.join("\n");
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
    let zpl = "^XA\n"; // Start ZPL
    let y = 30; // Start Y position
    const lineHeight = 30;
  
    const addText = (text: string, fontSize = 25) => {
      zpl += `^CF0,${fontSize}\n`;
      zpl += `^FO30,${y}^FD${text}^FS\n`;
      y += lineHeight;
    };
  
    addText("Medication Instructions", 30);
    addText("------------------------------", 20);
  
    medications.forEach((med) => {
      addText(`Name: ${med.medicationName}`);
      addText(`Dose: ${med.dose} ${med.doseUnits}`);
      addText(`Form: ${med.formulation}`);
      addText(`Freq: ${med.frequency}`);
      addText(`Duration: ${med.duration}`);
      addText(`Prescriber: ${med.prescribedBy}`);
      addText("------------------------------", 20);
    });
  
    zpl += "^XZ"; // End ZPL
    return zpl;
  }
  
