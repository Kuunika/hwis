import { Obs } from "@/interfaces";

type LabTest = { name: string; result: string };
type LabOrder = { specimen: { name: string }; tests: LabTest[] };

// const DPI = 203;                  // printer resolution
// const LABEL_WIDTH = 5 * DPI;      // 4 inches
// const LEFT_MARGIN = 40;
// const MAX_LINES_PER_LABEL = 9;    // demo size
// const HEADER_HEIGHT = 40;
// const LINE_HEIGHT = 25;

export function generatePatientSummaryZPL({
  presentingComplaints,
  diagnosis,
  labOrders,
  dischargeNotes,
  dischargePlan,
  // prescribedMedications, // Add this parameter

}: {
  presentingComplaints: Obs[];
  diagnosis: Obs[];
  labOrders: LabOrder[];
  dischargeNotes?: string;
  dischargePlan?: string;
  // prescribedMedications?: any[]; // Add this type definition

}): string {
  // Constants
  const DPI = 203; // printer resolution
  const LABEL_WIDTH = 5 * DPI; // 4 inches
  const LEFT_MARGIN = 40;
  const MAX_LINES_PER_LABEL = 9; // demo size
  const HEADER_HEIGHT = 40;
  const LINE_HEIGHT = 25;

  // Calculate wrapping
  const MAX_LINE_WIDTH = LABEL_WIDTH - LEFT_MARGIN * 2;
  const CHAR_WIDTH = 14; // approximate char width in dots
  const CHARS_PER_LINE = Math.floor(MAX_LINE_WIDTH / CHAR_WIDTH);

  // Helper to wrap a long string into multiple lines
  function wrapText(text: string): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";

    for (const w of words) {
      const candidate = line ? line + " " + w : w;
      if (candidate.length <= CHARS_PER_LINE) {
        line = candidate;
      } else {
        lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // Combine fields into single statements
  const complaintsText = presentingComplaints.length
    ? presentingComplaints.map((o) => o.value).join(" | ")
    : "None";

  const diagnosisText = diagnosis.length
    ? diagnosis.map((o) => o.value).join(" | ")
    : "None";

  const investigationsText = labOrders.length
    ? labOrders
      .flatMap((order) =>
        order.tests.map((t) => `${t.name}:${t.result || ""}`)
      )
      .join(" | ")
    : "No investigations ordered";

  // Add prescribed medications text
  // const medicationsText = prescribedMedications?.length
  //   ? prescribedMedications
  //     .map((med) => `${med.medicationName || med.name}: ${med.dose || ''} ${med.doseUnits || ''} ${med.frequency || ''}`)
  //     .join(" | ")
  //   : "No medications prescribed";


  // Define raw sections
  const rawSections = [
    { title: "Patient Summary", lines: [""] },
    {
      title: "Presenting Complaints",
      lines: [`Presenting Complaints: ${complaintsText}`],
    },
    { title: "Diagnosis", lines: [`Final Diagnosis: ${diagnosisText}`] },
    {
      title: "Investigations",
      lines: [`Investigations: ${investigationsText}`],
    },
    // {
    //   title: "Prescribed Medications", // Add this section
    //   lines: [`Prescribed Medications: ${medicationsText}`],
    // },
    {
      title: "Discharge Notes",
      lines: [`Discharge Notes: ${dischargeNotes || "N/A"}`],
    },
    {
      title: "Discharge Plan",
      lines: [`Discharge Plan: ${dischargePlan || "N/A"}`],
    },
  ];

  // Wrap each line to fit within label width
  const sections = rawSections.map((sec) => ({
    title: sec.title,
    lines: sec.lines.flatMap((line) => wrapText(line)),
  }));

  // Pagination into multiple labels
  const labels: Array<typeof sections> = [];
  let current: typeof sections = [] as any;
  let count = 0;

  sections.forEach((sec, idx) => {
    const needed =
      sec.lines.length +
      (current.length === 0 ? 1 : 0) +
      (idx < sections.length - 1 ? 1 : 0);
    if (count + needed > MAX_LINES_PER_LABEL) {
      labels.push(current);
      current = [sec];
      count = sec.lines.length + 1 + (idx < sections.length - 1 ? 1 : 0);
    } else {
      current.push(sec);
      count += needed;
    }
  });
  if (current.length) labels.push(current);

  // Build ZPL
  return labels
    .map((lbl, i) => {
      let zpl = "^XA\n";
      let y = 30;

      // Header (bold via double-print)
      const headerText = `Patient Summary${i > 0 ? " (Cont.)" : ""}`;
      zpl += `^CF0,30,30\n`;
      zpl += `^FO${LEFT_MARGIN},${y}^FD${headerText}^FS\n`;
      zpl += `^FO${LEFT_MARGIN + 1},${y}^FD${headerText}^FS\n`;
      y += HEADER_HEIGHT;

      // Horizontal line under header
      zpl += `^FO${LEFT_MARGIN},${y}^GB${MAX_LINE_WIDTH},1,1^FS\n`;
      y += 10; // small margin after line

      // Section content (lighter font)
      lbl.forEach((sec) => {
        sec.lines.forEach((line) => {
          zpl += `^CF0,20,20\n^FO${LEFT_MARGIN},${y}^FD${line}^FS\n`;
          y += LINE_HEIGHT;
        });
        y += LINE_HEIGHT; // spacer
      });

      // Continuation notice
      if (i < labels.length - 1) {
        zpl += `^CF0,18,18\n^FO${LEFT_MARGIN},550^FDContinued on next label...^FS\n`;
      }

      return zpl + "^XZ";
    })
    .join("\n");
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
