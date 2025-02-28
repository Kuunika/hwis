import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { FaAngleDown } from "react-icons/fa";
import { MainTypography, WrapperBox } from "@/components";
import Link from "next/link";
import Image from "next/image";
import gynacology from "../../../../icons/gynacology.svg";
import medicalInpatient from "../../../../icons/medicalInpatient.svg";
import monitoring from "../../../../icons/monitoring.svg";
import surgical from "../../../../icons/surgicalnotes.svg";
import referral from "../../../../icons/referral.svg";

export const templateForms = [
  {
    label: "Medical Inpatient",
    link: "inPatientAdmission",
    icon: medicalInpatient,
  },
  { label: "Surgical Notes", link: "surgicalNotes", icon: surgical },
  { label: "Gynacological ", link: "gynacological", icon: gynacology },
  { label: "SOAP ", link: "soap", icon: surgical },
  { label: "Monitoring Chart ", link: `nursingChart`, icon: monitoring },
  { label: "Referral ", link: "referral", icon: referral },
];

export const aetcClecking = [
  { label: "Primary Assessment", link: "primary-assessment", icon: surgical },
  {
    label: "Secondary Assessment",
    link: "secondary-assessment",
    icon: surgical,
  },
  { label: "Sample History", link: "sample-history", icon: surgical },
];
export function BasicAccordion() {
  const AccordionWrapper = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => {
    return (
      <Accordion
        sx={{
          mb: "1ch",
          "& .MuiAccordionSummary-root": {
            display: "flex",
            flexDirection: "row-reverse",
          },
          "& .MuiAccordionSummary-content": {
            "& .MuiTypography-root": {
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "17px",
              letterSpacing: "0em",
              textAlign: "left",
            },
          },
          "& .MuiCollapse-root": {
            ml: "2.8ch",
          },
        }}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    );
  };

  return (
    <>
      <AccordionWrapper title="Template Forms">
        <LinkList list={templateForms} />
      </AccordionWrapper>

      <AccordionWrapper title="AETC Clerking sheet">
        <LinkList list={aetcClecking} />
      </AccordionWrapper>
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
const ListItem = ({
  label,
  link,
  icon,
}: {
  label: string;
  link: string;
  icon?: any;
}) => {
  return (
    <Link href={link}>
      <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
        {/* {icon && <Image src={icon ? icon : "/test"} alt="AETC Form icon" />} */}
        <MainTypography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "17px",
            letterSpacing: "0em",
            textAlign: "left",
            my: "0.5ch",
            ml: "5px",
          }}
        >
          {label}
        </MainTypography>
      </WrapperBox>
    </Link>
  );
};
