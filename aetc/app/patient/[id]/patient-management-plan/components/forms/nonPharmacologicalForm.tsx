"use client";
import {
    FormikInit,
    FormValuesListener,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    CheckboxesGroup,
} from "@/components";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { concepts, encounters } from "@/constants";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { toast } from "react-toastify";
import { useParameters } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};
const proceduresConfig = [
    { value: concepts.MINOR_SURGERY, label: "Minor Surgery" },
    { value: concepts.SUTURING, label: "Suturing" },
    { value: concepts.JOINT_REDUCTION, label: "Joint Reduction" },
    { value: concepts.FRACTURE_REDUCTION, label: "Fracture Reduction" },
    { value: concepts.INTERCOSTAL_DRAIN_INSERTION, label: "Intercostal Drain Insertion" },
    { value: concepts.PLEUROCENTESIS, label: "Pleurocentesis" },
    { value: concepts.PERICARDIOCENTESISI, label: "Pericardiocentesis" },
    { value: concepts.PARACENTESISI, label: "Paracentesis" },
    { value: concepts.LUMBER_PUNCTURE, label: "Lumbar Puncture" },
    { value: concepts.INTRAVENOUS_CANNULATION, label: "Intravenous Cannulation" },
    { value: concepts.CENTRAL_LINE_INSERTION, label: "Central Line Insertion" },
    { value: concepts.CATHETERIZATION_URETHRAL, label: "Urethral Catheterization" },
    { value: concepts.CATHETERIZATION_SUPRAPUBIC, label: "Suprapubic Catheterization" },
    { value: concepts.SUCTIONING, label: "Suctioning" },
    { value: concepts.OROPHARYNGEAL_AIRWAY_INSERTION, label: "Oropharyngeal Airway Insertion" },
    { value: concepts.NASOPHARYNGEAL_AIRWAY_INSERTION, label: "Nasopharyngeal Airway Insertion" },
    { value: concepts.LARYNGEAL_MASK_AIRWAY_INSERTION, label: "Laryngeal Mask Airway Insertion" },
    { value: concepts.ENDOTRACHEAL_TUBE_INSERTION, label: "Endotracheal Tube Insertion" },
    { value: concepts.NASOGASTRIC_TUBE_INSERTION, label: "Nasogastric Tube Insertion" },
    { value: concepts.MANUAL_VENTILATION, label: "Manual Ventilation" },
    { value: concepts.CONTINUOUS_POSITIVE_AIRWAY_PRESSURE, label: "Continuous Positive Airway Pressure (CPAP)" },
    { value: concepts.OTHER, label: "Other (Specify)" },
];

const supportiveCareConfig = [
    { value: concepts.WOUND_DRESSING, label: "Wound Dressing" },
    { value: concepts.PATIENT_EDUCATION, label: "Patient Education" },
    { value: concepts.COUNSELLING, label: "Counselling" },
    { value: concepts.FEEDING, label: "Feeding" },
    { value: concepts.OXYGENATION, label: "Oxygenation" },
    { value: concepts.TEPID_SPONGING, label: "Tepid Sponging" },
    { value: concepts.ELECTROCARDIOGRAPHY_MONITORING, label: "Electrocardiography (ECG) Monitoring" },
    { value: concepts.TURNING_PATIENTS, label: "Turning Patients" },
    { value: concepts.ORAL_CARE, label: "Oral Care" },
    { value: concepts.OTHER, label: "Other (Specify)" },
];

const schema = yup.object().shape({
    procedures: yup
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
        .min(1, "At least one procedure must be selected"),

    otherProcedureSpecify: yup
        .string()
        .nullable()
        .when("procedures", {
            is: (procedures: any[]) => procedures.some((procedure) => procedure.key === concepts.OTHER),
            then: (schema) => schema.required("Please specify the other procedure"),
        }),

    supportiveCare: yup
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
        .min(1, "At least one supportive care option must be selected"),

    otherSupportiveCareSpecify: yup
        .string()
        .nullable()
        .when("supportiveCare", {
            is: (supportiveCare: any[]) => supportiveCare.some((care) => care.key === concepts.OTHER),
            then: (schema) => schema.required("Please specify the other supportive care"),
        }),
});

