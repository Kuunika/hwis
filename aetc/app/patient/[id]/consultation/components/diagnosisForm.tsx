"use client";
import { FormikInit, MainGrid, MainPaper } from "@/components";
import { useEffect, useState } from "react";
import { DiagnosisTable } from "./DiagnosisTable";
import * as Yup from "yup";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { Button, Typography } from "@mui/material";
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
    getPatientsEncounters,
    removeObservation,
} from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { toast } from "react-toastify";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { concepts, encounters } from "@/constants";
import ECTReactComponent from "@/components/form/ECTReactComponent"; // Import ICD-11 component

interface Diagnosis {
    id: string;
    condition: string;
    obsDatetime: string;
}

interface DiagnosisFormProps {
    conceptType: string;
}

function DiagnosisForm({ conceptType }: DiagnosisFormProps) {
    const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);
    const { mutate: createDiagnosis, isSuccess, isError } = fetchConceptAndCreateEncounter();
    const { params } = useParameters();
    const { data: patient } = getOnePatient(params.id as string);
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);

    const [showTable, setShowTable] = useState(false);
    const [showSelection, setShowSelection] = useState<{ [key: number]: boolean }>({});

    const [showICD11, setShowICD11] = useState(false);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { data: patientEncounters } = getPatientsEncounters(params.id as string);
    const { mutate: deleteDiagnosis } = removeObservation();

    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    useEffect(() => {
        if (patientEncounters) {
            const diagnosisRecords = patientEncounters
                .filter((encounter) => encounter.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS)
                .flatMap((encounter) =>
                    encounter.obs
                        .filter((obs) => obs.names[0]?.name === conceptType)
                        .map((obs) => ({
                            id: obs.obs_id.toString(),
                            condition: obs.value,
                            obsDatetime: obs.obs_datetime || "",
                        }))
                );
            setDiagnosisList(diagnosisRecords);
        }
    }, [patientEncounters, conceptType]);

    const initialValues = { condition: "" };

    const validationSchema = Yup.object().shape({
        condition: Yup.string().required("Condition is required"),
    });

    const handleICD11Selection = (selectedEntity: any, index: number) => {
        setShowSelection((prev) => ({ ...prev, [index]: true }));
        initialValues.condition = `${selectedEntity.code}, ${selectedEntity.bestMatchText}`;
    };

    const handleAddDiagnosis = (selectedCondition: any) => {
        const currentDateTime = getDateTime();

        if (selectedCondition && activeVisit?.uuid) {
            createDiagnosis({
                encounterType: encounters.OUTPATIENT_DIAGNOSIS,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime,
                obs: [
                    {
                        concept: conceptType,
                        value: `${selectedCondition.code} - ${selectedCondition.bestMatchText}`, // Use ICD-11 code
                        obsDatetime: currentDateTime,
                    },
                ],
            });

            if (isSuccess) {
                setDiagnosisList((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        condition: `${selectedCondition.code} - ${selectedCondition.label}`, // Display both code & label
                        obsDatetime: currentDateTime,
                    },
                ]);
                toast.success("Diagnosis submitted successfully!");
            } else if (isError) {
                toast.error("Failed to submit diagnosis.");
            }
        } else {
            toast.error("Visit information is missing, cannot add diagnosis.");
        }
    };

    const toggleTableVisibility = () => setShowTable(!showTable);
    const toggleICD11 = () => setShowICD11(!showICD11);

    const handleDeleteDiagnosis = (obs_id: string) => {
        deleteDiagnosis(obs_id, {
            onSuccess: () => {
                setDiagnosisList((prevList) =>
                    prevList.filter((diagnosis) => diagnosis.id !== obs_id)
                );
                toast.success("Diagnosis deleted successfully!");
            },
            onError: () => {
                console.error("Error deleting diagnosis");
                toast.error("Failed to delete diagnosis.");
            },
        });
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12}>
                <MainPaper style={{ padding: "20px" }}>
                    <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "500" }}>
                        Current Diagnosis
                    </Typography>
                    <br />

                    <div style={{ display: "flex", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                        <Typography variant="body2" style={{ width: "40%", fontWeight: "500" }}>Condition</Typography>
                        <Typography variant="body2" style={{ width: "25%", fontWeight: "500" }}>Diagnosis Type</Typography>
                        <Typography variant="body2" style={{ width: "25%", fontWeight: "500" }}>Date</Typography>
                        <Typography variant="body2" style={{ width: "10%", fontWeight: "500" }}>Action</Typography>
                    </div>

                    {diagnosisList.length === 0 ? (
                        <Typography variant="body2" style={{ padding: "16px", textAlign: "center", color: "gray" }}>
                            No Diagnosis Added
                        </Typography>
                    ) : (
                        diagnosisList.slice(-3).map((diagnosis) => (
                            <div key={diagnosis.id} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
                                <Typography variant="body2" style={{ width: "40%" }}>{diagnosis.condition}</Typography>
                                <Typography variant="body2" style={{ width: "25%", fontStyle: "italic" }}>
                                    {conceptType === concepts.DIFFERENTIAL_DIAGNOSIS ? "Differential Diagnosis" : "Final Diagnosis"}
                                </Typography>
                                <Typography variant="body2" style={{ width: "25%" }}>
                                    {new Date(diagnosis.obsDatetime).toLocaleDateString("en-GB")}
                                </Typography>
                                <Typography variant="body2" style={{ width: "10%" }}>
                                    <Button onClick={() => handleDeleteDiagnosis(diagnosis.id)} size="small" color="error" variant="text">
                                        Delete
                                    </Button>
                                </Typography>
                            </div>
                        ))
                    )}

                    <Typography variant="subtitle2" style={{ color: "green", cursor: "pointer", marginTop: "30px" }} onClick={toggleICD11}>
                        {showICD11 ? "- Cancel New Diagnosis" : "+ Add New Diagnosis"}
                    </Typography>

                    {showICD11 && (
                        <ECTReactComponent
                            iNo={1}  // Provide a unique number (adjust as needed)
                            // name="diagnosis" // Give an appropriate name
                            label="Select Diagnosis" // Set a meaningful label
                            onICD11Selection={(selectedCondition: any) => handleAddDiagnosis(selectedCondition)}
                        />
                    )}

                </MainPaper>
            </MainGrid>

            <MainGrid item xs={12}>
                <MainPaper>
                    <Typography onClick={toggleTableVisibility} variant="subtitle1" style={{ cursor: "pointer", padding: "1ch", fontWeight: "500" }}>
                        {showTable ? "Hide Previous Diagnosis" : "Show Previous Diagnosis"}
                    </Typography>
                    {showTable && <DiagnosisTable diagnoses={diagnosisList} />}
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}

export default DiagnosisForm;
