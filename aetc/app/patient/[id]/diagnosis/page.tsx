"use client";
import {
    MainGrid,
    MainPaper,
    FormikInit,
    SearchComboBox,
} from "@/components";
import { PersonalDetailsCard } from "@/app/patient/components";
import { VisitDates } from "@/app/patient/components/visitDates";
import { BackButton } from "@/components/buttons";
import { useEffect, useState } from "react";
import { DiagnosisTable } from "./components/diagnosisTable";
import * as Yup from "yup";
import { getConceptSetMembers } from "@/hooks/labOrder";

// Define the Diagnosis interface
interface Diagnosis {
    id: number;
    condition: string;
}

function DiagnosisForm() {
    const { data: bedsideTests, isLoading: bedsideTestsLoading, refetch: reloadBedSideTests, isRefetching: reloadingBedsideTest } = getConceptSetMembers('b9af45fa-8d80-11d8-abbb-0024217bb78e');
    // Define the type of diagnosisList explicitly
    const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);

    useEffect(() => {
        reloadBedSideTests()
    }, [])

    // console.log({ bedsideTests })

    // Sample condition options
    // const conditionOptions = [
    //     { id: 1, label: "HIV" },
    //     { id: 2, label: "Tuberculosis" },
    //     { id: 3, label: "Cholera" },
    //     { id: 4, label: "Diabetes Mellitus" },
    // ];

    // Modify the condition options to use data from the API
    const conditionOptions = bedsideTests?.map(test => ({
        id: test.uuid,  // UUID as the identifier
        label: test.names[0]?.name,  // Get the name attribute
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
            <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
                <MainGrid item xs={12} lg={2}>
                    <PersonalDetailsCard />
                </MainGrid>
                <MainGrid item xs={12} lg={8}>
                    <MainPaper elevation={0} sx={{ p: "1ch" }}>
                        <BackButton />
                        <h2>Differential Diagnosis</h2>
                        <VisitDates />

                        <FormikInit
                            initialValues={initialValues}
                            onSubmit={handleAddDiagnosis}
                            validationSchema={validationSchema}
                            submitButtonText="Add"
                        >
                            <MainGrid container spacing={2}>
                                <MainGrid item xs={12} lg={6}>
                                    <SearchComboBox
                                        label="Condition"
                                        name="condition"
                                        options={conditionOptions}
                                        sx={{ width: "80%" }}
                                        multiple={false}
                                    />

                                </MainGrid>

                                <MainGrid item xs={12} lg={2}>
                                    {/* Additional styling or button can go here */}
                                </MainGrid>
                            </MainGrid>

                            <MainGrid item xs={12} mt={2}>
                                {/* The button is added within Formik so the form can be reset */}
                            </MainGrid>
                        </FormikInit>

                        {/* Diagnosis Table */}
                        <h3>List of Diagnosis</h3>
                        <DiagnosisTable
                            diagnoses={diagnosisList}
                            onDelete={handleDeleteDiagnosis}
                        />
                    </MainPaper>
                </MainGrid>
            </MainGrid>
        </>
    );
}

export default DiagnosisForm;
