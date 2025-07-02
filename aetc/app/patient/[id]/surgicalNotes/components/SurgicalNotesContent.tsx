// components/surgicalNotes/SurgicalNotesContent.tsx
import React, { useEffect, useState } from "react";
import { PatientInfoTab } from "@/components";
import { LabOrderTable } from "@/app/patient/components/panels/labOrderTable";
import { BedsideResults } from "@/app/patient/components/panels/bedsideResults";
import { LabResultsTable } from "@/app/patient/components/panels/labResults";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import { Results } from "@/app/patient/components/panels";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters } from "@/constants";

interface Props {
    presentingInfo: {
        complaints: string[];
        history: string;
        surgicalHistory: string;
        surgicalProcedure: string;
        familyHistory: string[];
        allergies: string;
        differentialDiagnosis: string;
        smoking: {
            status: string;
            duration: string;
        };
        alcoholIntake: string;
        recreationalDrugs: string;
    };
    pastMedicalHistory: Array<{
        condition: string;
        onTreatment: string;
        medication: string;
        medicationDose: string;
        reasonForRequest: string;
        medicationDuration: string;
    }>;
    reviewOfSystems: {
        general: string[];
        ent: string[];
        endocrine: string[];
        cardiac: string[];
        respiratory: string[];
        gastrointestinal: string[];
        genitourinary: string[];
        musculoskeletal: string[];
        neurologic: string[];
        psychiatric: string[];
    };
    physicalExam: {
        generalCondition: string;
        temperature: string;
        pulseRate: string;
        bloodPressure: string;
        respiratoryRate: string;
        eyes: string;
        mouth: string;
        neck: string;
        chest: string;
        endocrine: string;
        abdominal: string;
        motorResponse: string;
        verbalResponse: string;
        eyeResponse: string;
        cranialNerves: string;
        grossMotor: string;
        sensation: string;
        pulsations: string;
        rectalExamination: string;
        extremities: string;
    };
    clerkInfo: {
        clerkName: string;
        designation: string;
        signature: string;
        additionalNotes: string;
    };
    setRow?: (row: any) => void;
    showPatientInfo?: boolean; // Optional prop to control PatientInfoTab display
}

