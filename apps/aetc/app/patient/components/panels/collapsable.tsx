import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaAngleDown } from "react-icons/fa";
import { MainTypography, WrapperBox } from "shared-ui/src";
import Link from "next/link";

export function BasicAccordion() {
  const aetcClecking = [
    { label: "Primary Assessment", link: "primary-assessment" },
    { label: "Secondary Assessment", link: "secondary-assessment" },
    { label: "Sample History", link: "sample-history" },
  ];

  const templateForme = [
    { label: "Medical Inpatient", link: "medicalInpatient" },
    { label: "Surgical Notes", link: "surgicalNotes" },
    { label: "Gynacological ", link: "ynacological" },
    { label: "SOAP ", link: "soap" },
    { label: "Monitoring Chat ", link: "monitoring" },
  ];
  return (
    <>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>AETC Clerking sheet</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LinkList list={aetcClecking} />
        </AccordionDetails>
      </Accordion>
      <br />
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Template Forms</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LinkList list={templateForme} />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

type ListItemProp = { label: string; link: string };

const LinkList = ({ list }: { list: ListItemProp[] }) => {
  return (
    <WrapperBox>
      {list.map((l) => (
        <ListItem {...l} key={l.label} />
      ))}
    </WrapperBox>
  );
};
const ListItem = ({ label, link }: { label: string; link: string }) => {
  return (
    <Link href={link}>
      <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
        <WrapperBox
          sx={{
            width: 12,
            height: 12,
            borderRadius: 6,
            border: "1px solid #B3B3B3",
            mr: "1ch",
          }}
        ></WrapperBox>
        <MainTypography variant="subtitle2">{label}</MainTypography>
      </WrapperBox>
    </Link>
  );
};
