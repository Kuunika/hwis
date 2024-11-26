"use client";

import { useState } from "react";
import {
    MainGrid,
    MainPaper,
    SearchComboBox,
    BackButton,

} from "@/components";
import { PersonalDetailsCard } from "@/app/patient/components";

import TransferForm from "./components/TransferForm";
import DischargeHomeForm from "./components/DischargeHomeForm";
import AbscondedForm from "./components/AbscondedForm";
import AdmissionForm from "./components/AdmissionForm";
import AwaitingSpecialityReviewForm from "./components/AwaitingSpecialityReviewForm";
import DeathForm from "./components/DeathForm";
import RefusedTreatmentForm from "./components/RefusedTreatmentForm";
import ShortStayForm from "./components/ShortStayForm";

const dispositionOptions = [
    { value: "dischargeHome", label: "Discharge home" },
    { value: "awaitingSpecialtyReview", label: "Awaiting specialty review" },
    { value: "admission", label: "Admission" },
    { value: "theatre", label: "Theatre" },
    { value: "interventionSuite", label: "Other intervention suite" },
    { value: "shortStay", label: "Short stay" },
    { value: "transfer", label: "Transfer to another facility" },
    { value: "death", label: "Death" },
    { value: "absconded", label: "Absconded" },
    { value: "refusedTreatment", label: "Refused hospital treatment" },
];

function DispositionFeature() {
    const [selectedDisposition, setSelectedDisposition] = useState<string | null>(
        null
    );

    const renderForm = () => {
        switch (selectedDisposition) {
            case "dischargeHome":
                return <DischargeHomeForm />;
            case "awaitingSpecialtyReview":
                return <AwaitingSpecialityReviewForm />;
            case "admission":
                return <AdmissionForm />;
            case "theatre":
                return <div>Theatre form coming soon!</div>;
            case "interventionSuite":
                return <div>Intervention Suite form coming soon!</div>;
            case "shortStay":
                return <ShortStayForm />;
            case "transfer":
                return <TransferForm />;
            case "death":
                return <DeathForm />;
            case "absconded":
                return <AbscondedForm />;
            case "refusedTreatment":
                return <RefusedTreatmentForm />;
            default:
                return null;
        }
    };

    return (
        <MainGrid container spacing={2} mt={"2ch"}>
            {/* Left Panel */}
            <MainGrid item xs={12} lg={3}>
                <PersonalDetailsCard />
            </MainGrid>

            {/* Main Content */}
            <MainGrid item xs={12} lg={9}>
                <MainPaper elevation={0} sx={{ p: "1ch" }}>
                    <BackButton />
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
                            Select a Disposition
                        </option>
                        {dispositionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>



                    {/* Dynamic Form */}
                    <div style={{ marginTop: "20px" }}>{renderForm()}</div>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}

export default DispositionFeature;
