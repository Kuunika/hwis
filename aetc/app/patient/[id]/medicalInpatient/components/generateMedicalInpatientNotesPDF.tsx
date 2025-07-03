"use client";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useReactToPrint } from "react-to-print";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import { PatientInfoTab } from "@/components";
import { encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Visit } from "@/interfaces";
// Define the interface for the component's exposed methods
export interface MedicalInpatientNotesPDFRef {
    generatePDF: () => void;
}

// Define props interface
interface GenerateMedicalInpatientPDFProps {
    onPrintComplete?: () => void;
    showPreview?: boolean; // Add this new prop

}


export const GenerateMedicalInpatientlNotesPDF = forwardRef<MedicalInpatientNotesPDFRef, GenerateMedicalInpatientPDFProps>(
    ({ onPrintComplete, showPreview = false }, ref) => {
        const [row, setRow] = useState<any>(null);
        const { params } = useParameters();
        const { data: patientVisits } = getPatientVisitTypes(params.id as string);
        const { data: encountersData } = getPatientsEncounters(params.id as string);
        const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);

        const [medicalInpatientInfo, setMedicalInpatientInfo] = useState({
            presentingComplaint: "",
            presentingHistory: "",
            medication: "",
            hivProgram: "",
            other: "",
            surgicalHistory: "",
            socialHistory: "",
            familyHistory: "",
            // drugGiven: "",
            allergicReaction: "",
            intoxication: "",
            general: "",
            systolicBloodpressure: "",
            diastolicBloodPressure: "",
            pulseRate: "",
            respiratoryRate: "",
            temperature: "",
            pupilsSymmetrical: "",
            conjunctiva: "",
            oralKS: "",
            oralCandidiasis: "",
            jvpRaised: "",
            lymphadenopathy: "",
        });

        // Ref for printing
        const contentRef = useRef<HTMLDivElement>(null);

        // Setup print function
        const reactToPrintFn = useReactToPrint({
            contentRef,
            onAfterPrint: onPrintComplete
        });

        // Expose the generatePDF method to parent components
        useImperativeHandle(ref, () => ({
            generatePDF: () => {
                reactToPrintFn();
            }
        }));

        useEffect(() => {
            if (!encountersData) return;
            const medicalInpatientEncounter = encountersData
                ?.filter(
                    (encounter) =>
                        encounter.encounter_type &&
                        encounter.encounter_type.uuid === encounters.MEDICAL_IN_PATIENT
                )
                .sort(
                    (a, b) =>
                        new Date(b.encounter_datetime).getTime() -
                        new Date(a.encounter_datetime).getTime()
                )[0];

            if (medicalInpatientEncounter && medicalInpatientEncounter.obs) {
                const inpatientInfo = {
                    presentingComplaint: "",
                    presentingHistory: "",
                    medication: "",
                    hivProgram: "",
                    other: "",
                    surgicalHistory: "",
                    socialHistory: "",
                    familyHistory: "",
                    // drugGiven: "",
                    allergicReaction: "",
                    intoxication: "",
                    general: "",
                    systolicBloodpressure: "",
                    diastolicBloodPressure: "",
                    pulseRate: "",
                    respiratoryRate: "",
                    temperature: "",
                    pupilsSymmetrical: "",
                    conjunctiva: "",
                    oralKS: "",
                    oralCandidiasis: "",
                    jvpRaised: "",
                    lymphadenopathy: "",

                };
                medicalInpatientEncounter.obs.forEach(obs => {
                    const conceptName = obs.names && obs.names.length > 0 ? obs.names[0].name : null;
                    if (conceptName === "Presenting Complaints") {
                        inpatientInfo.presentingComplaint = obs.value || obs.value_text || "";
                    } else if (conceptName === "Presenting history") {
                        inpatientInfo.presentingHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Medication") {
                        inpatientInfo.medication = obs.value || obs.value_text || "";
                    } else if (conceptName === "HIV program") {
                        inpatientInfo.hivProgram = obs.value || obs.value_text || "";
                    } else if (conceptName === "Other") {
                        inpatientInfo.other = obs.value || obs.value_text || "";
                    } else if (conceptName === "Surgical History") {
                        inpatientInfo.surgicalHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Social History") {
                        inpatientInfo.socialHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Family History") {
                        inpatientInfo.familyHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Allergic reaction") {
                        inpatientInfo.allergicReaction = obs.value || obs.value_text || "";
                    } else if (conceptName === "Intoxication") {
                        inpatientInfo.intoxication = obs.value || obs.value_text || "";
                    } else if (conceptName === "General") {
                        inpatientInfo.general = obs.value || obs.value_text || "";
                    } else if (conceptName === "Systolic blood pressure") {
                        inpatientInfo.systolicBloodpressure = obs.value || obs.value_text || "";
                    } else if (conceptName === "Diastolic blood pressure") {
                        inpatientInfo.diastolicBloodPressure = obs.value || obs.value_text || "";
                    } else if (conceptName === "Pulse Rate") {
                        inpatientInfo.pulseRate = obs.value || obs.value_text || "";
                    } else if (conceptName === "Respiratory rate") {
                        inpatientInfo.respiratoryRate = obs.value || obs.value_text || "";
                    } else if (conceptName === "Temperature (c)") {
                        inpatientInfo.temperature = obs.value || obs.value_text || "";
                    } else if (conceptName === "Pupils symmetrical") {
                        inpatientInfo.pupilsSymmetrical = obs.value || obs.value_text || "";
                    } else if (conceptName === "Conjunctiva") {
                        inpatientInfo.conjunctiva = obs.value || obs.value_text || "";
                    } else if (conceptName === "Oral KS") {
                        inpatientInfo.oralKS = obs.value || obs.value_text || "";
                    } else if (conceptName === "Oral candidiasis") {
                        inpatientInfo.oralCandidiasis = obs.value || obs.value_text || "";
                    } else if (conceptName === "JVP raised") {
                        inpatientInfo.jvpRaised = obs.value || obs.value_text || "";
                    } else if (conceptName === "Lymphadenopathy") {
                        inpatientInfo.lymphadenopathy = obs.value || obs.value_text || "";
                    }
                });
                setMedicalInpatientInfo(inpatientInfo);
            }

        }, [encountersData]);

        return (
            <div ref={contentRef} className="printable-content">
                <div className={showPreview ? "print-preview" : "print-only"}>
                    <PatientInfoTab />
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                        Medical Inpatient
                    </h1>

                    {Object.values(medicalInpatientInfo).every((val) => !val) ? (
                        <p style={{ fontStyle: "italic", color: "gray" }}>
                            Medical Inpatient not recorded.
                        </p>
                    ) : (
                        <div className="patient-examination-data">
                            {medicalInpatientInfo.presentingComplaint && (
                                <>
                                    <h2>Complaints</h2>
                                    <p>
                                        <strong>Presenting Complaints: </strong>
                                        {medicalInpatientInfo.presentingComplaint}
                                    </p>
                                </>
                            )}

                            {medicalInpatientInfo.presentingHistory && (
                                <p>
                                    <strong>History of Presenting Complaints: </strong>
                                    {medicalInpatientInfo.presentingHistory}
                                </p>
                            )}

                            {(medicalInpatientInfo.medication ||
                                medicalInpatientInfo.hivProgram ||
                                medicalInpatientInfo.other ||
                                medicalInpatientInfo.surgicalHistory ||
                                medicalInpatientInfo.socialHistory ||
                                medicalInpatientInfo.familyHistory ||
                                medicalInpatientInfo.allergicReaction ||
                                medicalInpatientInfo.intoxication) && (
                                    <>
                                        <h2>Medical History</h2>
                                        {medicalInpatientInfo.medication && (
                                            <p>
                                                <strong>Drug: </strong>
                                                {medicalInpatientInfo.medication}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.hivProgram && (
                                            <p>
                                                <strong>HIV Status: </strong>
                                                {medicalInpatientInfo.hivProgram}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.other && (
                                            <p>
                                                <strong>Other: </strong>
                                                {medicalInpatientInfo.other}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.surgicalHistory && (
                                            <p>
                                                <strong>Surgical History: </strong>
                                                {medicalInpatientInfo.surgicalHistory}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.socialHistory && (
                                            <p>
                                                <strong>Social History: </strong>
                                                {medicalInpatientInfo.socialHistory}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.familyHistory && (
                                            <p>
                                                <strong>Family History: </strong>
                                                {medicalInpatientInfo.familyHistory}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.allergicReaction && (
                                            <p>
                                                <strong>Allergy: </strong>
                                                {medicalInpatientInfo.allergicReaction}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.intoxication && (
                                            <p>
                                                <strong>Intoxication: </strong>
                                                {medicalInpatientInfo.intoxication}
                                            </p>
                                        )}
                                    </>
                                )}

                            {(medicalInpatientInfo.general ||
                                medicalInpatientInfo.systolicBloodpressure ||
                                medicalInpatientInfo.diastolicBloodPressure ||
                                medicalInpatientInfo.pulseRate ||
                                medicalInpatientInfo.respiratoryRate ||
                                medicalInpatientInfo.temperature ||
                                medicalInpatientInfo.pupilsSymmetrical ||
                                medicalInpatientInfo.conjunctiva ||
                                medicalInpatientInfo.oralKS ||
                                medicalInpatientInfo.oralCandidiasis ||
                                medicalInpatientInfo.jvpRaised ||
                                medicalInpatientInfo.lymphadenopathy) && (
                                    <>
                                        <h2>Review of Systems</h2>
                                        {medicalInpatientInfo.general && (
                                            <p>
                                                <strong>General Impression: </strong>
                                                {medicalInpatientInfo.general}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.systolicBloodpressure && (
                                            <p>
                                                <strong>Systolic: </strong>
                                                {medicalInpatientInfo.systolicBloodpressure}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.diastolicBloodPressure && (
                                            <p>
                                                <strong>Diastolic: </strong>
                                                {medicalInpatientInfo.diastolicBloodPressure}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.pulseRate && (
                                            <p>
                                                <strong>Pulse Rate: </strong>
                                                {medicalInpatientInfo.pulseRate}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.respiratoryRate && (
                                            <p>
                                                <strong>Respiratory Rate: </strong>
                                                {medicalInpatientInfo.respiratoryRate}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.temperature && (
                                            <p>
                                                <strong>Temperature: </strong>
                                                {medicalInpatientInfo.temperature}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.pupilsSymmetrical && (
                                            <p>
                                                <strong>Pupils Symmetrical: </strong>
                                                {medicalInpatientInfo.pupilsSymmetrical}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.conjunctiva && (
                                            <p>
                                                <strong>Conjunctiva: </strong>
                                                {medicalInpatientInfo.conjunctiva}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.oralKS && (
                                            <p>
                                                <strong>Oral KS: </strong>
                                                {medicalInpatientInfo.oralKS}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.oralCandidiasis && (
                                            <p>
                                                <strong>Oral Candidiasis: </strong>
                                                {medicalInpatientInfo.oralCandidiasis}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.jvpRaised && (
                                            <p>
                                                <strong>JVP raised: </strong>
                                                {medicalInpatientInfo.jvpRaised}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.lymphadenopathy && (
                                            <p>
                                                <strong>Lymphadenopathy: </strong>
                                                {medicalInpatientInfo.lymphadenopathy}
                                            </p>
                                        )}
                                    </>
                                )}
                        </div>
                    )}

                </div>
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
                        .print-preview {
            display: block; /* show on screen when preview is active */
            border: 1px solid #e0e0e0;
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
            `}</style>


            </div>



        );
    }
);


