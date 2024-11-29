"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    RadioGroupInput,
} from "@/components";
import * as Yup from "yup";

const vitalSignsOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
];

const validationSchema = Yup.object({
    expectedDuration: Yup.number()
        .min(1, "Duration must be at least 1 hour")
        .required("Expected Duration is required"),
    reasonForShortStay: Yup.string().required("Reason for Short Stay is required"),
    vitalSignsMonitoring: Yup.string().required("Vital Signs Monitoring option is required"),
    additionalNotes: Yup.string(),
});

const initialValues = {
    expectedDuration: "",
    reasonForShortStay: "",
    vitalSignsMonitoring: "",
    additionalNotes: "",
};

export default function ShortStayForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Short Stay Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Expected Duration */}
                            <MainGrid item xs={12} lg={6}>
                                <TextInputField
                                    id="expectedDuration"
                                    name="expectedDuration"
                                    label="Expected Duration (in hours)"
                                    placeholder="e.g., 2"
                                    type="number"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Vital Signs Monitoring */}
                            <MainGrid item xs={12} lg={6}>
                                <RadioGroupInput
                                    name="vitalSignsMonitoring"
                                    label="Will include vital signs monitoring?"
                                    options={vitalSignsOptions}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Reason for Short Stay */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="reasonForShortStay"
                                    name="reasonForShortStay"
                                    label="Reason for Short Stay"
                                    placeholder="Enter the reason for the short stay"
                                    rows={4}
                                    multiline={true}
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Additional Notes */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="additionalNotes"
                                    name="additionalNotes"
                                    label="Additional Notes (SOAP/Continuation Sheets)"
                                    placeholder="Enter additional notes or observations"
                                    rows={4}
                                    multiline={true}
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
