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
import { AccordionWithMedication } from "./AccordionWithMedication"; // Import the new component
import { useServerTime } from "@/contexts/serverTimeContext";


const specialtyOptions = [
    { id: concepts.MEDICINE, label: "Medicine" },
    { id: concepts.GENERAL_SURGERY, label: "General Surgery" },
    { id: concepts.ORTHOPEDICS, label: "Orthopedics" },
    { id: concepts.NEUROSURGERY, label: "Neurosurgery" },
    { id: concepts.EAR_NOSE_AND_THROAT_ENT, label: "Ear, Nose, and Throat (ENT)" },
    { id: concepts.DENTAL_AND_MAXILLOFACIAL_SURGERY, label: "Dental and Maxillofacial Surgery" },
    { id: concepts.OPHTHALMOLOGY, label: "Ophthalmology" },
    { id: concepts.PSYCHIATRY, label: "Psychiatry" },
    { id: concepts.GYNAECOLOGY_AND_OBSTETRICS, label: "Gynecology and Obstetrics" },
    { id: concepts.CRITICAL_CARE, label: "Critical Care" },
    { id: concepts.ONCOLOGY, label: "Oncology" },
];

const validationSchema = Yup.object({
    specialtyDepartment: Yup.string().required("Specialty Department is required"),
    reasonForReview: Yup.string().required("Reason for Review is required"),
    reviewDate: Yup.date().required("Date Scheduled for Review is required"),
});

const initialValues = {
    specialtyDepartment: "",
    reasonForReview: "",
    reviewDate: "",
};

export default function AwaitingSpecialityReviewForm({ openPatientSummary }: { openPatientSummary: () => void }) {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
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
                concept: concepts.AWAITING_SPECIALITY_REVIEW,
                value: concepts.AWAITING_SPECIALITY_REVIEW,
                obsDatetime: currentDateTime,
                groupMembers: [
                    { concept: concepts.SPECIALITY_DEPARTMENT, value: values.specialtyDepartment, obsDatetime: currentDateTime },
                    { concept: concepts.REASON_FOR_REQUEST, value: values.reasonForReview, obsDatetime: currentDateTime },
                    { concept: concepts.DATE, value: values.reviewDate, obsDatetime: currentDateTime },

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
            // toast.success("Awaiting Speciality Review information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            // navigateTo("/dispositions");
            openPatientSummary()


        } catch (error) {
            console.error("Error submitting Awaiting Speciality Review information: ", error);
            // toast.error("Failed to submit Awaiting Speciality Review information.");
        }


    };


    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <AccordionWithMedication />
                <MainPaper sx={{ p: 3 }}>
                    <h2>2. Awaiting Specialty Review Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>

                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>

                                    {/* Specialty Department */}
                                    <MainGrid item xs={12}>
                                        <SearchComboBox
                                            name="specialtyDepartment"
                                            label="Specialty Department"
                                            options={specialtyOptions}
                                            multiple={false}

                                        />
                                    </MainGrid>

                                    {/* Reason for Review */}
                                    <MainGrid item xs={12}>
                                        <TextInputField
                                            id="reasonForReview"
                                            name="reasonForReview"
                                            label="Reason for Review"
                                            sx={{ width: "100%" }}
                                            multiline={true}
                                            rows={4}
                                            placeholder="Provide reason for review"
                                        />
                                    </MainGrid>

                                </MainGrid>
                            </MainGrid>

                            {/* Date Scheduled for Review */}
                            <MainGrid item xs={12}>
                                <FormDatePicker
                                    name="reviewDate"
                                    label="Date Scheduled for Review"
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
