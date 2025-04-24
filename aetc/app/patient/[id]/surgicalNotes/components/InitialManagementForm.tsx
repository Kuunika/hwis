"use client";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    FormikInit,
    WrapperBox,
    FormFieldContainer,
    FormFieldContainerLayout,
    TextInputField,
    PatientInfoTab,
} from "@/components";
import { PrescribedMedicationList } from "../../nursingChart/components/prescribedMedicationList";
import * as Yup from "yup";
import { useParameters } from "@/hooks";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useNavigation } from "@/hooks";
import { concepts, encounters } from "@/constants";
import { addEncounter, fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { Visit } from "@/interfaces";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const validationSchema = Yup.object({});

export const InitialManagementForm = ({ onSubmit, onSkip }: Prop) => {
    const [row, setRow] = useState<any>(null);
    const { params } = useParameters();
    const { navigateTo } = useNavigation();
    const { data: patientVisits } = getPatientVisitTypes(params.id as string);
    const { data: encountersData } = getPatientsEncounters(params.id as string);
    const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
    const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
    const [clerkInfo, setClerkInfo] = useState({
        clerkName: "",
        designation: "",
        signature: "",
        additionalNotes: "",
    });
    const [presentingInfo, setPresentingInfo] = useState({
        complaints: "",
        history: "",
        surgicalHistory: "",
        surgicalProcedure: "",
        familyHistory: [] as string[], // Explicitly type as string array
        allergies: "",// Add this line for allergies
        smoking: {
            status: "",
            duration: ""
        },
        alcoholIntake: "",
        recreationalDrugs: "",
    });

    // Add state for review of systems
    const [reviewOfSystems, setReviewOfSystems] = useState({
        general: [] as string[],
        ent: [] as string[],
        endocrine: [] as string[],
        cardiac: [] as string[],
        respiratory: [] as string[],
        gastrointestinal: [] as string[],
        genitourinary: [] as string[],
        musculoskeletal: [] as string[],
        neurologic: [] as string[],
        psychiatric: [] as string[],
    });
    const [physicalExam, setPhysicalExam] = useState({
        generalCondition: "",
        temperature: "",
        pulseRate: "",
        bloodPressure: "",
        respiratoryRate: "",
        eyes: "",
        mouth: "",
        neck: "",
        chest: "",
        endocrine: "",
        abdominal: "",
        motorResponse: "",
        verbalResponse: "",
        eyeResponse: "",
        cranialNerves: "",
        grossMotor: "",
        sensation: "",
        pulsations: "",
        rectalExamination: "",





    });

    // Ref for printing
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!encountersData) return;

        const surgicalEncounter = encountersData
            ?.filter((encounter) => encounter.encounter_type.uuid === encounters.SURGICAL_NOTES_TEMPLATE_FORM)
            .sort((a, b) => new Date(b.encounter_datetime).getTime() - new Date(a.encounter_datetime).getTime())[0];

        if (surgicalEncounter && surgicalEncounter.obs) {
            // Initialize with default values
            const newClerkInfo = {
                clerkName: "",
                designation: "",
                signature: "",
                additionalNotes: "",
            };
            const newPresentingInfo = {
                complaints: "",
                history: "",
                surgicalHistory: "",
                surgicalProcedure: "",
                familyHistory: [] as string[], // Explicitly type as string array
                allergies: "",// Add this line for allergies
                smoking: {
                    status: "",
                    duration: ""
                },
                alcoholIntake: "",
                recreationalDrugs: "",
            };

            // Initialize review of systems
            const newReviewOfSystems = {
                general: [] as string[],
                ent: [] as string[],
                endocrine: [] as string[],
                cardiac: [] as string[],
                respiratory: [] as string[],
                gastrointestinal: [] as string[],
                genitourinary: [] as string[],
                musculoskeletal: [] as string[],
                neurologic: [] as string[],
                psychiatric: [] as string[],
            };
            // Add new physical examination object
            const newPhysicalExam = {
                generalCondition: "",
                temperature: "",
                pulseRate: "",
                bloodPressure: "",
                respiratoryRate: "",
                eyes: "",
                mouth: "",
                neck: "",
                chest: "",
                endocrine: "",
                abdominal: "",
                motorResponse: "",
                verbalResponse: "",
                eyeResponse: "",
                cranialNerves: "",
                grossMotor: "",
                sensation: "",
                pulsations: "",
                rectalExamination: "",

            };


            // Loop through all observations to find our target concepts
            surgicalEncounter.obs.forEach(obs => {
                // Check the concept name from the names array
                const conceptName = obs.names && obs.names.length > 0 ? obs.names[0].name : null;

                if (conceptName === "Clerk name") {
                    newClerkInfo.clerkName = obs.value || obs.value_text || "";
                } else if (conceptName === "Designation") {
                    newClerkInfo.designation = obs.value || obs.value_text || "";
                } else if (conceptName === "Signature") {
                    newClerkInfo.signature = obs.value || obs.value_text || "";
                } else if (conceptName === "Additional Notes") {
                    newClerkInfo.additionalNotes = obs.value || obs.value_text || "";
                } else if (conceptName === "Presenting Complaints") {
                    // For "Presenting Complaints", we need to look at its children
                    if (obs.children && obs.children.length > 0) {
                        // Get the first child's value_text (which should be "Vomiting")
                        newPresentingInfo.complaints = obs.children[0].value_text || "";
                    }
                } else if (conceptName === "Presenting history") {
                    newPresentingInfo.history = obs.value || obs.value_text || "";
                } else if (conceptName === "Surgical Procedure") {
                    // This is actually the Surgical History field based on your payload
                    newPresentingInfo.surgicalHistory = obs.value || obs.value_text || "";
                } else if (conceptName === "Procedures") {
                    // This is the Surgical Procedure field based on your payload
                    newPresentingInfo.surgicalProcedure = obs.value || obs.value_text || "";
                } else if (conceptName?.startsWith("Family History")) {
                    // This is a family history condition
                    const condition = obs.value || obs.value_text || "";
                    if (condition) {
                        newPresentingInfo.familyHistory.push(condition);
                    }
                } else if (conceptName === "Allergic reaction") {
                    // Add this condition to capture allergic reactions
                    newPresentingInfo.allergies = obs.value || obs.value_text || "";
                }
                else if (conceptName === "Patient smokes") {
                    newPresentingInfo.smoking.status = obs.value || obs.value_text || "";

                    // Handle the duration which is in the children
                    if (obs.children && obs.children.length > 0) {
                        const durationChild = obs.children.find(child =>
                            child.names && child.names.length > 0 &&
                            child.names[0].name === "Expected Duration"
                        );

                        if (durationChild) {
                            newPresentingInfo.smoking.duration = durationChild.value || durationChild.value_text || "";
                        }
                    }
                } else if (conceptName === "Alcohol intake") {
                    newPresentingInfo.alcoholIntake = obs.value || obs.value_text || "";
                } else if (conceptName === "Recreational drug") {
                    newPresentingInfo.recreationalDrugs = obs.value || obs.value_text || "";
                } // Review of Systems - General
                else if (conceptName === "Review of systems, general") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.general.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - ENT
                else if (conceptName === "Review of systems ENT") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.ent.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Endocrine
                else if (conceptName === "Review of systems endocrine") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.endocrine.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - cardiac
                else if (conceptName === "Review of systems cardiac") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.cardiac.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - respiratory
                else if (conceptName === "Severe Respiratory") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.respiratory.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Gastrointestinal
                else if (conceptName === "Review Of Systems Gastrointestinal") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.gastrointestinal.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Genitourinary
                else if (conceptName === "Review Of Systems Genitourinary") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.genitourinary.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Musculoskeletal
                else if (conceptName === "Review Of Systems musculoskeletal") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.musculoskeletal.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Neurologic
                else if (conceptName === "Review Of Systems neurologic") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.neurologic.push(childName);
                            }
                        });
                    }
                }
                // Review of Systems - Psychiatric
                else if (conceptName === "Review of systems psychiatric") {
                    if (obs.children && obs.children.length > 0) {
                        obs.children.forEach(child => {
                            const childName = child.names && child.names.length > 0 ? child.names[0].name : null;
                            if (childName) {
                                newReviewOfSystems.psychiatric.push(childName);
                            }
                        });
                    }
                }

                // Add conditions for physical examination data
                if (conceptName === "General condition") {
                    newPhysicalExam.generalCondition = obs.value || "";
                } else if (conceptName === "Temperature (c)") {
                    newPhysicalExam.temperature = obs.value_numeric ? `${obs.value_numeric}°C` : obs.value || "";
                } else if (conceptName === "Pulse Rate") {
                    newPhysicalExam.pulseRate = obs.value_text || obs.value || "";
                } else if (conceptName === "Blood Pressure Measured") {
                    newPhysicalExam.bloodPressure = obs.value_text || obs.value || "";
                } else if (conceptName === "Respiratory rate") {
                    newPhysicalExam.respiratoryRate = obs.value_text || obs.value || "";
                } else if (conceptName === "Eyes") {
                    newPhysicalExam.eyes = obs.value_text || obs.value || "";
                } else if (conceptName === "Mouth") {
                    newPhysicalExam.mouth = obs.value_text || obs.value || "";
                } else if (conceptName === "Neck") {
                    newPhysicalExam.neck = obs.value_text || obs.value || "";
                } else if (conceptName === "Chest examination") {
                    newPhysicalExam.chest = obs.value_text || obs.value || "";
                } else if (conceptName === "Endocrine examination") {
                    newPhysicalExam.endocrine = obs.value_text || obs.value || "";
                } else if (conceptName === "Abdominal examination") {
                    newPhysicalExam.abdominal = obs.value_text || obs.value || "";
                } else if (conceptName === "Motor response") {
                    newPhysicalExam.motorResponse = obs.value_text || obs.value || "";
                } else if (conceptName === "Verbal Response") {
                    newPhysicalExam.verbalResponse = obs.value_text || obs.value || "";
                } else if (conceptName === "Eye Opening response") {
                    newPhysicalExam.eyeResponse = obs.value_text || obs.value || "";
                } else if (conceptName === "Motor response") {
                    newPhysicalExam.motorResponse = obs.value_text || obs.value || "";
                } else if (conceptName === "Verbal Response") {
                    newPhysicalExam.verbalResponse = obs.value_text || obs.value || "";
                } else if (conceptName === "Cranial erves") {
                    newPhysicalExam.cranialNerves = obs.value_text || obs.value || "";
                } else if (conceptName === "Gross motor") {
                    newPhysicalExam.grossMotor = obs.value_text || obs.value || "";
                } else if (conceptName === "Sensation") {
                    newPhysicalExam.sensation = obs.value_text || obs.value || "";
                } else if (conceptName === "Pulsations") {
                    newPhysicalExam.pulsations = obs.value_text || obs.value || "";
                } else if (conceptName === "Rectal examination") {
                    newPhysicalExam.rectalExamination = obs.value_text || obs.value || "";
                }

            });

            // If clerk name is still empty, use the created_by field as fallback
            if (!newClerkInfo.clerkName && surgicalEncounter.created_by) {
                newClerkInfo.clerkName = surgicalEncounter.created_by;
            }

            setClerkInfo(newClerkInfo);
            setPresentingInfo(newPresentingInfo);
            setReviewOfSystems(newReviewOfSystems);
            setPhysicalExam(newPhysicalExam); // Add this line to update physical exam state



        }
    }, [encountersData]);

    useEffect(() => {
        // Find the active visit for the patient from their visit history
        if (patientVisits) {
            const active = patientVisits.find((visit) => !visit.date_stopped);
            if (active) {
                setActiveVisit(active as unknown as Visit);
            }
        }
    }, [patientVisits]);

    const handleSubmit = async (values: any) => {
        const currentDateTime = getDateTime();
        // Create observations
        const obs = [
            {
                concept: concepts.ADDITIONAL_NOTES,
                value: values.additionalNotes,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.CLERK_NAME,
                value: values.clerkName,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.DESIGNATION,
                value: values.designation,
                obsDatetime: currentDateTime,
            },
            {
                concept: concepts.SIGNATURE,
                value: values.signature,
                obsDatetime: currentDateTime,
            },
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
            console.log("Initial Management submitted successfully!");
            onSubmit(values); // This triggers navigation to the next step
            reactToPrintFn(); // Trigger printing after submission
            navigateTo(`/dispositions`);
        } catch (error) {
            console.error("Error submitting Initial Management:", error);
        }
    };

    // Updated Print function using the new syntax
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <FormikInit
            initialValues={{
                additionalNotes: clerkInfo.additionalNotes,
                clerkName: clerkInfo.clerkName,
                designation: clerkInfo.designation,
                signature: clerkInfo.signature,
            }}
            validationSchema={validationSchema}
            submitButtonText="Submit and Print to PDF"
            onSubmit={handleSubmit}
            enableReinitialize // Allows the form to update with new clerkInfo
        >
            <div ref={contentRef} className="printable-content">
                <div className="print-only">
                    <PatientInfoTab />
                    <PrescribedMedicationList setRow={setRow} />
                    <p><strong>Clerk Name:</strong> {clerkInfo.clerkName}</p>
                    <p><strong>Designation:</strong> {clerkInfo.designation}</p>
                    <p><strong>Signature:</strong> {clerkInfo.signature}</p>
                    <p><strong>Additional Notes:</strong> {clerkInfo.additionalNotes}</p>
                    <p><strong>Presenting Complaints:</strong> {presentingInfo.complaints}</p>
                    <p><strong>Presenting History:</strong> {presentingInfo.history}</p>
                    <p><strong>Surgical History:</strong> {presentingInfo.surgicalHistory}</p>
                    <p><strong>Surgical Procedure:</strong> {presentingInfo.surgicalProcedure}</p>
                    <p><strong>Family History:</strong> {presentingInfo.familyHistory.length > 0 ?
                        presentingInfo.familyHistory.join(", ") : "None"}</p>
                    <p><strong>Allergies:</strong> {presentingInfo.allergies || "None"}</p>
                    {/* Social History Section */}
                    <h3>Social History</h3>
                    <p><strong>Smoking Status:</strong> {presentingInfo.smoking.status || "Unknown"}</p>
                    {presentingInfo.smoking.status === "Yes" && (
                        <p><strong>Cigarettes per day:</strong> {presentingInfo.smoking.duration || "Unknown"}</p>
                    )}
                    <p><strong>Alcohol Intake:</strong> {presentingInfo.alcoholIntake ? `${presentingInfo.alcoholIntake} units per day` : "None"}</p>
                    <p><strong>Recreational Drugs:</strong> {presentingInfo.recreationalDrugs || "None"}</p>
                    {/* Review of Systems Section */}
                    <h3>Review of Systems</h3>
                    <p><strong>General:</strong> {reviewOfSystems.general.length > 0 ?
                        reviewOfSystems.general.join(", ") : "None"}</p>
                    <p><strong>ENT:</strong> {reviewOfSystems.ent.length > 0 ?
                        reviewOfSystems.ent.join(", ") : "None"}</p>
                    <p><strong>Endocrine:</strong> {reviewOfSystems.endocrine.length > 0 ?
                        reviewOfSystems.endocrine.join(", ") : "None"}</p>
                    <p><strong>Cardiac:</strong> {reviewOfSystems.cardiac.length > 0 ?
                        reviewOfSystems.cardiac.join(", ") : "None"}</p>
                    <p><strong>Respiratory:</strong> {reviewOfSystems.respiratory.length > 0 ?
                        reviewOfSystems.respiratory.join(", ") : "None"}</p>
                    <p><strong>Gastrointestinal:</strong> {reviewOfSystems.gastrointestinal.length > 0 ?
                        reviewOfSystems.gastrointestinal.join(", ") : "None"}</p>
                    <p><strong>Genitourinary:</strong> {reviewOfSystems.genitourinary.length > 0 ?
                        reviewOfSystems.genitourinary.join(", ") : "None"}</p>
                    <p><strong>Musculoskeletal:</strong> {reviewOfSystems.musculoskeletal.length > 0 ?
                        reviewOfSystems.musculoskeletal.join(", ") : "None"}</p>
                    <p><strong>Neurologic:</strong> {reviewOfSystems.neurologic.length > 0 ?
                        reviewOfSystems.neurologic.join(", ") : "None"}</p>
                    <p><strong>Psychiatric:</strong> {reviewOfSystems.psychiatric.length > 0 ?
                        reviewOfSystems.psychiatric.join(", ") : "None"}</p>
                    {/* Add Physical Examination Section */}
                    <h3>Physical Examination</h3>
                    <p><strong>General Condition:</strong> {physicalExam.generalCondition || "Not recorded"}</p>

                    <h4>Vitals</h4>
                    <p><strong>Temperature:</strong> {physicalExam.temperature || "Not recorded"}</p>
                    <p><strong>Pulse Rate:</strong> {physicalExam.pulseRate || "Not recorded"} bpm</p>
                    <p><strong>Blood Pressure:</strong> {physicalExam.bloodPressure || "Not recorded"} mmHg</p>
                    <p><strong>Respiratory Rate:</strong> {physicalExam.respiratoryRate || "Not recorded"} breaths/min</p>

                    <p><strong>Eyes:</strong> {physicalExam.eyes || "Not recorded"}</p>
                    <p><strong>Mouth:</strong> {physicalExam.mouth || "Not recorded"}</p>
                    <p><strong>Neck:</strong> {physicalExam.neck || "Not recorded"}</p>
                    <p><strong>Chest Examination:</strong> {physicalExam.chest || "Not recorded"}</p>
                    <p><strong>Endocrine Examination:</strong> {physicalExam.endocrine || "Not recorded"}</p>
                    <p><strong>Abdominal Examination:</strong> {physicalExam.abdominal || "Not recorded"}</p>

                    <h4>Glasgow Coma Scale (GCS)</h4>
                    <p><strong>Motor Response:</strong> {physicalExam.motorResponse || "Not recorded"}</p>
                    <p><strong>Verbal Response:</strong> {physicalExam.verbalResponse || "Not recorded"}</p>
                    <p><strong>Eye Response:</strong> {physicalExam.eyeResponse || "Not recorded"}</p>

                    <h4>Additional Examinations</h4>
                    <p><strong>Cranial Nerves  :</strong> {physicalExam.cranialNerves || "Not recorded"}</p>
                    <p><strong>Gross Motor    :</strong> {physicalExam.grossMotor || "Not recorded"}</p>
                    <p><strong>Sensation:</strong> {physicalExam.sensation || "Not recorded"}</p>


                    <h4>Extremities</h4>
                    <p><strong>Pulsations:</strong> {physicalExam.pulsations || "Not recorded"}</p>
                    <p><strong>Rectal Examination  :</strong> {physicalExam.rectalExamination || "Not recorded"}</p>

                </div>
            </div>

            <FormFieldContainer direction="column">
                <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
                    {/* Prescribed Medication Section */}
                    <PrescribedMedicationList setRow={setRow} />

                    {/* Additional Information Section */}
                    <FormFieldContainerLayout title="Additional Information">
                        <TextInputField
                            sx={{ width: "100%" }}
                            name="additionalNotes"
                            label="Additional Notes"
                            multiline
                            rows={5}
                            placeholder="Enter any additional information here..."
                            id={""}
                        />
                    </FormFieldContainerLayout>

                    {/* Clerk Information Section */}
                    <FormFieldContainerLayout title="Clerk Information">
                        <TextInputField
                            name="clerkName"
                            label="Clerked by (Name)"
                            id={""}
                        />
                        <TextInputField
                            name="designation"
                            label="Designation"
                            id={""}
                        />
                        <TextInputField
                            name="signature"
                            label="Signature"
                            placeholder="E.g J.Smith"
                            id={""}
                        />
                    </FormFieldContainerLayout>
                </WrapperBox>
            </FormFieldContainer>

            {/* CSS for Print Handling */}
            <style jsx>{`
                @media print {
                    .print-only {
                        display: block !important; /* Ensure visibility in print */
                    }
                }
                .print-only {
                    display: none; /* Hide on screen */
                }
            `}</style>
        </FormikInit>
    );
};