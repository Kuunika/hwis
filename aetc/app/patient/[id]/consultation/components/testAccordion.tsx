"use client";

import { BedsideTestForm } from "./bedsideTestForm";
import { LabRequestForm } from "./labRequestForm";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";
import { AccordionComponent } from "@/components/accordion";
import { Radiology } from "./Radiology";

export function TestAccordion() {
  const sections = [
    {
      id: "bedside",
      title: "Bedside",
      content: <BedsideTestForm />,
    },
    {
      id: "labForm",
      title: "Lab",
      content: (
        <>
          <LabRequestForm onClose={() => {}} addRequest={() => {}} />
          <LabOrderTable />
        </>
      ),
    },
    {
      id: "radiology",
      title: "Radiology (Coming Soon)",
      content: (
        <>
          <Radiology />
        </>
      ),
    },
  ];

  return <AccordionComponent sections={sections} />;
}
