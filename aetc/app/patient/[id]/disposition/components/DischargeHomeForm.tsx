"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    RadioGroupInput,
    PatientInfoTab,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Visit } from "@/interfaces";
import { closeCurrentVisit } from "@/hooks/visit";
import { useNavigation } from "@/hooks"; // Import navigation hook

const followUpOptions = [
    { id: concepts.HEALTH_CENTER, label: "Health Center" },
    { id: concepts.SPECIALIST_CLINIC, label: "Specialist Clinic" },
    { id: concepts.DISTRICT_HOSPITAL, label: "District Hospital" },
];

const specialistClinicOptions = [
    { id: "cardiology", label: "Cardiology" },
    { id: "neurology", label: "Neurology" },
    { id: "orthopedics", label: "Orthopedics" },
    { id: "pediatrics", label: "Pediatrics" },
    { id: "other", label: "Other" },
];
const validationSchema = Yup.object({
    dischargePlan: Yup.string().required("Discharge Plan is required"),
    followUpPlan: Yup.string().required("Follow-Up Plan is required"),
    homeCareInstructions: Yup.string().required(
        "Home Care Instructions are required"
    ),
    //   followUpDetails: Yup.string().required("Follow-Up Details are required"),
    dischargeNotes: Yup.string().required("Discharge Notes are required"),
    // specialistClinic: Yup.string(),
});
const initialValues = {
    dischargePlan: "",
    followUpPlan: "",
    homeCareInstructions: "",
    followUpDetails: "",
    dischargeNotes: "",
    specialistClinic: "",
};

export default function DischargeHomeForm() {
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
    const { navigateTo } = useNavigation(); // Initialize navigation

    // Ref for printing
    const contentRef = useRef<HTMLDivElement>(null);

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
                concept: concepts.DISCHARGE_HOME,
                value: concepts.DISCHARGE_HOME,
                obsDatetime: currentDateTime,
                group_members: [
                    {
                        concept: concepts.DISCHARGE_PLAN,
                        value: values.dischargePlan,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.FOLLOWUP_PLAN,
                        value: values.followUpPlan,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.HOME_CARE_INSTRUCTIONS,
                        value: values.homeCareInstructions,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.FOLLOWUP_DETAILS,
                        value: values.followUpDetails,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.DISCHARGE_NOTES,
                        value: values.dischargeNotes,
                        obsDatetime: currentDateTime,
                    },
                    {
                        concept: concepts.SPECIALIST_CLINIC,
                        value: values.specialistClinic || "",
                        obsDatetime: currentDateTime,
                    },
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
            toast.success("Discharge Home information submitted successfully!");
            // Close the visit after successfully submitting the encounter
            // if (activeVisit?.uuid) {
            //     closeVisit(activeVisit.uuid);
            // }
            navigateTo("/dispositions");

            if (activeVisit?.uuid) {
                closeVisit(activeVisit.uuid);
            }
            navigateTo("/assessments");
        } catch (error) {
            console.error("Error submitting Discharge Home information: ", error);
            toast.error("Failed to submit Discharge Home information.");
        }
    };

    // Updated Print function using the new syntax
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Discharge Home Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        {({ values }) => (
                            <>
                                <div ref={contentRef} className="printable-content">
                                    <div className="print-only">
                                        <PatientInfoTab />
                                        <p>
                                            <strong>Discharge Plan:</strong> {values.dischargePlan}
                                        </p>
                                        <p>
                                            <strong>Followup Plan:</strong> {values.followUpPlan}
                                        </p>
                                        <p>
                                            <strong>Home care Instructions:</strong> {values.homeCareInstructions}
                                        </p>

                                        {/* Conditionally render Follow-Up Details */}
                                        {values.followUpPlan === concepts.YES && (
                                            <>
                                                <p>
                                                    <strong>Follow up details:</strong> {values.followUpDetails}
                                                </p>

                                                <p>
                                                    <strong>Specialist Clinic (if applicable):</strong> {values.specialistClinic}
                                                </p>

                                            </>


                                        )}

                                        <p>
                                            <strong>Discharge notes:</strong> {values.dischargeNotes}
                                        </p>

                                    </div>
                                </div>

                                <MainGrid container spacing={2}>
                                    {/* Discharge Plan */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="dischargePlan"
                                            name="dischargePlan"
                                            label="Discharge Plan"
                                            sx={{ width: "100%" }}
                                            multiline
                                            rows={3}
                                            placeholder="Write the discharge plan"
                                        />
                                    </MainGrid>

                                    {/* Follow-Up Plan */}
                                    <MainGrid item xs={6}>
                                        <RadioGroupInput
                                            name="followUpPlan"
                                            label="Follow-Up Plan"
                                            options={[
                                                { value: concepts.YES, label: "Yes" },
                                                { value: concepts.NO, label: "No" },
                                            ]}
                                        />
                                    </MainGrid>

                                    {/* Home Care Instructions */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="homeCareInstructions"
                                            name="homeCareInstructions"
                                            label="Home Care Instructions"
                                            sx={{ width: "100%" }}
                                            multiline
                                            rows={3}
                                            placeholder="Write specific home care instructions"
                                        />
                                    </MainGrid>

                                    {/* Conditionally render Follow-Up Details and Specialist Clinic fields */}
                                    {values.followUpPlan === concepts.YES && (
                                        <>
                                            <MainGrid item xs={6}>
                                                <SearchComboBox
                                                    name="followUpDetails"
                                                    label="Follow-Up Details"
                                                    options={followUpOptions}
                                                    multiple={false}
                                                />
                                            </MainGrid>

                                            <MainGrid item xs={6}>
                                                <SearchComboBox
                                                    name="specialistClinic"
                                                    label="Specialist Clinic (if applicable)"
                                                    options={specialistClinicOptions}
                                                    multiple={false}
                                                />
                                            </MainGrid>
                                        </>
                                    )}

                                    {/* Discharge Notes */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="dischargeNotes"
                                            name="dischargeNotes"
                                            label="Discharge Notes"
                                            sx={{ width: "100%" }}
                                            multiline
                                            rows={4}
                                            placeholder="Write discharge notes"
                                        />
                                    </MainGrid>



                                    {/* Submit & Print */}
                                    <MainGrid item xs={12}>
                                        <button
                                            type="button"
                                            onClick={() => reactToPrintFn()}
                                            style={{
                                                marginRight: "10px",
                                                padding: "10px 20px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Print Discharge Notes
                                        </button>
                                    </MainGrid>
                                </MainGrid>
                            </>
                        )}
                    </FormikInit>
                </MainPaper>
            </MainGrid>
            {/* CSS for Print Handling */}
            <style jsx>{`
        @media print {
          .print-only {
            display: block !important; /* Ensure visibility in print */
          }
        }
        .print-only {
          display: none; /* Hide on screen */
        }
      `}</style>
        </MainGrid>
    );
}
