import { useState } from "react";
import { AccordionComponent } from "@/components/accordion";
// import { MedicationsForm } from "../../consultation/components/medication";
import { MedicationsForm } from "./medication";

import { encounters } from "@/constants";


export const AccordionWithMedication = () => {
  const [accordionKey, setAccordionKey] = useState(Date.now());

  const handleCloseAccordion = () => {
    // Update the key to force a re-render and collapse the accordion
    setAccordionKey(Date.now());
  };

  const sections = [
    {
      id: "medications",
      title: (
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          1. Prescribe Medications
        </h2>
      ),      
      content: (
        <MedicationsForm
          medicationLabelTitle="Medication to Pharmacy"
          medicationTitle="Medication to Pharmacy"
          onSubmissionSuccess={handleCloseAccordion}
          encounterType={encounters.DISPOSED_PRESCRIPTIONS}
          onSkip={() => { }}
          onSubmit={() => { }}
        />
        // <MedicationsForm
        //   onSubmit={() => {
        //     throw new Error("Function not implemented.");
        //   }}
        //   onSkip={() => {
        //     throw new Error("Function not implemented.");
        //   }}
        //   onSuccess={handleCloseAccordion}
        // />
      ),
    },
  ];

  return <AccordionComponent key={accordionKey} sections={sections} />;
};