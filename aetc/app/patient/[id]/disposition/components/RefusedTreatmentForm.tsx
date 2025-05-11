"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    FormDatePicker,
    RadioGroupInput,
    MainButton
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
import { useServerTime } from "@/contexts/serverTimeContext";




const validationSchema = Yup.object({
    reasonForRefusal: Yup.string().required("Reason for refusal is required"),
    plansToReturn: Yup.string().required("Please select plans to return for treatment"),
    dateOfRefusal: Yup.date().required("Date of refusal is required"),
    witnessName: Yup.string().required("Witness name is required"),
});

const initialValues = {
    reasonForRefusal: "",
    plansToReturn: "",
    dateOfRefusal: "",
    witnessName: "",
};

export default function RefusedTreatmentForm({ openPatientSummary }: { openPatientSummary: () => void }) {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
    const { navigateTo } = useNavigation(); // Initialize navigation
    const { init, ServerTime } = useServerTime();





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
        const currentDateTime = ServerTime.getServerTimeString();

        const obs = [
            {
                concept: concepts.REFUSED_HOSPITAL_TREATMENT,
                value: concepts.REFUSED_HOSPITAL_TREATMENT,
                obsDatetime: currentDateTime,
                groupMembers: [
                    { concept: concepts.REASON_FOR_REFUSAL, value: values.reasonForRefusal, obsDatetime: currentDateTime },
                    { concept: concepts.PLANS_TO_RETURN_FOR_TREATMENT, value: values.plansToReturn, obsDatetime: currentDateTime },
                    { concept: concepts.DATE_OF_REFUSAL, value: values.dateOfRefusal, obsDatetime: currentDateTime },
                    { concept: concepts.WITNESS_NAME, value: values.witnessName, obsDatetime: currentDateTime },
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
            // toast.success("Refused Hospital Treatment information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            // navigateTo("/dispositions");
            openPatientSummary()


        } catch (error) {
            console.error("Error submittingRefused Hospital Treatment information: ", error);
            // toast.error("Failed to submit Refused Hospital Treatment  information.");
        }
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <AccordionWithMedication />
                <MainPaper sx={{ p: 3 }}>
                    <h2>Refused Treatment Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Reason for Refusal */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="1"
                                    name="reasonForRefusal"
                                    label="Reason for Refusal"
                                    placeholder="Enter the reason for refusal"
                                    sx={{ width: "100%" }}
                                    multiline
                                    rows={3}
                                />
                            </MainGrid>

                            {/* Plans to Return for Treatment */}
                            <MainGrid item xs={12}>
                                <RadioGroupInput
                                    name="plansToReturn"
                                    label="Plans to Return for Treatment"
                                    options={[
                                        { value: concepts.YES, label: "Yes" },
                                        { value: concepts.NO, label: "No" },
                                    ]}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Date of Refusal */}
                            <MainGrid item xs={6}>
                                <FormDatePicker
                                    name="dateOfRefusal"
                                    label="Date of Refusal"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Witness Name */}
                            <MainGrid item xs={6}>
                                <TextInputField
                                    id="3"

                                    name="witnessName"
                                    label="Witness Name"
                                    placeholder="Enter name of witness"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Submit Button */}
                            <MainGrid item xs={12}>
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
