
"use client";

import React, { useState, useEffect } from "react";
import { NewStepperContainer } from "@/components";
import { Box, Button } from "@mui/material";
import { MedicationForm } from "./forms/medicationForm";
// import { MedicationForm } from "../../consultation/components/medication"; // Import the MedicationsForm
import { MedicationsForm } from "../../consultation/components/medication"; // Import the MedicationsForm

import { NonPharmacologicalForm } from "./forms/nonPharmacologicalForm";
import { PatientCareAreaForm } from "./forms/patientCareAreaForm";

export const PatientManagementFlow = () => {
    const [activeStep, setActiveStep] = useState<number>(0);

    const steps = [
        { id: 1, label: "Non-Pharmacological" },
        { id: 2, label: "Patient Care Area" },
        { id: 3, label: "Medication" },

    ];

    useEffect(() => {
        console.log(`Active step is now: ${activeStep}`);
    }, [activeStep]);

    return (
        <NewStepperContainer
            title="Patient Management Plan"
            steps={steps}
            active={activeStep}
            setActive={setActiveStep}
        >

            <>
                <NonPharmacologicalForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(2)}
                />
            </>
            <>
                <PatientCareAreaForm onSkip={() => { }} onSubmit={() => { }} />
                <StepButtons
                    onNext={() => setActiveStep(2)}
                    onPrevious={() => setActiveStep(1)}
                />
            </>
            <>
                <MedicationsForm onSkip={() => { }} onSubmit={() => { }} />
                {/* <MedicationForm /> */}
                <StepButtons
                    onPrevious={() => setActiveStep(1)}
                />
            </>


        </NewStepperContainer>
    );
};

const StepButtons = ({
    onPrevious,
    onNext,
}: {
    onPrevious?: () => void;
    onNext?: () => void;
}) => {
    return (
        <Box sx={{ mt: "1ch" }}>
            {onPrevious && (
                <Button
                    sx={{ mr: "0.5ch" }}
                    size="small"
                    variant="contained"
                    color="inherit"
                    onClick={onPrevious}
                >
                    Previous
                </Button>
            )}
            {onNext && (
                <Button size="small" variant="contained" color="inherit"
                    onClick={onNext}>
                    Next
                </Button>
            )}
        </Box>
    );
};
