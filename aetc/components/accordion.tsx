"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { FaAngleUp } from "react-icons/fa6";

interface AccordionSection {
  id: string;
  title: string | JSX.Element; // ✅ This allows both strings and JSX
  content: React.ReactNode;
}

interface TestAccordionProps {
  sections: AccordionSection[];
}

export function AccordionComponent({ sections }: TestAccordionProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {sections.map(({ id, title, content }) => (
        <Accordion
          key={id}
          expanded={expanded === id}
          onChange={handleChange(id)}
        >
          <AccordionSummary
            expandIcon={<FaAngleUp />}
            aria-controls={`${id}-content`}
            id={`${id}-header`}
          >
            <Typography sx={{ width: "33%", flexShrink: 0, fontWeight: 600 }}>
              {title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
