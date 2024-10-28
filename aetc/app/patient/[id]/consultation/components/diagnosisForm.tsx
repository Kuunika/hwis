"use client";
import { FormikInit, SearchComboBox } from "@/components";
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

// Define the Diagnosis interface
interface Diagnosis {
    id: string;
    condition: string;
    obsDatetime: string; // Updated for observation date
}

function DiagnosisForm() {
    const { data: bedsideTests, refetch: reloadBedSideTests } = getConceptSetMembers("b9af45fa-8d80-11d8-abbb-0024217bb78e");
    const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);
    const { mutate: createDiagnosis, isSuccess, isError } = addEncounter();
    const { params } = useParameters();
    const { data: patient } = getOnePatient(params.id as string);

    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const [showTable, setShowTable] = useState(false);

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

        // Fetch diagnosis records from encounters using obs_datetime
        if (patientEncounters) {
            const diagnosisRecords = patientEncounters
                .filter(encounter => encounter.encounter_type.uuid === "ba05c128-8d80-11d8-abbb-0024217bb78e")
                .flatMap(encounter => {
                    return encounter.obs.map(obs => ({
                        id: obs.uuid,
                        condition: obs.value,
                        obsDatetime: obs.obs_datetime || "", // Using obs_datetime
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
        const currentDateTime = getDateTime(); // Capture the current date-time

        // console.log("Encounter Date Generated:", currentDateTime); // Debugging log

        if (selectedCondition && activeVisit?.uuid) {
            createDiagnosis({
                encounterType: "ba05c128-8d80-11d8-abbb-0024217bb78e",
                visit: activeVisit?.uuid,
                patient: params.id,
                encounterDatetime: currentDateTime, // Set the date-time here
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
                        obsDatetime: currentDateTime // Using obsDatetime here
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

    return (
        <>
            {/* <Typography variant="h6">Differential Diagnosis</Typography> */}

            {/* Conditionally Render Recent Diagnosis Table */}
            {diagnosisList.length > 0 && (
                <>
                    <Typography variant="h6" style={{ marginTop: "20px" }}>
                        Recent Diagnosis
                    </Typography>
                    <DiagnosisTable
                        diagnoses={diagnosisList.slice(-3)}  // Show only the most recent entry
                    />
                </>
            )}

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

            <Typography
                variant="h5"
                onClick={toggleTableVisibility}
                style={{ cursor: "pointer", marginTop: "20px", marginBottom: "10px" }}
            >
                {showTable ? "Hide Previous Diagnosis" : "Show Previous Diagnosis"}
            </Typography>

            {/* Conditionally Render Previous Diagnosis Table */}
            {showTable && (
                <DiagnosisTable
                    diagnoses={diagnosisList}
                />
            )}
        </>
    );
}

export default DiagnosisForm;
