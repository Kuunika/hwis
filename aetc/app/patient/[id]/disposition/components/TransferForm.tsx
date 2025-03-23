"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    FormDatePicker,
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



const transferNotesOptions = [
    { id: "medicalHistory", label: "Medical History" },
    { id: "currentTreatment", label: "Current Treatment Plan" },
    { id: "diagnosisDetails", label: "Diagnosis Details" },
    { id: "medicationList", label: "Medication List" },
    { id: "allergyInfo", label: "Allergy Information" },
    { id: "otherNotes", label: "Other Notes" },
];

const validationSchema = Yup.object({
    facilityName: Yup.string().required("Facility Name is required"),
    reason: Yup.string().required("Reason for Transfer is required"),
    // transferNotes: Yup.string().required("Select at least one note to include"),

});

const initialValues = {
    facilityName: "",
    reason: "",
    // transferNotes: "",
};

export default function TransferForm() {
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
                concept: concepts.TRANSFER_TO_ANOTHER_FACILITY,
                value: concepts.TRANSFER_TO_ANOTHER_FACILITY,
                obsDatetime: currentDateTime,
                group_members: [
                    { concept: concepts.FACILITY_NAME, value: values.facilityName, obsDatetime: currentDateTime },
                    { concept: concepts.REASON_FOR_TRANSFER, value: values.reason, obsDatetime: currentDateTime },
                    // { concept: concepts.TRANSFER_NOTES, value: values.transferNotes, obsDatetime: currentDateTime },
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
            toast.success("Transfer information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            navigateTo("/dispositions");


        } catch (error) {
            console.error("Error submitting Transfer information: ", error);
            toast.error("Failed to submit Transfer information.");
        }
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Transfer Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Facility Name */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="facilityName"
                                    name="facilityName"
                                    label="Facility Name"
                                    placeholder="Enter Facility Name"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Reason for Transfer */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="reason"
                                    name="reason"
                                    label="Reason for Transfer"
                                    placeholder="Provide reason for transfer"
                                    rows={4}
                                    multiline={true}

                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Transfer Notes */}
                            {/* <MainGrid item xs={12}>
                                <SearchComboBox
                                    name="transferNotes"
                                    label="Notes to Include"
                                    options={transferNotesOptions}
                                    multiple={false}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid> */}
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
