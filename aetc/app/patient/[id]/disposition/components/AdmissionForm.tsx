"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
} from "@/components";
import * as Yup from "yup";

const wardOptions = [
    { id: "2A", label: "2A Oncology Ward (General ward/High Dependency Unit)" },
    { id: "2B", label: "2B Renal and Dermatology Ward" },
    { id: "6A", label: "6A Female Orthopaedic Ward" },
    { id: "4A", label: "4A Female Medical Ward (General ward/High Dependency Unit)" },
    { id: "gynecology", label: "Gynecology Ward (General ward/High Dependency Unit)" },
    { id: "labour", label: "Labour Ward (General ward/High Dependency Unit)" },
    { id: "3B", label: "3B Female Medical Ward (General ward/High Dependency Unit)" },
    { id: "3A", label: "3A TB Ward" },
    { id: "hdr", label: "3A HDRU (High Dependency Respiratory Unit)" },
    { id: "5A", label: "5A Male Surgical Ward (General ward/High Dependency Unit)" },
    { id: "5B-female", label: "5B Female Surgical Ward (General ward/High Dependency Unit)" },
    { id: "5B-ortho", label: "5B Orthopaedic Ward" },
    { id: "5B-neuro", label: "5B Neurosurgical Ward (General ward/High Dependency Unit)" },
    { id: "icu", label: "Intensive Care Unit (ICU)" },
    { id: "theatre", label: "Theatre" },
    { id: "ent", label: "ENT" },
    { id: "ophthalmology", label: "Ophthalmology" },
];

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
    wardName: Yup.string().required("Ward Name is required"),
    bedNumber: Yup.string().required("Bed Number is required"),
    reasonForAdmission: Yup.string().required("Reason for Admission is required"),
    specialtyInvolved: Yup.string().required("Specialty Involved is required"),
});

const initialValues = {
    wardName: "",
    bedNumber: "",
    reasonForAdmission: "",
    specialtyInvolved: "",
};

export default function AdmissionForm() {
    const handleSubmit = (values: any) => {
       
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Admission Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Ward Name */}
                            <MainGrid item xs={12} lg={6}>
                                <SearchComboBox
                                    name="wardName"
                                    label="Ward Name"
                                    options={wardOptions}
                                />
                            </MainGrid>

                            {/* Bed Number */}
                            <MainGrid item xs={12} lg={6}>
                                <TextInputField
                                    id="bedNumber"
                                    name="bedNumber"
                                    label="Bed Number"
                                    placeholder="Enter Bed Number"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Reason for Admission */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="reasonForAdmission"
                                    name="reasonForAdmission"
                                    label="Reason for Admission"
                                    placeholder="Provide reason for admission"
                                    rows={4}
                                    multiline={true}

                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Specialty Involved */}
                            <MainGrid item xs={12}>
                                <SearchComboBox
                                    name="specialtyInvolved"
                                    label="Specialty Involved"
                                    options={specialtyOptions}
                                />
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
