"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    CheckboxesGroup,
    FormValuesListener,
    RadioGroupInput,
} from "@/components";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import {
    addEncounter,
    fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

// Complaints that require location selection
const complaintsRequiringLocation = [
    concepts.FEELING_OF_A_MASS,
    concepts.PAIN,
    concepts.ULCER_OR_WOUND,
    concepts.BLEEDING,
];

const presentingComplaintsConfig = [
    { value: concepts.FEELING_OF_A_MASS, label: "Feeling of a mass" },
    { value: concepts.DIFFICULTY_PAIN_ON_PASSING_STOOLS, label: "Difficulty/Pain on passing stools" },
    { value: concepts.PAIN, label: "Pain" },
    { value: concepts.NOT_PASSING_FLATUS, label: "Not passing flatus" },
    { value: concepts.PASSING_BLOODY_STOOLS, label: "Passing bloody stools" },
    { value: concepts.PASSING_MELENA, label: "Passing melena" },
    { value: concepts.NOT_PASSING_URINE, label: "Not passing urine" },
    { value: concepts.DIFFICULTY_PASSING_URINE, label: "Difficulty passing urine" },
    { value: concepts.PASSING_DEEP_YELLOW_URINE, label: "Passing deep yellow urine" },
    { value: concepts.PASSING_PUS_IN_URINE, label: "Passing pus in urine" },
    { value: concepts.NOT_PASSING_STOOLS, label: "Not passing stools" },
    { value: concepts.VOMITING, label: "Vomiting" },
    { value: concepts.VOMITING_BLOOD, label: "Vomiting Blod" },
    { value: concepts.DYSPHAGIA, label: "Dysphagia" },
    { value: concepts.ODYNOPHAGIA, label: "Odynophagia" },
    { value: concepts.ULCER_OR_WOUND, label: "Ulcer" },
    { value: concepts.YELLOWINGOFEYESORSKIN, label: "Yellowing of the eyes" },
    { value: concepts.BLEEDING, label: "Bleeding" },
    { value: concepts.SHORTNESS_OF_BREATH, label: "Shortness of breath" },
    { value: concepts.OTHER, label: "Other (Specify)" },
];

// Location options
const locationOptions = [
    { value: concepts.BREAST, label: "Breast" },
    { value: concepts.CHEST, label: "Chest" },
    { value: concepts.ARM, label: "Arm" },
    { value: concepts.FOREARM, label: "Forearm" },
    { value: concepts.HAND, label: "Hand" },
    { value: concepts.THIGH, label: "Thigh" },
    { value: concepts.LEG, label: "Leg" },
    { value: concepts.FOOT, label: "Foot" },
    { value: concepts.HEAD, label: "Head" },
    { value: concepts.NECK, label: "Neck" },
];

// Validation schema
const schema = yup.object().shape({
    presentingComplaints: yup
        .array()
        .of(
            yup.object().shape({
                key: yup.string().required(),
                value: yup.boolean().required(),
            })
        )
        .transform((value) =>
            Array.isArray(value) ? value.filter((item: any) => item.value === true) : []
        )
        .min(1, "Select at least one complaint"),
    otherComplaintSpecify: yup
        .string()
        .nullable()
        .when("presentingComplaints", {
            is: (complaints: any[]) =>
                complaints && complaints.some(complaint => complaint.key === concepts.OTHER && complaint.value),
            then: (schema) => schema.required("Please specify the other complaint"),
        }),
    historyOfPresentingComplaint: yup.string().required("History is required"),
    // Validation for locations will be handled dynamically
});

export const PresentingComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [showOtherTextField, setShowOtherTextField] = useState(false);
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { init, ServerTime } = useServerTime();


    useEffect(() => {
        // Finds the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleCheckboxChange = (values: any) => {
        const selected = values.filter((item: any) => item.value).map((item: any) => item.key);
        setSelectedComplaints(selected);
        setShowOtherTextField(selected.includes(concepts.OTHER));
    };

    const handleSubmit = async (values: any) => {
        const currentDateTime = ServerTime.getServerTimeString();

        // Extract the selected complaints
        const selectedComplaints = (values.presentingComplaints || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        // Create observations for each selected complaint
        const complaintObservations = selectedComplaints.map((complaintKey: string) => {
            const isOther = complaintKey === concepts.OTHER;
            const needsLocation = complaintsRequiringLocation.includes(complaintKey);

            const baseObservation = {
                concept: complaintKey,
                value: isOther ? values.otherComplaintSpecify : complaintKey,
                obsDatetime: currentDateTime,
            };

            // Add location as a group member if this complaint needs location
            if (needsLocation && values.complaintLocations && values.complaintLocations[complaintKey]) {
                return {
                    ...baseObservation,
                    groupMembers: [
                        {
                            concept: concepts.LOCATION,
                            value: values.complaintLocations[complaintKey],
                            obsDatetime: currentDateTime,
                        }
                    ]
                };
            }

            return baseObservation;
        });

        // Create the main observations array
        const obs = [
            {
                concept: concepts.PRESENTING_COMPLAINTS,
                value: concepts.PRESENTING_COMPLAINTS,
                obsDatetime: currentDateTime,
                groupMembers: complaintObservations,
            },
            {
                concept: concepts.PRESENTING_HISTORY,
                value: values.historyOfPresentingComplaint,
                obsDatetime: currentDateTime,
            },
        ];

        // Prepare the payload
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            onSubmit(values);
        } catch (error) {
            console.error("Error submitting presenting complaints: ", error);
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                presentingComplaints: [],
                otherComplaintSpecify: "",
                historyOfPresentingComplaint: "",
                complaintLocations: {},
            }}
            onSubmit={handleSubmit}
        >
            {(formik) => (
                <>
                    <FormValuesListener getValues={setFormValues} />
                    <FormFieldContainer direction="row">
                        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                            <FormFieldContainerLayout title="Presenting complaints">
                                {/* Map through each complaint option */}
                                {presentingComplaintsConfig.map((complaint) => (
                                    <div key={complaint.value} style={{ marginBottom: "10px" }}>
                                        {/* Checkbox for the complaint */}
                                        <CheckboxesGroup
                                            name="presentingComplaints"
                                            allowFilter={false}
                                            options={[{ value: complaint.value, label: complaint.label }]}
                                            getValue={(values) => {
                                                // Call the main handler to update selected complaints
                                                handleCheckboxChange(
                                                    formik.values.presentingComplaints.map((c: any) =>
                                                        c.key === complaint.value
                                                            ? { key: c.key, value: values[0].value }
                                                            : c
                                                    )
                                                );
                                            }}
                                        />

                                        {/* If this complaint is selected and requires location, show location options */}
                                        {selectedComplaints.includes(complaint.value) &&
                                            complaintsRequiringLocation.includes(complaint.value) && (
                                                <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                                                    <RadioGroupInput
                                                        label={`Location for ${complaint.label}`}
                                                        name={`complaintLocations.${complaint.value}`}
                                                        options={locationOptions}
                                                        getValue={(value) =>
                                                            formik.setFieldValue(`complaintLocations.${complaint.value}`, value)
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </div>
                                ))}

                                {/* Other complaint text field */}
                                {showOtherTextField && (
                                    <TextInputField
                                        id="otherComplaintSpecify"
                                        label="Specify Other Complaint"
                                        name="otherComplaintSpecify"
                                        placeholder="Specify the complaint"
                                    />
                                )}
                            </FormFieldContainerLayout>
                            <br />

                            {/* History of presenting complaint */}
                            <TextInputField
                                sx={{ width: "100%" }}
                                id="historyOfPresentingComplaint"
                                name="historyOfPresentingComplaint"
                                label="History of Presenting Complaint"
                                multiline
                                rows={5}
                                placeholder="Describe the history of the presenting complaint..."
                            />
                        </WrapperBox>
                    </FormFieldContainer>
                </>
            )}
        </FormikInit>
    );
};