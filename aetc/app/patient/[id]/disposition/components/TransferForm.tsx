"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    FormDatePicker,
} from "@/components";
import * as Yup from "yup";

const transferNotesOptions = [
    { id: "medicalHistory", label: "Medical History" },
    { id: "currentTreatment", label: "Current Treatment Plan" },
    { id: "diagnosisDetails", label: "Diagnosis Details" },
    { id: "medicationList", label: "Medication List" },
    { id: "allergyInfo", label: "Allergy Information" },
    { id: "otherNotes", label: "Other Notes" },
];

const validationSchema = Yup.object({
    facilityName: Yup.string().required("Facility Name is required"),
    reason: Yup.string().required("Reason for Transfer is required"),
    transferNotes: Yup.array().min(1, "Select at least one note to include"),
});

const initialValues = {
    facilityName: "",
    reason: "",
    transferNotes: [],
};

export default function TransferForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Transfer Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Facility Name */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="facilityName"
                                    name="facilityName"
                                    label="Facility Name"
                                    placeholder="Enter Facility Name"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Reason for Transfer */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="reason"
                                    name="reason"
                                    label="Reason for Transfer"
                                    placeholder="Provide reason for transfer"
                                    rows={4}
                                    multiline={true}

                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Transfer Notes */}
                            <MainGrid item xs={12}>
                                <SearchComboBox
                                    name="transferNotes"
                                    label="Notes to Include"
                                    options={transferNotesOptions}
                                    multiple={true}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