export const SurgicalNotesContent: React.FC<Props> = ({
    presentingInfo,
    pastMedicalHistory,
    reviewOfSystems,
    physicalExam,
    clerkInfo,
    setRow,
    showPatientInfo = false
}) => {
    // State for bedside results
    const [bedsideResults, setBedsideResults] = useState<any[]>([]);
    const { params } = useParameters();
    const patientId = params.id as string;

    // Fetch bedside results
    const { data: BedSideResults, isLoading: bedsideLoading } = getPatientsEncounters(
        patientId,
        `encounter_type=${encounters.BED_SIDE_TEST}`
    );

    useEffect(() => {
        if (!bedsideLoading && BedSideResults) {
            setBedsideResults(BedSideResults?.[0]?.obs ?? []);
        }
    }, [BedSideResults, bedsideLoading]);

    const isEmpty = [
        ...presentingInfo.complaints,
        presentingInfo.history,
        presentingInfo.surgicalHistory,
        presentingInfo.surgicalProcedure,
        ...presentingInfo.familyHistory,
        presentingInfo.allergies,
        presentingInfo.differentialDiagnosis,
        presentingInfo.smoking.status,
        presentingInfo.smoking.duration,
        presentingInfo.alcoholIntake,
        presentingInfo.recreationalDrugs,
        ...pastMedicalHistory,
        ...Object.values(reviewOfSystems).flat(),
        ...Object.values(physicalExam),
        clerkInfo.additionalNotes,
        clerkInfo.clerkName,
        clerkInfo.designation,
        clerkInfo.signature
    ].every((val: any) => Array.isArray(val) ? val.length === 0 : typeof val === 'string' ? !val.trim() : false);

    if (isEmpty) {
        return (
            <>
                {showPatientInfo && <PatientInfoTab />}

                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Surgical Notes</h1>
                <p style={{ fontStyle: "italic", color: "gray" }}>
                    Surgical Notes not recorded.
                </p>
            </>
        );
    }

    return (
        <div>
            {showPatientInfo && <PatientInfoTab />}

            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Surgical Notes</h1>

            <p><strong>Presenting Complaints:</strong> {presentingInfo.complaints.length > 0 ?
                presentingInfo.complaints.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                : "None"}</p>
            <p><strong>Additional Complaints:</strong> {presentingInfo.history}</p>
            <hr />

            <h2>Past Medical History</h2>
            {pastMedicalHistory.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Condition</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>On Treatment</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Medication</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Medication Dose</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Reason for Request</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Medication Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastMedicalHistory.map((history, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.condition}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.onTreatment}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.medication}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.medicationDose}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.reasonForRequest}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{history.medicationDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No past medical history recorded.</p>
            )}

            <p><strong>Surgical History:</strong> {presentingInfo.surgicalHistory}</p>
            <p><strong>Surgical Procedure:</strong> {presentingInfo.surgicalProcedure}</p>
            <p><strong>Family History:</strong> {presentingInfo.familyHistory.length > 0 ?
                presentingInfo.familyHistory.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                : "None"}</p>
            <p><strong>Allergies:</strong> {presentingInfo.allergies || "None"}</p>
            <hr />

            <h2>Social History & Review of Systems</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Social History</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Review of Systems</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Smoking Status:</strong> {presentingInfo.smoking.status || "Unknown"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>General:</strong> {reviewOfSystems.general.length > 0 ? reviewOfSystems.general.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    {presentingInfo.smoking.status === "Yes" && (
                        <tr>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <strong>Cigarettes per day:</strong> {presentingInfo.smoking.duration || "Unknown"}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <strong>ENT:</strong>{" "}
                                {reviewOfSystems.ent.length > 0
                                    ? reviewOfSystems.ent.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                    : "None"}
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Alcohol Intake:</strong> {presentingInfo.alcoholIntake ? `${presentingInfo.alcoholIntake} units per day` : "None"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Endocrine:</strong> {reviewOfSystems.endocrine.length > 0 ? reviewOfSystems.endocrine.join(", ") : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Recreational Drugs:</strong> {presentingInfo.recreationalDrugs || "None"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Cardiac:</strong> {reviewOfSystems.cardiac.length > 0 ? reviewOfSystems.cardiac.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Respiratory:</strong> {reviewOfSystems.respiratory.length > 0 ? reviewOfSystems.respiratory.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Gastrointestinal:</strong> {reviewOfSystems.gastrointestinal.length > 0 ? reviewOfSystems.gastrointestinal.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Genitourinary:</strong> {reviewOfSystems.genitourinary.length > 0 ? reviewOfSystems.genitourinary.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Musculoskeletal:</strong> {reviewOfSystems.musculoskeletal.length > 0 ? reviewOfSystems.musculoskeletal.join(", ") : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Neurologic:</strong> {reviewOfSystems.neurologic.length > 0 ? reviewOfSystems.neurologic.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Psychiatric:</strong> {reviewOfSystems.psychiatric.length > 0 ? reviewOfSystems.psychiatric.map((item, index) => `(${index + 1}) ${item}`).join(", ")
                                : "None"}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Physical Examination</h2>
            <p><strong>General Condition:</strong> {physicalExam.generalCondition || "Not recorded"}</p>

            <h3>Vitals</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <p><strong>Temperature:</strong> {physicalExam.temperature || "Not recorded"}</p>
                <p><strong>Pulse Rate:</strong> {physicalExam.pulseRate || "Not recorded"} bpm</p>
                <p><strong>Blood Pressure:</strong> {physicalExam.bloodPressure || "Not recorded"} mmHg</p>
                <p><strong>Respiratory Rate:</strong> {physicalExam.respiratoryRate || "Not recorded"} breaths/min</p>
            </div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <p><strong>Eyes:</strong> {physicalExam.eyes || "Not recorded"}</p>
                <p><strong>Mouth:</strong> {physicalExam.mouth || "Not recorded"}</p>
                <p><strong>Neck:</strong> {physicalExam.neck || "Not recorded"}</p>
            </div>

            <p><strong>Chest Examination:</strong> {physicalExam.chest || "Not recorded"}</p>
            <p><strong>Endocrine Examination:</strong> {physicalExam.endocrine || "Not recorded"}</p>
            <p><strong>Abdominal Examination:</strong> {physicalExam.abdominal || "Not recorded"}</p>
            <hr />

            <h3>Glasgow Coma Scale (GCS)</h3>
            <p><strong>Motor Response:</strong> {physicalExam.motorResponse || "Not recorded"}</p>
            <p><strong>Verbal Response:</strong> {physicalExam.verbalResponse || "Not recorded"}</p>
            <p><strong>Eye Response:</strong> {physicalExam.eyeResponse || "Not recorded"}</p>
            <hr />

            <h3>Additional Examinations & Extremities</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Additional Examinations</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Extremities</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Cranial Nerves:</strong> {physicalExam.cranialNerves || "Not recorded"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Pulsations:</strong> {physicalExam.pulsations || "Not recorded"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Gross Motor:</strong> {physicalExam.grossMotor || "Not recorded"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Rectal Examination:</strong> {physicalExam.rectalExamination || "Not recorded"}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Sensation:</strong> {physicalExam.sensation || "Not recorded"}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <strong>Extremities:</strong> {physicalExam.extremities || "Not recorded"}
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />
            <p><strong>Working Differential Diagnosis:</strong> {presentingInfo.differentialDiagnosis || "None"}</p>
            <hr />

            <h2>Investigations</h2>

            <h3>Bedside Results</h3>
            <BedsideResults data={bedsideResults} />

            <h3>Lab Results</h3>
            <LabResultsTable rows={[]} />
            <hr />

            <h2>Medications</h2>
            <PrescribedMedicationList setRow={setRow} />
            <hr />

            <h2>Clerking Details</h2>
            <p><strong>Additional Notes:</strong> {clerkInfo.additionalNotes}</p>
            <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <p><strong>Clerk Name:</strong> {clerkInfo.clerkName}</p>
                <p><strong>Designation:</strong> {clerkInfo.designation}</p>
                <p><strong>Signature:</strong> {clerkInfo.signature}</p>
            </div>
        </div>
    );
};