"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    FormDatePicker,
    RadioGroupInput,
    MainButton
} from "@/components";
import {
    concepts
} from "@/constants";
import * as Yup from "yup";

const validationSchema = Yup.object({
    reasonForRefusal: Yup.string().required("Reason for refusal is required"),
    plansToReturn: Yup.string().required("Please select plans to return for treatment"),
    dateOfRefusal: Yup.date().required("Date of refusal is required"),
    witnessName: Yup.string().required("Witness name is required"),
});

const initialValues = {
    reasonForRefusal: "",
    plansToReturn: "",
    dateOfRefusal: "",
    witnessName: "",
};

export default function RefusedTreatmentForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Refused Treatment Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Reason for Refusal */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="1"
                                    name="reasonForRefusal"
                                    label="Reason for Refusal"
                                    placeholder="Enter the reason for refusal"
                                    sx={{ width: "100%" }}
                                    multiline
                                    rows={3}
                                />
                            </MainGrid>

                            {/* Plans to Return for Treatment */}
                            <MainGrid item xs={12}>
                                <RadioGroupInput
                                    name="plansToReturn"
                                    label="Plans to Return for Treatment"
                                    options={[
                                        { value: concepts.YES, label: "Yes" },
                                        { value: concepts.NO, label: "No" },
                                    ]}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Date of Refusal */}
                            <MainGrid item xs={6}>
                                <FormDatePicker
                                    name="dateOfRefusal"
                                    label="Date of Refusal"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Witness Name */}
                            <MainGrid item xs={6}>
                                <TextInputField
                                    id="3"

                                    name="witnessName"
                                    label="Witness Name"
                                    placeholder="Enter name of witness"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Submit Button */}
                            <MainGrid item xs={12}>
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
