 import Accordion from "@mui/material/Accordion";
 import AccordionSummary from "@mui/material/AccordionSummary";
 import AccordionDetails from "@mui/material/AccordionDetails";
 import Typography from "@mui/material/Typography";
 import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SxProps } from "@mui/material";
import { useState } from "react";

 interface Props{
    name: string
    sx?:SxProps
 }
const AccordionInput = ({name,sx}:Props) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionInput;
