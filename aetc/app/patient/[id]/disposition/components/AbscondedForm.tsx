"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    FormDatePicker,
    FormTimePicker,
    SearchComboBox,
    MainButton
} from "@/components";
import * as Yup from "yup";

const validationSchema = Yup.object({
    lastSeenLocation: Yup.string().required("Last Seen Location is required"),
    dateAbsconded: Yup.date().required("Date of Absconding is required"),
    timeAbsconded: Yup.string().required("Time of Absconding is required"),
});

const initialValues = {
    lastSeenLocation: "",
    dateAbsconded: "",
    timeAbsconded: "",
};

export default function AbscondedForm() {
    const handleSubmit = (values: any) => {
        console.log("Form Values: ", values);
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Absconded Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            {/* Last Seen Location */}
                            <MainGrid item xs={12}>
                                <TextInputField
                                    id="1"
                                    name="lastSeenLocation"
                                    label="Last Seen Location"
                                    placeholder="Enter the last known location"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Date of Absconding */}
                            <MainGrid item xs={6}>
                                <FormDatePicker

                                    name="dateAbsconded"
                                    label="Date of Absconding"
                                    sx={{ width: "100%" }}
                                />
                            </MainGrid>

                            {/* Time of Absconding */}
                            <MainGrid item xs={6}>
                                <FormTimePicker

                                    name="timeAbsconded"
                                    label="Time of Absconding"
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
