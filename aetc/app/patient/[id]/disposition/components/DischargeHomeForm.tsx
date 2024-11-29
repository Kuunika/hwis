"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    RadioGroupInput,
} from "@/components";
import * as Yup from "yup";

const followUpOptions = [
    { id: "healthCenter", label: "Health Center" },
    { id: "specialistClinic", label: "Specialist Clinic" },
    { id: "districtHospital", label: "District Hospital" },
];

const specialistClinicOptions = [
    { id: "cardiology", label: "Cardiology" },
    { id: "neurology", label: "Neurology" },
    { id: "orthopedics", label: "Orthopedics" },
    { id: "pediatrics", label: "Pediatrics" },
    { id: "other", label: "Other" },
];

const validationSchema = Yup.object({
    dischargePlan: Yup.string().required("Discharge Plan is required"),
    followUpPlan: Yup.string().required("Follow-Up Plan is required"),
    homeCareInstructions: Yup.string().required("Home Care Instructions are required"),
    followUpDetails: Yup.string().required("Follow-Up Details are required"),
    dischargeNotes: Yup.string().required("Discharge Notes are required"),
});

const initialValues = {
    dischargePlan: "",
    followUpPlan: "",
    homeCareInstructions: "",
    followUpDetails: "",
    specialistClinic: "",
    dischargeNotes: "",
};

export default function DischargeHomeForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Discharge Home Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Discharge Plan and Follow-Up Plan Inline */}
                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>
                                    {/* Discharge Plan */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="dischargePlan"
                                            name="dischargePlan"
                                            label="Discharge Plan"
                                            sx={{ width: "100%" }}
                                            multiline={true}
                                            rows={3}
                                            placeholder="Write the discharge plan"
                                        />
                                    </MainGrid>

                                    {/* Follow-Up Plan */}
                                    <MainGrid item xs={6}>
                                        <RadioGroupInput
                                            name="followUpPlan"
                                            label="Follow-Up Plan"
                                            options={[
                                                { value: "yes", label: "Yes" },
                                                { value: "no", label: "No" },
                                            ]}
                                        />
                                    </MainGrid>
                                </MainGrid>
                            </MainGrid>


                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>
                                    {/* Home Care Instructions */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="homeCareInstructions"
                                            name="homeCareInstructions"
                                            label="Home Care Instructions"
                                            sx={{ width: "100%" }}
                                            multiline={true}
                                            rows={3}
                                            placeholder="Write specific home care instructions"
                                        />
                                    </MainGrid>

                                    {/* Follow-Up Details */}
                                    <MainGrid item xs={6}>
                                        <SearchComboBox
                                            name="followUpDetails"
                                            label="Follow-Up Details"
                                            options={followUpOptions}
                                        />
                                    </MainGrid>


                                </MainGrid>
                            </MainGrid>





                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>

                                    {/* Discharge Notes */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="dischargeNotes"
                                            name="dischargeNotes"
                                            label="Discharge Notes"
                                            sx={{ width: "100%" }}
                                            multiline={true}
                                            rows={4}
                                            placeholder="Write discharge notes"
                                        />
                                    </MainGrid>

                                    {/* Specialist Clinics */}
                                    <MainGrid item xs={6}>
                                        <SearchComboBox
                                            name="specialistClinic"
                                            label="Specialist Clinic (if applicable)"
                                            options={specialistClinicOptions}
                                        />
                                    </MainGrid>



                                </MainGrid>
                            </MainGrid>

















                            {/* Submit & Print */}
                            <MainGrid item xs={12}>
                                <button
                                    type="button"
                                    onClick={() => alert("Discharge notes will be printed")}
                                    style={{
                                        marginRight: "10px",
                                        padding: "10px 20px",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Print Discharge Notes
                                </button>
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
