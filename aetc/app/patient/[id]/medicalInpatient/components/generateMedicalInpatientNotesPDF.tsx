"use client";
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useReactToPrint } from "react-to-print";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import { LabOrderPlanTable } from "@/app/patient/components/panels/labOrderPlanTable";
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
            differentialDiagnosis: "",
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
                    differentialDiagnosis: "",
                    admittingOfficer: admittingOfficer, // Use the created_by field as the admitting officer


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
                    // ✅ New Fields
                    else if (conceptName === "symmetrical expansion") {
                        inpatientInfo.symmetricalExpansion = obs.value || obs.value_text || "";
                    } else if (conceptName === "Apex beat") {
                        inpatientInfo.apexBeat = obs.value || obs.value_text || "";
                    } else if (conceptName === "Tthrill heaves") {
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
                    }
                    else if (conceptName === "Attempted/ Differential Diagnosis") {
                        inpatientInfo.differentialDiagnosis = obs.value || obs.value_text || "";
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
                            <hr />


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
                            <hr />


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
                                medicalInpatientInfo.admittingOfficer

                            )
                                && (
                                    <>
                                        <h2>Review of Systems</h2>
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

                                        {medicalInpatientInfo.differentialDiagnosis && (

                                            <p>
                                                <strong>Differential Diagnosis: </strong>
                                                {medicalInpatientInfo.differentialDiagnosis}
                                            </p>
                                        )}

                                        <hr />
                                        <h3>Investigation Plan</h3>
                                        <LabOrderPlanTable />
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


