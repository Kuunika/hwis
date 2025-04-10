
import { useState, useEffect } from "react";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import {concepts, encounters} from "@/constants";
import {push} from "micromark-util-chunked";

export interface ComponentNote {
    paragraph: string;
    creator: string;
    time: string;
    rawTime: number;
}

export const useComponentNotes = (encounterType: string) => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [notes, setNotes] = useState<ComponentNote[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const encounter = patientHistory.find(
                (enc: any) => enc?.encounter_type?.uuid === encounterType
            );

            if (encounter) {
                const formattedNotes = formatComponentNotes(encounter.obs, encounterType);
                setNotes(formattedNotes);
            }
        }
    }, [patientHistory, historyLoading, encounterType]);

    const formatComponentNotes = (obs: any[], encounterType: string): ComponentNote[] => {
        switch (encounterType) {
            case encounters.AIRWAY_ASSESSMENT:
                return formatAirwayAssessmentNotes(obs);
            case encounters.BREATHING_ASSESSMENT:
                return formatBreathingAssessmentNotes(obs);
            case encounters.CIRCULATION_ASSESSMENT:
                return formatCirculationAssessmentNotes(obs);
            case encounters.DISABILITY_ASSESSMENT:
                return formatDisabilityAssessmentNotes(obs);
            case encounters.EXPOSURE_ASSESSMENT:
                return formatExposureAssessmentNotes(obs);
            case encounters.PRESENTING_COMPLAINTS:
                return formatPresentingComplaintsNotes(obs);
            case encounters.ALLERGIES:
                return formatAllergiesNotes(obs);
            case encounters.PRESCRIPTIONS:
                return formatMedicationsNotes(obs);
            case encounters.DIAGNOSIS:
                return formatExistingConditionsNotes(obs);
            // case encounters.SURGICAL_HISTORY:
            //     return formatSurgicalHistoryNotes(obs)
            // case encounters.PATIENT_ADMISSIONS:
            //     return formatAdmissionNotes(obs);
            case encounters.GENERAL_INFORMATION_ASSESSMENT:
                return formatGeneralInformationNotes(obs);
            case encounters.HEAD_AND_NECK_ASSESSMENT:
                return formatHeadAndNeckNotes(obs);
            case encounters.CHEST_ASSESSMENT:
                return formatChestAssessmentNotes(obs);
            case encounters.ABDOMEN_AND_PELVIS_ASSESSMENT:
                return formatAbdomenPelvisNotes(obs);
            case encounters.EXTREMITIES_ASSESSMENT:
                return formatExtremitiesNotes(obs);
            case encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT:
                return formatNeurologicalExaminationNotes(obs);
            case encounters.NURSING_CARE_NOTES:
                return formatSoapierNotes(obs)
            default:
                return [];
        }
    };

    const formatAirwayAssessmentNotes = (obs: any[]): ComponentNote[] => {
        const paragraphs: ComponentNote[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";
        let currentCreator = "";
        let airwayReasons: string[] = [];
        let airwayInterventions: string[] = [];

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const creator = ob.created_by || "Unknown";

            if (name === "Airway Patent" && currentParagraph.length > 0) {
                if (airwayReasons.length > 0) {
                    currentParagraph.push(`The airway obstruction is attributed to ${airwayReasons.join(", ")}.`);
                    airwayReasons = [];
                }
                if (airwayInterventions.length > 0) {
                    currentParagraph.push(`Interventions performed: ${airwayInterventions.join(", ")}.`);
                    airwayInterventions = [];
                }

                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                    creator: currentCreator,
                    rawTime: new Date(currentTime).getTime(),
                });

                currentParagraph = [];
            }

            if (name === "Airway Patent") {
                currentTime = ob.obs_datetime || new Date().toISOString();
                currentCreator = creator;
            }

            if (name === "Airway Patent") {
                if (valueText === "Yes") {
                    currentParagraph.push("The airway is patent.");
                } else if (valueText === "No") {
                    currentParagraph.push("The airway is not patent.");
                } else {
                    currentParagraph.push("The patient's airway is threatened.");
                }
            } else if (name === "Airway Reason") {
                airwayReasons.push(valueText);
            } else if (name === "Airway Opening Intervention") {
                airwayInterventions.push(valueText);
            } else if (name === "Patient Injured") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient has sustained injuries.");
                } else if (valueText === "No") {
                    currentParagraph.push("The patient is not injured.");
                }
            } else if (name === "Neck collar applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient was stabilised by applying the Neck Collar.");
                } else if (valueText === "No") {
                    currentParagraph.push("The Neck Collar was not applied.");
                } else {
                    currentParagraph.push("Application of a Neck Collar was not indicated.");
                }
            } else if (name === "Head blocks applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("Head blocks were applied to stabilize the C-Spine.");
                } else {
                    currentParagraph.push("Head blocks were not applied as an Intervention to stabilize the C-Spine.");
                }
            }
        });

        if (airwayReasons.length > 0) {
            currentParagraph.push(`The airway obstruction is attributed to ${airwayReasons.join(", ")}.`);
        }
        if (airwayInterventions.length > 0) {
            currentParagraph.push(`Interventions performed: ${airwayInterventions.join(", ")}.`);
        }

        if (currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime(),
            });
        }

        return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
    };

    return { notes, isLoading: historyLoading };
};

const formatBreathingAssessmentNotes = (obs: any[]) => {
    const paragraphs: ComponentNote[] = [];
    let currentParagraph: string[] = [];
    let currentStatus = "normal";
    let currentTime = "";
    let currentCreator = "";
    let additionalNotes = "";

    const addStatement = (statement: string, isAbnormal: boolean = false) => {
        currentParagraph.push(statement);
        if (isAbnormal) {
            currentStatus = "abnormal";
        }
    };

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const valueText = ob.value;
        const creator = ob.created_by;

        if (name === "Is Breathing Abnormal" && currentParagraph.length > 0) {
            if (additionalNotes) {
                currentParagraph.push(additionalNotes);
                additionalNotes = "";
            }

            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime(),

            });

            currentParagraph = [];
            currentStatus = "normal";
        }

        if (name === "Is Breathing Abnormal") {
            currentTime = ob.obs_datetime || new Date().toISOString();
            currentCreator = creator;
        }

        if (name === "Is Breathing Abnormal") {
            if (valueText === "Yes") {
                addStatement("The patient is breathing normally.", true);
            } else if (valueText === "No") {
                addStatement("The patient is breathing abnormally.", true);
                const startTimeObs = obs.find((ob: any) => ob.names?.[0]?.name === "Start Time");
                const endTimeObs = obs.find((ob: any) => ob.names?.[0]?.name === "End Time");

                if (startTimeObs) {
                    addStatement(`The patient was assisted with ventilation from ${startTimeObs.value}`, true);
                }
                if (endTimeObs) {
                    addStatement(`to ${endTimeObs.value}.`, true);
                }
            }
        } else if (name === "Respiratory rate") {
            addStatement(`The patient's respiratory rate is ${valueText} bpm.`, true);
        } else if (name === "Oxygen Saturation") {
            addStatement(`And oxygen saturation is ${valueText}%.`, true);
        } else if (name === "Patient Need Oxygen") {
            if (valueText === "Yes") {
                addStatement("Supplemental oxygen required.", true);
            } else {
                addStatement("Supplemental oxygen not required.");
            }
        } else if (name === "Is Trachea Central") {
            if (valueText === "No") {
                addStatement("The trachea is not central.", true);
            } else {
                addStatement("The trachea is central.");
            }
        } else if (name === "Chest wall abnormality") {
            if (valueText === "Yes") {
                addStatement("The chest wall is abnormal.", true);
            } else {
                addStatement("The chest wall is normal.");
            }
        } else if (name === "Chest Expansion") {
            if (valueText === "Reduced") {
                addStatement("The patient's chest expansion is reduced.", true);
            } else {
                addStatement("The patient's chest expansion is normal.");
            }
        } else if (name === "Percussion") {
            if (valueText === "Abnormal") {
                addStatement("Percussion findings are abnormal.", true);
            } else {
                addStatement("Percussion findings are normal.");
            }
        } else if (name === "Breathing sounds") {
            if (valueText === "Abnormal") {
                addStatement("Breath sounds are abnormal.", true);
            } else {
                addStatement("Breath sounds are normal.");
            }
        } else if (name === "Additional Notes") {
            additionalNotes = `Additional Notes: ${valueText}`;
        }
    });

    if (currentParagraph.length > 0) {
        if (additionalNotes) {
            currentParagraph.push(additionalNotes);
        }

        paragraphs.push({
            paragraph: currentParagraph.join(" "),
            time: currentTime,
            creator: currentCreator,
            rawTime: new Date(currentTime).getTime(),

        });
    }

    return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
};

