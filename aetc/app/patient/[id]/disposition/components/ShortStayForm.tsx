"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    RadioGroupInput,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Visit } from "@/interfaces";
import { closeCurrentVisit } from "@/hooks/visit";
import { useNavigation } from "@/hooks"; // Import navigation hook
import { AccordionWithMedication } from "./AccordionWithMedication"; // Import the new component



const vitalSignsOptions = [
    { value: concepts.YES, label: "Yes" },
    { value: concepts.NO, label: "No" },
];

const validationSchema = Yup.object({
    expectedDuration: Yup.number()
        .min(1, "Duration must be at least 1 hour")
        .required("Expected Duration is required"),
    // reasonForShortStay: Yup.string().required("Reason for Short Stay is required"),
    vitalSignsMonitoring: Yup.string().required("Vital Signs Monitoring option is required"),
    additionalNotes: Yup.string(),
});

const initialValues = {
    expectedDuration: "",
    // reasonForShortStay: "",
    vitalSignsMonitoring: "",
    additionalNotes: "",
};

export default function ShortStayForm() {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
    const { navigateTo } = useNavigation(); // Initialize navigation




    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        const obs = [
            {
                concept: concepts.SHORT_STAY,
                value: concepts.SHORT_STAY,
                obsDatetime: currentDateTime,
                groupMembers: [
                    { concept: concepts.EXPECTED_DURATION, value: values.expectedDuration, obsDatetime: currentDateTime },
                    { concept: concepts.VITAL_SIGNS, value: values.vitalSignsMonitoring, obsDatetime: currentDateTime },
                    { concept: concepts.SOAP_NOTES, value: values.additionalNotes, obsDatetime: currentDateTime },
                ],
            },
        ];

        const payload = {
            encounterType: encounters.DISPOSITION,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            // toast.success("Short Stay information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            navigateTo("/dispositions");

        } catch (error) {
            console.error("Error submitting Short Stay information: ", error);
            // toast.error("Failed to submit Short Stay information.");
        }
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <AccordionWithMedication />
                <MainPaper sx={{ p: 3 }}>
                    <h2>Short Stay Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Expected Duration */}
                            <MainGrid item xs={12} lg={6}>
                                <TextInputField
                                    id="expectedDuration"
                                    name="expectedDuration"
                                    label="Expected Duration (in hours)"
                                    placeholder="e.g., 2"
                                    type="number"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Vital Signs Monitoring */}
                            <MainGrid item xs={12} lg={6}>
                                <RadioGroupInput
                                    name="vitalSignsMonitoring"
                                    label="Will include vital signs monitoring?"
                                    options={vitalSignsOptions}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Reason for Short Stay */}
                            {/* <MainGrid item xs={12}>
                                <TextInputField
                                    id="reasonForShortStay"
                                    name="reasonForShortStay"
                                    label="Reason for Short Stay"
                                    placeholder="Enter the reason for the short stay"
                                    rows={4}
                                    multiline={true}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid> */}

                            {/* Additional Notes */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="additionalNotes"
                                    name="additionalNotes"
                                    label="Additional Notes (SOAP/Continuation Sheets)"
                                    placeholder="Enter additional notes or observations"
                                    rows={4}
                                    multiline={true}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
