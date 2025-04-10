"use client";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    CheckboxesGroup,
    FormValuesListener,
    RadioGroupInput, // Ensure this is imported
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

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
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
    { value: concepts.OTHER, label: "Other (Specify)" }, // "Other" option

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
            is: (complaints: any[]) => complaints.some((complaint) => complaint.key === "Other"),
            then: (schema) => schema.required("Please specify the other complaint"),
        }),

    historyOfPresentingComplaint: yup.string().required("History is required"),
});
//concepts:  PRESENTING_COMPLAINTS  PRESENTING_HISTORY, also Add LOCATION concept
export const PresentingComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [showOtherTextField, setShowOtherTextField] = useState(false);
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [showLocationField, setShowLocationField] = useState(false);
    const [complaintLocations, setComplaintLocations] = useState<Record<string, string[]>>({});

    const handleCheckboxChange = (values: any) => {
        const selected = values.filter((item: any) => item.value).map((item: any) => item.key);

        setSelectedComplaints(selected);
        setShowOtherTextField(selected.includes("Other"));

        // Determine if any of the selected values require location
        const requiresLocation = [
            concepts.FEELING_OF_A_MASS,
            concepts.PAIN,
            concepts.ULCER_OR_WOUND,
            concepts.BLEEDING,
        ].some((c) => selected.includes(c));

        setShowLocationField(requiresLocation);
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
        // Filter selected complaints
        const selectedComplaints = (values.presentingComplaints || [])
            .filter((item: any) => item.value)
            .map((item: any) => item.key);

        const hasOther = selectedComplaints.includes("Other");
        const complaintsWithOther = hasOther
            ? selectedComplaints.map((c: string) => (c === "Other" ? values.otherComplaintSpecify : c))
            : selectedComplaints;
        const requiresLocation = selectedComplaints.some((complaint: string) =>
            ["Feeling of a mass", "Pain", "Ulcer", "Bleeding"].includes(complaint)
        );
        const obs = [
            {
                concept: concepts.PRESENTING_COMPLAINTS,
                value: concepts.PRESENTING_COMPLAINTS,
                obsDatetime: currentDateTime,
                groupMembers: (values.presentingComplaints || [])
                    .filter((complaint: any) => complaint.value === true)
                    .map((complaint: any) => {
                        const isOther = complaint.key === "Other";
                        const isLocationRequired = [
                            concepts.FEELING_OF_A_MASS,
                            concepts.PAIN,
                            concepts.ULCER_OR_WOUND,
                            concepts.BLEEDING
                        ].includes(complaint.key);

                        const baseObservation = {
                            concept: complaint.key,
                            value: isOther ? values.otherComplaintSpecify : complaint.key,
                            obsDatetime: currentDateTime,
                        };

                        if (isLocationRequired && values.location) {
                            return {
                                ...baseObservation,
                                groupMembers: [
                                    {
                                        concept: concepts.LOCATION,
                                        value: values.location,
                                        obsDatetime: currentDateTime,
                                    },
                                ],
                            };
                        }

                        return baseObservation;
                    }),
            },

            {
                concept: concepts.PRESENTING_HISTORY,
                value: values.historyOfPresentingComplaint,
                obsDatetime: currentDateTime,
            },
            // ...(values.location ? [{
            //     concept: concepts.LOCATION,  // make sure concepts.LOCATION exists
            //     value: values.location,
            //     obsDatetime: currentDateTime,
            // }] : []),

        ];
        const payload = {
            encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            // toast.success("Presenting complaints submitted successfully!");
            onSubmit(values); // triggers navigation to the next step
        } catch (error) {
            console.error("Error submitting presenting complaints: ", error);
            // toast.error("Failed to submit presenting complaints.");
        }
    };
    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                presentingComplaints: [],
                otherComplaintSpecify: "",
                historyOfPresentingComplaint: "",
                location: "", // Add location field
            }}
            onSubmit={handleSubmit}
        >
            <FormValuesListener getValues={setFormValues} />
            <FormFieldContainer direction="row">
                {/* Presenting Complaints Checkboxes */}
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>

                    <FormFieldContainerLayout title="Presenting complaints">
                        <CheckboxesGroup
                            name="presentingComplaints"
                            allowFilter={false}
                            options={presentingComplaintsConfig}
                            getValue={handleCheckboxChange}
                        />
                        {showOtherTextField && (
                            <TextInputField
                                id="otherComplaintSpecify"
                                label="Specify Other Complaint"
                                name="otherComplaintSpecify"
                                placeholder="Specify the complaint"
                            />
                        )}
                        {showLocationField && (
                            <RadioGroupInput
                                label="Location of Complaint"
                                name="location"
                                options={locationOptions}
                            />
                        )}
                    </FormFieldContainerLayout>
                    <br />
                    {/* <FormFieldContainerLayout title="Presenting complaints history"> */}
                    <TextInputField
                        sx={{ width: "100%" }}
                        id="historyOfPresentingComplaint"
                        name="historyOfPresentingComplaint"
                        label="History of Presenting Complaint"
                        multiline
                        rows={5}
                        placeholder="Describe the history of the presenting complaint..."
                    />
                    {/* </FormFieldContainerLayout> */}
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};