const formatPresentingComplaintsNotes = (obs: any[]): ComponentNote[] => {
    const complaintDetails: string[] = [];
    let assessmentTime = new Date().toISOString();
    let creator = "Unknown";

    obs?.forEach((item: any) => {
        if (item.names?.[0]?.name && item.value) {
            complaintDetails.push(item.value);
        }
        if (item.obs_datetime) {
            assessmentTime = item.obs_datetime;
        }
        if (item.created_by) {
            creator = item.created_by;
        }
    });

    if (complaintDetails.length === 0) {
        return [];
    }

    return [{
        paragraph: `Presenting complaints: ${complaintDetails.join(', ')}.`,
        time: assessmentTime,
        creator: creator,
        rawTime: new Date(assessmentTime).getTime()
    }];
};

const formatAllergiesNotes = (obs: any[]): ComponentNote[] => {
    const allergyNames: string[] = [];
    let assessmentTime = new Date().toISOString();
    let creator = "Unknown";

    obs?.forEach(item => {
        item.children?.forEach((child: any) => {
            if (child.value && !allergyNames.includes(child.value)) {
                allergyNames.push(child.value);
            }
        });
        if (item.obs_datetime) {
            assessmentTime = item.obs_datetime;
        }
        if (item.created_by) {
            creator = item.created_by;
        }
    });

    return allergyNames.length > 0 ? [{
        paragraph: `Allergies: ${allergyNames.join(', ')}.`,
        time: assessmentTime,
        creator,
        rawTime: new Date(assessmentTime).getTime()
    }] : [];
};

const formatMedicationsNotes = (obs: any[]): ComponentNote[] => {
    const medicationNotes: ComponentNote[] = [];

    obs?.forEach((item: any) => {
        // Skip if not a medication observation
        if (item.names?.[0]?.name !== "Drug Given") return;

        let drugGiven = item.value;
        let lastTaken = "";
        let lastPrescription = "";
        let frequency = "";
        let creator = item.created_by || "Unknown";
        let encounterTime = item.obs_datetime || new Date().toISOString();

        // Process group members
        if (item.groupMembers && item.groupMembers.length > 0) {
            item.groupMembers.forEach((member: any) => {
                const memberName = member.conceptName;
                const memberValue = member.value;

                switch (memberName) {
                    case "Medication Date Last Taken":
                        lastTaken = memberValue;
                        break;
                    case "Medication Date Of Last Prescription":
                        lastPrescription = memberValue;
                        break;
                    case "Medication Frequency":
                        frequency = memberValue;
                        break;
                    case "Dose In Grams":
                        // Handle dose if needed
                        break;
                }
            });
        }

        const parts = [];
        if (drugGiven) parts.push(`${drugGiven}`);
        if (frequency) parts.push(`Frequency: ${frequency}`);
        if (lastTaken) parts.push(`Last taken: ${new Date(lastTaken).toLocaleDateString()}`);
        if (lastPrescription) parts.push(`Last prescribed: ${new Date(lastPrescription).toLocaleDateString()}`);

        if (parts.length > 0) {
            medicationNotes.push({
                paragraph: `Medication: ${parts.join('; ')}.`,
                time: encounterTime,
                creator,
                rawTime: new Date(encounterTime).getTime()
            });
        }
    });

    return medicationNotes;
};
const formatExistingConditionsNotes = (obs: any[]): ComponentNote[] => {
    const assessments: ComponentNote[] = [];
    let currentAssessment: {
        diagnosisDate?: string;
        icd11Diagnosis?: string;
        onTreatment?: string;
        additionalDetails?: string;
        creator: string;
    } = {
        creator: "Unknown"
    };

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const creator = ob.creator || ob.created_by || "Unknown";

        switch (name) {
            case "Diagnosis date":
                if (currentAssessment.icd11Diagnosis) {
                    assessments.push(createExistingConditionAssessment(currentAssessment));
                }
                currentAssessment = {
                    diagnosisDate: value,
                    creator: creator
                };
                break;
            case "ICD11 Diagnosis":
                currentAssessment.icd11Diagnosis = value;
                currentAssessment.creator = creator;
                break;
            case "On treatment":
                currentAssessment.onTreatment = value;
                break;
            case "Additional Diagnosis Details":
                currentAssessment.additionalDetails = value;
                break;
        }
    });

    if (currentAssessment.icd11Diagnosis) {
        assessments.push(createExistingConditionAssessment(currentAssessment));
    }

    return assessments.sort((a, b) => b.rawTime - a.rawTime);
};

const createExistingConditionAssessment = (assessment: {
    diagnosisDate?: string;
    icd11Diagnosis?: string;
    onTreatment?: string;
    additionalDetails?: string;
    creator: string;
}): ComponentNote => {
    const parts: string[] = [];

    if (assessment.icd11Diagnosis) {
        parts.push(`Diagnosis: ${assessment.icd11Diagnosis}`);
    }

    if (assessment.diagnosisDate) {
        parts.push(`Diagnosed on ${new Date(assessment.diagnosisDate).toLocaleDateString()}`);
    }

    if (assessment.onTreatment) {
        switch (assessment.onTreatment.toLowerCase()) {
            case 'yes':
                parts.push(`Currently on treatment`);
                break;
            case 'no':
                parts.push(`Not currently on treatment`);
                break;
            case 'unknown':
                parts.push(`Treatment status unknown`);
                break;
            default:
                parts.push(`Treatment status: ${assessment.onTreatment}`);
        }
    }

    if (assessment.additionalDetails) {
        parts.push(`Additional notes: ${assessment.additionalDetails}`);
    }

    const time = assessment.diagnosisDate || new Date().toISOString();

    return {
        paragraph: parts.join(". ") + (parts.length > 0 ? '.' : ''),
        time: time,
        creator: assessment.creator,
        rawTime: new Date(time).getTime()
    };
};
const formatSurgicalHistoryNotes = (obs: any[]): ComponentNote[] => {
    const surgicalNotes: ComponentNote[] = [];
    let currentNote: {
        surgeryDate?: string;
        procedureName?: string;
        indication?: string;
        complications?: string;
        creator: string;
    } = {
        creator: "Unknown"
    };

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const creator = ob.creator || ob.created_by || "Unknown";

        if (name === "Date of surgery") {
            if (currentNote.surgeryDate) {
                surgicalNotes.push(createSurgicalNote(currentNote));
            }
            currentNote = {
                surgeryDate: value,
                creator: creator
            };
        }
        else if (name === "Indication For Surgery") {
            currentNote.indication = value;
        }
        else if (name === "Complications") {
            currentNote.complications = value;
        }
        else if (value === true || value === "true") {
            currentNote.procedureName = name;
            currentNote.creator = creator;
        }
    });

    if (currentNote.surgeryDate) {
        surgicalNotes.push(createSurgicalNote(currentNote));
    }

    return surgicalNotes.sort((a, b) => b.rawTime - a.rawTime);
};

