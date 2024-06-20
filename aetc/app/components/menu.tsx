import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaAngleDown } from "react-icons/fa";
import { MainTypography, WrapperBox } from "@/components";
import Link from "next/link";

export function LandingPageCollapsible() {
  const aetcClecking = [
    { label: "Initial Registration", link: "initial-registration" },
    { label: "Brought In Dead", link: "registration/death/list" },
  ];

  const templateForme = [
    {
      label: "Patients Waiting for Prescreening",
      link: "initial-registration/list",
    },
    { label: "Patients Waiting for Registration", link: "registration/list" },
    { label: "Patients Waiting for Triage ", link: "triage" },
    { label: "Patients Waiting for Assessment ", link: "assessments" },
    { label: "Current Visits ", link: "monitoring" },
  ];
  return (
    <>
      <Accordion expanded={true} elevation={0}>
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Menu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LinkList list={aetcClecking} />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={true} elevation={0}>
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Dashboards</Typography>
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
