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
  const lines: string[] = [];

  let y = 30;
  const lineHeight = 30;

  const addLine = (text: string, fontSize = 25) => {
    lines.push(`^CF0,${fontSize}`);
    lines.push(`^FO50,${y}^FD${text}^FS`);
    y += lineHeight;
  };

  lines.push("^XA"); // Start of label
  addLine("Patient Summary", 30);
  addLine("Presenting Complaints:");

  presentingComplaints.forEach((obs) => {
    addLine(`- ${obs.value}`);
  });

  addLine("Final Diagnosis:");
  diagnosis?.forEach((obs) => {
    addLine(`- ${obs.value}`);
  });

  addLine("Investigations:");
  addLine("Specimen     Test       Result");

  labOrders?.forEach((order) => {
    order.tests.forEach((test) => {
      const specimen = order.specimen.name.padEnd(12, " ");
      const testName = test.name.padEnd(10, " ");
      const result = test.result ?? "";
      addLine(`${specimen}${testName}${result}`);
    });
  });

  lines.push("^XZ"); // End of label

  return lines.join("\n");
}