const createSurgicalNote = (note: {
    surgeryDate?: string;
    procedureName?: string;
    indication?: string;
    complications?: string;
    creator: string;
}): ComponentNote => {
    const parts: string[] = [];

    if (note.procedureName) {
        parts.push(`Surgical procedure performed: ${note.procedureName}`);
    } else {
        parts.push("Surgical procedure performed");
    }

    if (note.surgeryDate) {
        parts.push(`Date of surgery: ${new Date(note.surgeryDate).toLocaleDateString()}`);
    }

    if (note.indication) {
        parts.push(`Indication: ${note.indication}`);
    }

    if (note.complications) {
        if (note.complications.toLowerCase() === "none") {
            parts.push(`No complications reported`);
        } else {
            parts.push(`Complications: ${note.complications}`);
        }
    }

    const time = note.surgeryDate || new Date().toISOString();

    return {
        paragraph: parts.join(". ") + (parts.length > 0 ? '.' : ''),
        time: time,
        creator: note.creator,
        rawTime: new Date(time).getTime()
    };
};
const formatAdmissionNotes = (obs: any[]): ComponentNote[] => {
    const admissionNotes: ComponentNote[] = [];
    let currentAdmission: {
        admissionDate?: string;
        healthCenter?: string;
        admissionSection?: string;
        diagnosis?: string;
        surgicalInterventions?: string;
        dischargeInstructions?: string;
        followUp?: string;
        creator: string;
    } = {
        creator: "Unknown"
    };

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const creator =  ob.created_by || "Unknown";

        switch (name) {
            case "Admission date":
                if (currentAdmission.admissionDate) {
                    admissionNotes.push(createAdmissionNote(currentAdmission));
                }
                currentAdmission = {
                    admissionDate: value,
                    creator: creator
                };
                break;
            case "Health center hospitals":
                currentAdmission.healthCenter = value;
                break;
            case "Admission section":
                currentAdmission.admissionSection = value;
                break;
            case "ICD11 Diagnosis":
                currentAdmission.diagnosis = value;
                break;
            case "Surgical interventions for tuberculosis":
                currentAdmission.surgicalInterventions = value;
                break;
            case "Discharge Instructions":
                currentAdmission.dischargeInstructions = value;
                break;
            case "Follow Up":
                currentAdmission.followUp = value;
                break;
        }
    });

    if (currentAdmission.admissionDate) {
        admissionNotes.push(createAdmissionNote(currentAdmission));
    }

    return admissionNotes.sort((a, b) => b.rawTime - a.rawTime);
};

const createAdmissionNote = (admission: {
    admissionDate?: string;
    healthCenter?: string;
    admissionSection?: string;
    diagnosis?: string;
    surgicalInterventions?: string;
    dischargeInstructions?: string;
    followUp?: string;
    creator: string;
}): ComponentNote => {
    const parts: string[] = [];

    if (admission.healthCenter) {
        parts.push(`Admitted at ${admission.healthCenter}`);
    }

    if (admission.admissionSection) {
        parts.push(`Ward name: ${admission.admissionSection}`);
    }

    if (admission.admissionDate) {
        parts.push(`Date of admission ${new Date(admission.admissionDate).toLocaleDateString()}`);
    }

    if (admission.diagnosis) {
        parts.push(`Diagnosis: ${admission.diagnosis}`);
    }

    if (admission.surgicalInterventions) {
        parts.push(`Surgical interventions: ${admission.surgicalInterventions}`);
    }

    if (admission.dischargeInstructions) {
        parts.push(`Discharge instructions: ${admission.dischargeInstructions}`);
    }

    if (admission.followUp) {
        parts.push(`Follow-up: ${admission.followUp}`);
    }

    const time = admission.admissionDate || new Date().toISOString();

    return {
        paragraph: parts.join(". ") + (parts.length > 0 ? '.' : ''),
        time: time,
        creator: admission.creator,
        rawTime: new Date(time).getTime()
    };
};
const formatGeneralInformationNotes = (obs: any[]): ComponentNote[] => {
    const paragraphs: ComponentNote[] = [];
    let currentParagraph: string[] = [];
    let currentTime = "";
    let currentCreator = "";

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const valueText = ob.value;
        const creator = ob.created_by || "Unknown";

        if (name === "Additional Notes" && currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime(),
            });
            currentParagraph = [];
        }

        if (name === "Additional Notes") {
            currentTime = ob.obs_datetime || new Date().toISOString();
            currentCreator = creator;
            currentParagraph.push(`${valueText}.`);
        }
    });

    if (currentParagraph.length > 0) {
        paragraphs.push({
            paragraph: currentParagraph.join(" "),
            time: currentTime,
            creator: currentCreator,
            rawTime: new Date(currentTime).getTime(),
        });
    }

    return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
};
const formatHeadAndNeckNotes = (obs: any[]): ComponentNote[] => {
    const assessments: ComponentNote[] = [];
    let currentAssessment: {
        parts: string[];
        abnormalities: Map<
            string,
            {
                type: string;
                details: Record<string, string>;
            }[]
        >;
        time: string;
        creator: string;
    } = {
        parts: [],
        abnormalities: new Map(),
        time: "",
        creator: "Unknown"
    };

    let currentImageName = "";
    let currentAbnormalityType = "";

    const isBasicImageName = (name: string) => {
        const basicNames = ["Front", "Back", "Left", "Right"];
        return basicNames.includes(name);
    };

    const getLastAbnormality = (assessment: any, imageName: string) => {
        if (!assessment.abnormalities.has(imageName)) return null;
        const abnormalities = assessment.abnormalities.get(imageName);
        return abnormalities[abnormalities.length - 1];
    };

    // Helper function to process observations recursively
    const processObservation = (ob: any) => {
        // Get properties from either direct fields or children structure
        const name = ob.conceptName || ob.name || (ob.names && ob.names[0]?.name);
        const valueText = ob.value || ob.value_text;
        const creator = ob.creator || ob.created_by || "Unknown";
        const time = ob.obs_datetime || ob.obsDateTime || new Date().toISOString();
        const children = ob.children || ob.groupMembers || [];
        console.log("Wisdom",name, valueText, children)

        if (!name) return;

        if (name === "Image Part Name") {
            if (valueText === "Front") {
                if (currentAssessment.parts.length > 0 || currentAssessment.abnormalities.size > 0) {
                    assessments.push(formatHeadAndNeckAssessmentToParagraph(currentAssessment));
                }

                // Start new assessment
                currentAssessment = {
                    parts: [],
                    abnormalities: new Map(),
                    time: time,
                    creator: creator
                };
            }

            if (!isBasicImageName(valueText)) {
                currentImageName = valueText;
                if (!currentAssessment.parts.includes(valueText)) {
                    currentAssessment.parts.push(valueText);
                }
            }
        }
        else if (name === "Abnormalities") {
            currentAbnormalityType = valueText;
            if (currentImageName) {
                if (!currentAssessment.abnormalities.has(currentImageName)) {
                    currentAssessment.abnormalities.set(currentImageName, []);
                }
                currentAssessment.abnormalities.get(currentImageName)?.push({
                    type: valueText,
                    details: {}
                });
            }
        }
        else if (name === "Laceration length" && currentAbnormalityType === "Laceration") {
            const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
            if (lastAbnormality) lastAbnormality.details.length = valueText;
        }
        else if (name === "Laceration depth" && currentAbnormalityType === "Laceration") {
            const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
            if (lastAbnormality) lastAbnormality.details.depth = valueText;
        }
        else if (name === "Laceration other" && currentAbnormalityType === "Laceration") {
            const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
            if (lastAbnormality) lastAbnormality.details.other = valueText;
        }
        else if (name === "Description" && currentAbnormalityType === "Bruise") {
            const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
            if (lastAbnormality) lastAbnormality.details.description = valueText;
        }
        else if (name === "Specify" && currentAbnormalityType === "Other") {
            const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
            if (lastAbnormality) lastAbnormality.details.specify = valueText;
        }
        else if (name === "Clinician notes" || name === "Notes") {
            if (!currentAssessment.abnormalities.has("General")) {
                currentAssessment.abnormalities.set("General", []);
            }
            currentAssessment.abnormalities.get("General")?.push({
                type: "Note",
                details: { note: valueText }
            });
        }

        children.forEach((child: any) => processObservation(child));
    };

    obs.forEach(processObservation);

    // Add the last assessment
    if (currentAssessment.parts.length > 0 || currentAssessment.abnormalities.size > 0) {
        assessments.push(formatHeadAndNeckAssessmentToParagraph(currentAssessment));
    }

    return assessments.sort((a, b) => b.rawTime - a.rawTime);
};

