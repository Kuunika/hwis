"use client";

import {
    MainGrid,
    MainPaper,
    FormikInit,
    TextInputField,
    SearchComboBox,
    SelectInputField,
    FormDatePicker,
    RadioGroupInput,
    MainButton,
} from "@/components";
import {
    concepts
} from "@/constants";
import * as Yup from "yup";

const mortuaryOptions = [
    { id: "QECH", label: "QECH" },
    { id: "COM", label: "COM" },
    { id: "Mthunzi", label: "Mthunzi" },
    { id: "other", label: "Other (Specify)" },
];

const relationshipOptions = [
    { id: concepts.SPOUSE, label: "Spouse" },
    { id: concepts.PARENT, label: "Parent" },
    { id: concepts.SIBLING, label: "Sibling" },
    { id: concepts.UNCLE_AUNTIE, label: "Uncle" },
    { id: "cousin", label: "Cousin" },
    { id: "other", label: "Other" },
];




const validationSchema = Yup.object({
    dateOfDeath: Yup.date().required("Date of Death is required"),
    causeOfDeath: Yup.string().required("Cause of Death is required"),
    familyInformed: Yup.string().required("Please specify if family has been informed"),
    relationshipToDeceased: Yup.string().required("Relationship to Deceased is required"),

    // relationshipToDeceased: Yup.string().when("familyInformed", {
    //     is: "yes",
    //     then: Yup.string().required("Relationship to Deceased is required"),
    // }),
    mortuary: Yup.string().required("Mortuary is required"),
    lastOfficeConducted: Yup.string().required("Last office status is required"),
    healthWorkerName: Yup.string().required("Name of health worker is required"),
    lastOfficeDateTime: Yup.date().required("Date and Time of Last Office is required"),
});

const initialValues = {
    dateOfDeath: "",
    causeOfDeath: "",
    familyInformed: "",
    relationshipToDeceased: "",
    mortuary: "",
    lastOfficeConducted: "",
    healthWorkerName: "",
    lastOfficeDateTime: "",
};





export default function DeathForm() {
    const handleSubmit = (values: any) => {
     
        alert("Form Submitted!");
    };

    return (
        <MainGrid container spacing={2}>
            <MainGrid item xs={12} lg={8}>
                <MainPaper sx={{ p: 3 }}>
                    <h2>Death Form</h2>
                    <FormikInit
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        submitButtonText="Submit"
                    >
                        <MainGrid container spacing={2}>
                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>


                                    {/* Cause of Death */}
                                    <MainGrid item xs={12}>
                                        <TextInputField
                                            id="2"
                                            name="causeOfDeath"
                                            label="Cause of Death"
                                            placeholder="Enter the cause of death"
                                            rows={4}
                                            sx={{ width: "100%" }}
                                        />
                                    </MainGrid>
                                </MainGrid>
                            </MainGrid>

                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>
                                    {/* Family Informed */}
                                    <MainGrid item xs={6}>


                                        <RadioGroupInput
                                            name="familyInformed"
                                            label="Has the family been informed?"
                                            options={[
                                                { value: concepts.YES, label: "Yes" },
                                                { value: concepts.NO, label: "No" },
                                            ]}
                                        />


                                    </MainGrid>

                                    {/* Relationship to Deceased */}
                                    <MainGrid item xs={6}>
                                        <SearchComboBox
                                            name="relationshipToDeceased"
                                            label="If yes, relationship to deceased"
                                            options={relationshipOptions}
                                            sx={{ width: "100%" }}
                                            multiple={false}
                                        />



                                    </MainGrid>
                                </MainGrid>
                            </MainGrid>

                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>
                                    {/* Mortuary */}
                                    <MainGrid item xs={6}>
                                        <SearchComboBox
                                            name="mortuary"
                                            label="Mortuary to take the deceased"
                                            options={mortuaryOptions}
                                            sx={{ width: "100%" }}
                                            multiple={false}
                                        />
                                    </MainGrid>

                                    {/* Last Office Conducted */}
                                    <MainGrid item xs={6}>

                                        <RadioGroupInput
                                            name="lastOfficeConducted"
                                            label="Was the last office conducted?"
                                            options={[
                                                { value: concepts.YES, label: "Yes" },
                                                { value: concepts.NO, label: "No" },
                                            ]}
                                        />



                                    </MainGrid>
                                </MainGrid>
                            </MainGrid>

                            <MainGrid item xs={12}>
                                <MainGrid container spacing={2} sx={{ display: "flex", alignItems: "flex-start" }}>
                                    {/* Health Worker Name */}
                                    <MainGrid item xs={6}>
                                        <TextInputField
                                            id="4"
                                            name="healthWorkerName"
                                            label="Name of Health Worker who conducted the last office"
                                            placeholder="Enter health worker's name"
                                            sx={{ width: "100%" }}
                                        />
                                    </MainGrid>

                                    {/* Date and Time of Last Office */}
                                    <MainGrid item xs={6}>
                                        <FormDatePicker
                                            name="dateOfDeath"
                                            label="Date of Last Office"
                                            sx={{ width: "100%" }}
                                        />
                                    </MainGrid>
                                </MainGrid>
                            </MainGrid>

                            <MainGrid item xs={12}>
                            </MainGrid>
                        </MainGrid>
                    </FormikInit>
                </MainPaper>
            </MainGrid>
        </MainGrid>
    );
}
