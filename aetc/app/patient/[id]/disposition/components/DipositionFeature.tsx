"use client";
import React, { useState } from "react";
import {
  MainGrid,
  MainPaper,
  MainTypography,
  PatientInfoTab,
} from "@/components";
import TransferForm from "./TransferForm";
import DischargeHomeForm from "./DischargeHomeForm";
import AbscondedForm from "./AbscondedForm";
import AdmissionForm from "./AdmissionForm";
import AwaitingSpecialityReviewForm from "./AwaitingSpecialityReviewForm";
import DeathForm from "./DeathForm";
import RefusedTreatmentForm from "./RefusedTreatmentForm";
import ShortStayForm from "./ShortStayForm";

import { useParameters } from "@/hooks";
import { concepts } from "@/constants";
import { FaAngleLeft } from "react-icons/fa6";

const dispositionOptions = [
  { id: concepts.DISCHARGE_HOME, label: "Discharge home" },
  {
    id: concepts.AWAITING_SPECIALITY_REVIEW,
    label: "Awaiting specialty review",
  },
  { id: concepts.ADMISSION, label: "Admission" },
  { id: concepts.SHORT_STAY, label: "Short stay" },
  {
    id: concepts.TRANSFER_TO_ANOTHER_FACILITY,
    label: "Transfer to another facility",
  },
  { id: concepts.DEATH, label: "Death" },
  { id: concepts.ABSCONDED, label: "Absconded" },
  {
    id: concepts.REFUSED_HOSPITAL_TREATMENT,
    label: "Refused hospital treatment",
  },
];

function DispositionFeature() {
  const [selectedDisposition, setSelectedDisposition] = useState<string | null>(
    null
  );

  const renderForm = () => {
    switch (selectedDisposition) {
      case concepts.DISCHARGE_HOME:
        return <DischargeHomeForm />;
      case concepts.AWAITING_SPECIALITY_REVIEW:
        return <AwaitingSpecialityReviewForm />;
      case concepts.ADMISSION:
        return <AdmissionForm />;
      case concepts.SHORT_STAY:
        return <ShortStayForm />;
      case concepts.TRANSFER_TO_ANOTHER_FACILITY:
        return <TransferForm />;
      case concepts.DEATH:
        return <DeathForm />;
      case concepts.ABSCONDED:
        return <AbscondedForm />;
      case concepts.REFUSED_HOSPITAL_TREATMENT:
        return <RefusedTreatmentForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <PatientInfoTab />

      <MainGrid container spacing={2} mt={"2ch"} sx={{ ml: 16 }}>
        {/* Main Content */}
        <MainGrid item xs={12} lg={9}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MainTypography
              sx={{
                width: "24px",
                height: "24px",
                fontSize: "20px",
                fontWeight: 400,
              }}
            >
              <FaAngleLeft />
            </MainTypography>
            <MainTypography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                pl: "1ch",
              }}
              onClick={() => window.history.back()}
            >
              Back
            </MainTypography>
          </div>
          <MainPaper elevation={0} sx={{ p: "1ch" }}>
            <h2>Disposition</h2>
            {/* Dropdown */}
            <select
              value={selectedDisposition || ""}
              onChange={(e) => setSelectedDisposition(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "20px",
                fontSize: "16px",
              }}
            >
              <option value="" disabled>
                Select Disposition Option
              </option>
              {dispositionOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Dynamic Form */}
            <div style={{ marginTop: "20px" }}>{renderForm()}</div>
          </MainPaper>
        </MainGrid>
      </MainGrid>
    </>
  );
}

export default DispositionFeature;