const formatHeadAndNeckAssessmentToParagraph = (assessment: any): ComponentNote => {
    let paragraphParts: string[] = [];

    if (assessment.parts.length > 0) {
        paragraphParts.push(`Assessment of ${assessment.parts.join(", ")} was performed.`);
    }

    assessment.abnormalities.forEach((abnormalities: any, part: any) => {
        if (part === "General") {
            abnormalities.forEach((abnormality: any) => {
                paragraphParts.push(`Head and neck assessment status: ${abnormality.details.note}.`);
            });
        } else {
            abnormalities.forEach((abnormality: any) => {
                let description = `${part} showed ${abnormality.type}`;

                switch (abnormality.type) {
                    case "Laceration":
                        if (abnormality.details.length) description += ` (Length: ${abnormality.details.length}`;
                        if (abnormality.details.depth) description += `, Depth: ${abnormality.details.depth}`;
                        if (abnormality.details.other) description += `, Description: ${abnormality.details.other}`;
                        if (abnormality.details.length) description += ")";
                        break;
                    case "Bruise":
                        if (abnormality.details.description) description += ` (${abnormality.details.description})`;
                        break;
                    case "Other":
                        if (abnormality.details.specify) description += ` (${abnormality.details.specify})`;
                        break;
                }

                paragraphParts.push(description + ".");
            });
        }
    });

    return {
        paragraph: paragraphParts.join(" "),
        time: assessment.time,
        creator: assessment.creator,
        rawTime: new Date(assessment.time).getTime(),
    };
};
const formatChestAssessmentNotes = (obs: any[]): ComponentNote[] => {
    const paragraphs: ComponentNote[] = [];
    let currentParagraph: string[] = [];
    let currentTime = "";
    let currentCreator = "";
    let abnormalZones = new Set<string>();

    const formatList = (items: string[]) => {
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} and ${items[1]}`;
        return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
    };

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const valueText = ob.value;
        const creator = ob.created_by || "Unknown";
        const time = ob.obs_datetime || new Date().toISOString();

        if (name === "Respiratory rate") {
            if (currentParagraph.length > 0) {
                if (abnormalZones.size > 0) {
                    currentParagraph.push(`Abnormal findings in ${formatList(Array.from(abnormalZones))}.`);
                    abnormalZones = new Set();
                }
                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                    creator: currentCreator,
                    rawTime: new Date(currentTime).getTime(),
                });
                currentParagraph = [];
            }
            currentTime = time;
            currentCreator = creator;
            currentParagraph.push(`Respiratory rate: ${valueText} bpm.`);
        }
        else if (name === "Chest wall abnormality") {
            currentParagraph.push(valueText === "Yes"
                ? "Chest wall abnormality present."
                : "No chest wall abnormality.");
        }
        else if (name === "Apex beat") {
            if (valueText === "Displaced") {
                const positioning = obs.find(o => o.names?.[0]?.name === "Positioning")?.value;
                currentParagraph.push("Apex beat displaced" + (positioning ? ` (${positioning}).` : "."));
            } else {
                currentParagraph.push("Apex beat normal.");
            }
        }
        else if (name === "Trill") {
            currentParagraph.push(valueText === "Yes"
                ? "Trill detected."
                : "No trill detected.");
        }
        else if (name === "Heaves") {
            currentParagraph.push(valueText === "Yes"
                ? "Heaves present."
                : "No heaves present.");
        }
        else if (name === "Chest Expansion") {
            currentParagraph.push(`Chest expansion is ${valueText.toLowerCase()}.`);
        }
        else if (name === "Tactile fremitus") {
            currentParagraph.push(`Tactile fremitus is ${valueText.toLowerCase()}.`);
        }
        else if (name === "Image Part Name") {
            const validZones = [
                "Right Upper Zone", "Left Upper Zone",
                "Right Middle Zone", "Left Middle Zone",
                "Right Lower Zone", "Left Lower Zone"
            ];

            if (validZones.includes(valueText)) {
                const notes = obs.find(o =>
                    o.names?.[0]?.name === "Clinician notes" &&
                    o.group_id === ob.group_id
                )?.value;

                if (notes) {
                    currentParagraph.push(`${valueText}: ${notes}.`);
                } else {
                    abnormalZones.add(valueText);
                }
            }
        }
    });

    if (abnormalZones.size > 0) {
        currentParagraph.push(`Abnormal findings in ${formatList(Array.from(abnormalZones))}.`);
    }

    if (currentParagraph.length > 0) {
        paragraphs.push({
            paragraph: currentParagraph.join(" "),
            time: currentTime,
            creator: currentCreator,
            rawTime: new Date(currentTime).getTime(),
        });
    }

    return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
};
const formatAbdomenPelvisNotes = (obs: any[]): ComponentNote[] => {
    const encounterGroups: {time: string; observations: any[]; creator: string}[] = [];
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    let currentGroup: {time: string; observations: any[]; creator: string} | null = null;

    sortedObs.forEach(ob => {
        const obTime = ob.obs_datetime || new Date().toISOString();
        const obTimestamp = new Date(obTime).getTime();
        const obCreator = ob.created_by || "Unknown";

        if (!currentGroup ||
            obTimestamp - new Date(currentGroup.time).getTime() > 5 * 60 * 1000) {
            currentGroup = {
                time: obTime,
                observations: [],
                creator: obCreator
            };
            encounterGroups.push(currentGroup);
        }

        currentGroup.observations.push(ob);
    });

    return encounterGroups
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .map(group => {
            const assessment: {
                findings: Record<string, string>,
                additionalNotes: string[],
                status: string
            } = {
                findings: {},
                additionalNotes: [],
                status: 'normal'
            };

            group.observations.forEach(ob => {
                const name = ob.names?.[0]?.name;
                const valueText = ob.value;

                switch (name) {
                    case "Abdominal distention":
                        assessment.findings[name] = valueText === "Yes"
                            ? "The patient has abdominal distention."
                            : "The patient has no abdominal distention.";
                        break;

                    case "Abnormalities present":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Abnormality present."
                            : "Abnormality not present.";
                        break;

                    case "Shifting dullness":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Shifting dullness present."
                            : "Shifting dullness not present.";
                        break;

                    case "Fluid thrill":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Fluid Thrill available."
                            : "Fluid Thrill not available.";
                        break;

                    case "Tenderness":
                        assessment.findings[name] = valueText === "No"
                            ? "Tenderness not present."
                            : "Tenderness present.";
                        break;

                    case "Bruit":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Bruit present."
                            : "Bruit not present.";
                        break;

                    case "Bowel sounds":
                        assessment.findings[name] = `Bowel sounds: ${valueText}.`;
                        break;

                    case "General":
                    case "Prostate":
                    case "Sphincter tone":
                        assessment.findings[name] = `${name}: ${valueText}.`;
                        break;

                    case "Mass":
                        assessment.findings[name] = valueText === "No"
                            ? "Mass not present."
                            : "Mass present.";
                        break;

                    case "Circumcision status":
                        assessment.findings[name] = valueText === "No"
                            ? "Patient is not circumcised."
                            : "Patient is circumcised.";
                        break;

                    case "Laceration":
                        assessment.findings[name] = valueText === "No"
                            ? "Ulcerations/lacerations, bite marks not present."
                            : "Ulcerations/lacerations, bite marks present.";
                        break;

                    case "Hematomas":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of oedema, Hematomas, discolourations not present."
                            : "Signs of oedema, Hematomas, discolourations present.";
                        break;

                    case "Inflammation":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of inflammation, edema, lesions around periurethral tissue, bleeding not present."
                            : "Signs of inflammation, edema, lesions around periurethral tissue, bleeding present.";
                        break;

                    case "Testicles":
                        assessment.findings[name] = valueText === "No"
                            ? "Both Testicles not present."
                            : "Both Testicles present.";
                        break;

                    case "Additional Notes":
                        if (valueText.trim()) {
                            assessment.additionalNotes.push(valueText);
                        }
                        break;
                }
            });

            const orderedFindings = [
                "Abdominal distention",
                "Abnormalities present",
                "Shifting dullness",
                "Fluid thrill",
                "Tenderness",
                "Bruit",
                "Bowel sounds",
                "General",
                "Prostate",
                "Mass",
                "Sphincter tone",
                "Circumcision status",
                "Laceration",
                "Hematomas",
                "Inflammation",
                "Testicles"
            ];

            const paragraphParts = orderedFindings
                .filter(finding => assessment.findings[finding])
                .map(finding => assessment.findings[finding]);

            if (assessment.additionalNotes.length > 0) {
                const cleanNotes = assessment.additionalNotes
                    .filter(note => note.trim().length > 0);
                if (cleanNotes.length > 0) {
                    paragraphParts.push(`Additional notes: ${cleanNotes.join('; ')}`);
                }
            }

            return {
                paragraph: paragraphParts.join(' '),
                time: group.time,
                creator: group.creator,
                rawTime: new Date(group.time).getTime()
            };
        });
};
const formatExtremitiesNotes = (obs: any[]): ComponentNote[] => {
    const encounterGroups: {time: string; observations: any[]; creator: string}[] = [];
    const defaultCreator = obs[0]?.created_by || "Unknown";

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    let currentGroup: {time: string; observations: any[]; creator: string} | null = null;

    sortedObs.forEach(ob => {
        const obTime = ob.obs_datetime || new Date().toISOString();
        const obTimestamp = new Date(obTime).getTime();
        const obCreator = ob.created_by || defaultCreator;

        if (!currentGroup ||
            obTimestamp - new Date(currentGroup.time).getTime() > 5 * 60 * 1000) {
            currentGroup = {
                time: obTime,
                observations: [],
                creator: obCreator
            };
            encounterGroups.push(currentGroup);
        }

        currentGroup.observations.push(ob);
        if (ob.created_by) {
            currentGroup.creator = ob.created_by;
        }
    });

    const extremityAbnormalities = [
        "Deformity", "Fracture", "Burns", "Mass",
        "Tenderness", "Crepitus", "Laceration",
        "Scars", "Skin rash", "Wound", "Swelling"
    ];

    return encounterGroups.map(group => {
        const assessment: {
            findings: Record<string, string>,
            additionalNotes: string[],
            upperLimbImagesWithAbnormalities: Record<string, string[]>,
            lowerLimbImagesWithAbnormalities: Record<string, string[]>,
            upperLimbAbnormalities: string[],
            lowerLimbAbnormalities: string[],
            upperLimbStatus: string,
            lowerLimbStatus: string
        } = {
            findings: {},
            additionalNotes: [],
            upperLimbImagesWithAbnormalities: {},
            lowerLimbImagesWithAbnormalities: {},
            upperLimbAbnormalities: [],
            lowerLimbAbnormalities: [],
            upperLimbStatus: 'normal',
            lowerLimbStatus: 'normal'
        };

        // First pass to handle abnormalities and image parts
        group.observations.forEach(ob => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            if (name === "Abnormalities upper limb") {
                assessment.upperLimbStatus = valueText === "Yes" ? "abnormal" : "normal";
            } else if (name === "Abnormalities lower limb") {
                assessment.lowerLimbStatus = valueText === "Yes" ? "abnormal" : "normal";
            } else if (name === "Image Part Name") {
                const isUpperLimb = valueText.includes("upper limb");
                const isLowerLimb = valueText.includes("lower limb");

                if (isUpperLimb || isLowerLimb) {
                    const imageName = valueText.replace(/(upper|lower) limb -? /, "");
                    const abnormalities: string[] = [];

                    // Check for abnormalities in children
                    if (ob.children && ob.children.length > 0) {
                        ob.children.forEach((child: any) => {
                            if (child.children && child.children.length > 0) {
                                child.children.forEach((grandChild: any) => {
                                    const abnormalityName = grandChild.names?.[0]?.name;
                                    if (extremityAbnormalities.includes(abnormalityName) && grandChild.value === "Yes") {
                                        abnormalities.push(abnormalityName);
                                    }
                                });
                            }
                        });
                    }

                    if (abnormalities.length > 0) {
                        if (isUpperLimb) {
                            assessment.upperLimbImagesWithAbnormalities[imageName] = abnormalities;
                            assessment.upperLimbAbnormalities.push(...abnormalities);
                        } else {
                            assessment.lowerLimbImagesWithAbnormalities[imageName] = abnormalities;
                            assessment.lowerLimbAbnormalities.push(...abnormalities);
                        }
                    }
                }
            }
        });

        // Second pass to handle other observations
        group.observations.forEach(ob => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            switch (name) {
                case "Edema":
                    assessment.findings[name] = valueText === "Yes"
                        ? "The patient has Edema. "
                        : "The patient has no Edema. ";
                    break;

                case "Oedema details":
                    assessment.findings[name] = `Edema details: ${valueText}. `;
                    break;

                case "Cold clammy":
                    assessment.findings[name] = valueText === "Yes"
                        ? "Cold clammy extremities present. "
                        : "Cold clammy extremities not present. ";
                    break;

                case "Additional Notes":
                    if (valueText.trim()) {
                        assessment.additionalNotes.push(valueText);
                    }
                    break;
            }
        });

        const paragraphParts: string[] = [];

        if (assessment.findings["Edema"]) {
            paragraphParts.push(assessment.findings["Edema"]);
        }
        if (assessment.findings["Oedema details"]) {
            paragraphParts.push(assessment.findings["Oedema details"]);
        }
        if (assessment.findings["Cold clammy"]) {
            paragraphParts.push(assessment.findings["Cold clammy"]);
        }

        // Upper limb description
        let upperLimbText = "Upper limbs: ";
        if (assessment.upperLimbStatus === "normal") {
            upperLimbText += "No abnormalities detected";
        } else {
            const parts = [];

            // Add abnormalities per image
            Object.entries(assessment.upperLimbImagesWithAbnormalities).forEach(([image, abnormalities]) => {
                parts.push(`Body part of ${image} shows ${abnormalities.join(", ")}`);
            });

            // Add any general abnormalities not tied to specific images
            if (assessment.upperLimbAbnormalities.length > 0) {
                const generalAbnormalities = assessment.upperLimbAbnormalities.filter(
                    ab => !Object.values(assessment.upperLimbImagesWithAbnormalities).flat().includes(ab)
                );
                if (generalAbnormalities.length > 0) {
                    parts.push(`${generalAbnormalities.join(", ")} present`);
                }
            }

            upperLimbText += parts.join("; ");
        }
        paragraphParts.push(upperLimbText + ".");

        // Lower limb description
        let lowerLimbText = "Lower limbs: ";
        if (assessment.lowerLimbStatus === "normal") {
            lowerLimbText += "No abnormalities detected";
        } else {
            const parts = [];

            // Add abnormalities per image
            Object.entries(assessment.lowerLimbImagesWithAbnormalities).forEach(([image, abnormalities]) => {
                parts.push(`Body part of ${image} shows ${abnormalities.join(", ")}`);
            });

            // Add any general abnormalities not tied to specific images
            if (assessment.lowerLimbAbnormalities.length > 0) {
                const generalAbnormalities = assessment.lowerLimbAbnormalities.filter(
                    ab => !Object.values(assessment.lowerLimbImagesWithAbnormalities).flat().includes(ab)
                );
                if (generalAbnormalities.length > 0) {
                    parts.push(`${generalAbnormalities.join(", ")} present`);
                }
            }

            lowerLimbText += parts.join("; ");
        }
        paragraphParts.push(lowerLimbText + ".");

        if (assessment.additionalNotes.length > 0) {
            paragraphParts.push(`Additional notes: ${assessment.additionalNotes.join('; ')}`);
        }

        return {
            paragraph: paragraphParts.join(' '),
            time: group.time,
            creator: group.creator,
            rawTime: new Date(group.time).getTime()
        };
    }).sort((a, b) => b.rawTime - a.rawTime);
};const formatNeurologicalExaminationNotes = (obs: any[]): ComponentNote[] => {
    const paragraphs: ComponentNote[] = [];
    let currentParagraph: string[] = [];
    let currentTime = "";
    let currentCreator = "Unknown";

    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const valueText = ob.value;
        const creator = ob.created_by || currentCreator;
        const time = ob.obs_datetime || new Date().toISOString();

        if (name === "Additional Notes" && currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime()
            });
            currentParagraph = [];
        }

        if (name === "Additional Notes") {
            currentTime = time;
            currentCreator = creator;
            currentParagraph.push(`${valueText}.`);
        }
    });

    if (currentParagraph.length > 0) {
        paragraphs.push({
            paragraph: currentParagraph.join(" "),
            time: currentTime,
            creator: currentCreator,
            rawTime: new Date(currentTime).getTime()
        });
    }

    return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
};
const formatSoapierNotes = (obs: any[]): ComponentNote[] => {
    const soapNotes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        sections: Record<string, string>;
        vitals: Record<string, string>;
        labs: Record<string, string>;
    } = {
        time: "",
        creator: "Unknown",
        sections: {},
        vitals: {},
        labs: {}
    };

    // Sort observations by time
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (name === "Subjective" && currentNote.sections.Subjective) {
            // Push the current note if we're starting a new subjective section
            soapNotes.push(createSoapierNote(currentNote));
            currentNote = {
                time,
                creator,
                sections: {},
                vitals: {},
                labs: {}
            };
        }

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        if ([
            "Subjective", "Medical record observations", "Assessment", "Plan",
            "Intervention", "Evaluation", "Replan", "Implementation"
        ].includes(name)) {
            currentNote.sections[name] = value;
        }
        // Handle vital signs
        else if ([
            "Systolic blood pressure", "Diastolic blood pressure",
            "Pulse Rate", "Respiratory Rate", "Spo2", "Temperature"
        ].includes(name)) {
            currentNote.vitals[name] = value;
        }
        // Handle lab results
        else if ([
            "Malaria Rapid Diagnostic Test (MRDT)",
            "Blood glucose", "Serum glucose", "Investigations PT",
            "Urine Dipstick Ketones"
        ].includes(name)) {
            const labName = name === "Serum glucose" ? "Blood glucose" : name;
            currentNote.labs[labName] = value;
        }
    });

    if (Object.keys(currentNote.sections).length > 0 ||
        Object.keys(currentNote.vitals).length > 0 ||
        Object.keys(currentNote.labs).length > 0) {
        soapNotes.push(createSoapierNote(currentNote));
    }

    return soapNotes.sort((a, b) => b.rawTime - a.rawTime);
};

const createSoapierNote = (note: {
    time: string;
    creator: string;
    sections: Record<string, string>;
    vitals: Record<string, string>;
    labs: Record<string, string>;
}): ComponentNote => {
    const paragraphParts: string[] = [];

    const sectionDisplayNames: Record<string, string> = {
        "Subjective": "Subjective",
        "Medical record observations": "Objective",
        "Assessment": "Assessment",
        "Plan": "Plan",
        "Intervention": "Intervention",
        "Evaluation": "Evaluation",
        "Replan": "Replan",
        "Implementation": "Implementation"
    };

    const orderedSections = [
        "Subjective", "Medical record observations", "Assessment", "Plan",
        "Intervention", "Evaluation", "Replan", "Implementation"
    ];

    orderedSections.forEach(section => {
        if (note.sections[section]) {
            const displayName = sectionDisplayNames[section] || section;
            paragraphParts.push(`${displayName}: ${note.sections[section]}`);

            // Insert vitals and labs after "Medical record observations" (which displays as "Objective")
            if (section === "Medical record observations") {
                if (Object.keys(note.vitals).length > 0) {
                    const vitalParts: string[] = [];
                    if (note.vitals["Systolic blood pressure"] && note.vitals["Diastolic blood pressure"]) {
                        vitalParts.push(`BP: ${note.vitals["Systolic blood pressure"]}/${note.vitals["Diastolic blood pressure"]} mmHg`);
                    }
                    if (note.vitals["Pulse Rate"]) {
                        vitalParts.push(`Pulse: ${note.vitals["Pulse Rate"]} bpm`);
                    }
                    if (note.vitals["Respiratory Rate"]) {
                        vitalParts.push(`Respiratory Rate: ${note.vitals["Respiratory Rate"]} breaths/min`);
                    }
                    if (note.vitals["Spo2"]) {
                        vitalParts.push(`SpO2: ${note.vitals["Spo2"]}%`);
                    }
                    if (note.vitals["Temperature"]) {
                        vitalParts.push(`Temp: ${note.vitals["Temperature"]}°C`);
                    }

                    if (vitalParts.length > 0) {
                        paragraphParts.push(`Vitals: ${vitalParts.join(", ")}`);
                    }
                }

                // Add labs if available
                if (Object.keys(note.labs).length > 0) {
                    const labParts: string[] = [];
                    if (note.labs["Malaria Rapid Diagnostic Test (MRDT)"]) {
                        labParts.push(`Malaria Test: ${note.labs["Malaria Rapid Diagnostic Test (MRDT)"]}`);
                    }
                    if (note.labs["Blood glucose"]) {
                        labParts.push(`Blood Glucose: ${note.labs["Blood glucose"]} mg/dL`);
                    }
                    if (note.labs["Investigations PT"]) {
                        labParts.push(`PT: ${note.labs["Investigations PT"]}`);
                    }
                    if (note.labs["Urine Dipstick Ketones"]) {
                        labParts.push(`Urine Ketones: ${note.labs["Urine Dipstick Ketones"]}`);
                    }

                    if (labParts.length > 0) {
                        paragraphParts.push(`Labs: ${labParts.join(", ")}`);
                    }
                }
            }
        }
    });

    // If we have vitals or labs but no "Medical record observations" section,
    if (!note.sections["Medical record observations"] &&
        (Object.keys(note.vitals).length > 0 || Object.keys(note.labs).length > 0)) {
        const objectiveParts: string[] = [];

        // Add vitals
        if (Object.keys(note.vitals).length > 0) {
            const vitalParts: string[] = [];
            if (note.vitals["Systolic blood pressure"] && note.vitals["Diastolic blood pressure"]) {
                vitalParts.push(`BP: ${note.vitals["Systolic blood pressure"]}/${note.vitals["Diastolic blood pressure"]} mmHg`);
            }
            if (note.vitals["Pulse Rate"]) {
                vitalParts.push(`Pulse: ${note.vitals["Pulse Rate"]} bpm`);
            }
            if (note.vitals["Respiratory Rate"]) {
                vitalParts.push(`Respiratory Rate: ${note.vitals["Respiratory Rate"]} breaths/min`);
            }
            if (note.vitals["Spo2"]) {
                vitalParts.push(`SpO2: ${note.vitals["Spo2"]}%`);
            }
            if (note.vitals["Temperature"]) {
                vitalParts.push(`Temp: ${note.vitals["Temperature"]}°C`);
            }

            if (vitalParts.length > 0) {
                objectiveParts.push(`Vitals: ${vitalParts.join(", ")}`);
            }
        }

        // Add labs
        if (Object.keys(note.labs).length > 0) {
            const labParts: string[] = [];
            if (note.labs["Malaria Rapid Diagnostic Test (MRDT)"]) {
                labParts.push(`Malaria Test: ${note.labs["Malaria Rapid Diagnostic Test (MRDT)"]}`);
            }
            if (note.labs["Blood glucose"]) {
                labParts.push(`Blood Glucose: ${note.labs["Blood glucose"]} mg/dL`);
            }
            if (note.labs["Investigations PT"]) {
                labParts.push(`PT: ${note.labs["Investigations PT"]}`);
            }
            if (note.labs["Urine Dipstick Ketones"]) {
                labParts.push(`Urine Ketones: ${note.labs["Urine Dipstick Ketones"]}`);
            }

            if (labParts.length > 0) {
                objectiveParts.push(`Labs: ${labParts.join(", ")}`);
            }
        }

        // Insert before Assessment if we have objective data
        if (objectiveParts.length > 0) {
            const assessmentIndex = paragraphParts.findIndex(p => p.startsWith("Assessment:"));
            if (assessmentIndex >= 0) {
                paragraphParts.splice(assessmentIndex, 0, "Objective:", ...objectiveParts);
            } else {
                paragraphParts.push("Objective:", ...objectiveParts);
            }
        }
    }

    return {
        paragraph: paragraphParts.join(". "),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};

const formatCirculationAssessmentNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        observations: Record<string, any>;
    } = {
        time: "",
        creator: "Unknown",
        observations: {}
    };
    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        currentNote.observations[name] = {
            value,
            creator,
            time
        };
    });

    if (Object.keys(currentNote.observations).length > 0) {
        notes.push(createCirculationAssessmentNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createCirculationAssessmentNote = (note: {
    time: string;
    creator: string;
    observations: Record<string, any>;
}): ComponentNote => {
    const messages: string[] = [];
    const obs = note.observations;

    if (obs[concepts.IS_PATIENT_ACTIVELY_BLEEDING]?.value == "Yes") {
        messages.push("The patient is actively bleeding.");
    } else {
        messages.push("The patient is not actively bleeding.");
    }

    if (obs[concepts.ACTION_DONE]?.value) {
        messages.push(`Action taken: ${obs[concepts.ACTION_DONE].value}.`);
    }

    // Pulse rate
    if (obs[concepts.PULSE_RATE]?.value == "Weak") {
        messages.push("The patient's pulse rate is weak.");
    } else if (obs[concepts.PULSE_RATE]?.value == "Strong,Regular") {
        messages.push("The patient's pulse rate is strong and regular.");
    } else if (obs[concepts.PULSE_RATE]?.value) {
        messages.push(`The patient's pulse rate is ${obs[concepts.PULSE_RATE].value}.`);
    }

    // Capillary refill
    if (obs[concepts.CAPILLARY_REFILL_TIME]?.value == "Less than 3 seconds") {
        messages.push("The patient's capillary refill time is less than 3 seconds.");
    } else if (obs[concepts.CAPILLARY_REFILL_TIME]?.value == "3 seconds") {
        messages.push("The patient's capillary refill time is 3 seconds.");
    } else if (obs[concepts.CAPILLARY_REFILL_TIME]?.value) {
        messages.push(`The patient's capillary refill time is ${obs[concepts.CAPILLARY_REFILL_TIME].value}.`);
    }

    // CPR details
    if (obs[concepts.CARDIAC_ARREST]?.value == "Yes") {
        messages.push("There is a witnessed cardiac arrest.");
    } else if (obs[concepts.CARDIAC_ARREST]?.value == "No") {
        messages.push("There is no witnessed cardiac arrest.");
    }

    if (obs[concepts.DATE_OF_CPR]?.value) {
        messages.push(`CPR date of call: ${obs[concepts.DATE_OF_CPR].value}.`);
    }

    if (obs[concepts.SITE]?.value == "Rescitation") {
        messages.push("The site is resuscitation.");
    } else if (obs[concepts.SITE]?.value == "SSW") {
        messages.push("The site is SSW.");
    } else if (obs[concepts.SITE]?.value == "Priority") {
        messages.push("The site is priority.");
    }

    if (obs[concepts.SPECIFY]?.value) {
        messages.push(`Witnessed cardiac arrest specification: ${obs[concepts.SPECIFY].value}.`);
    }

    if (obs[concepts.TIME]?.value) {
        messages.push(`Record time: ${obs[concepts.TIME].value}.`);
    }

    if (obs[concepts.RHYTHM]?.value) {
        messages.push(`Rhythm: ${obs[concepts.RHYTHM].value}.`);
    }

    if (obs[concepts.SHOCK_ENERGY]?.value) {
        messages.push(`Shock energy: ${obs[concepts.SHOCK_ENERGY].value}.`);
    }

    if (obs[concepts.MEDICATION]?.value) {
        messages.push(`Medication name: ${obs[concepts.MEDICATION].value}.`);
    }

    if (obs[concepts.DOSE_IN_MILLIGRAMS]?.value) {
        messages.push(`Dose: ${obs[concepts.DOSE_IN_MILLIGRAMS].value}.`);
    }

    if (obs[concepts.MEDICATION_ROUTE]?.value) {
        messages.push(`Medication route: ${obs[concepts.MEDICATION_ROUTE].value}.`);
    }

    if (obs[concepts.INTERVENTION]?.value) {
        messages.push(`Interventions: ${obs[concepts.INTERVENTION].value}.`);
    }

    if (obs[concepts.OCCURRENCES]?.value) {
        messages.push(`Occurrences: ${obs[concepts.OCCURRENCES].value}.`);
    }

    if (obs[concepts.REVERSIBLE_CAUSES]?.value) {
        messages.push(`Reversible causes: ${obs[concepts.REVERSIBLE_CAUSES].value}.`);
    }

    if (obs[concepts.SPO2]?.value) {
        messages.push(`SPO2: ${obs[concepts.SPO2].value}.`);
    }

    if (obs[concepts.OXYGEN_GIVEN]?.value == "Yes") {
        messages.push("Oxygen was administered.");
    } else if (obs[concepts.OXYGEN_GIVEN]?.value == "No") {
        messages.push("Oxygen was not administered.");
    }

    if (obs[concepts.SYSTOLIC_BLOOD_PRESSURE]?.value) {
        messages.push(`Systolic blood pressure: ${obs[concepts.SYSTOLIC_BLOOD_PRESSURE].value}.`);
    }

    if (obs[concepts.DIASTOLIC_BLOOD_PRESSURE]?.value) {
        messages.push(`Diastolic blood pressure: ${obs[concepts.DIASTOLIC_BLOOD_PRESSURE].value}.`);
    }

    if (obs[concepts.RESPIRATORY_RATE]?.value) {
        messages.push(`Respiratory rate: ${obs[concepts.RESPIRATORY_RATE].value}.`);
    }

    if (obs[concepts.TEMPERATURE]?.value) {
        messages.push(`Temperature: ${obs[concepts.TEMPERATURE].value}.`);
    }

    // Motor response
    if (obs[concepts.MOTOR_RESPONSE]?.value == "Obeying Commands") {
        messages.push("Motor response: obeying commands.");
    } else if (obs[concepts.MOTOR_RESPONSE]?.value == "Localising") {
        messages.push("Motor response: localising.");
    } else if (obs[concepts.MOTOR_RESPONSE]?.value == "Withdraw") {
        messages.push("Motor response: withdraw.");
    } else if (obs[concepts.MOTOR_RESPONSE]?.value == "Normal Flexion") {
        messages.push("Motor response: normal flexion.");
    } else if (obs[concepts.MOTOR_RESPONSE]?.value == "Extension") {
        messages.push("Motor response: extension.");
    } else if (obs[concepts.MOTOR_RESPONSE]?.value == "None") {
        messages.push("No motor response.");
    }

    // Verbal response
    if (obs[concepts.VERBAL_RESPONSE]?.value == "Oriented") {
        messages.push("Verbal response: oriented.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == "Confused") {
        messages.push("Verbal response: confused.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == "Inappropriate Words") {
        messages.push("Verbal response: inappropriate words.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == "Incomprehensible sounds") {
        messages.push("Verbal response: incomprehensible sounds.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == "None") {
        messages.push("No verbal response.");
    }

    // Eye opening response
    if (obs[concepts.EYE_OPENING_RESPONSE]?.value == "Spontaneous") {
        messages.push("Eye opening response: spontaneous.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == "To Speech") {
        messages.push("Eye opening response: to speech.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == "To Pain") {
        messages.push("Eye opening response: to pain.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == "No Response") {
        messages.push("No eye opening response.");
    }

    if (obs[concepts.CPR_TIME_STOPPED]?.value) {
        messages.push(`CPR time stopped: ${obs[concepts.CPR_TIME_STOPPED].value}.`);
    }

    if (obs[concepts.REASON_CPR_STOPPED]?.value) {
        messages.push(`Reason CPR stopped: ${obs[concepts.REASON_CPR_STOPPED].value}.`);
    }

    if (obs[concepts.DISPOSITION_AFTER_CPR]?.value) {
        messages.push(`Disposition after CPR: ${obs[concepts.DISPOSITION_AFTER_CPR].value}.`);
    }

    if (obs[concepts.TEAM_LEADER]?.value) {
        messages.push(`Team leader: ${obs[concepts.TEAM_LEADER].value}.`);
    }

    if (obs[concepts.TEAM_MEMBERS]?.value) {
        messages.push(`Team members: ${obs[concepts.TEAM_MEMBERS].value}.`);
    }

    // Mucous membranes
    if (obs[concepts.MUCOUS_MEMBRANES]?.value == "Normal") {
        messages.push("Mucous membranes are normal.");
    } else if (obs[concepts.MUCOUS_MEMBRANES]?.value) {
        messages.push(`Mucous membranes: ${obs[concepts.MUCOUS_MEMBRANES].value}.`);
    }

    if (obs[concepts.MUCOUS_ABNORMAL]?.value) {
        messages.push(`Mucous abnormality: ${obs[concepts.MUCOUS_ABNORMAL].value}.`);
    }

    // Peripheries
    if (obs[concepts.ASSESS_PERIPHERIES]?.value == "Cold and clammy") {
        messages.push("Peripheries are cold and clammy.");
    } else if (obs[concepts.ASSESS_PERIPHERIES]?.value) {
        messages.push(`Peripheries: ${obs[concepts.ASSESS_PERIPHERIES].value}.`);
    }

    // Blood pressure
    if (obs[concepts.BLOOD_PRESSURE_MEASURED]?.value == "Done") {
        messages.push("Blood pressure was measured.");
        if (obs[concepts.BLOOD_PRESSURE_SYSTOLIC]?.value && obs[concepts.BLOOD_PRESSURE_DIASTOLIC]?.value) {
            messages.push(`BP: ${obs[concepts.BLOOD_PRESSURE_SYSTOLIC].value}/${obs[concepts.BLOOD_PRESSURE_DIASTOLIC].value}.`);
        }
    } else if (obs[concepts.BLOOD_PRESSURE_MEASURED]?.value == "Not Done") {
        messages.push("Blood pressure was not measured.");
    } else if (obs[concepts.BP_NOT_RECORDABLE]?.value) {
        messages.push("Blood pressure is unrecordable.");
    }

    if (obs[concepts.NOT_DONE]?.value) {
        messages.push(`BP not done reason: ${obs[concepts.NOT_DONE].value}.`);
    }

    // Patient injury
    if (obs[concepts.PATIENT_INJURED]?.value == "Yes") {
        messages.push("The patient is injured.");
    } else {
        messages.push("The patient is not injured.");
    }

    // IV access
    if (obs[concepts.INTRAVENOUS]?.value == "Yes") {
        messages.push("The patient requires intravenous access.");
        if (obs[concepts.SIZE_OF_CATHETER]?.value) {
            messages.push(`IV catheter size: ${obs[concepts.SIZE_OF_CATHETER].value}.`);
        }
        if (obs[concepts.CANNULATION_SITE]?.value) {
            messages.push(`Cannulation site: ${obs[concepts.CANNULATION_SITE].value}.`);
        }
    } else {
        messages.push("The patient does not require intravenous access.");
    }

    if (obs[concepts.FEMORAL]?.value) {
        messages.push(`Femoral assessment: ${obs[concepts.FEMORAL].value}.`);
    }

    // Abdominal assessment
    if (obs[concepts.ABDOMINAL_DISTENSION]?.value == "Yes") {
        messages.push("There is abdominal distention.");
    } else {
        messages.push("There is no abdominal distention.");
    }

    // Other abnormalities
    if (obs[concepts.IS_THERE_OTHER_OBDONORMALITIES]?.value == "Yes") {
        messages.push("There are other abnormalities.");
    } else {
        messages.push("There are no other abnormalities.");
    }

    return {
        paragraph: messages.join(" "),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};

const formatDisabilityAssessmentNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        observations: Record<string, any>;
    } = {
        time: "",
        creator: "Unknown",
        observations: {}
    };

    // Group observations by encounter
    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        currentNote.observations[name] = {
            value,
            creator,
            time
        };
    });

    if (Object.keys(currentNote.observations).length > 0) {
        notes.push(createDisabilityAssessmentNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createDisabilityAssessmentNote = (note: {
    time: string;
    creator: string;
    observations: Record<string, any>;
}): ComponentNote => {
    const messages: string[] = [];
    const obs = note.observations;

    // Level of Consciousness
    if (obs[concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS]?.value === "No") {
        messages.push("The patient is alert and does not exhibit a low level of consciousness.");
    } else {
        messages.push("The patient exhibits a low level of consciousness and requires further evaluation and monitoring.");
    }
    // GCS
    if (obs[concepts.GCS]?.value === 15) {
        messages.push("The GCS is 15: patient is fully conscious with normal neurological function.");
    } else if (obs[concepts.GCS]?.value >= 13 && obs[concepts.GCS]?.value <= 14) {
        messages.push("GCS is 13–14: Mild brain injury. Close monitoring advised.");
    } else if (obs[concepts.GCS]?.value >= 9 && obs[concepts.GCS]?.value <= 12) {
        messages.push("GCS is 9–12: Moderate brain injury. Further assessment required.");
    } else if (obs[concepts.GCS]?.value >= 3 && obs[concepts.GCS]?.value <= 8) {
        messages.push("GCS is 3–8: Severe brain injury or coma. Immediate intervention required.");
    } else {
        messages.push("GCS score not available or invalid.");
    }
    // Eye Opening Response
    if (obs[concepts.EYE_OPENING_RESPONSE]?.value == 4) {
        messages.push("Eyes open spontaneously: patient is fully conscious.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == 3) {
        messages.push("Eyes open to speech: mild impairment in consciousness.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == 2) {
        messages.push("Eyes open to pain: more significant impairment in consciousness.");
    } else if (obs[concepts.EYE_OPENING_RESPONSE]?.value == 1) {
        messages.push("No eye opening response: patient may be in a deep coma.");
    } else {
        messages.push("Eye opening response not available or invalid.");
    }

    // Verbal Response
    if (obs[concepts.VERBAL_RESPONSE]?.value == 5) {
        messages.push("Verbal response is 5: patient is oriented and converses normally.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == 4) {
        messages.push("Verbal response is 4: patient is confused but able to speak.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == 3) {
        messages.push("Verbal response is 3: inappropriate words, not making sense.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == 2) {
        messages.push("Verbal response is 2: incomprehensible sounds, moaning or groaning.");
    } else if (obs[concepts.VERBAL_RESPONSE]?.value == 1) {
        messages.push("Verbal response is 1: no verbal response, patient is unresponsive.");
    } else {
        messages.push("Verbal response not available or invalid.");
    }

    // Pupil Size
    messages.push(`Pupil Size and Reaction to Light: ${obs[concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT]?.value || "Not available"}`);

    // Focal Neurology
    messages.push(`Focal Neurology: ${obs[concepts.FOCAL_NEUROLOGY]?.value || "Not available"}`);

    // Posture
    messages.push(`Posture: ${obs[concepts.POSTURE]?.value || "Not available"}`);

    return {
        paragraph: messages.join(" "),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};
const formatExposureAssessmentNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        observations: Record<string, any>;
    } = {
        time: "",
        creator: "Unknown",
        observations: {}
    };

    // Group observations by encounter
    obs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        currentNote.observations[name] = {
            value,
            creator,
            time
        };
    });

    if (Object.keys(currentNote.observations).length > 0) {
        notes.push(createExposureAssessmentNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createExposureAssessmentNote = (note: {
    time: string;
    creator: string;
    observations: Record<string, any>;
}): ComponentNote => {
    const messages: string[] = [];
    const obs = note.observations;

    // Temperature
    if (obs[concepts.TEMPERATURE]?.value) {
        messages.push(`Temperature (C): ${obs[concepts.TEMPERATURE].value}. `);
    } else {
        messages.push("Temperature (C) not recorded .");
    }

    // Additional Notes
    if (obs[concepts.ADDITIONAL_NOTES]?.value) {
        messages.push(`Additional Notes: ${obs[concepts.ADDITIONAL_NOTES].value}. `);
    }

    // Description
    if (obs[concepts.DESCRIPTION]?.value) {
        messages.push(`Description: ${obs[concepts.DESCRIPTION].value}. `);
    }

    // Cephalic Frontal Rash
    if (obs[concepts.RASH]?.value) {
        messages.push(`Rash on Cephalic: ${obs[concepts.RASH].value}. `);
    }

    // Cephalic Frontal Skin Abnormalities
    if (obs[concepts.ABNORMALITIES]?.value) {
        messages.push(`Skin abnormalities on Cephalic: ${obs[concepts.ABNORMALITIES].value}. `);
    }

    // Cephalic Frontal Injury
    if (obs[concepts.INJURY]?.value) {
        messages.push(`Injury on Cephalic: ${obs[concepts.INJURY].value}. `);
    } else {
        messages.push("Description of Injury: Not reported. ");
    }

    // Image Part Name
    if (obs[concepts.IMAGE_PART_NAME]?.value) {
        messages.push(`Image Part Name: ${obs[concepts.IMAGE_PART_NAME].value}. `);
    }
    // Skin Rash
    if (obs[concepts.SKIN_RASH]?.value) {
        messages.push(`Skin Rash: ${obs[concepts.SKIN_RASH].value}. `);
    }
    // Abnormalities
    if (obs[concepts.ABNORMALITIES]?.value) {
        messages.push(`Abnormalities: ${obs[concepts.ABNORMALITIES].value}. `);
    }
    // Injury
    if (obs[concepts.INJURY]?.value) {
        messages.push(`Injury: ${obs[concepts.INJURY].value}. `);
    }

    return {
        paragraph: messages.join(" "),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};
