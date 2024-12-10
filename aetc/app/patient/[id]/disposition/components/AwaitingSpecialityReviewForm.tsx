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

const specialtyOptions = [
    { id: "medicine", label: "Medicine" },
    { id: "generalSurgery", label: "General Surgery" },
    { id: "orthopedics", label: "Orthopedics" },
    { id: "neurosurgery", label: "Neurosurgery" },
    { id: "ent", label: "Ear, Nose, and Throat (ENT)" },
    { id: "dental", label: "Dental and Maxillofacial Surgery" },
    { id: "ophthalmology", label: "Ophthalmology" },
    { id: "psychiatry", label: "Psychiatry" },
    { id: "gynecology", label: "Gynecology and Obstetrics" },
    { id: "criticalCare", label: "Critical Care" },
    { id: "oncology", label: "Oncology" },
];

const validationSchema = Yup.object({
    specialtyDepartment: Yup.string().required("Specialty Department is required"),
    reasonForReview: Yup.string().required("Reason for Review is required"),
    reviewDate: Yup.date().required("Date Scheduled for Review is required"),
});

const initialValues = {
    specialtyDepartment: "",
    reasonForReview: "",
    reviewDate: "",
};

export default function AwaitingSpecialityReviewForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Awaiting Specialty Review Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>

                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>

                                    {/* Specialty Department */}
                                    <MainGrid item xs={12}>
                                        <SearchComboBox
                                            name="specialtyDepartment"
                                            label="Specialty Department"
                                            options={specialtyOptions}
                                            multiple={false}

                                        />
                                    </MainGrid>

                                    {/* Reason for Review */}
                                    <MainGrid item xs={12}>
                                        <TextInputField
                                            id="reasonForReview"
                                            name="reasonForReview"
                                            label="Reason for Review"
                                            sx={{ width: "100%" }}
                                            multiline={true}
                                            rows={4}
                                            placeholder="Provide reason for review"
                                        />
                                    </MainGrid>

                                </MainGrid>
                            </MainGrid>

                            {/* Date Scheduled for Review */}
                            <MainGrid item xs={12}>
                                <FormDatePicker
                                    name="reviewDate"
                                    label="Date Scheduled for Review"
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
