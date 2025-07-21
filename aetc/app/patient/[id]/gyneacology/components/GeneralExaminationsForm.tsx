"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    TextInputField,
    FormFieldContainerLayout,
    RadioGroupInput,
    PatientInfoTab,
} from "@/components";
import { getDateTime } from "@/helpers/dateTime";
import * as Yup from "yup";
import { getActivePatientDetails } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getPatientsEncounters } from "@/hooks/encounter";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { Visit } from "@/interfaces";
import { useParameters } from "@/hooks";
import { useNavigation } from "@/hooks";
import { useServerTime } from "@/contexts/serverTimeContext";
import { useReactToPrint } from "react-to-print";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const conditionOptions = [
    { value: concepts.STABLE, label: "Stable" },
    { value: concepts.SICK, label: "Sick" },
    { value: concepts.CRITICAL, label: "Critical" },
];

const yesNoOptions = [
    { value: concepts.YES, label: "Yes" },
    { value: concepts.NO, label: "No" },
];

const validationSchema = Yup.object({});

export const GeneralExaminationsForm = ({ onSubmit, onSkip }: Prop) => {
    const { gender } = getActivePatientDetails();
    const { params } = useParameters();
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { data: encountersData } = getPatientsEncounters(params.id as string);
    const { navigateTo } = useNavigation();
    const { init, ServerTime } = useServerTime();

    const [complaintsInfo, setComplaintsInfo] = useState({
        chiefComplaint: "",
        illnessHistory: "",
        lnmp: "",
        //edd remaining
        gestationalAge: "",
        gravidity: "",
        parity: "",
        numberOfLivingChildren: "",
        menarche: "",
        menstralCycle: "",
        duration: "",
        prevAbortion: "",
        prevEctopic: "",
        abnormalVaginalDischarge: "",
        consistency: "",
        color: "",
        odour: "",
        amount: "",
        previousContraceptive: "",
        //currently on contracepptive
        sideEffects: "",
        cancerScreening: "",
        historyOfStis: "",
        medicalHistory: [] as string[],
        habits: [] as string[],
        temperature: "",
        pulse: "",
        respiratory: "",
        bloodPressure: "",
        stats: "",
        rbs: "",
        weight: "",
        height: "",
        chestExamination: "",
        abdomenExamination: "",
        vaginalExamination: "",
        extremities: "",
        impression: "",


    });
    // Ref for printing
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!encountersData) return;
        const gyneacologyEncounter = encountersData
            ?.filter(
                (encounter) =>
                    encounter.encounter_type &&
                    encounter.encounter_type.uuid === encounters.GYNEACOLOGY_WARD
            )
            .sort(
                (a, b) =>
                    new Date(b.encounter_datetime).getTime() -
                    new Date(a.encounter_datetime).getTime()
            )[0];

        if (gyneacologyEncounter && gyneacologyEncounter.obs) {
            const newComplaintsInfo = {
                chiefComplaint: "",
                illnessHistory: "",
                lnmp: "",
                //edd remaining
                gestationalAge: "",
                gravidity: "",
                parity: "",
                numberOfLivingChildren: "",
                menarche: "",
                menstralCycle: "",
                duration: "",
                prevAbortion: "",
                prevEctopic: "",
                abnormalVaginalDischarge: "",
                consistency: "",
                color: "",
                odour: "",
                amount: "",
                previousContraceptive: "",
                //currently on contracepptive
                sideEffects: "",
                cancerScreening: "",
                historyOfStis: "",
                medicalHistory: [] as string[],
                habits: [] as string[],
                temperature: "",
                pulse: "",
                respiratory: "",
                bloodPressure: "",
                stats: "",
                rbs: "",
                weight: "",
                height: "",
                chestExamination: "",
                abdomenExamination: "",
                vaginalExamination: "",
                extremities: "",
                impression: "",

            };

            const medicalHistoryConceptNames = [
                "Family History Hypertension",
                "Family History Diabetes Mellitus",
                "Family History Tuberculosis",
                "Family History Epilepsy",
                "Family History Asthma",
                "Mental illness",
                "Blood transfusion",
                "Drug Allergies"
            ];

            const habitsConceptNames = [
                "Alcohol intake",
                "Smoking history",
                "Recreational drug",
            ];

            gyneacologyEncounter.obs.forEach(obs => {
                const conceptName = obs.names && obs.names.length > 0 ? obs.names[0].name : null;
                if (conceptName === "Chief complaint") {
                    newComplaintsInfo.chiefComplaint = obs.value || obs.value_text || "";
                } else if (conceptName === "History of present illness") {
                    newComplaintsInfo.illnessHistory = obs.value || obs.value_text || "";
                }
                else if (conceptName === "LNMP") {
                    newComplaintsInfo.lnmp = obs.value || obs.value_text || "";
                } else if (conceptName === "Gestational age") {
                    newComplaintsInfo.gestationalAge = obs.value || obs.value_text || "";
                } else if (conceptName === "Gravidity") {
                    newComplaintsInfo.gravidity = obs.value || obs.value_text || "";
                }
                else if (conceptName === "Parity") {
                    newComplaintsInfo.parity = obs.value || obs.value_text || "";
                }

                else if (conceptName === "Number of living children") {
                    newComplaintsInfo.numberOfLivingChildren = obs.value || obs.value_text || "";
                } else if (conceptName === "Menarche") {
                    newComplaintsInfo.menarche = obs.value || obs.value_text || "";
                } else if (conceptName === "Menstrual cycle") {
                    newComplaintsInfo.menstralCycle = obs.value || obs.value_text || "";
                } else if (conceptName === "Duration") {
                    newComplaintsInfo.duration = obs.value || obs.value_text || "";
                } else if (conceptName === "Prev Abortion") {
                    newComplaintsInfo.prevAbortion = obs.value || obs.value_text || "";
                } else if (conceptName === "Prev Ectopic") {
                    newComplaintsInfo.prevEctopic = obs.value || obs.value_text || "";
                } else if (conceptName === "Abnormal Vaginal Discharge") {
                    newComplaintsInfo.abnormalVaginalDischarge = obs.value || obs.value_text || "";
                } else if (conceptName === "Consistency") {
                    newComplaintsInfo.consistency = obs.value || obs.value_text || "";
                } else if (conceptName === "Color") {
                    newComplaintsInfo.color = obs.value || obs.value_text || "";
                } else if (conceptName === "Odour") {
                    newComplaintsInfo.odour = obs.value || obs.value_text || "";
                } else if (conceptName === "Amount") {
                    newComplaintsInfo.amount = obs.value || obs.value_text || "";
                } else if (conceptName === "Previous Contraceptive") {
                    newComplaintsInfo.previousContraceptive = obs.value || obs.value_text || "";
                } else if (conceptName === "Side effects") {
                    newComplaintsInfo.sideEffects = obs.value || obs.value_text || "";
                } else if (conceptName === "Cancer Screening") {
                    newComplaintsInfo.cancerScreening = obs.value || obs.value_text || "";
                } else if (conceptName === "History of STIs") {
                    newComplaintsInfo.historyOfStis = obs.value || obs.value_text || "";
                } else if (conceptName && medicalHistoryConceptNames.includes(conceptName)) {
                    const condition = obs.value || obs.value_text || "";
                    if (condition) {
                        newComplaintsInfo.medicalHistory.push(condition);
                    }
                } else if (conceptName && habitsConceptNames.includes(conceptName)) {
                    const condition = obs.value || obs.value_text || "";
                    if (condition) {
                        newComplaintsInfo.habits.push(condition);
                    }

                } else if (conceptName === "Temperature") {
                    newComplaintsInfo.temperature = obs.value || obs.value_text || "";
                } else if (conceptName === "Pulse Rate") {
                    newComplaintsInfo.pulse = obs.value || obs.value_text || "";
                } else if (conceptName === "Respiratory Rate") {
                    newComplaintsInfo.respiratory = obs.value || obs.value_text || "";
                } else if (conceptName === "Blood Pressure Measured") {
                    newComplaintsInfo.bloodPressure = obs.value || obs.value_text || "";
                } else if (conceptName === "Stats") {
                    newComplaintsInfo.stats = obs.value || obs.value_text || "";
                } else if (conceptName === "Random Blood Glucose (RBS)") {
                    newComplaintsInfo.rbs = obs.value || obs.value_text || "";
                } else if (conceptName === "Weight") {
                    newComplaintsInfo.weight = obs.value || obs.value_text || "";
                }
                else if (conceptName === "Height") {
                    newComplaintsInfo.height = obs.value || obs.value_text || "";
                }
                else if (conceptName === "Chest examination") {
                    newComplaintsInfo.chestExamination = obs.value || obs.value_text || "";
                } else if (conceptName === "Abdominal examination") {
                    newComplaintsInfo.abdomenExamination = obs.value || obs.value_text || "";
                } else if (conceptName === "Vaginal examination") {
                    newComplaintsInfo.vaginalExamination = obs.value || obs.value_text || "";
                } else if (conceptName === "Extremities") {
                    newComplaintsInfo.extremities = obs.value || obs.value_text || "";
                } else if (conceptName === "Impression") {
                    newComplaintsInfo.impression = obs.value || obs.value_text || "";
                }
            });
            setComplaintsInfo(newComplaintsInfo);
        }
    }, [encountersData]);



    useEffect(() => {
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }


    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        if (!activeVisit) {
            console.error("No active visit found for the patient.");
            return;
        }

        // Get current server time
        const currentDateTime = ServerTime.getServerTimeString();

        const createObs = (concept: string, value: any) => ({
            concept,
            value,
            obsDatetime: currentDateTime,
        });

        const obs = [
            createObs(concepts.CONDITION, values.condition),
            createObs(concepts.PALLOR, values.pallor),
            createObs(concepts.TEMPERATURE, values.temperature),
            createObs(concepts.PULSE_RATE, values.pulse),
            createObs(concepts.RESPIRATORY_RATE, values.respiratoryRate),
            createObs(concepts.BLOOD_PRESSURE_MEASURED, values.bloodPressure),
            createObs(concepts.STATS, values.stats),
            createObs(concepts.RBS, values.rbs),
            createObs(concepts.WEIGHT, values.weight),


            createObs(concepts.RAISED_HEIGHT, values.height),
            createObs(concepts.CHEST_EXAMINATION, values.chest),
            createObs(concepts.ABDOMINAL_EXAMINATION, values.abdomen),
            createObs(concepts.VAGINAL_INSPECTION, values.vaginalInspection),
            createObs(concepts.VAGINAL_EXAMINATION, values.vaginalExamination),
            createObs(concepts.EXTREMITIES, values.extremities),
            createObs(concepts.IMPRESSION, values.impression),
            createObs(concepts.GENERAL_EXAMINATION_PLAN, values.plan),
            createObs(concepts.IMMEDIATE_INTERVENTION, values.immediateIntervention),
        ].filter((item) => item.value && item.value !== "");

        const payload = {
            encounterType: encounters.GYNEACOLOGY_WARD,
            patient: params.id,
            visit: activeVisit.uuid,
            encounterDatetime: currentDateTime,
            obs,
        };

        try {
            await submitEncounter(payload);
            onSubmit(values);
            // reactToPrintFn(); // Trigger printing after submission
            navigateTo(`/patient/${params.id}/profile`);
        } catch (error) {
            console.error("Error submitting General Examination:", error);
        }
    };

    // Updated Print function using the new syntax
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <FormikInit
            initialValues={{
                condition: "",
                pallor: "",
                temperature: "",
                pulse: "",
                respiratoryRate: "",
                bloodPressure: "",
                stats: "",
                rbs: "",
                weight: "",
                height: "",
                chest: "",
                abdomen: "",
                vaginalInspection: "",
                vaginalExamination: "",
                extremities: "",
                impression: "",
                plan: "",
                immediateIntervention: "",

            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <div ref={contentRef} className="printable-content">
                <div className="print-only">
                    <PatientInfoTab />
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Gyneacology Ward</h1>

                    {/* Display all collected data in a structured format */}
                    <div className="patient-examination-data">
                        <h2>Complaints</h2>
                        <p><strong>Chief Complaints: </strong>{complaintsInfo.chiefComplaint}</p>
                        <p><strong>History of Present Illness: </strong>{complaintsInfo.illnessHistory}</p>

                        <h2>Obstetric and Gyneacology History</h2>
                        <p><strong>LNMP: </strong>{complaintsInfo.lnmp}</p>
                        <p><strong>Gestational Age: </strong>{complaintsInfo.gestationalAge}</p>
                        <p><strong>Gravidity: </strong>{complaintsInfo.gravidity}</p>
                        <p><strong>Number of Living Children: </strong>{complaintsInfo.numberOfLivingChildren}</p>
                        <p><strong>Menarche: </strong>{complaintsInfo.menarche}</p>
                        <p><strong>Menstrual cycle: </strong>{complaintsInfo.menstralCycle}</p>
                        <p><strong>Duration: </strong>{complaintsInfo.duration}</p>
                        <p><strong>Prev Abortion: </strong>{complaintsInfo.prevAbortion}</p>
                        <p><strong>Prev Ectopic: </strong>{complaintsInfo.prevEctopic}</p>
                        <p><strong>Abnormal Vaginal Discharge: </strong>{complaintsInfo.abnormalVaginalDischarge}</p>
                        <p><strong>Consistency: </strong>{complaintsInfo.consistency}</p>
                        <p><strong>Color: </strong>{complaintsInfo.color}</p>
                        <p><strong>Odour: </strong>{complaintsInfo.odour}</p>
                        <p><strong>Amount: </strong>{complaintsInfo.amount}</p>
                        <p><strong>Previous Contraceptive: </strong>{complaintsInfo.previousContraceptive}</p>
                        <p><strong>Side effects: </strong>{complaintsInfo.sideEffects}</p>
                        <p><strong>Cancer Screening: </strong>{complaintsInfo.cancerScreening}</p>
                        <p><strong>History of STIs: </strong>{complaintsInfo.historyOfStis}</p>


                        <h2>Medical History</h2>
                        <p><strong> Condition: </strong>{complaintsInfo.medicalHistory.length > 0 ?
                            complaintsInfo.medicalHistory.join(",") : "None"}</p>

                        <h2>Habits</h2>
                        <p><strong> Condition: </strong>{complaintsInfo.habits.length > 0 ?
                            complaintsInfo.habits.join(",") : "None"}</p>

                        <h2>Condition & Pallor</h2>
                        <p><strong>Condition: </strong></p>
                        <p><strong>Pallor: </strong></p>

                        <h2>Vital Signs</h2>
                        <p><strong>Temperature: </strong>{complaintsInfo.temperature}</p>
                        <p><strong>Pulse: </strong>{complaintsInfo.pulse}</p>
                        <p><strong>Respiratory: </strong>{complaintsInfo.respiratory}</p>
                        <p><strong>Blood Pressure: </strong>{complaintsInfo.bloodPressure}</p>
                        <p><strong>Stats: </strong>{complaintsInfo.stats}</p>
                        <p><strong>RBS: </strong>{complaintsInfo.rbs}</p>
                        <p><strong>Weight: </strong>{complaintsInfo.weight}</p>

                        <h2>Examinations</h2>
                        <p><strong>Chest Examination: </strong>{complaintsInfo.chestExamination}</p>
                        <p><strong>Abdominal Examination: </strong>{complaintsInfo.abdomenExamination}</p>
                        <p><strong>Vaginal Examination: </strong>{complaintsInfo.vaginalExamination}</p>
                        <p><strong>Extremities: </strong>{complaintsInfo.extremities}</p>
                        <p><strong>Impression: </strong>{complaintsInfo.impression}</p>

                    </div>
                </div>
            </div>
            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    <FormFieldContainerLayout title="General Examination">

                        <FormFieldContainerLayout title="Condition">
                            <RadioGroupInput name="condition" options={conditionOptions} label={""} />
                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Pallor">
                            <RadioGroupInput name="pallor" options={yesNoOptions} label={""} />
                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Vitals">
                            <TextInputField name="temperature" label="Temperature" type="text" id={""} />
                            <TextInputField name="pulse" label="Pulse" type="text" id={""} />
                            <TextInputField name="respiratoryRate" label="Respiratory Rate" type="text" id={""} />
                            <TextInputField name="bloodPressure" label="Blood Pressure" type="text" id={""} />
                            <TextInputField name="stats" label="Sats" type="text" id={""} />
                            <TextInputField name="rbs" label="RBS" type="text" id={""} />
                            <TextInputField name="weight" label="Weight" type="text" id={""} />
                            <TextInputField name="height" label="Height" type="text" id={""} />
                        </FormFieldContainerLayout>

                        <FormFieldContainerLayout title="Other Examinations">
                            <TextInputField name="chest" label="Chest" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="abdomen" label="Abdomen" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="vaginalInspection" label="Vaginal Inspection" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="vaginalExamination" label="Vaginal Examination" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="extremities" label="Extremities" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="impression" label="Impression" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="plan" label="Plan" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                            <TextInputField name="immediateIntervention" label="Immediate Intervention" type="text" id={""} multiline
                                rows={5} sx={{ width: "100%" }}
                            />
                        </FormFieldContainerLayout>

                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>
            {/* CSS for Print Handling */}
            <style jsx>{`
                @media print {
                    .print-only {
                        display: block !important; /* Ensure visibility in print */
                    }
                    .patient-examination-data {
                        margin: 20px 0;
                        line-height: 1.5;
                    }
                    .patient-examination-data h2 {
                        margin-top: 15px;
                        margin-bottom: 10px;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 5px;
                    }
                }
                .print-only {
                    display: none; /* Hide on screen */
                }
            `}</style>
        </FormikInit>
    );
};