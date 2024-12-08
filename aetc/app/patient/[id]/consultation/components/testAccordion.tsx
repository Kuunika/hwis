"use client";

import { BedsideTestForm } from "./bedsideTestForm";
import { LabRequestForm } from "./labRequestForm";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";
import { AccordionComponent } from "@/components/accordion";

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
  ];

  return <AccordionComponent sections={sections} />;
}
