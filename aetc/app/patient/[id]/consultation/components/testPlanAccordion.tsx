"use client";

import { BedsideTestPlanForm } from "./bedsideTestPlanForm";
import { LabRequestPlanForm } from "./labRequestPlanForm";
import { LabOrderPlanTable } from "@/app/patient/components/panels/labOrderPlanTable";
import { AccordionComponent } from "@/components/accordion";
import { Radiology } from "./Radiology";

export function TestPlanAccordion() {
  const sections = [
    {
      id: "bedside",
      title: "Bedside",
      content: <BedsideTestPlanForm />,
    },
    {
      id: "labForm",
      title: "Lab",
      content: (
        <>
          <LabRequestPlanForm onClose={() => {}} addRequest={() => {}} />
          <LabOrderPlanTable />
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
