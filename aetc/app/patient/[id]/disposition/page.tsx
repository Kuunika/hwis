"use client";
import React, { useEffect, useState } from "react";
import {
  MainGrid,
  MainPaper,
  MainTypography,
  SearchComboBox,
  BackButton,
  WrapperBox,
  PatientInfoTab,
} from "@/components";
import {
  ConsultationCard,
  PersonalDetailsCard,
} from "@/app/patient/components";
import TransferForm from "./components/TransferForm";
import DischargeHomeForm from "./components/DischargeHomeForm";
import AbscondedForm from "./components/AbscondedForm";
import AdmissionForm from "./components/AdmissionForm";
import AwaitingSpecialityReviewForm from "./components/AwaitingSpecialityReviewForm";
import DeathForm from "./components/DeathForm";
import RefusedTreatmentForm from "./components/RefusedTreatmentForm";
import ShortStayForm from "./components/ShortStayForm";


import { concepts } from "@/constants";

import { PatientInfoPrintDialog } from "../../components/dialogs";
import { useNavigation } from "@/hooks";
const dispositionOptions = [
  { id: concepts.DISCHARGE_HOME, label: "Discharge home" },
  { id: concepts.ADMISSION, label: "Admission" },
  {
    id: concepts.AWAITING_SPECIALITY_REVIEW,
    label: "Awaiting specialty review",
  },
  { id: concepts.DEATH, label: "Death" },
  { id: concepts.ABSCONDED, label: "Absconded" },
  {
    id: concepts.REFUSED_HOSPITAL_TREATMENT,
    label: "Refused hospital treatment",
  },
  // { id: concepts.SHORT_STAY, label: "Short stay" },
  {
    id: concepts.TRANSFER_OUT,
    label: "Transfer Out",
  },

];

function DispositionFeature() {
  const { navigateTo } = useNavigation();
  const [initialNotes, setInitialNotes] = useState<any>({
    dischargeNotes: "",
    dischargePlan: "",
    followUpDetails: "",
    followUpPlan: "",
    clinic: "",
    homeCareInstructions: "",
  });
  const [openPatientSummary, setOpenPatientSummary] = useState(false)
  const [selectedDisposition, setSelectedDisposition] = useState<string | null>(
    null
  );


  const openPatientSummaryDialog = () => {
    setOpenPatientSummary(true)
  }


  const renderForm = () => {
    switch (selectedDisposition) {
      case concepts.DISCHARGE_HOME:
        return (
          <DischargeHomeForm
            setInitialNotes={setInitialNotes}
            openPatientSummary={openPatientSummaryDialog}
          />
        );
      case concepts.AWAITING_SPECIALITY_REVIEW:
        return <AwaitingSpecialityReviewForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.ADMISSION:
        return <AdmissionForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.SHORT_STAY:
        return <ShortStayForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.TRANSFER_OUT:
        return <TransferForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.DEATH:
        return <DeathForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.ABSCONDED:
        return <AbscondedForm openPatientSummary={openPatientSummaryDialog} />;
      case concepts.REFUSED_HOSPITAL_TREATMENT:
        return <RefusedTreatmentForm openPatientSummary={openPatientSummaryDialog} />;
      default:
        return null;
    }
  };

  console.log({initialNotes});

  return (
    <>
      <PatientInfoTab />
      <BackButton />
      <MainGrid container spacing={2} mt={"2ch"} sx={{ ml: 16 }}>
        <PatientInfoPrintDialog initialNotes={initialNotes}  onClose={() => navigateTo("/dispositions")} open={openPatientSummary} />
        {/* Main Content */}
        <MainGrid item xs={12} lg={9}>
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
