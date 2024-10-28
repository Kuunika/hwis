"use client";
import { FormikInit, SearchComboBox } from "@/components";

import { useEffect, useState } from "react";
import { DiagnosisTable } from "./DiagnosisTable";
import * as Yup from "yup";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { Typography } from "@mui/material";


// Define the Diagnosis interface
interface Diagnosis {
    id: number;
    condition: string;
}

function DiagnosisForm() {
    const {
        data: bedsideTests,
        isLoading: bedsideTestsLoading,
        refetch: reloadBedSideTests,
        isRefetching: reloadingBedsideTest,
    } = getConceptSetMembers("b9af45fa-8d80-11d8-abbb-0024217bb78e");
    // Define the type of diagnosisList explicitly
    const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);

    useEffect(() => {
        reloadBedSideTests();
    }, []);




    // Modify the condition options to use data from the API
    const conditionOptions =
        bedsideTests?.map((test) => ({
            id: test.uuid, // UUID as the identifier
            label: test.names[0]?.name, // Get the name attribute
        })) || [];



    // Initial values for Formik
    const initialValues = {
        condition: "",
    };

    // Validation Schema
    const validationSchema = Yup.object().shape({
        condition: Yup.string().required("Condition is required"),
    });

    // Function to add a diagnosis to the list
    const handleAddDiagnosis = (values: any, resetForm: any) => {
        const selectedCondition = conditionOptions.find(option => option.id === values.condition);
        if (selectedCondition) {
            setDiagnosisList([
                ...diagnosisList,
                { id: diagnosisList.length + 1, condition: selectedCondition.label },
            ]);
            resetForm();
        }
    };

    // Function to delete a diagnosis
    const handleDeleteDiagnosis = (id: number) => {
        const updatedList = diagnosisList.filter((item) => item.id !== id);
        setDiagnosisList(updatedList);
    };

    return (
        <>
            <Typography variant="h6">Differential Diagnosis</Typography>

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

            {/* Diagnosis Table */}
            <h3>List of Diagnosis</h3>
            <DiagnosisTable
                diagnoses={diagnosisList}
                onDelete={handleDeleteDiagnosis}
            />

        </>

    );
}

export default DiagnosisForm;
