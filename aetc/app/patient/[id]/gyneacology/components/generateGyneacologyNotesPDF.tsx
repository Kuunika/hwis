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

export interface GyneacologyNotesPDFRef {
    generatePDF: () => void;
}

// Define props interface
interface GenerateGyneacologyNotesPDFProps {
    onPrintComplete?: () => void;
    showPreview?: boolean; // Add this new prop

}

export const GenerateGyneacologyNotesPDF = forwardRef<GyneacologyNotesPDFRef, GenerateGyneacologyNotesPDFProps>(
    ({ onPrintComplete, showPreview = false }, ref) => {
        const [row, setRow] = useState<any>(null);
        const { params } = useParameters();
        const { data: patientVisits } = getPatientVisitTypes(params.id as string);
        const { data: encountersData } = getPatientsEncounters(params.id as string);
        const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);

        const [complaintsInfo, setComplaintsInfo] = useState({
            chiefComplaint: "",
            illnessHistory: "",
            lnmp: "",
            //edd remaining
            gestationalAge: "",
            gravidity: "",
            //parity
            numberOfLivingChildren: "",
            menarche: "",
            menstralCycle: "",
            duration: "",
            prevAbortion: "",
            prevEctopic: "",
            abnormalVaginalDischarge: "",
            consistency: "",
            color: "",
            odour: "",
            amount: "",
            previousContraceptive: "",
            //currently on contracepptive
            sideEffects: "",
            cancerScreening: "",
            historyOfStis: "",
            medicalHistory: [] as string[],
            habits: [] as string[],
            temperature: "",
            pulse: "",
            respiratory: "",
            bloodPressure: "",
            stats: "",
            rbs: "",
            weight: "",
            //height
            chestExamination: "",
            abdomenExamination: "",
            vaginalExamination: "",
            extremities: "",
            impression: "",


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
            const gyneacologyEncounter = encountersData
                ?.filter(
                    (encounter) =>
                        encounter.encounter_type &&
                        encounter.encounter_type.uuid === encounters.GYNEACOLOGY_WARD
                )
                .sort(
                    (a, b) =>
                        new Date(b.encounter_datetime).getTime() -
                        new Date(a.encounter_datetime).getTime()
                )[0];

            if (gyneacologyEncounter && gyneacologyEncounter.obs) {
                const newComplaintsInfo = {
                    chiefComplaint: "",
                    illnessHistory: "",
                    lnmp: "",
                    //edd remaining
                    gestationalAge: "",
                    gravidity: "",
                    //parity
                    numberOfLivingChildren: "",
                    menarche: "",
                    menstralCycle: "",
                    duration: "",
                    prevAbortion: "",
                    prevEctopic: "",
                    abnormalVaginalDischarge: "",
                    consistency: "",
                    color: "",
                    odour: "",
                    amount: "",
                    previousContraceptive: "",
                    //currently on contracepptive
                    sideEffects: "",
                    cancerScreening: "",
                    historyOfStis: "",
                    medicalHistory: [] as string[],
                    habits: [] as string[],
                    temperature: "",
                    pulse: "",
                    respiratory: "",
                    bloodPressure: "",
                    stats: "",
                    rbs: "",
                    weight: "",
                    chestExamination: "",
                    abdomenExamination: "",
                    vaginalExamination: "",
                    extremities: "",
                    impression: "",

                };

                const medicalHistoryConceptNames = [
                    "Family History Hypertension",
                    "Family History Diabetes Mellitus",
                    "Family History Tuberculosis",
                    "Family History Epilepsy",
                    "Family History Asthma",
                    "Mental illness",
                    "Blood transfusion",
                    "Drug Allergies"
                ];

                const habitsConceptNames = [
                    "Alcohol intake",
                    "Smoking history",
                    "Recreational drug",
                ];
                gyneacologyEncounter.obs.forEach(obs => {
                    const conceptName = obs.names && obs.names.length > 0 ? obs.names[0].name : null;
                    if (conceptName === "Chief complaint") {
                        newComplaintsInfo.chiefComplaint = obs.value || obs.value_text || "";
                    } else if (conceptName === "History of present illness") {
                        newComplaintsInfo.illnessHistory = obs.value || obs.value_text || "";
                    }
                    else if (conceptName === "LNMP") {
                        newComplaintsInfo.lnmp = obs.value || obs.value_text || "";
                    } else if (conceptName === "Gestational age") {
                        newComplaintsInfo.gestationalAge = obs.value || obs.value_text || "";
                    } else if (conceptName === "Gravidity") {
                        newComplaintsInfo.gravidity = obs.value || obs.value_text || "";
                    } else if (conceptName === "Number of living children") {
                        newComplaintsInfo.numberOfLivingChildren = obs.value || obs.value_text || "";
                    } else if (conceptName === "Menarche") {
                        newComplaintsInfo.menarche = obs.value || obs.value_text || "";
                    } else if (conceptName === "Menstrual cycle") {
                        newComplaintsInfo.menstralCycle = obs.value || obs.value_text || "";
                    } else if (conceptName === "Duration") {
                        newComplaintsInfo.duration = obs.value || obs.value_text || "";
                    } else if (conceptName === "Prev Abortion") {
                        newComplaintsInfo.prevAbortion = obs.value || obs.value_text || "";
                    } else if (conceptName === "Prev Ectopic") {
                        newComplaintsInfo.prevEctopic = obs.value || obs.value_text || "";
                    } else if (conceptName === "Abnormal Vaginal Discharge") {
                        newComplaintsInfo.abnormalVaginalDischarge = obs.value || obs.value_text || "";
                    } else if (conceptName === "Consistency") {
                        newComplaintsInfo.consistency = obs.value || obs.value_text || "";
                    } else if (conceptName === "Color") {
                        newComplaintsInfo.color = obs.value || obs.value_text || "";
                    } else if (conceptName === "Odour") {
                        newComplaintsInfo.odour = obs.value || obs.value_text || "";
                    } else if (conceptName === "Amount") {
                        newComplaintsInfo.amount = obs.value || obs.value_text || "";
                    } else if (conceptName === "Previous Contraceptive") {
                        newComplaintsInfo.previousContraceptive = obs.value || obs.value_text || "";
                    } else if (conceptName === "Side effects") {
                        newComplaintsInfo.sideEffects = obs.value || obs.value_text || "";
                    } else if (conceptName === "Cancer Screening") {
                        newComplaintsInfo.cancerScreening = obs.value || obs.value_text || "";
                    } else if (conceptName === "History of STIs") {
                        newComplaintsInfo.historyOfStis = obs.value || obs.value_text || "";
                    } else if (conceptName && medicalHistoryConceptNames.includes(conceptName)) {
                        const condition = obs.value || obs.value_text || "";
                        if (condition) {
                            newComplaintsInfo.medicalHistory.push(condition);
                        }
                    } else if (conceptName && habitsConceptNames.includes(conceptName)) {
                        const condition = obs.value || obs.value_text || "";
                        if (condition) {
                            newComplaintsInfo.habits.push(condition);
                        }

                    } else if (conceptName === "Temperature") {
                        newComplaintsInfo.temperature = obs.value || obs.value_text || "";
                    } else if (conceptName === "Pulse Rate") {
                        newComplaintsInfo.pulse = obs.value || obs.value_text || "";
                    } else if (conceptName === "Respiratory Rate") {
                        newComplaintsInfo.respiratory = obs.value || obs.value_text || "";
                    } else if (conceptName === "Blood Pressure Measured") {
                        newComplaintsInfo.bloodPressure = obs.value || obs.value_text || "";
                    } else if (conceptName === "Stats") {
                        newComplaintsInfo.stats = obs.value || obs.value_text || "";
                    } else if (conceptName === "Random Blood Glucose (RBS)") {
                        newComplaintsInfo.rbs = obs.value || obs.value_text || "";
                    } else if (conceptName === "Weight") {
                        newComplaintsInfo.weight = obs.value || obs.value_text || "";
                    } else if (conceptName === "Chest examination") {
                        newComplaintsInfo.chestExamination = obs.value || obs.value_text || "";
                    } else if (conceptName === "Abdominal examination") {
                        newComplaintsInfo.abdomenExamination = obs.value || obs.value_text || "";
                    } else if (conceptName === "Vaginal examination") {
                        newComplaintsInfo.vaginalExamination = obs.value || obs.value_text || "";
                    } else if (conceptName === "Extremities") {
                        newComplaintsInfo.extremities = obs.value || obs.value_text || "";
                    } else if (conceptName === "Impression") {
                        newComplaintsInfo.impression = obs.value || obs.value_text || "";
                    }
                });
                setComplaintsInfo(newComplaintsInfo);
            }
        }, [encountersData]);

        return (
            <div ref={contentRef} className="printable-content">
                <div className={showPreview ? "print-preview" : "print-only"}>
                    <PatientInfoTab />
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Gyneacology Ward</h1>

                    {/* Display all collected data in a structured format */}
                    <div className="patient-examination-data">
                        <h2>Complaints</h2>
                        <p><strong>Chief Complaints: </strong>{complaintsInfo.chiefComplaint}</p>
                        <p><strong>History of Present Illness: </strong>{complaintsInfo.illnessHistory}</p>
                        <hr />

                        <h2>Obstetric and Gyneacology History</h2>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>

                            <p><strong>LNMP: </strong>{complaintsInfo.lnmp}</p>
                            <p><strong>Gestational Age: </strong>{complaintsInfo.gestationalAge}</p>
                            <p><strong>Gravidity: </strong>{complaintsInfo.gravidity}</p>
                            <p><strong>Number of Living Children: </strong>{complaintsInfo.numberOfLivingChildren}</p>
                        </div>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>

                            <p><strong>Menarche: </strong>{complaintsInfo.menarche}</p>
                            <p><strong>Menstrual cycle: </strong>{complaintsInfo.menstralCycle}</p>
                            <p><strong>Duration: </strong>{complaintsInfo.duration}</p>
                            <p><strong>Prev Abortion: </strong>{complaintsInfo.prevAbortion}</p>
                        </div>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                            <p><strong>Prev Ectopic: </strong>{complaintsInfo.prevEctopic}</p>
                            <p><strong>Abnormal Vaginal Discharge: </strong>{complaintsInfo.abnormalVaginalDischarge}</p>
                            <p><strong>Consistency: </strong>{complaintsInfo.consistency}</p>
                            <p><strong>Color: </strong>{complaintsInfo.color}</p>
                        </div>

                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>

                            <p><strong>Odour: </strong>{complaintsInfo.odour}</p>
                            <p><strong>Amount: </strong>{complaintsInfo.amount}</p>
                            <p><strong>Previous Contraceptive: </strong>{complaintsInfo.previousContraceptive}</p>
                            <p><strong>Side effects: </strong>{complaintsInfo.sideEffects}</p>
                        </div>

                        <p><strong>Cancer Screening: </strong>{complaintsInfo.cancerScreening}</p>
                        <p><strong>History of STIs: </strong>{complaintsInfo.historyOfStis}</p>

                        <hr />

                        <h2>Medical History</h2>
                        <p><strong> Condition: </strong>{complaintsInfo.medicalHistory.length > 0 ?
                            complaintsInfo.medicalHistory.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                            : "None"}</p>
                        <hr />

                        <h2>Habits</h2>
                        <p><strong> Condition: </strong>{complaintsInfo.habits.length > 0 ?
                            complaintsInfo.habits.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                            : "None"}</p>
                        <hr />

                        <h2>Condition & Pallor</h2>
                        <p><strong>Condition: </strong></p>
                        <p><strong>Pallor: </strong></p>
                        <hr />

                        <h2>Vital Signs</h2>
                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                            <p><strong>Temperature: </strong>{complaintsInfo.temperature}</p>
                            <p><strong>Pulse: </strong>{complaintsInfo.pulse}</p>
                            <p><strong>Respiratory: </strong>{complaintsInfo.respiratory}</p>
                            <p><strong>Blood Pressure: </strong>{complaintsInfo.bloodPressure}</p>
                        </div>

                        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>

                            <p><strong>Stats: </strong>{complaintsInfo.stats}</p>
                            <p><strong>RBS: </strong>{complaintsInfo.rbs}</p>
                            <p><strong>Weight: </strong>{complaintsInfo.weight}</p>
                        </div>
                        <hr />

                        <h2>Examinations</h2>
                        <p><strong>Chest Examination: </strong>{complaintsInfo.chestExamination}</p>
                        <p><strong>Abdominal Examination: </strong>{complaintsInfo.abdomenExamination}</p>
                        <p><strong>Vaginal Examination: </strong>{complaintsInfo.vaginalExamination}</p>
                        <p><strong>Extremities: </strong>{complaintsInfo.extremities}</p>
                        <p><strong>Impression: </strong>{complaintsInfo.impression}</p>
                        <hr />

                    </div>
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
