import { Obs } from "@/interfaces";

type LabTest = { name: string; result: string };
type LabOrder = { specimen: { name: string }; tests: LabTest[] };

export function generatePatientSummaryZPL({
  presentingComplaints,
  diagnosis,
  labOrders,
  dischargeNotes,
  dischargePlan,
  followUpPlan
}: {
  presentingComplaints: Obs[];
  diagnosis: Obs[];
  labOrders: LabOrder[];
  dischargeNotes?: string;
  dischargePlan?: string;
  followUpPlan?: string;
}): string {
  // Constants for 10cm x 4cm label (203 DPI)
  const DPI = 203;
  const LABEL_WIDTH_MM = 100;   // 100mm = 10cm
  const LABEL_HEIGHT_MM = 40;   // 40mm = 4cm
  const MM_TO_DOTS = (mm: number) => Math.round(mm * DPI / 25.4);
  
  const LABEL_WIDTH = MM_TO_DOTS(LABEL_WIDTH_MM);  // ~799 dots
  const LABEL_HEIGHT = MM_TO_DOTS(LABEL_HEIGHT_MM); // ~320 dots
  
  // Layout constants
  const TOP_OFFSET = 20;         // Top offset to prevent cutting
  const MARGIN_X = 20;           // Left/right margin
  const HEADER_HEIGHT = 50;      // Space for header section
  const TITLE_HEIGHT = 30;       // Height for section titles
  const LINE_HEIGHT = 25;        // Height per text line
  const SECTION_SPACING = 10;    // Space between sections
  const MAX_LINE_WIDTH = LABEL_WIDTH - (2 * MARGIN_X); // Adjusted width with margins
  const MAX_CHARS_PER_LINE = Math.floor(MAX_LINE_WIDTH / 8); // Conservative estimate
  const SEPARATOR = " ! ";       // Content separator

  // Helper: wrap text to fit within label width
  function wrapText(text: string): string[] {
    if (!text) return [];
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    
    for (const word of words) {
      // Handle very long words by breaking them
      if (word.length > MAX_CHARS_PER_LINE) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        // Break the long word into chunks
        for (let i = 0; i < word.length; i += MAX_CHARS_PER_LINE) {
          const chunk = word.substring(i, i + MAX_CHARS_PER_LINE);
          lines.push(chunk);
        }
        continue;
      }
      
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= MAX_CHARS_PER_LINE) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Prepare all content sections
  const sections = [
    {
      title: "Final Diagnosis",
      content: diagnosis?.length 
        ? diagnosis.map(o => o.value).join(SEPARATOR)
        : "None"
    },
    {
      title: "Investigations",
      content: labOrders.length
        ? labOrders.flatMap(order => 
            order.tests.map(t => `${t.name}:${t.result || "pending"}`)
          ).join(SEPARATOR)
        : "No investigations ordered"
    },
    {
      title: "Discharge Notes",
      content: dischargeNotes || "N/A"
    },
    {
      title: "Discharge Plan",
      content: dischargePlan || "N/A"
    },
    {
      title: "Follow Up Plan",
      content: followUpPlan || "N/A"
    }
  ];

  // Flatten all content into lines with section markers
  const allLines: Array<{text: string, isTitle: boolean, sectionIndex: number}> = [];
  
  sections.forEach((section, index) => {
    // Add section title
    allLines.push({
      text: section.title,
      isTitle: true,
      sectionIndex: index
    });
    
    // Add wrapped content lines
    const contentLines = wrapText(section.content);
    contentLines.forEach(line => {
      allLines.push({
        text: line,
        isTitle: false,
        sectionIndex: index
      });
    });
  });

  // Paginate content across multiple labels
  const labels: Array<Array<typeof allLines[0]>> = [];
  let currentLabelLines: Array<typeof allLines[0]> = [];
  let currentY = TOP_OFFSET + HEADER_HEIGHT; // Start below header with top offset
  
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    
    // Calculate spacing between sections
    let spacing = 0;
    if (currentLabelLines.length > 0) {
      const lastLine = currentLabelLines[currentLabelLines.length - 1];
      if (line.sectionIndex !== lastLine.sectionIndex) {
        spacing = SECTION_SPACING;
      }
    }
    
    const lineHeight = line.isTitle ? TITLE_HEIGHT : LINE_HEIGHT;
    const requiredHeight = spacing + lineHeight;
    
    // Check if we need a new label
    if (currentY + requiredHeight > LABEL_HEIGHT - TOP_OFFSET) {
      // If we can't even fit one line, force new label
      if (currentLabelLines.length === 0) {
        // Should never happen, but safety check
        currentLabelLines.push(line);
        labels.push(currentLabelLines);
        currentLabelLines = [];
        currentY = TOP_OFFSET;
        continue;
      }
      
      // Save current label and start new one
      labels.push(currentLabelLines);
      currentLabelLines = [];
      currentY = TOP_OFFSET;
      
      // Re-process this line in new label context
      i--;
      continue;
    }
    
    // Add line to current label
    currentLabelLines.push(line);
    currentY += requiredHeight;
  }
  
  // Add any remaining lines
  if (currentLabelLines.length > 0) {
    labels.push(currentLabelLines);
  }

  // Generate ZPL for each label
  return labels.map((labelLines, labelIndex) => {
    let yPosition = TOP_OFFSET;
    let zpl = `^XA
^PW${LABEL_WIDTH}
^LL${LABEL_HEIGHT}
^CF0,25`; // Default font

    // Add header only to first label
    if (labelIndex === 0) {
      zpl += `
^FO${MARGIN_X},${TOP_OFFSET}^FDPatient Summary-QUECH AETC^FS
^FO${MARGIN_X},${TOP_OFFSET + 40}^GB${MAX_LINE_WIDTH},3,3^FS`;
      yPosition = TOP_OFFSET + HEADER_HEIGHT;
    } else {
      // For subsequent labels, start at top offset
      yPosition = TOP_OFFSET;
    }

    // Track current section to avoid repeating titles
    let currentSection = -1;
    
    for (const line of labelLines) {
      // Add spacing between sections
      if (line.sectionIndex !== currentSection) {
        if (currentSection !== -1) {
          yPosition += SECTION_SPACING;
        }
        currentSection = line.sectionIndex;
      }
      
      // Set appropriate font and format
      if (line.isTitle) {
        zpl += `
^CF0,25
^FO${MARGIN_X},${yPosition}^FD${line.text}^FS`;
        yPosition += TITLE_HEIGHT;
      } else {
        zpl += `
^CFA,20
^FO${MARGIN_X},${yPosition}^FD${line.text}^FS`;
        yPosition += LINE_HEIGHT;
      }
    }
    
    zpl += `
^XZ`;
    
    return zpl;
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

export function generateMedicationLabelZPL(medications: Medication[], title = 'Medication Instructions'): string {
  // Constants (Zebra ZPL measurements in dots)
  const DPI = 203; // Standard printer resolution
  const LABEL_WIDTH = 5 * DPI; // 4" wide
  const LABEL_HEIGHT = 2 * DPI; // 2" tall

  const LEFT_MARGIN = 30;
  const HEADER_HEIGHT = 60;
  const BORDER_THICKNESS = 3;
  const LINE_HEIGHT = 20; // 25pt font + 10pt spacing
  const BLOCK_SPACING = 10; // extra space between meds
  const MAX_LINE_WIDTH = LABEL_WIDTH - LEFT_MARGIN * 2;
  const MAX_CONTENT_HEIGHT =
    LABEL_HEIGHT - HEADER_HEIGHT - BORDER_THICKNESS - 20;

  // Font metrics for ^A0 (approximate)
  const CHAR_WIDTH = 14;
  const CHARS_PER_LINE = Math.floor(MAX_LINE_WIDTH / CHAR_WIDTH);

  const labels: string[] = [];
  let currentBlock: string[][] = [];
  let currentHeight = 0; // we'll add header separately
  let medNumber = 1;

  // Helper: break a text into actual lines of <= CHARS_PER_LINE
  function wrapText(text: string): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length <= CHARS_PER_LINE) {
        line = (line + " " + w).trim();
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
      `(${med.prescribedBy})`,
    ]
      .filter(Boolean)
      .map((p) => p.replace(/[\\^]/g, ""));
    return `${n}. ${parts.join(" | ")}`;
  }

  function blockHeight(lines: string[]): number {
    return lines.length * LINE_HEIGHT + BLOCK_SPACING;
  }

  function emitLabel(blocks: string[][], labelNo: number): string {
    let zpl =
      [
        "^XA",
        "^CF0,25",
        // Header
        `^FO${LEFT_MARGIN},30^${title}${labelNo > 1 ? ` (Cont. ${labelNo})` : ""}^FS`,
        `^FO${LEFT_MARGIN},${HEADER_HEIGHT}^GB${MAX_LINE_WIDTH},${BORDER_THICKNESS},${BORDER_THICKNESS}^FS`,
      ].join("\n") + "\n";

    // Start printing *just below* the border
    let y = HEADER_HEIGHT + BORDER_THICKNESS + 5;

    for (const medLines of blocks) {
      for (const line of medLines) {
        zpl += `^FO${LEFT_MARGIN},${y}^FD${line}^FS\n`;
        y += LINE_HEIGHT;
      }
      y += BLOCK_SPACING; // gap before next med
    }

    zpl += "^XZ";
    return zpl;
  }

  // Build up pages
  medications.forEach((med) => {
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

  return labels.join("\n");
}
