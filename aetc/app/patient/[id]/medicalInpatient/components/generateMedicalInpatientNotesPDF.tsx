"use client";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useReactToPrint } from "react-to-print";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import { LabOrderPlanTable } from "@/app/patient/components/panels/labOrderPlanTable";
import { BedsideResults } from "@/app/patient/components/panels/bedsideResults";
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
            presentingComplaint: [] as Array<{ complaint: string, duration: string }>,
            presentingHistory: "",
            medication: [] as string[],        // 👈 was string
            hivProgram: "",
            onARV: "",
            healthCenter: "",
            other: "",
            surgicalHistory: "",
            socialHistory: "",
            familyHistory: "",
            // drugGiven: "",
            allergicReaction: [] as string[],  // 👈 was string
            intoxication: [] as string[],
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
            // ✅ New Fields
            symmetricalExpansion: "",
            apexBeat: "",
            thrillHeaves: "",
            auscultation: "",
            auscultationLung: "",
            edema: "",
            skinRash: "",
            herpesZosterScar: "",
            nuchalRigidity: "",
            motorResponse: "",
            verbalResponse: "",
            eyeOpeningResponse: "",
            pupil: "",
            visualFieldAcuity: "",
            eyeMovementsNystagmus: "",
            eyeMovementsSensation: "",
            hearing: "",
            tongueMovementTastes: "",
            coughGagReflex: "",
            power: "",
            tone: "",
            reflexes: "",
            plantars: "",
            sensation: "",
            coordination: "",
            summary: "",
            generalReview: [] as string[],
            ent: [] as string[],
            endocrine: [] as string[],
            cardiac: [] as string[],
            respiratory: [] as string[],
            gastrointestinal: [] as string[],
            genitourinary: [] as string[],
            musculoskeletal: [] as string[],
            neurologic: [] as string[],
            psychiatric: [] as string[],
            integumentary: [] as string[],
            differentialDiagnosis: [] as string[],
            additionalNotes: "",
            admittingOfficer: "", // Default value


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
                const admittingOfficer = medicalInpatientEncounter.created_by || "";

                const inpatientInfo = {
                    presentingComplaint: [] as Array<{ complaint: string, duration: string }>,
                    presentingHistory: "",
                    medication: [] as string[],
                    hivProgram: "",
                    healthCenter: "",
                    onARV: "",
                    other: "",
                    surgicalHistory: "",
                    socialHistory: "",
                    familyHistory: "",
                    // drugGiven: "",
                    allergicReaction: [] as string[],
                    intoxication: [] as string[],
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
                    // ✅ New Fields
                    symmetricalExpansion: "",
                    apexBeat: "",
                    thrillHeaves: "",
                    auscultation: "",
                    auscultationLung: "",
                    edema: "",
                    skinRash: "",
                    herpesZosterScar: "",
                    nuchalRigidity: "",
                    motorResponse: "",
                    verbalResponse: "",
                    eyeOpeningResponse: "",
                    pupil: "",
                    visualFieldAcuity: "",
                    eyeMovementsNystagmus: "",
                    eyeMovementsSensation: "",
                    hearing: "",
                    tongueMovementTastes: "",
                    coughGagReflex: "",
                    power: "",
                    tone: "",
                    reflexes: "",
                    plantars: "",
                    sensation: "",
                    coordination: "",
                    summary: "",
                    generalReview: [] as string[],
                    ent: [] as string[],
                    endocrine: [] as string[],
                    cardiac: [] as string[],
                    respiratory: [] as string[],
                    gastrointestinal: [] as string[],
                    genitourinary: [] as string[],
                    musculoskeletal: [] as string[],
                    neurologic: [] as string[],
                    psychiatric: [] as string[],
                    integumentary: [] as string[],
                    differentialDiagnosis: [] as string[],
                    additionalNotes: "",
                    admittingOfficer: admittingOfficer, // Use the created_by field as the admitting officer


                };
                medicalInpatientEncounter.obs.forEach(obs => {
                    const conceptName = obs.names && obs.names.length > 0 ? obs.names[0].name : null;
                    if (conceptName === "Presenting Complaints") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childValue = child.names[0].name || "";
                                let duration = "";

                                // Check if this child has duration information
                                if (child.children && child.children.length > 0) {
                                    const durationChild = child.children.find(grandChild =>
                                        grandChild.names && grandChild.names.length > 0 &&
                                        grandChild.names[0].name === "Duration"
                                    );
                                    if (durationChild) {
                                        duration = durationChild.value || durationChild.value_text || "";
                                    }
                                }

                                if (childValue) {
                                    inpatientInfo.presentingComplaint.push({
                                        complaint: childValue,
                                        duration: duration
                                    });
                                }
                            });
                        }
                    } else if (conceptName === "Presenting history") {
                        inpatientInfo.presentingHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Medication") {
                        if (obs.children && obs.children.length > 0) {
                            inpatientInfo.medication = obs.children
                                .map((child: any) => child.value_text || child.value || "")
                                .filter(Boolean);
                        } else {
                            inpatientInfo.medication = [(obs.value_text || obs.value || "")].filter(Boolean);
                        }
                    }
                    else if (conceptName === "HIV program") {
                        inpatientInfo.hivProgram = obs.value || obs.value_text || "";
                    } else if (conceptName === "On arv") {
                        inpatientInfo.onARV = obs.value || obs.value_text || "";
                    } else if (conceptName === "Health center") {
                        inpatientInfo.healthCenter = obs.value || obs.value_text || "";
                    } else if (conceptName === "Other") {
                        inpatientInfo.other = obs.value || obs.value_text || "";
                    } else if (conceptName === "Surgical History") {
                        inpatientInfo.surgicalHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Social History") {
                        inpatientInfo.socialHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Family History") {
                        inpatientInfo.familyHistory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Allergic reaction") {
                        if (obs.children && obs.children.length > 0) {
                            const newAllergies = obs.children
                                .map((child: any) => child.value_text || child.value || "")
                                .filter(Boolean);
                            inpatientInfo.allergicReaction.push(...newAllergies);
                        } else {
                            const directValue = obs.value_text || obs.value || "";
                            if (directValue) {
                                inpatientInfo.allergicReaction.push(directValue);
                            }
                        }
                    } else if (conceptName === "Intoxication") {
                        const intoxicationValues = obs.children
                            ?.filter(
                                (child) =>
                                    child.names &&
                                    child.names.length > 0 &&
                                    child.names[0].name === "Intoxication"
                            )
                            .map((child) => child.value || child.value_text)
                            .filter(Boolean);

                        inpatientInfo.intoxication = intoxicationValues || "";
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
                    // ✅ New Fields
                    else if (conceptName === "symmetrical expansion") {
                        inpatientInfo.symmetricalExpansion = obs.value || obs.value_text || "";
                    } else if (conceptName === "Apex beat") {
                        inpatientInfo.apexBeat = obs.value || obs.value_text || "";
                    } else if (conceptName === "Thrill heaves") {
                        inpatientInfo.thrillHeaves = obs.value || obs.value_text || "";
                    } else if (conceptName === "Auscultation") {
                        inpatientInfo.auscultation = obs.value || obs.value_text || "";
                    } else if (conceptName === "Auscultation Lung") {
                        inpatientInfo.auscultationLung = obs.value || obs.value_text || "";
                    } else if (conceptName === "Edema") {
                        inpatientInfo.edema = obs.value || obs.value_text || "";
                    } else if (conceptName === "Skin rash") {
                        inpatientInfo.skinRash = obs.value || obs.value_text || "";
                    } else if (conceptName === "Herpes Zoster Scar") {
                        inpatientInfo.herpesZosterScar = obs.value || obs.value_text || "";
                    } else if (conceptName === "Nuchal rigidity") {
                        inpatientInfo.nuchalRigidity = obs.value || obs.value_text || "";
                    } else if (conceptName === "Motor response") {
                        inpatientInfo.motorResponse = obs.value || obs.value_text || "";
                    } else if (conceptName === "Verbal response") {
                        inpatientInfo.verbalResponse = obs.value || obs.value_text || "";
                    } else if (conceptName === "Eye Opening response") {
                        inpatientInfo.eyeOpeningResponse = obs.value || obs.value_text || "";
                    } else if (conceptName === "Pupil") {
                        inpatientInfo.pupil = obs.value || obs.value_text || "";
                    } else if (conceptName === "Visual Field Acuity") {
                        inpatientInfo.visualFieldAcuity = obs.value || obs.value_text || "";
                    } else if (conceptName === "Eye Movements/Nystagmus") {
                        inpatientInfo.eyeMovementsNystagmus = obs.value || obs.value_text || "";
                    } else if (conceptName === "Eye Movements/Sensation") {
                        inpatientInfo.eyeMovementsSensation = obs.value || obs.value_text || "";
                    }
                    else if (conceptName === "Hearing") {
                        inpatientInfo.hearing = obs.value || obs.value_text || "";
                    } else if (conceptName === "Tongue Movement/Tastes") {
                        inpatientInfo.tongueMovementTastes = obs.value || obs.value_text || "";
                    } else if (conceptName === "Cough Gag Reflex") {
                        inpatientInfo.coughGagReflex = obs.value || obs.value_text || "";
                    } else if (conceptName === "Power") {
                        inpatientInfo.power = obs.value || obs.value_text || "";
                    } else if (conceptName === "Tone") {
                        inpatientInfo.tone = obs.value || obs.value_text || "";
                    } else if (conceptName === "Reflexes") {
                        inpatientInfo.reflexes = obs.value || obs.value_text || "";
                    } else if (conceptName === "Plantars") {
                        inpatientInfo.plantars = obs.value || obs.value_text || "";
                    } else if (conceptName === "Sensation") {
                        inpatientInfo.sensation = obs.value || obs.value_text || "";
                    } else if (conceptName === "Coordination") {
                        inpatientInfo.coordination = obs.value || obs.value_text || "";
                    } else if (conceptName === "Summary") {
                        inpatientInfo.summary = obs.value || obs.value_text || "";
                    } else if (conceptName === "Additional Notes") {
                        inpatientInfo.additionalNotes = obs.value || obs.value_text || "";
                    }
                    // Review of Systems mapping
                    else if (conceptName === "Review of systems, general") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                // Extract the value instead of the name
                                const childValue = child.value;
                                if (childValue) {
                                    inpatientInfo.generalReview.push(childValue);
                                }
                            });
                        }
                    }
                    // else if (conceptName === "Review of systems, general") {
                    //     if (obs.children && obs.children.length > 0) {
                    //         obs.children.forEach(child => {
                    //             const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                    //             if (childName) {
                    //                 inpatientInfo.generalReview.push(childName);
                    //             }
                    //         });
                    //     }
                    // }

                    else if (conceptName === "Review of systems ENT") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.ent.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review of systems  endocrine") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.endocrine.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review of systems cardiac") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.cardiac.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Severe Respiratory") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.respiratory.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review Of Systems Gastrointestinal") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.gastrointestinal.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review Of Systems Genitourinary") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.genitourinary.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review of systems musculoskeletal") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.musculoskeletal.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review of systems neurologic") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.neurologic.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Review of systems psychiatric") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.psychiatric.push(childName);
                                }
                            });
                        }
                    } else if (conceptName === "Skin Infection") {
                        if (obs.children && obs.children.length > 0) {
                            obs.children.forEach(child => {
                                const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                                if (childName) {
                                    inpatientInfo.integumentary.push(childName);
                                }
                            });
                        }
                    }

                    else if (conceptName === "Attempted/ Differential Diagnosis") {
                        const diffDiagnosisValues = obs.children
                            ?.filter(
                                (child) =>
                                    child.names &&
                                    child.names.length > 0 &&
                                    child.names[0].name === "Attempted/ Differential Diagnosis"
                            )
                            .map((child) => child.value || child.value_text)
                            .filter(Boolean);

                        inpatientInfo.differentialDiagnosis = diffDiagnosisValues || "";
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
                        Medical Inpatient Admission Sheet                    </h1>

                    {Object.values(medicalInpatientInfo).every((val) => (typeof val === "string" ? !val.trim() : val.length === 0)
                    ) ? (
                        <p style={{ fontStyle: "italic", color: "gray" }}>
                            Medical Inpatient Admission Sheet not recorded.
                        </p>
                    ) : (
                        <div className="patient-examination-data">
                            {medicalInpatientInfo.presentingComplaint && (
                                <>
                                    <h2>Complaints</h2>
                                    <p>
                                        <strong>Presenting Complaints: </strong>
                                        {medicalInpatientInfo.presentingComplaint.map((item, index) => `(${index + 1}) ${item.complaint}${item.duration ? ` - Duration: ${item.duration}` : ''}`
                                        ).join(", ")
                                        }
                                    </p>
                                </>
                            )}

                            {medicalInpatientInfo.presentingHistory && (
                                <p>
                                    <strong>History of Presenting Complaints: </strong>
                                    {medicalInpatientInfo.presentingHistory}
                                </p>

                            )}
                            <hr />


                            {(medicalInpatientInfo.medication ||
                                medicalInpatientInfo.hivProgram ||
                                medicalInpatientInfo.onARV ||
                                medicalInpatientInfo.healthCenter ||
                                medicalInpatientInfo.other ||
                                medicalInpatientInfo.surgicalHistory ||
                                medicalInpatientInfo.socialHistory ||
                                medicalInpatientInfo.familyHistory ||
                                medicalInpatientInfo.allergicReaction ||
                                medicalInpatientInfo.intoxication) && (
                                    <>
                                        <h2>Medical History</h2>
                                        {medicalInpatientInfo.medication.length > 0 && (
                                            <p>
                                                <strong>Drug: </strong>
                                                {medicalInpatientInfo.medication.map((item, index) => `(${index + 1}) ${item}`).join(", ")}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.hivProgram && (
                                            <p>
                                                <strong>HIV Status: </strong>
                                                {medicalInpatientInfo.hivProgram}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.onARV && (
                                            <p>
                                                <strong>On ARV: </strong>
                                                {medicalInpatientInfo.onARV}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.healthCenter && (
                                            <p>
                                                <strong>Referral Medical Facility: </strong>
                                                {medicalInpatientInfo.healthCenter}
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
                                        {medicalInpatientInfo.allergicReaction.length > 0 && (
                                            <p>
                                                <strong>Allergy: </strong>
                                                {medicalInpatientInfo.allergicReaction.map((item, index) => `(${index + 1}) ${item}`).join(", ")}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.intoxication.length > 0 && (
                                            <p>
                                                <strong>Intoxication: </strong>
                                                {medicalInpatientInfo.intoxication.map((item, index) => `(${index + 1}) ${item}`).join(", ")}
                                            </p>
                                        )}
                                    </>
                                )}
                            <hr />
                            {(medicalInpatientInfo.generalReview ||
                                medicalInpatientInfo.ent ||
                                medicalInpatientInfo.endocrine ||
                                medicalInpatientInfo.cardiac ||
                                medicalInpatientInfo.respiratory ||
                                medicalInpatientInfo.gastrointestinal ||
                                medicalInpatientInfo.genitourinary ||
                                medicalInpatientInfo.musculoskeletal ||
                                medicalInpatientInfo.neurologic ||
                                medicalInpatientInfo.psychiatric ||
                                medicalInpatientInfo.integumentary

                            ).length > 0 && (
                                    <>
                                        <h2>Review of Systems</h2>
                                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.generalReview.length > 0 && (
                                                            <>
                                                                <strong>General(Constitutional): </strong>
                                                                {/* {medicalInpatientInfo.generalReview} */}
                                                                {medicalInpatientInfo.generalReview.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}

                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.ent.length > 0 && (
                                                            <>
                                                                <strong>HEENT: </strong>
                                                                {/* {medicalInpatientInfo.ent} */}
                                                                {medicalInpatientInfo.ent.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.endocrine.length > 0 && (
                                                            <>
                                                                <strong>Endocrine: </strong>
                                                                {/* {medicalInpatientInfo.endocrine} */}
                                                                {medicalInpatientInfo.endocrine.map((item, index) => `(${index + 1}) ${item}`).join(", ")}


                                                            </>
                                                        )}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.cardiac.length > 0 && (
                                                            <>
                                                                <strong>Cardiovascular: </strong>
                                                                {/* {medicalInpatientInfo.cardiac} */}
                                                                {medicalInpatientInfo.cardiac.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.respiratory.length > 0 && (
                                                            <>
                                                                <strong>Respiratory: </strong>
                                                                {/* {medicalInpatientInfo.respiratory} */}
                                                                {medicalInpatientInfo.respiratory.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.gastrointestinal.length > 0 && (
                                                            <>
                                                                <strong>Gastrointestinal: </strong>
                                                                {/* {medicalInpatientInfo.gastrointestinal} */}
                                                                {medicalInpatientInfo.gastrointestinal.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.genitourinary.length > 0 && (
                                                            <>
                                                                <strong>Genitourinary: </strong>
                                                                {/* {medicalInpatientInfo.genitourinary} */}
                                                                {medicalInpatientInfo.genitourinary.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}</td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.musculoskeletal.length > 0 && (
                                                            <>
                                                                <strong>Musculoskeletal: </strong>
                                                                {/* {medicalInpatientInfo.musculoskeletal} */}
                                                                {medicalInpatientInfo.musculoskeletal.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.neurologic.length > 0 && (
                                                            <>
                                                                <strong>Neurological: </strong>
                                                                {/* {medicalInpatientInfo.neurologic} */}
                                                                {medicalInpatientInfo.neurologic.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )}   </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.psychiatric.length > 0 && (
                                                            <>
                                                                <strong>Psychiatric: </strong>
                                                                {/* {medicalInpatientInfo.psychiatric} */}
                                                                {medicalInpatientInfo.psychiatric.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )} </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.integumentary.length > 0 && (
                                                            <>
                                                                <strong>Integumentary(Skin): </strong>
                                                                {/* {medicalInpatientInfo.integumentary} */}
                                                                {medicalInpatientInfo.integumentary.map((item, index) => `(${index + 1}) ${item}`).join(", ")}

                                                            </>
                                                        )} </td>

                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr />

                                    </>
                                )
                            }



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
                                medicalInpatientInfo.lymphadenopathy ||
                                medicalInpatientInfo.symmetricalExpansion ||
                                medicalInpatientInfo.apexBeat ||
                                medicalInpatientInfo.thrillHeaves ||
                                medicalInpatientInfo.auscultation ||
                                medicalInpatientInfo.auscultationLung ||
                                medicalInpatientInfo.edema ||
                                medicalInpatientInfo.skinRash ||
                                medicalInpatientInfo.herpesZosterScar ||
                                medicalInpatientInfo.nuchalRigidity ||
                                medicalInpatientInfo.motorResponse ||
                                medicalInpatientInfo.verbalResponse ||
                                medicalInpatientInfo.eyeOpeningResponse ||
                                medicalInpatientInfo.pupil ||
                                medicalInpatientInfo.visualFieldAcuity ||
                                medicalInpatientInfo.eyeMovementsNystagmus ||
                                medicalInpatientInfo.eyeMovementsSensation ||
                                medicalInpatientInfo.hearing ||
                                medicalInpatientInfo.tongueMovementTastes ||
                                medicalInpatientInfo.coughGagReflex ||
                                medicalInpatientInfo.power ||
                                medicalInpatientInfo.tone ||
                                medicalInpatientInfo.reflexes ||
                                medicalInpatientInfo.plantars ||
                                medicalInpatientInfo.sensation ||
                                medicalInpatientInfo.coordination ||
                                medicalInpatientInfo.summary ||
                                medicalInpatientInfo.differentialDiagnosis ||
                                medicalInpatientInfo.additionalNotes ||
                                medicalInpatientInfo.admittingOfficer

                            )
                                && (
                                    <>
                                        <h2>Physical Examination</h2>
                                        {medicalInpatientInfo.general && (
                                            <p>
                                                <strong>General Impression: </strong>
                                                {medicalInpatientInfo.general}
                                            </p>
                                        )}


                                        <h3>Vital Signs</h3>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "10px" }}>


                                            {medicalInpatientInfo.systolicBloodpressure && (
                                                <p>
                                                    <strong>Systolic: </strong>
                                                    {medicalInpatientInfo.systolicBloodpressure} mmHg
                                                </p>
                                            )}
                                            {medicalInpatientInfo.diastolicBloodPressure && (
                                                <p>
                                                    <strong>Diastolic: </strong>
                                                    {medicalInpatientInfo.diastolicBloodPressure} mmHg
                                                </p>
                                            )}
                                            {medicalInpatientInfo.pulseRate && (
                                                <p>
                                                    <strong>Pulse Rate: </strong>
                                                    {medicalInpatientInfo.pulseRate} bpm
                                                </p>
                                            )}
                                            {medicalInpatientInfo.respiratoryRate && (
                                                <p>
                                                    <strong>Respiratory Rate: </strong>
                                                    {medicalInpatientInfo.respiratoryRate} breaths/min
                                                </p>
                                            )}
                                            {medicalInpatientInfo.temperature && (
                                                <p>
                                                    <strong>Temperature: </strong>
                                                    {medicalInpatientInfo.temperature} °C
                                                </p>
                                            )}
                                        </div>


                                        <h3>Head and Neck</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "10px" }}>




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

                                        </div>
                                        <h3>Chest and Lungs</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "10px" }}>

                                            {medicalInpatientInfo.symmetricalExpansion && (
                                                <p>
                                                    <strong>Symmetrical Expansion: </strong>
                                                    {medicalInpatientInfo.symmetricalExpansion}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.apexBeat && (
                                                <p>
                                                    <strong>Apex Beat: </strong>
                                                    {medicalInpatientInfo.apexBeat}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.thrillHeaves && (
                                                <p>
                                                    <strong>Thrill Heaves: </strong>
                                                    {medicalInpatientInfo.thrillHeaves}
                                                </p>
                                            )}
                                        </div>


                                        {medicalInpatientInfo.auscultation && (
                                            <p>
                                                <strong>Auscultation: </strong>
                                                {medicalInpatientInfo.auscultation}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.auscultationLung && (
                                            <p>
                                                <strong>Auscultation Lung: </strong>
                                                {medicalInpatientInfo.auscultationLung}
                                            </p>
                                        )}
                                        {medicalInpatientInfo.edema && (
                                            <p>
                                                <strong>Oedema: </strong>
                                                {medicalInpatientInfo.edema}
                                            </p>
                                        )}

                                        <h3>Skin</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "10px" }}>

                                            {medicalInpatientInfo.skinRash && (
                                                <p>
                                                    <strong>Skin Rash: </strong>
                                                    {medicalInpatientInfo.skinRash}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.herpesZosterScar && (
                                                <p>
                                                    <strong>Herpes Zoster Scar: </strong>
                                                    {medicalInpatientInfo.herpesZosterScar}
                                                </p>
                                            )}
                                        </div>
                                        <h3>Neurological Examination</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "10px" }}>


                                            {medicalInpatientInfo.nuchalRigidity && (
                                                <p>
                                                    <strong>Nuchal Rigidity: </strong>
                                                    {medicalInpatientInfo.nuchalRigidity}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.motorResponse && (
                                                <p>
                                                    <strong>Motor Response: </strong>
                                                    {medicalInpatientInfo.motorResponse}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.verbalResponse && (
                                                <p>
                                                    <strong>Verbal Response: </strong>
                                                    {medicalInpatientInfo.verbalResponse}
                                                </p>
                                            )}
                                            {medicalInpatientInfo.eyeOpeningResponse && (
                                                <p>
                                                    <strong>Eye Opening Response: </strong>
                                                    {medicalInpatientInfo.eyeOpeningResponse}
                                                </p>
                                            )}

                                        </div>
                                        <br />
                                        <h3>Cranial and Peripheral Nerves</h3>

                                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>

                                                        {medicalInpatientInfo.pupil && (
                                                            <p>
                                                                <strong>Pupil: </strong>
                                                                {medicalInpatientInfo.pupil}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.visualFieldAcuity && (
                                                            <p>
                                                                <strong>Visual Field Acuity: </strong>
                                                                {medicalInpatientInfo.visualFieldAcuity}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.eyeMovementsNystagmus && (
                                                            <p>
                                                                <strong>Eye Movements Nystagmus: </strong>
                                                                {medicalInpatientInfo.eyeMovementsNystagmus}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.eyeMovementsSensation && (
                                                            <p>
                                                                <strong>Eye Movements Sensation: </strong>
                                                                {medicalInpatientInfo.eyeMovementsSensation}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.hearing && (
                                                            <p>
                                                                <strong>Hearing: </strong>
                                                                {medicalInpatientInfo.hearing}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.tongueMovementTastes && (
                                                            <p>
                                                                <strong>Tongue Movement Tastes: </strong>
                                                                {medicalInpatientInfo.tongueMovementTastes}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.coughGagReflex && (
                                                            <p>
                                                                <strong>Cough Gag Reflex: </strong>
                                                                {medicalInpatientInfo.coughGagReflex}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.power && (
                                                            <p>
                                                                <strong>Power: </strong>
                                                                {medicalInpatientInfo.power}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.tone && (
                                                            <p>
                                                                <strong>Tone: </strong>
                                                                {medicalInpatientInfo.tone}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.reflexes && (
                                                            <p>
                                                                <strong>Reflexes: </strong>
                                                                {medicalInpatientInfo.reflexes}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.plantars && (
                                                            <p>
                                                                <strong>Plantars: </strong>
                                                                {medicalInpatientInfo.plantars}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.sensation && (
                                                            <p>
                                                                <strong>Sensation: </strong>
                                                                {medicalInpatientInfo.sensation}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                        {medicalInpatientInfo.coordination && (
                                                            <p>
                                                                <strong>Coordination: </strong>
                                                                {medicalInpatientInfo.coordination}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        {medicalInpatientInfo.summary && (
                                            <p>
                                                <strong>Summary: </strong>
                                                {medicalInpatientInfo.summary}
                                            </p>
                                        )}
                                        <hr />

                                        {medicalInpatientInfo.differentialDiagnosis.length > 0 && (

                                            <p>
                                                <strong>Differential Diagnosis: </strong>
                                                {medicalInpatientInfo.differentialDiagnosis.map((item, index) => ` ${item}`).join(", ")}
                                            </p>
                                        )}

                                        <hr />
                                        <h2>Investigation</h2>
                                        <h3>
                                            Bedside Results
                                        </h3>
                                        <BedsideResults data={[]} />

                                        <h3>Lab results</h3>
                                        <LabOrderPlanTable />
                                        {medicalInpatientInfo.additionalNotes && (
                                            <p>
                                                <strong>Additional Notes: </strong>
                                                {medicalInpatientInfo.additionalNotes}
                                            </p>
                                        )}

                                        <hr />




                                        {medicalInpatientInfo.admittingOfficer && (
                                            <p>
                                                <strong>Admitting Officer: </strong>
                                                {medicalInpatientInfo.admittingOfficer}
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


