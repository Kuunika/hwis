"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    TextInputField,
    PatientInfoTab,
} from "@/components";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import * as Yup from "yup";
import { useParameters } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getPatientsEncounters } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { Visit } from "@/interfaces";
type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
const validationSchema = Yup.object({});
//concepts:CLERK_NAME,  DESIGNATION, SIGNATURE
export const InitialManagementForm = ({ onSubmit, onSkip }: Prop) => {
    const [row, setRow] = useState<any>(null);
    const { params } = useParameters();
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { data: encountersData } = getPatientsEncounters(params.id as string);
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const [clerkInfo, setClerkInfo] = useState({
        clerkName: "",
    });
    // Ref for printing
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!encountersData) return;

        // Find the latest SURGICAL_NOTES_TEMPLATE_FORM encounter
        const surgicalEncounter = encountersData
            ?.filter((encounter) => encounter.encounter_type.uuid === encounters.SURGICAL_NOTES_TEMPLATE_FORM)
            .sort((a, b) => new Date(b.encounter_datetime).getTime() - new Date(a.encounter_datetime).getTime())[0];

        console.log("Encounters Data:", encountersData);
        console.log("Filtered Surgical Encounter:", surgicalEncounter);

        if (surgicalEncounter) {
            setClerkInfo({
                clerkName: surgicalEncounter.created_by || "Unknown",
                // designation: " ", // Default or dynamic based on auth system
            });
        }
    }, [encountersData]);

    useEffect(() => {
        // Find the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);
    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();
        // Create observations
        const obs = [
            {
                concept: concepts.ADDITIONAL_NOTES,
                value: values.additionalNotes,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.CLERK_NAME,
                value: values.clerkName,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.DESIGNATION,
                value: values.designation,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.SIGNATURE,
                value: values.signature,
                obsDatetime: currentDateTime,
            },
        ];
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };
        try {
            await submitEncounter(payload);
            console.log("Initial Management submitted successfully!");
            onSubmit(values); // This triggers navigation to the next step
        } catch (error) {
            console.error("Error submitting Initial Management:", error);
        }
        reactToPrintFn(); // Trigger printing after submission

    };
    // Updated Print function using the new syntax
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <FormikInit
            initialValues={{
                additionalNotes: "",
                clerkName: clerkInfo.clerkName,
                designation: "",
                signature: "",
            }}
            validationSchema={validationSchema}
            submitButtonText="Submit and Print to PDF"
            onSubmit={handleSubmit}
            enableReinitialize // **Allows the form to update with new clerkInfo**
        >
            <div ref={contentRef} className="printable-content">
                <div className="print-only">
                    <PatientInfoTab />
                    <PrescribedMedicationList setRow={setRow} />
                    <p><strong>Clerk Name:</strong> {clerkInfo.clerkName}</p>
                    <p><strong>Designation:</strong></p>
                    <p><strong>Additional Notes:</strong> {/* Dynamically filled value */}</p>
                </div>

            </div>
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    {/* Prescribed Medication Section */}
                    {/* <FormFieldContainerLayout title="Prescribed Medication"> */}
                    <PrescribedMedicationList setRow={setRow} />
                    {/* </FormFieldContainerLayout> */}

                    {/* Additional Information Section */}
                    <FormFieldContainerLayout title="Additional Information">
                        <TextInputField
                            sx={{ width: "100%" }}

                            name="additionalNotes"
                            label="Additional Notes"
                            multiline
                            rows={5}
                            placeholder="Enter any additional information here..."
                            id={""}
                        />
                    </FormFieldContainerLayout>

                    {/* Clerk Information Section */}
                    <FormFieldContainerLayout title="Clerk Information">
                        <TextInputField
                            name="clerkName"
                            label="Clerked by (Name)" id={""} />
                        <TextInputField
                            name="designation"
                            label="Designation"

                            id={""} />
                        <TextInputField
                            name="signature"
                            label="Signature"
                            placeholder="E.g J.Smith"
                            id={""}
                        />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
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
        </FormikInit>
    );
};