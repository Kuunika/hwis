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
  // Constants (Zebra ZPL measurements in dots)
  const DPI = 203;                // Standard printer resolution
  const LABEL_WIDTH = 6 * DPI;    // 4" wide
  const LABEL_HEIGHT = 2 * DPI;   // 2" tall

  const LEFT_MARGIN = 30;
  const HEADER_HEIGHT = 60;
  const BORDER_THICKNESS = 3;
  const LINE_HEIGHT = 20;         // 25pt font + 10pt spacing
  const BLOCK_SPACING = 10;       // extra space between meds
  const MAX_LINE_WIDTH = LABEL_WIDTH - LEFT_MARGIN * 2;
  const MAX_CONTENT_HEIGHT = LABEL_HEIGHT - HEADER_HEIGHT - BORDER_THICKNESS - 20; 

  // Font metrics for ^A0 (approximate)
  const CHAR_WIDTH = 14;
  const CHARS_PER_LINE = Math.floor(MAX_LINE_WIDTH / CHAR_WIDTH);

  const labels: string[] = [];
  let currentBlock: string[][] = [];
  let currentHeight = 0;          // we'll add header separately
  let medNumber = 1;

  // Helper: break a text into actual lines of <= CHARS_PER_LINE
  function wrapText(text: string): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length <= CHARS_PER_LINE) {
        line = (line + ' ' + w).trim();
      } else {
        lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function formatMedication(med: Medication, n: number): string {
    const parts = [
      med.medicationName,
      `${med.dose} ${med.doseUnits}`,
      med.frequency,
      med.duration,
      med.formulation,
      `(${med.prescribedBy})`
    ].filter(Boolean).map(p => p.replace(/[\\^]/g, ''));
    return `${n}. ${parts.join(' | ')}`;
  }

  function blockHeight(lines: string[]): number {
    return lines.length * LINE_HEIGHT + BLOCK_SPACING;
  }

  function emitLabel(blocks: string[][], labelNo: number): string {
    let zpl = [
      '^XA',
      '^CF0,25',
      // Header
      `^FO${LEFT_MARGIN},30^FDMedication Instructions${labelNo > 1 ? ` (Cont. ${labelNo})` : ''}^FS`,
      `^FO${LEFT_MARGIN},${HEADER_HEIGHT}^GB${MAX_LINE_WIDTH},${BORDER_THICKNESS},${BORDER_THICKNESS}^FS`
    ].join('\n') + '\n';

    // Start printing *just below* the border
    let y = HEADER_HEIGHT + BORDER_THICKNESS + 5;

    for (const medLines of blocks) {
      for (const line of medLines) {
        zpl += `^FO${LEFT_MARGIN},${y}^FD${line}^FS\n`;
        y += LINE_HEIGHT;
      }
      y += BLOCK_SPACING;  // gap before next med
    }

    zpl += '^XZ';
    return zpl;
  }

  // Build up pages
  medications.forEach(med => {
    const formatted = formatMedication(med, medNumber);
    const wrapped = wrapText(formatted);
    const h = blockHeight(wrapped);

    // New page if no room
    if (currentHeight + h > MAX_CONTENT_HEIGHT) {
      labels.push(emitLabel(currentBlock, labels.length + 1));
      currentBlock = [];
      currentHeight = 0;
    }

    currentBlock.push(wrapped);
    currentHeight += h;
    medNumber++;
  });

  // Last page
  if (currentBlock.length) {
    labels.push(emitLabel(currentBlock, labels.length + 1));
  }

  return labels.join('\n');
}
