import {
  MainButton,
  MainGrid,
  MainPaper,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import { ConsultationCard, PersonalDetailsCard, VisitsBar } from ".";
import {
  BasicAccordion,
  ClinicalNotes,
  Investigations,
  Medications,
  Results,
  aetcClecking,
  templateForms,
} from "./panels";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PersonalDetailsTabletView } from "./cards/patientDetailsTabletView";
import { VitalsPanel } from "./panels/vitalsDetails";
import { BasicSelect } from "./basicSelect";
import { FaFileAlt } from "react-icons/fa";
import { checkPatientIfOnWaitingAssessment, useParameters } from "@/hooks";


export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string)



  return (
    <MainGrid
      display={{ xs: "none", lg: "flex" }}
      container
      spacing={1}
      mt={"2ch"}
      ml={"9ch"}
    >
      <MainGrid item lg={2}>
        <PersonalDetailsCard />
        <WrapperBox sx={{ my: "1ch" }}>
          <ConsultationCard
            disabled={!isOnList}
            link={"/primary-assessment/" + params.id}
            title="Start Primary Survey"
          />
          <ConsultationCard
            disabled={!isOnList}
            link={"/secondary-assessment/" + params.id}
            title="Start Secondary Survey"
          />
        </WrapperBox>
        <BasicAccordion />
      </MainGrid>
      <MainGrid item lg={9}>
        <MainPaper
          elevation={0}
          sx={{ pb: "5ch", display: { xs: "none", lg: "block" } }}
        >
          <VisitsBar />
          <WrapperBox mx={"2ch"}>
            <WrapperBox sx={{ display: "flex" }}>
              <VitalsPanel />
              <Investigations />
            </WrapperBox>
            <WrapperBox sx={{ display: "flex" }}>
              <ClinicalNotes />
              <Results />
            </WrapperBox>
            <WrapperBox>
              <Medications />
            </WrapperBox>
          </WrapperBox>
        </MainPaper>
      </MainGrid>
    </MainGrid>
  );
};

export const TabletView = () => {
  const visits = [
    { value: "1", label: "Current" },
    { value: "2", label: "12 January 2024" },
    { value: "3", label: "15 December 2023" },
  ];
  return (
    <MainGrid display={{ xs: "block", lg: "none" }} container>
      <MainGrid item xs={12} sx={{ ml: "0.5ch", mt: "2ch", p: "1ch" }}>
        <WrapperBox display="flex">
          <ActionMenu />{" "}
          <WrapperBox sx={{ width: "15ch", mx: "1ch" }}>
            <BasicSelect label="Visits" options={visits} />
          </WrapperBox>
        </WrapperBox>
      </MainGrid>
      <MainGrid item xs={12} sx={{ p: "1ch" }}>
        <WrapperBox sx={{ display: "flex" }}>
          <PersonalDetailsTabletView />
          <VitalsPanel />
        </WrapperBox>
        <WrapperBox sx={{ display: "flex" }}>
          <ClinicalNotes />
          <Investigations />
        </WrapperBox>
        <WrapperBox sx={{ display: "flex" }}>
          <Medications />
          <Results />
        </WrapperBox>
      </MainGrid>
    </MainGrid>
  );
};

const ActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const forms = [...aetcClecking, ...templateForms];

  return (
    <>
      <MainButton
        icon={<FaFileAlt />}
        aria-controls={open ? "basic-menu" : undefined}
        sx={{ borderRadius: "1px" }}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="secondary"
        onClick={handleClick}
        title={"forms"}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {forms.map(({ link, icon, label }) => {
          return (
            <MenuItem key={label} onClick={handleClose}>
              <Link href={link}>
                <WrapperBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: "1ch",
                    px: "2ch",
                  }}
                >
                  {icon && <Image src={icon} alt="AETC Form icon" />}
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
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
