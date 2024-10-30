"use client";
import { FormikInit, SearchComboBox, MainGrid, MainPaper } from "@/components";
import { useEffect, useState } from "react";
import { DiagnosisTable } from "./DiagnosisTable";
import * as Yup from "yup";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { Typography } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { toast } from "react-toastify";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { concepts, encounters } from "@/constants";
import Tooltip from "@mui/material/Tooltip";

interface Diagnosis {
    id: string;
    condition: string;
    obsDatetime: string;
}

function DiagnosisForm() {
    const { data: bedsideTests, refetch: reloadBedSideTests } = getConceptSetMembers(concepts.CONDITION);
    const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);
    const { mutate: createDiagnosis, isSuccess, isError } = addEncounter();
    const { params } = useParameters();
    const { data: patient } = getOnePatient(params.id as string);
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const [showTable, setShowTable] = useState(false);
    const [showComboBox, setShowComboBox] = useState(false);

    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { data: patientEncounters } = getPatientsEncounters(params.id as string);

    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    useEffect(() => {
        reloadBedSideTests();

        if (patientEncounters) {
            const diagnosisRecords = patientEncounters
                .filter(encounter => encounter.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS)
                .flatMap(encounter => {
                    return encounter.obs.map(obs => ({
                        id: obs.uuid,
                        condition: obs.value,
                        obsDatetime: obs.obs_datetime || "",
                    }));
                });

            setDiagnosisList(diagnosisRecords);
        }
    }, [patientEncounters]);

    const conditionOptions = bedsideTests?.map((test) => ({
        id: test.names[0]?.uuid,
        label: test.names[0]?.name,
    })) || [];

    const initialValues = { condition: "" };
    const validationSchema = Yup.object().shape({
        condition: Yup.string().required("Condition is required"),
    });

    const handleAddDiagnosis = (values: any, resetForm: any) => {
        const selectedCondition = conditionOptions.find(option => option.id === values.condition);
        const currentDateTime = getDateTime();

        if (selectedCondition && activeVisit?.uuid) {
            createDiagnosis({
                encounterType: encounters.OUTPATIENT_DIAGNOSIS,
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime,
                obs: [{
                    concept: selectedCondition.id,
                    value: selectedCondition.label,
                    obsDatetime: currentDateTime,
                }],
            });

            if (isSuccess) {
                setDiagnosisList(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        condition: selectedCondition.label,
                        obsDatetime: currentDateTime
                    },
                ]);
                toast.success("Diagnosis submitted successfully!");
            } else if (isError) {
                toast.error("Failed to submit diagnosis.");
            }

            resetForm();
        } else {
            toast.error("Visit information is missing, cannot add diagnosis.");
        }
    };

    const toggleTableVisibility = () => {
        setShowTable(!showTable);
    };
    const toggleComboBox = () => {
        setShowComboBox(!showComboBox);
    };

    const handleDeleteDiagnosis = (id: string) => {
        setDiagnosisList(diagnosisList.filter(diagnosis => diagnosis.id !== id));
        toast.success("Diagnosis deleted successfully!");
    };


    return (
        <MainGrid container spacing={2}>
            {/* Recent Diagnosis Section */}
            <MainGrid item xs={12}>
                <MainPaper style={{ padding: "20px" }}>
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                        Current Diagnosis
                    </Typography>

                    {/* Header */}
                    <div style={{ display: "flex", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                        <Typography variant="subtitle1" style={{ width: "25%", fontWeight: "bold" }}>
                            Condition
                        </Typography>
                        <Typography variant="subtitle1" style={{ width: "25%", fontWeight: "bold" }}>
                            Diagnosis Type
                        </Typography>
                        <Typography variant="subtitle1" style={{ width: "25%", fontWeight: "bold" }}>
                            Date
                        </Typography>
                        <Typography variant="subtitle1" style={{ width: "25%", fontWeight: "bold" }}>
                            Action
                        </Typography>
                    </div>

                    {/* Diagnosis entries */}
                    {diagnosisList.length === 0 ? (
                        <Typography variant="body2" style={{ padding: "16px", textAlign: "center", color: "gray" }}>
                            No Diagnosis Added
                        </Typography>
                    ) : (
                        diagnosisList.slice(-3).map((diagnosis) => (
                            <div key={diagnosis.id} style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                                <Typography variant="body1" style={{ width: "25%" }}>
                                    {diagnosis.condition}
                                </Typography>
                                <Typography variant="body2" style={{ width: "25%", fontStyle: "italic" }}>
                                    Differential Diagnosis
                                </Typography>
                                <Typography variant="body2" style={{ width: "25%" }}>
                                    {new Date(diagnosis.obsDatetime).toLocaleDateString("en-GB")}
                                </Typography>
                                <Typography variant="body2" style={{ width: "25%" }}>
                                    <button
                                        onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                        }}
                                        title="Delete Diagnosis"
                                    >
                                        Delete
                                    </button>
                                </Typography>

                            </div>
                        ))
                    )}


                    {/* </MainPaper>
            </MainGrid>



            <MainGrid item xs={12}>
                <MainPaper> */}
                    <Typography
                        variant="h6"
                        style={{ color: "green", cursor: "pointer", marginTop: "30px" }}  // Added margin-top
                        onClick={toggleComboBox}
                    >
                        {showComboBox ? "- Cancel New Diagnosis" : "+ Add New Diagnosis"}
                    </Typography>
                    {showComboBox && (
                        <FormikInit
                            initialValues={initialValues}
                            onSubmit={handleAddDiagnosis}
                            validationSchema={validationSchema}
                            submitButtonText="Add"
                        >
                            <SearchComboBox
                                label="Condition"
                                name="condition"
                                options={conditionOptions}
                                sx={{ width: "100%" }}
                                multiple={false}
                            />
                        </FormikInit>
                    )}
                </MainPaper>
            </MainGrid>

            <MainGrid item xs={12}>
                <MainPaper>
                    <Typography variant="h6" onClick={toggleTableVisibility}
                        style={{ cursor: "pointer", padding: "16px 0" }} // Added padding
                    >
                        {showTable ? " Hide Previous Diagnosis" : " Show Previous Diagnosis"}
                    </Typography>
                    {showTable && (
                        <DiagnosisTable diagnoses={diagnosisList} />
                    )}
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}

export default DiagnosisForm;
