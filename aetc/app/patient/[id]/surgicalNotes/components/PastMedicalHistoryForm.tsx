// "use client";
// import {
//     FormikInit,
//     WrapperBox,
//     FormFieldContainer,
//     FormFieldContainerLayout,
//     CheckboxesGroup,
//     RadioGroupInput,
//     TextInputField,

// } from "@/components";
// import * as yup from "yup";
// import React, { useState } from "react";

// type Prop = {
//     onSubmit: (values: any) => void;
//     onSkip: () => void;
// };

// // List of past medical history conditions
// const pastMedicalHistoryOptions = [
//     "HIV",
//     "Tuberculosis (TB)",
//     "Chronic Obstructive Pulmonary Disease (COPD)",
//     "Diabetes Mellitus",
//     "Asthma",
//     "Epilepsy",
//     "Previous stroke",
//     "Bleeding disorders",
// ];

// // Diabetes Type options
// const diabetesTypeOptions = [
//     { value: "Type I", label: "Type I" },
//     { value: "Type II", label: "Type II" },
//     { value: "Unsure", label: "Unsure" },
// ];

// // Diabetes Control options
// const diabetesControlOptions = [
//     { value: "Diet", label: "Diet" },
//     { value: "Tablet", label: "Tablet" },
//     { value: "Insulin", label: "Insulin" },
// ];

// // Validation schema
// const schema = yup.object().shape({
//     pastMedicalHistory: yup.array().min(1, "Select at least one condition"),
//     diabetesType: yup.string().nullable(),
//     diabetesControl: yup.string().nullable(),
// });

// export const PastMedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
//     const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

//     const handleCheckboxChange = (values: any) => {
//         setSelectedConditions(values.filter((item: any) => item.value).map((item: any) => item.key));
//     };

//     return (
//         <FormikInit
//             validationSchema={schema}
//             initialValues={{
//                 pastMedicalHistory: [],
//                 diabetesType: "", // Added diabetes type field
//                 diabetesControl: "", // Added diabetes control field
//             }}
//             onSubmit={(values) => console.log("Past Medical History:", values)}
//         >
//             <FormFieldContainer direction="column">
//                 {/* Past Medical History Checkboxes */}
//                 <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
//                     <FormFieldContainerLayout title="Past Medical History">

//                         {pastMedicalHistoryOptions.map((condition) => (
//                             <div key={condition} style={{ marginBottom: "10px" }}>
//                                 <CheckboxesGroup
//                                     name="pastMedicalHistory"
//                                     allowFilter={false}
//                                     options={[{ value: condition, label: condition }]}
//                                     getValue={handleCheckboxChange}
//                                 />
//                                 {/* Show Diabetes Type & Control options if Diabetes Mellitus is selected */}
//                                 {selectedConditions.includes("Diabetes Mellitus") &&
//                                     condition === "Diabetes Mellitus" && (
//                                         <div style={{ marginLeft: "20px", marginTop: "5px" }}>
//                                             <RadioGroupInput
//                                                 name="diabetesType"
//                                                 label="Type"
//                                                 options={diabetesTypeOptions}
//                                             />
//                                             <RadioGroupInput
//                                                 name="diabetesControl"
//                                                 label="Controlled by"
//                                                 options={diabetesControlOptions}
//                                             />
//                                         </div>
//                                     )}
//                             </div>
//                         ))}
//                     </FormFieldContainerLayout>

//                 </WrapperBox>
//             </FormFieldContainer>
//         </FormikInit>
//     );
// };

"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    CheckboxesGroup,
    RadioGroupInput,
    TextInputField,
} from "@/components";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { FormikProps } from "formik";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
// List of past medical history conditions
const pastMedicalHistoryOptions = [
    "HIV",
    "Tuberculosis (TB)",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Diabetes Mellitus",
    "Asthma",
    "Epilepsy",
    "Previous stroke",
    "Bleeding disorders",
];

// Validation schema
const schema = yup.object().shape({
    pastMedicalHistory: yup.array().min(1, "Select at least one condition"),
});