export const NonPharmacologicalForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [showTextFields, setShowTextFields] = useState({
        otherProcedure: false,
        otherSupportiveCare: false,
    });
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { init, ServerTime } = useServerTime();


    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        console.log("Procedures Selected:", values.procedures);
        console.log("Supportive Care Selected:", values.supportiveCare);
        // const currentDateTime = getDateTime();
        const currentDateTime = ServerTime.getServerTimeString();


        const obs = [
            {
                concept: concepts.PROCEDURES,
                value: concepts.PROCEDURES,
                obsDatetime: currentDateTime,
                groupMembers: (values.procedures || [])
                    .filter((procedure: any) => procedure.value === true)
                    .map((procedure: any) => ({
                        concept: procedure.key,
                        value: procedure.key === concepts.OTHER ? values.otherProcedureSpecify : procedure.key,
                        obsDatetime: currentDateTime,
                    })),
            },
            {
                concept: concepts.SUPPORTIVE_CARE,
                value: concepts.SUPPORTIVE_CARE,
                obsDatetime: currentDateTime,
                groupMembers: (values.supportiveCare || [])
                    .filter((care: any) => care.value === true)
                    .map((care: any) => ({
                        concept: care.key,
                        value: care.key === concepts.OTHER ? values.otherSupportiveCareSpecify : null,
                        obsDatetime: currentDateTime,
                    })),
            },
        ];

        const payload = {
            encounterType: encounters.NON_PHARMACOLOGICAL,
            visit: activeVisit?.uuid,
            patient: params.id,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            // toast.success("Non-Pharmacological Form submitted successfully!");
            onSubmit(values); //  This triggers navigation to the next step
        } catch (error) {
            console.error("Error submitting Non-Pharmacological form: ", error);
            // toast.error("Failed to submit the form.");
        }
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{
                procedures: [],
                supportiveCare: [],
                otherProcedureSpecify: "",
                otherSupportiveCareSpecify: "",
            }}
            onSubmit={handleSubmit}
        >
            <FormValuesListener getValues={setFormValues} />
            <FormFieldContainer direction="row">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                    <h4>Procedures</h4>
                    <CheckboxesGroup
                        name="procedures"
                        allowFilter={false}
                        options={proceduresConfig}
                        getValue={(values) =>
                            setShowTextFields((prev) => ({
                                ...prev,
                                otherProcedure: values.some(
                                    (val: any) => val.key === concepts.OTHER && val.value
                                ),
                            }))
                        }
                    />
                    {showTextFields.otherProcedure && (
                        <TextInputField
                            id="otherProcedureSpecify"
                            label="Specify Other Procedure"
                            name="otherProcedureSpecify"
                            placeholder="Specify the procedure"
                        />
                    )}
                </WrapperBox>
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: "100%" }}>
                    <h4>Supportive Care</h4>
                    <CheckboxesGroup
                        name="supportiveCare"
                        allowFilter={false}
                        options={supportiveCareConfig}
                        getValue={(values) =>
                            setShowTextFields((prev) => ({
                                ...prev,
                                otherSupportiveCare: values.some(
                                    (val: any) => val.key === concepts.OTHER && val.value
                                ),
                            }))
                        }
                    />
                    {showTextFields.otherSupportiveCare && (
                        <TextInputField
                            id="otherSupportiveCareSpecify"
                            label="Specify Other Supportive Care"
                            name="otherSupportiveCareSpecify"
                            placeholder="Specify the care"
                        />
                    )}
                </WrapperBox>
            </FormFieldContainer>
        </FormikInit>
    );
};