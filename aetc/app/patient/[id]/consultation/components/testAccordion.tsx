import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { FaCaretUp } from "react-icons/fa6";
import { BedsideTestForm } from "./bedsideTestForm";
import { LabRequestForm } from "./labRequestForm";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";

export function TestAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === "bedside"}
        onChange={handleChange("bedside")}
      >
        <AccordionSummary
          expandIcon={<FaCaretUp />}
          aria-controls="bedsidebh-content"
          id="bedsidebh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Bedside</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BedsideTestForm />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "labForm"}
        onChange={handleChange("labForm")}
      >
        <AccordionSummary
          expandIcon={<FaCaretUp />}
          aria-controls="labFormbh-content"
          id="labFormbh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Lab</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <>
            <LabRequestForm onClose={() => {}} addRequest={() => {}} />
            <LabOrderTable />
          </>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