//encounter: SURGICAL_NOTES_TEMPLATE_FORM
//concepts:  CONDITION,  ON_TREATMENT, MEDICATION,  MEDICATION_DOSE, REASON_FOR_REQUEST,  MEDICATION_DURATION
export const PastMedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

    // Handle checkbox selection
    const handleCheckboxChange = (values: any, formik: any) => {
        const selected = values.filter((item: any) => item.value).map((item: any) => item.key);
        setSelectedConditions(selected);

        // Reset onTreatment state in Formik when a condition is deselected
        formik.setFieldValue("onTreatment", {
            ...formik.values.onTreatment,
            ...Object.fromEntries(
                pastMedicalHistoryOptions.map((condition) => [
                    condition,
                    selected.includes(condition) ? formik.values.onTreatment[condition] || "" : "",
                ])
            ),
        });
    };

    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);

    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();

        // Construct observations for selected conditions
        const obs = values.pastMedicalHistory.map((condition: string) => ({
            concept: concepts.CONDITION,
            value: condition,
            obsDatetime: currentDateTime,
            group_members: [
                {
                    concept: concepts.ON_TREATMENT,
                    value: values.onTreatment[condition] || "No", // Defaults to "No" if not selected
                    obsDatetime: currentDateTime,
                },
                ...(values.onTreatment[condition] === "Yes"
                    ? [
                        {
                            concept: concepts.MEDICATION,
                            value: values.medications[condition]?.currentMedication || "",
                            obsDatetime: currentDateTime,
                        },
                        {
                            concept: concepts.MEDICATION_DOSE,
                            value: values.medications[condition]?.dose || "",
                            obsDatetime: currentDateTime,
                        },
                        {
                            concept: concepts.REASON_FOR_REQUEST,
                            value: values.medications[condition]?.reason || "",
                            obsDatetime: currentDateTime,
                        },
                        {
                            concept: concepts.MEDICATION_DURATION,
                            value: values.medications[condition]?.duration || "",
                            obsDatetime: currentDateTime,
                        },
                    ]
                    : []),
            ],
        }));

        // Construct the encounter payload
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            console.log("Past Medical History submitted successfully!");
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting Past Medical History: ", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                pastMedicalHistory: [],
                onTreatment: {},
                medications: {},
            }}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <FormFieldContainer direction="column">
                    <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                        <FormFieldContainerLayout title="Past Medical History">
                            {pastMedicalHistoryOptions.map((condition) => (
                                <div key={condition} style={{ marginBottom: "10px" }}>
                                    {/* Checkbox for each condition */}
                                    <CheckboxesGroup
                                        name="pastMedicalHistory"
                                        allowFilter={false}
                                        options={[{ value: condition, label: condition }]}
                                        getValue={(values) => handleCheckboxChange(values, formik)}
                                    />

                                    {/* If the condition is selected, show treatment options */}
                                    {selectedConditions.includes(condition) && (
                                        <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                            <RadioGroupInput
                                                name={`onTreatment.${condition}`}
                                                label={`Are you on treatment for ${condition}?`}
                                                options={[
                                                    { value: "Yes", label: "Yes" },
                                                    { value: "No", label: "No" },
                                                ]}
                                                getValue={(value) =>
                                                    formik.setFieldValue(`onTreatment.${condition}`, value)
                                                }
                                            />

                                            {/* If treatment is "Yes", show medication fields */}
                                            {formik.values.onTreatment[condition] === "Yes" && (
                                                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                                                    <h5>Medication Details</h5>
                                                    <TextInputField
                                                        name={`medications.${condition}.currentMedication`}
                                                        label="Current Medication"
                                                        type="text"
                                                        id=""
                                                    />
                                                    <TextInputField
                                                        name={`medications.${condition}.dose`}
                                                        label="Dose"
                                                        type="text"
                                                        id=""
                                                    />
                                                    <TextInputField
                                                        name={`medications.${condition}.reason`}
                                                        label="Reason for Taking"
                                                        type="text"
                                                        id=""
                                                    />
                                                    <TextInputField
                                                        name={`medications.${condition}.duration`}
                                                        label="How long have you been taking it?"
                                                        type="text"
                                                        id=""
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </FormFieldContainerLayout>
                    </WrapperBox>
                </FormFieldContainer>
            )}
        </FormikInit>
    );
};