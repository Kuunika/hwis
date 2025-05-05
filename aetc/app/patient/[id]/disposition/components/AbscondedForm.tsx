"use client";
import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    FormDatePicker,
    FormTimePicker,
    SearchComboBox,
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
    lastSeenLocation: Yup.string().required("Last Seen Location is required"),
    dateAbsconded: Yup.date().required("Date of Absconding is required"),
    timeAbsconded: Yup.string().required("Time of Absconding is required"),
});

const initialValues = {
    lastSeenLocation: "",
    dateAbsconded: "",
    timeAbsconded: "",
};

export default function AbscondedForm({openPatientSummary}:{openPatientSummary:()=>void}) {
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
                concept: concepts.ABSCONDED,
                value: concepts.ABSCONDED,
                obsDatetime: currentDateTime,
                groupMembers: [
                    { concept: concepts.LAST_SEEN_LOCATION, value: values.lastSeenLocation, obsDatetime: currentDateTime },
                    { concept: concepts.DATE_OF_ABSCONDING, value: values.dateAbsconded, obsDatetime: currentDateTime },
                    { concept: concepts.TIME_OF_ABSCONDING, value: values.timeAbsconded, obsDatetime: currentDateTime },
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
            // toast.success("Absconded information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            // navigateTo("/dispositions");
            openPatientSummary()

        } catch (error) {
            console.error("Error submitting Absconded information: ", error);
            // toast.error("Failed to submit Absconded information.");
        }
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                {/* Include the Accordion with Medication Form */}
                <AccordionWithMedication />
                <MainPaper sx={{ p: 3 }}>
                    <h2>Absconded Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Last Seen Location */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="1"
                                    name="lastSeenLocation"
                                    label="Last Seen Location"
                                    placeholder="Enter the last known location"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Date of Absconding */}
                            <MainGrid item xs={6}>
                                <FormDatePicker

                                    name="dateAbsconded"
                                    label="Date of Absconding"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Time of Absconding */}
                            <MainGrid item xs={6}>
                                <FormTimePicker

                                    name="timeAbsconded"
                                    label="Time of Absconding"
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
