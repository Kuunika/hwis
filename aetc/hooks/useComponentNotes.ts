
import { useState, useEffect } from "react";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import {concepts, encounters} from "@/constants";
import {push} from "micromark-util-chunked";
import { useVisitDates } from "@/contexts/visitDatesContext";

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

    const { visitDate } = useVisitDates();

    useEffect(() => {
      if (!historyLoading && patientHistory && visitDate) {
        // First, strictly filter encounters by the exact visit date
        const encountersForVisitDate = patientHistory.filter(
          (encounter: any) => encounter.visit.date_started === visitDate
        );

        // Then find the encounter with the specific type from these date-filtered encounters
        const targetEncounter = encountersForVisitDate.find(
          (enc: any) => enc?.encounter_type?.uuid === encounterType
        );

        if (targetEncounter) {
          const formattedNotes = formatComponentNotes(
            targetEncounter.obs,
            encounterType
          );
          setNotes(formattedNotes);
        } else {
          // Clear notes if no matching encounter was found
          setNotes([]);
        }
      }
    }, [patientHistory, visitDate, historyLoading, encounterType]);

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
            case encounters.SURGICAL_HISTORY:
                return formatSurgicalHistoryNotes(obs)
            case encounters.PATIENT_ADMISSIONS:
                return formatAdmissionNotes(obs);
            // case encounters.REVIEW_OF_SYSTEMS:
            //     return formatReviewOfSystemsNotes(obs);
            case encounters.OBSTETRIC_HISTORY:
                return formatGynecologyNotes(obs)
            case encounters.SUMMARY_ASSESSMENT:
                return formatLastMealNotes(obs)
            case encounters.FAMILY_MEDICAL_HISTORY:
                return formatFamilyHistoryNotes(obs)
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
            case encounters.DISPOSITION:
                return formatDispositionNotes(obs);
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

        const sortedObs = [...obs].sort((a, b) =>
            new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
        );

        sortedObs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const value = ob.value;
            const creator = ob.created_by || "Unknown";

            if (name === "Airway Patent") {
                if (currentParagraph.length > 0) {
                    if (airwayReasons.length > 0) {
                        currentParagraph.push(
                            airwayReasons.length === 1
                                ? `The airway obstruction is attributed to ${airwayReasons[0]}.`
                                : `The airway obstruction is attributed to: ${airwayReasons.join(", ")}.`
                        );
                        airwayReasons = [];
                    }
                    if (airwayInterventions.length > 0) {
                        currentParagraph.push(
                            airwayInterventions.length === 1
                                ? `Intervention performed: ${airwayInterventions[0]}.`
                                : `Interventions performed: ${airwayInterventions.join(", ")}.`
                        );
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

                currentTime = ob.obs_datetime || new Date().toISOString();
                currentCreator = creator;

                if (value === "Yes") {
                    currentParagraph.push("The airway is patent.");
                } else if (value === "No") {
                    currentParagraph.push("The airway is not patent.");
                } else {
                    currentParagraph.push("The patient's airway is threatened.");
                }
            }
            else if (name === "Airway Reason") {
                airwayReasons.push(value);
            }
            else if (name === "Airway Opening Intervention") {
                airwayInterventions.push(value);
            }
            else if (name === "Patient Injured") {
                if (value === "Yes") {
                    currentParagraph.push("The patient has sustained injuries.");
                } else if (value === "No") {
                    currentParagraph.push("The patient is not injured.");
                }
            }
            else if (name === "Neck collar applied") {
                if (value === "Yes") {
                    currentParagraph.push("The patient was stabilised by applying the Neck Collar.");
                } else if (value === "No") {
                    currentParagraph.push("The Neck Collar was not applied.");
                } else {
                    currentParagraph.push("Application of a Neck Collar was not indicated.");
                }
            }
            else if (name === "Head blocks applied") {
                if (value === "Yes") {
                    currentParagraph.push("Head blocks were applied to stabilize the C-Spine.");
                } else {
                    currentParagraph.push("Head blocks were not applied as an Intervention to stabilize the C-Spine.");
                }
            }

        });

        if (airwayReasons.length > 0) {
            currentParagraph.push(
                airwayReasons.length === 1
                    ? `The airway obstruction is attributed to ${airwayReasons[0]}.`
                    : `The airway obstruction is attributed to: ${airwayReasons.join(", ")}.`
            );
        }
        if (airwayInterventions.length > 0) {
            currentParagraph.push(
                airwayInterventions.length === 1
                    ? `Intervention performed: ${airwayInterventions[0]}.`
                    : `Interventions performed: ${airwayInterventions.join(", ")}.`
            );
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
const formatBreathingAssessmentNotes = (obs: any[]): ComponentNote[] => {
    const paragraphs: ComponentNote[] = [];
    let currentParagraph: string[] = [];
    let currentTime = "";
    let currentCreator = "";
    let additionalNotes = "";
    let oxygenDetails: string[] = [];
    let chestAbnormalities: string[] = [];
    let lungSites: Record<string, string[]> = {};

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const creator = ob.created_by || "Unknown";

        if (name === "Is Breathing Abnormal" && currentParagraph.length > 0) {
            if (oxygenDetails.length > 0) {
                currentParagraph.push(oxygenDetails.join(" "));
                oxygenDetails = [];
            }
            if (chestAbnormalities.length > 0) {
                currentParagraph.push(`Chest abnormalities: ${chestAbnormalities.join(", ")}.`);
                chestAbnormalities = [];
            }

            for (const [site, findings] of Object.entries(lungSites)) {
                if (findings.length > 0) {
                    currentParagraph.push(`${site}: ${findings.join(", ")}.`);
                }
            }
            lungSites = {};

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
        }

        if (name === "Is Breathing Abnormal") {
            currentTime = ob.obs_datetime || new Date().toISOString();
            currentCreator = creator;

            if (value === "Yes") {
                currentParagraph.push("Patient has abnormal breathing.");
            } else if (value === "No") {
                currentParagraph.push("Patient has normal breathing.");
            }
        }
        else if (name === "Patient Need Oxygen") {
            if (value === "Yes") {
                oxygenDetails.push("Supplemental oxygen required.");
            } else {
                oxygenDetails.push("Supplemental oxygen not required.");
            }
        }
        else if (name === "Oxygen Given") {
            oxygenDetails.push(`Oxygen given: ${value} L/min.`);
        }
        else if (name === "Oxygen Source") {
            oxygenDetails.push(`Source: ${value}.`);
        }
        else if (name === "Chest wall abnormality") {
            if (value === "Yes" && ob.children && ob.children.length > 0) {
                ob.children.forEach((child: any) => {
                    const childName = child.names?.[0]?.name;
                    const childValue = child.value;

                    if (childName === "Image Part Name") {
                        if (child.children && child.children.length > 0) {
                            child.children.forEach((grandChild: any) => {
                                const grandChildName = grandChild.names?.[0]?.name;
                                const grandChildValue = grandChild.value;

                                if (grandChildName === "Description") {
                                    chestAbnormalities.push(`${childValue} - ${grandChildValue}`);
                                } else if (grandChildName === "Additional Notes") {
                                    chestAbnormalities.push(`${childValue} notes: ${grandChildValue}`);
                                }
                            });
                        }
                    }
                });
            }
        }
        else if (name === "Site") {
            if (!lungSites[value]) {
                lungSites[value] = [];
            }
        }
        else if (name === "Respiratory rate") {
            currentParagraph.push(`Respiratory rate: ${value} bpm.`);
        }
        else if (name === "Oxygen Saturation") {
            currentParagraph.push(`Oxygen saturation: ${value}%.`);
        }
        else if (name === "Is Trachea Central") {
            if (value === "Yes") {
                currentParagraph.push("Trachea is central.");
            } else {
                currentParagraph.push("Trachea is not central.");
            }
        }
        else if (name === "Chest Expansion") {
            if (value === "Normal") {
                currentParagraph.push("Chest expansion is normal.");
            } else {
                currentParagraph.push("Chest expansion is abnormal.");
            }
        }
        else if (name === "Percussion") {
            if (value === "Normal") {
                currentParagraph.push("Percussion findings are normal.");
            } else {
                currentParagraph.push("Percussion findings are abnormal.");
            }
        }
        else if (name === "Breathing sounds") {
            if (value === "Normal") {
                currentParagraph.push("Breath sounds are normal.");
            } else {
                currentParagraph.push("Breath sounds are abnormal.");
            }
        }
        else if (name === "Additional Notes") {
            additionalNotes = `Additional notes: ${value}`;
        }
    });

    if (oxygenDetails.length > 0) {
        currentParagraph.push(oxygenDetails.join(" "));
    }
    if (chestAbnormalities.length > 0) {
        currentParagraph.push(`Chest abnormalities: ${chestAbnormalities.join(", ")}.`);
    }
    for (const [site, findings] of Object.entries(lungSites)) {
        if (findings.length > 0) {
            currentParagraph.push(`${site}: ${findings.join(", ")}.`);
        }
    }
    if (additionalNotes) {
        currentParagraph.push(additionalNotes);
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
const formatPresentingComplaintsNotes = (obs: any[]): ComponentNote[] => {
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    const groupedNotes: {
        time: string;
        creator: string;
        complaints: string[];
    }[] = [];

    let currentGroup: {
        time: string;
        creator: string;
        complaints: string[];
    } | null = null;

    const durationTypes = [
        "Duration Of Symptoms Hours",
        "Duration Of Symptoms Days",
        "Duration Of Symptoms Weeks",
        "Duration Of Symptoms Months",
        "Duration Of Symptoms Years"
    ];

    sortedObs.forEach((item: any) => {
        if (item.names?.[0]?.name === "Current complaints or symptoms" && item.value) {
            const itemTime = item.obs_datetime || new Date().toISOString();
            const itemCreator = item.created_by || "Unknown";
            let complaintText = item.value;
            let durationText = "";

            for (const durationType of durationTypes) {
                const durationChild = item.children?.find(
                    (child: any) => child.names?.[0]?.name === durationType && child.value
                );

                if (durationChild) {
                    const unit = durationType.toLowerCase().split(' ')[3];
                    durationText = `${durationChild.value} ${unit}`;
                    break;
                }
            }

            if (durationText) {
                complaintText += ` (${durationText})`;
            }

            if (!currentGroup ||
                new Date(itemTime).getTime() - new Date(currentGroup.time).getTime() > 3 * 60 * 1000) {
                currentGroup = {
                    time: itemTime,
                    creator: itemCreator,
                    complaints: []
                };
                groupedNotes.push(currentGroup);
            }

            currentGroup.complaints.push(complaintText);

            currentGroup.time = itemTime;
            currentGroup.creator = itemCreator;
        }
    });

    return groupedNotes.map(group => ({
        paragraph: `Presenting complaints: ${group.complaints.join(', ')}.`,
        time: group.time,
        creator: group.creator,
        rawTime: new Date(group.time).getTime()
    }));
};
const formatAllergiesNotes = (obs: any[]): ComponentNote[] => {
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    const groupedNotes: {
        time: string;
        creator: string;
        allergyGroups: {
            [category: string]: {
                allergens: string[];
                description?: string;
            }
        }
    }[] = [];

    let currentGroup: {
        time: string;
        creator: string;
        allergyGroups: {
            [category: string]: {
                allergens: string[];
                description?: string;
            }
        }
    } | null = null;

    sortedObs.forEach(item => {
        if (item.names?.[0]?.name === "Allergen Category" && item.value) {
            const itemTime = item.obs_datetime || new Date().toISOString();
            const itemCreator = item.created_by || "Unknown";
            const category = item.value;

            const allergens: string[] = [];
            let description: string | undefined;

            item.children?.forEach((child: any) => {
                if (child.names?.[0]?.name === "Allergen" && child.value) {
                    allergens.push(child.value);
                } else if (child.names?.[0]?.name === "Description" && child.value) {
                    description = child.value;
                }
            });

            if (allergens.length > 0) {
                if (!currentGroup ||
                    new Date(itemTime).getTime() - new Date(currentGroup.time).getTime() > 3 * 60 * 1000) {
                    currentGroup = {
                        time: itemTime,
                        creator: itemCreator,
                        allergyGroups: {}
                    };
                    groupedNotes.push(currentGroup);
                }

                if (!currentGroup.allergyGroups[category]) {
                    currentGroup.allergyGroups[category] = {
                        allergens: [],
                        description
                    };
                }

                currentGroup.allergyGroups[category].allergens.push(...allergens);

                if (description) {
                    currentGroup.allergyGroups[category].description = description;
                }

                currentGroup.time = itemTime;
                currentGroup.creator = itemCreator;
            }
        }
    });

    const notes: ComponentNote[] = [];
    groupedNotes.forEach(group => {
        const categoryNotes: string[] = [];

        Object.entries(group.allergyGroups).forEach(([category, details]) => {
            let noteText = `${category}: ${details.allergens.join(', ')}`;
            if (details.description) {
                noteText += ` (${details.description})`;
            }
            categoryNotes.push(noteText);
        });

        if (categoryNotes.length > 0) {
            notes.push({
                paragraph: `ALLERGIES: ${categoryNotes.join('; ')}.`,
                time: group.time,
                creator: group.creator,
                rawTime: new Date(group.time).getTime()
            });
        }
    });

    return notes;
};
const formatMedicationsNotes = (obs: any[]): ComponentNote[] => {
    const medicationNotes: ComponentNote[] = [];

    obs?.forEach((item: any) => {
        if (item.names?.[0]?.name !== "Drug Given") return;

        let drugGiven = item.value;
        let lastTaken = "";
        let lastPrescription = "";
        let frequency = "";
        let doseInGrams="";
        let doseInMilligrams="";
        let doseInMicrograms="";
        let doseInInternationalUnits="";
        let doseInMilliliters="";
        let durationInWeeks ="";
        let durationInMonths = "";
        let durationInYears="";
        let durationInDays = "";
        let durationInHours = "";
        let medicationFormulation ="";
        let selfMedication="";
        let creator = item.created_by || "Unknown";
        let encounterTime = item.obs_datetime || new Date().toISOString();

        if (item.children && item.children.length > 0) {
            item.children.forEach((member: any) => {
                const memberName = member.names?.[0]?.name;
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
                    case "Dose in grams":
                        doseInGrams = memberValue;
                        break;
                        case "Dose in milligrams":
                        doseInMilligrams = memberValue;
                        break;
                    case "Dose In Micrograms":
                        doseInMicrograms = memberValue;
                        break;
                    case "Dose In Millimeter":
                        doseInMilliliters = memberValue;
                        break;
                    case "Dose In Iu":
                        doseInInternationalUnits = memberValue;
                        break;
                    case "Duration On Medication Hours":
                        durationInHours = memberValue;
                        break;
                    case "Duration On Medication Days":
                        durationInDays = memberValue;
                        break;
                    case "Duration On Medication Weeks":
                        durationInWeeks=memberValue;
                        break;
                    case "Duration On Medication Months":
                        durationInMonths = memberValue;
                        break;
                    case "Duration On Medication Years":
                        durationInYears = memberValue;
                        break;
                    case "Medication Formulation":
                        medicationFormulation = memberValue;
                        break;
                    case "Self medicated":
                        selfMedication=memberValue;
                        break;

                }
            });
        }

        const parts = [];
        if (drugGiven) parts.push(`${drugGiven}`);
        if (frequency) parts.push(`Frequency: ${frequency}`);
        if (doseInGrams) parts.push(`Dose: ${doseInGrams} grams`);
        if (doseInMilligrams) parts.push(`Dose: ${doseInMilligrams} milligrams`);
        if (doseInMicrograms) parts.push(`Dose: ${doseInMicrograms} micrograms`);
        if (doseInMilliliters) parts.push(`Dose: ${doseInMilliliters} millimeters`);
        if (doseInInternationalUnits) parts.push(`Dose: ${doseInInternationalUnits} international units`);
        if (durationInHours) parts.push(`Duration: ${durationInHours} hours`);
        if (durationInDays) parts.push(`Duration: ${durationInDays} days`);
        if (durationInWeeks) parts.push(`Duration: ${durationInWeeks} weeks`);
        if (durationInMonths) parts.push(`Duration: ${durationInMonths} months`);
        if (durationInYears) parts.push(`Duration: ${durationInYears} years`);
        if(medicationFormulation) parts.push(`Medication formulation: ${medicationFormulation}`);
        if (lastTaken) parts.push(`Last taken: ${new Date(lastTaken).toLocaleDateString()}`);
        if (lastPrescription) parts.push(`Last prescribed: ${new Date(lastPrescription).toLocaleDateString()}`);
        if (selfMedication) {
            parts.push(selfMedication === "Yes"
                ? "The patient self-medicated."
                : "The patient did not self-medicate.");
        }
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
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    const groupedAssessments: {
        time: string;
        creator: string;
        conditions: {
            diagnosisDate?: string;
            icd11Diagnosis?: string;
            onTreatment?: string;
            additionalDetails?: string;
        }[];
    }[] = [];

    let currentGroup: {
        time: string;
        creator: string;
        conditions: any[];
    } | null = null;

    // Process all observations to group by 3-minute intervals
    sortedObs.forEach((parentOb: any) => {
        if (parentOb.names?.[0]?.name === "Diagnosis date") {
            const itemTime = parentOb.obs_datetime || new Date().toISOString();
            const itemCreator = parentOb.created_by || "Unknown";

            const assessment: any = {
                diagnosisDate: parentOb.value,
                creator: itemCreator
            };
            parentOb.children?.forEach((child: any) => {
                const name = child.names?.[0]?.name;
                const value = child.value;

                switch (name) {
                    case "ICD11 Diagnosis":
                        assessment.icd11Diagnosis = value;
                        break;
                    case "On treatment":
                        assessment.onTreatment = value === "Yes"
                            ? "The patient is on treatment"
                            : value === "No"
                                ? "The patient is not on treatment"
                                : "The treatment status is not known";
                        break;
                    case "Additional Diagnosis Details":
                        assessment.additionalDetails = value;
                        break;
                }
            });

            // Check if we need a new time group (3 minute interval)
            if (!currentGroup ||
                new Date(itemTime).getTime() - new Date(currentGroup.time).getTime() > 3 * 60 * 1000) {
                currentGroup = {
                    time: itemTime,
                    creator: itemCreator,
                    conditions: []
                };
                groupedAssessments.push(currentGroup);
            }

            if (assessment.icd11Diagnosis) {
                currentGroup.conditions.push(assessment);
                currentGroup.time = itemTime;
                currentGroup.creator = itemCreator;
            }
        }
    });

    // Convert grouped assessments to ComponentNote format
    return groupedAssessments.map(group => ({
        paragraph: group.conditions.map(condition =>
            createExistingConditionText(condition)).join(' '),
        time: group.time,
        creator: group.creator,
        rawTime: new Date(group.time).getTime()
    })).sort((a, b) => b.rawTime - a.rawTime); // Sort newest first
};

const createExistingConditionText = (assessment: {
    diagnosisDate?: string;
    icd11Diagnosis?: string;
    onTreatment?: string;
    additionalDetails?: string;
}): string => {
    const parts: string[] = [];

    if (assessment.icd11Diagnosis) {
        parts.push(`Diagnosis: ${assessment.icd11Diagnosis}`);
    }
    if (assessment.diagnosisDate) {
        const date = new Date(assessment.diagnosisDate);
        parts.push(`Diagnosed on ${date.toLocaleDateString()}`);
    }
    if (assessment.onTreatment) {
        parts.push(assessment.onTreatment);
    }

    if (assessment.additionalDetails) {
        parts.push(`Details: ${assessment.additionalDetails}.`);
    }

    return parts.join('. ');
};
const formatSurgicalHistoryNotes = (obs: any[]): ComponentNote[] => {
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    const groupedNotes: {
        time: string;
        creator: string;
        surgeries: {
            surgeryDate?: string;
            procedureName?: string;
            indication?: string;
            complications?: string;
        }[];
    }[] = [];

    let currentGroup: {
        time: string;
        creator: string;
        surgeries: any[];
    } | null = null;

    sortedObs.forEach((parentOb: any) => {
        if (parentOb.names?.[0]?.name === "Date of surgery") {
            const itemTime = parentOb.obs_datetime || new Date().toISOString();
            const itemCreator = parentOb.created_by || "Unknown";

            const surgery: any = {
                surgeryDate: parentOb.value,
                creator: itemCreator
            };
            parentOb.children?.forEach((child: any) => {
                const name = child.names?.[0]?.name;
                const value = child.value;

                if (name === "Indication For Surgery") {
                    surgery.indication = value;
                }
                else if (name === "Complications") {
                    surgery.complications = value;
                }
                else if (value === true || value === "true") {
                    surgery.procedureName = name;
                }
            });
            if (!currentGroup ||
                new Date(itemTime).getTime() - new Date(currentGroup.time).getTime() > 3 * 60 * 1000) {
                currentGroup = {
                    time: itemTime,
                    creator: itemCreator,
                    surgeries: []
                };
                groupedNotes.push(currentGroup);
            }

            // Add the surgery to current group if we have a procedure name
            if (surgery.procedureName) {
                currentGroup.surgeries.push(surgery);
                currentGroup.time = itemTime;
                currentGroup.creator = itemCreator;
            }
        }
    });

    // Convert grouped surgeries to ComponentNote format
    return groupedNotes.map(group => ({
        paragraph: group.surgeries.map(surgery =>
            createSurgicalNoteText(surgery)).join(' '),
        time: group.time,
        creator: group.creator,
        rawTime: new Date(group.time).getTime()
    })).sort((a, b) => b.rawTime - a.rawTime); // Sort newest first
};

const createSurgicalNoteText = (surgery: {
    surgeryDate?: string;
    procedureName?: string;
    indication?: string;
    complications?: string;
}): string => {
    const parts: string[] = [];

    if (surgery.procedureName) {
        parts.push(`Surgery: ${surgery.procedureName}`);
    }

    if (surgery.surgeryDate) {
        parts.push(`Date performed: ${new Date(surgery.surgeryDate).toLocaleDateString()}`);
    }

    if (surgery.indication) {
        parts.push(`Indication: ${surgery.indication}`);
    }

    if (surgery.complications) {
        if (surgery.complications.toLowerCase() === "none") {
            parts.push(`No complications`);
        } else {
            parts.push(`Complications: ${surgery.complications}`);
        }
    }

    return parts.join('. ') + (parts.length > 0 ? '.' : '');
};
const formatAdmissionNotes = (obs: any[]): ComponentNote[] => {
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    const groupedAdmissions: {
        time: string;
        creator: string;
        admissions: {
            admissionDate?: string;
            healthCenter?: string;
            admissionSection?: string;
            diagnosis?: string;
            surgicalInterventions?: string;
            dischargeInstructions?: string;
            followUp?: string;
        }[];
    }[] = [];

    let currentGroup: {
        time: string;
        creator: string;
        admissions: any[];
    } | null = null;

    // Process all observations to group by 3-minute intervals
    sortedObs.forEach((parentOb: any) => {
        if (parentOb.names?.[0]?.name === "Admission date") {
            const itemTime = parentOb.obs_datetime || new Date().toISOString();
            const itemCreator = parentOb.created_by || "Unknown";

            const admission: any = {
                admissionDate: parentOb.value,
                creator: itemCreator
            };

            parentOb.children?.forEach((child: any) => {
                const name = child.names?.[0]?.name;
                const value = child.value;

                if (name === "Health center hospitals") {
                    admission.healthCenter = value;
                }
                else if (name === "Admission section") {
                    admission.admissionSection = value;
                }
                else if (name === "ICD11 Diagnosis") {
                    admission.diagnosis = value;
                }
                else if (name === "Surgical interventions for tuberculosis" ||
                    name === "Surgical interventions" ||
                    name === "Surgical interventions for TB") {
                    admission.surgicalInterventions = value;
                }
                else if (name === "Discharge Instructions") {
                    admission.dischargeInstructions = value;
                }
                else if (name === "Follow Up") {
                    admission.followUp = value;
                }
            });

            if (!currentGroup ||
                new Date(itemTime).getTime() - new Date(currentGroup.time).getTime() > 3 * 60 * 1000) {
                currentGroup = {
                    time: itemTime,
                    creator: itemCreator,
                    admissions: []
                };
                groupedAdmissions.push(currentGroup);
            }

            currentGroup.admissions.push(admission);
            currentGroup.time = itemTime;
            currentGroup.creator = itemCreator;
        }
    });

    // Convert grouped admissions to ComponentNote format
    return groupedAdmissions.map(group => ({
        paragraph: group.admissions.map(admission =>
            createAdmissionNoteText(admission)).join(' '),
        time: group.time,
        creator: group.creator,
        rawTime: new Date(group.time).getTime()
    })).sort((a, b) => b.rawTime - a.rawTime); // Sort newest first
};

const createAdmissionNoteText = (admission: {
    admissionDate?: string;
    healthCenter?: string;
    admissionSection?: string;
    diagnosis?: string;
    surgicalInterventions?: string;
    dischargeInstructions?: string;
    followUp?: string;
}): string => {
    const parts: string[] = [];

    if (admission.healthCenter) {
        parts.push(`The patient was admitted at ${admission.healthCenter}`);
    }

    if (admission.admissionSection) {
        parts.push(`Admission section/ward: ${admission.admissionSection}`);
    }

    if (admission.admissionDate) {
        parts.push(`Admission date: ${new Date(admission.admissionDate).toLocaleDateString()}`);
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

    return parts.join('. ') + (parts.length > 0 ? '.' : '');
};

const formatGynecologyNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        ageAtMenarche?: string;
        gestationWeeks?: string;
        previousPregnancies?: string;
        contraceptives: string[];
        pregnancyOutcomes: {
            type: string;
            details?: string;
            parity?: number;
        }[];
        additionalNotes?: string;
    } = {
        time: "",
        creator: "Unknown",
        contraceptives: [],
        pregnancyOutcomes: []
    };

    // Sort observations by datetime
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        switch (name) {
            case "Age At Menarche":
                // If we already have some data, push current note and start a new one
                if (currentNote.ageAtMenarche ||
                    currentNote.gestationWeeks ||
                    currentNote.previousPregnancies ||
                    currentNote.contraceptives.length > 0 ||
                    currentNote.pregnancyOutcomes.length > 0) {
                    notes.push(createGynecologyNote(currentNote));
                    currentNote = {
                        time: time,
                        creator: creator,
                        contraceptives: [],
                        pregnancyOutcomes: []
                    };
                }
                currentNote.ageAtMenarche = value;
                break;

            case "Gestation weeks":
                currentNote.gestationWeeks = value;
                break;

            case "Previous Pregnancies":
                currentNote.previousPregnancies = value;
                break;

            case "Levoplant":
            case "Jadelle":
            case "Implanon":
                if (value === "true") {
                    currentNote.contraceptives.push(name);
                }
                break;

            case "Pregenancy Outcome":
                // Handle pregnancy outcomes with children
                if (ob.children && ob.children.length > 0) {
                    const outcome: any = {};

                    ob.children.forEach((child: any) => {
                        const childName = child.names?.[0]?.name;
                        if (childName === "Live birth" ||
                            childName === "STILL BIRTH" ||
                            childName === "Second Trimester Miscarriage" ||
                            childName === "First Trimester Miscarriage") {
                            outcome.type = childName;

                            // Check for parity information with live births
                            if (childName === "Live birth") {
                                const parityChild = ob.children.find((c: any) =>
                                    c.names?.some((n: any) =>
                                        n.name === "Parity" ||
                                        n.name === "Number of births" ||
                                        n.name === "Number of delivered children"
                                    )
                                );
                                if (parityChild) {
                                    outcome.parity = parseFloat(parityChild.value);
                                }
                            }
                        }
                    });

                    if (outcome.type) {
                        currentNote.pregnancyOutcomes.push(outcome);
                    }
                }
                break;
            case "First Trimester Miscarriage":
            case "Second Trimester Miscarriage":
            case "STILL BIRTH":
            case "Live birth":
                const outcome: any = { type: name };

                // Check for parity with live births
                if (name === "Live birth" && ob.children) {
                    const parityChild = ob.children.find((child: any) =>
                        child.names?.some((n: any) =>
                            n.name === "Parity" ||
                            n.name === "Number of births" ||
                            n.name === "Number of delivered children"
                        )
                    );
                    if (parityChild) {
                        outcome.parity = parseFloat(parityChild.value);
                    }
                }

                currentNote.pregnancyOutcomes.push(outcome);
                break;

            case "Additional Notes":
                currentNote.additionalNotes = value;
                break;
        }

        // Update time and creator with latest observation
        currentNote.time = time;
        currentNote.creator = creator;
    });

    // Create the note if we have any data
    if (currentNote.ageAtMenarche ||
        currentNote.gestationWeeks ||
        currentNote.previousPregnancies ||
        currentNote.contraceptives.length > 0 ||
        currentNote.pregnancyOutcomes.length > 0) {
        notes.push(createGynecologyNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createGynecologyNote = (note: {
    time: string;
    creator: string;
    ageAtMenarche?: string;
    gestationWeeks?: string;
    previousPregnancies?: string;
    contraceptives: string[];
    pregnancyOutcomes: {
        type: string;
        details?: string;
        parity?: number;
    }[];
    additionalNotes?: string;
}): ComponentNote => {
    const paragraphs: string[] = [];

    if (note.ageAtMenarche) {
        paragraphs.push(`Menarche occurred at age ${note.ageAtMenarche}.`);
    }

    // Current pregnancy status
    const currentPregnancyParts: string[] = [];
    if (note.gestationWeeks) {
        currentPregnancyParts.push(`currently ${note.gestationWeeks} gestation`);
    }

    // Previous pregnancies
    if (note.previousPregnancies) {
        const pregnancyCount = parseInt(note.previousPregnancies);
        currentPregnancyParts.push(`${pregnancyCount} previous ${pregnancyCount === 1 ? 'pregnancy' : 'pregnancies'}`);
    }

    // Add current pregnancy status paragraph if we have info
    if (currentPregnancyParts.length > 0) {
        paragraphs.push(`Obstetric history: ${currentPregnancyParts.join(', ')}.`);
    }

    // Pregnancy outcomes with proper numbering and parity for live births
    if (note.pregnancyOutcomes.length > 0) {
        const outcomeDescriptions = note.pregnancyOutcomes.map((outcome, index) => {
            const pregnancyNumber = index + 1;
            let outcomeText = outcome.type;

            // Add parity for live births
            if (outcome.type === "Live birth" && outcome.parity !== undefined) {
                outcomeText += ` (${outcome.parity} ${outcome.parity === 1 ? 'child' : 'children'})`;
            }

            return `Pregnancy ${pregnancyNumber}: ${outcomeText}`;
        });
        paragraphs.push(`Pregnancy outcomes: ${outcomeDescriptions.join('; ')}.`);
    }

    // Contraceptive use - handle multiple contraceptives
    if (note.contraceptives.length > 0) {
        if (note.contraceptives.length === 1) {
            paragraphs.push(`Contraception: Currently using ${note.contraceptives[0]}.`);
        } else {
            const lastContraceptive = note.contraceptives.pop();
            paragraphs.push(`Contraception: Currently using ${note.contraceptives.join(', ')} and ${lastContraceptive}.`);
        }
    }

    if (note.additionalNotes) {
        paragraphs.push(`Notes: ${note.additionalNotes}.`);
    }

    return {
        paragraph: paragraphs.join(' '),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};
const formatReviewOfSystemsNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentSystem: string | null = null;
    let currentDetails: Record<string, any> = {};
    let currentTime = "";
    let currentCreator = "";

    // Sort observations by datetime
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    // Process each observation
    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        if (name === "Review of systems, general") {
            if (currentSystem) {
                notes.push(createSystemNote(currentSystem, currentDetails, currentTime, currentCreator));
            }
            currentSystem = "General";
            currentDetails = {};
            currentTime = ob.obs_datetime;
            currentCreator = ob.created_by;
        } else if (name.includes("Review Of Systems")) {
            if (currentSystem) {
                notes.push(createSystemNote(currentSystem, currentDetails, currentTime, currentCreator));
            }
            currentSystem = name.replace("Review Of Systems ", "");
            currentDetails = {};
            currentTime = ob.obs_datetime;
            currentCreator = ob.created_by;
        }

        if (currentSystem) {
            currentDetails[name] = value;
        }
    });

    // Add the last system note
    if (currentSystem) {
        notes.push(createSystemNote(currentSystem, currentDetails, currentTime, currentCreator));
    }

    return notes;
};

const createSystemNote = (
    system: string,
    details: Record<string, any>,
    time: string,
    creator: string
): ComponentNote => {
    const detailText = Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

    return {
        paragraph: `
            Review of ${system} System:
            ${detailText}
        `.trim(),
        creator: creator,
        time: time,
        rawTime: new Date(time).getTime(),
    };
};
const formatFamilyHistoryNotes = (obs: any[]): ComponentNote[] => {
    type FamilyHistoryCondition = {
        name: string;
        relationship?: string;
        details?: string;
    };

    type FamilyHistoryNote = {
        time: string;
        creator: string;
        conditions: FamilyHistoryCondition[];
    };

    const notes: ComponentNote[] = [];
    let currentNote: FamilyHistoryNote | null = null;
    let lastObservationTime: Date | null = null;

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );
    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const currentTime = new Date(time);
        const creator = ob.created_by || "Unknown";

        // Check if we need to start a new note (3-minute interval or first observation)
        if (!currentNote || !lastObservationTime ||
            (currentTime.getTime() - lastObservationTime.getTime()) > 180000) {

            if (currentNote?.conditions?.length) {
                notes.push(createFamilyHistoryNote(currentNote));
            }

            currentNote = {
                time: time,
                creator: creator,
                conditions: []
            };
        }

        lastObservationTime = currentTime;

        if (name.startsWith("Family History")) {
            const condition: FamilyHistoryCondition = {
                name: name.replace("Family History", "").trim(),
                // For cancer, include the type from the value
                details: name === "Family History Cancer" ? value : undefined
            };

            if (ob.children && ob.children.length > 0) {
                const relationshipChild = ob.children.find((child: any) =>
                    child.names?.some((n: any) => n.name === "Relationship To Patient")
                );
                if (relationshipChild) {
                    condition.relationship = relationshipChild.value;
                }
            }

            if (name === "Family History Other Condition" || name === "Review Of Systems Other") {
                condition.details = value;
            }

            currentNote!.conditions.push(condition);
        }
        else if (name === "Relationship To Patient" && currentNote?.conditions?.length) {
            currentNote.conditions[currentNote.conditions.length - 1].relationship = value;
        }

        currentNote!.time = time;
        currentNote!.creator = creator;
    });

    if (currentNote) {
        notes.push(createFamilyHistoryNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createFamilyHistoryNote = (note: {
    time: string;
    creator: string;
    conditions: {
        name: string;
        relationship?: string;
        details?: string;
    }[];
}): ComponentNote => {
    const parts: string[] = [];
    parts.push("Family History:");

    note.conditions.forEach(condition => {
        let conditionText = condition.name;

        if (condition.relationship) {
            conditionText += ` (${condition.relationship})`;
        }

        // Cancer to include type
        if (condition.name === "Cancer" && condition.details) {
            conditionText += `: ${condition.details}`;
        }
        // For other conditions with details
        else if (condition.details && condition.name !== "Cancer") {
            conditionText += `: ${condition.details}`;
        }

        parts.push(conditionText);
    });

    return {
        paragraph: parts.join("; "), // Use semicolon for better separation
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};
const formatLastMealNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        time: string;
        creator: string;
        lastMealTime?: string;
        lastMealDescription?: string;
    } = {
        time: "",
        creator: "Unknown"
    };

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (!currentNote.time) {
            currentNote.time = time;
            currentNote.creator = creator;
        }

        switch (name) {
            case "Time of last meal":
                if (currentNote.lastMealTime || currentNote.lastMealDescription) {
                    notes.push(createLastMealNote(currentNote));
                    currentNote = {
                        time: time,
                        creator: creator
                    };
                }
                currentNote.lastMealTime = value;

                if (ob.children && ob.children.length > 0) {
                    const mealDescriptionChild = ob.children.find((child: any) =>
                        child.names?.some((n: any) => n.name === "Description of last meal")
                    );
                    if (mealDescriptionChild) {
                        currentNote.lastMealDescription = mealDescriptionChild.value;
                    }
                }
                break;

            case "Description of last meal":
                if (!currentNote.lastMealDescription) {
                    currentNote.lastMealDescription = value;
                }
                break;
        }

        currentNote.time = time;
        currentNote.creator = creator;
    });

    if (currentNote.lastMealTime || currentNote.lastMealDescription) {
        notes.push(createLastMealNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createLastMealNote = (note: {
    time: string;
    creator: string;
    lastMealTime?: string;
    lastMealDescription?: string;
}): ComponentNote => {
    const parts: string[] = [];
    parts.push("Last meal:");

    if (note.lastMealTime) {
        const formattedTime = note.lastMealTime.replace(',', ' at');
        parts.push(`consumed on ${formattedTime}`);
    }

    if (note.lastMealDescription) {
        if (note.lastMealTime) {
            parts.push(`(${note.lastMealDescription})`);
        } else {
            parts.push(note.lastMealDescription);
        }
    }

    return {
        paragraph: parts.join(' '),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
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

    const processObservation = (ob: any) => {
        const name = ob.conceptName || ob.name || (ob.names && ob.names[0]?.name);
        const valueText = ob.value || ob.value_text;
        const creator = ob.creator || ob.created_by || "Unknown";
        const time = ob.obs_datetime || ob.obsDateTime || new Date().toISOString();
        const children = ob.children || [];
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
        medications: Array<{
            name: string;
            formulation: string;
            dose: string;
            doseUnit: string;
            frequency: string;
            duration: string;
            durationUnit: string;
            description: string;
        }>;
    } = {
        time: "",
        creator: "Unknown",
        sections: {},
        vitals: {},
        labs: {},
        medications: []
    };

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (name === "Subjective" && currentNote.sections.Subjective) {
            soapNotes.push(createSoapierNote(currentNote));
            currentNote = {
                time,
                creator,
                sections: {},
                vitals: {},
                labs: {},
                medications: []
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
        else if ([
            "Systolic blood pressure", "Diastolic blood pressure",
            "Pulse Rate", "Respiratory Rate", "Spo2", "Temperature"
        ].includes(name)) {
            currentNote.vitals[name] = value;
        }
        else if ([
            "Malaria Rapid Diagnostic Test (MRDT)",
            "Blood glucose", "Serum glucose", "Investigations PT",
            "Urine Dipstick Ketones"
        ].includes(name)) {
            const labName = name === "Serum glucose" ? "Blood glucose" : name;
            currentNote.labs[labName] = value;
        }
        else if (name === "Drug Given") {
            const medication = {
                name: value,
                formulation: "",
                dose: "",
                doseUnit: "",
                frequency: "",
                duration: "",
                durationUnit: "",
                description: ""
            };

            ob.children?.forEach((child: any) => {
                const childName = child.names?.[0]?.name;
                const childValue = child.value;

                switch (childName) {
                    case "Medication Formulation":
                        medication.formulation = childValue;
                        break;
                    case "Medication Dose":
                        medication.dose = childValue;
                        break;
                    case "Medication Dose Unit":
                        medication.doseUnit = childValue;
                        break;
                    case "Medication Frequency":
                        medication.frequency = childValue;
                        break;
                    case "Medication Duration":
                        medication.duration = childValue;
                        break;
                    case "Medication Duration Unit":
                        medication.durationUnit = childValue;
                        break;
                    case "Description":
                        medication.description = childValue;
                        break;
                }
            });

            currentNote.medications.push(medication);
        }
    });

    if (Object.keys(currentNote.sections).length > 0 ||
        Object.keys(currentNote.vitals).length > 0 ||
        Object.keys(currentNote.labs).length > 0 ||
        currentNote.medications.length > 0) {
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
    medications: Array<{
        name: string;
        formulation: string;
        dose: string;
        doseUnit: string;
        frequency: string;
        duration: string;
        durationUnit: string;
        description: string;
    }>;
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

            // Insert vitals, labs, and medications after "Medical record observations" (which displays as "Objective")
            if (section === "Medical record observations") {
                // Add vitals if available
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

                // Add medications if available
                if (note.medications.length > 0) {
                    const medParts = note.medications.map(med => {
                        let medStr = `${med.name}`;
                        if (med.formulation) medStr += ` (${med.formulation})`;
                        if (med.dose && med.doseUnit) medStr += ` ${med.dose} ${med.doseUnit}`;
                        if (med.frequency) medStr += ` ${med.frequency}`;
                        if (med.duration && med.durationUnit) medStr += ` for ${med.duration} ${med.durationUnit}`;
                        if (med.description) medStr += ` - ${med.description}`;
                        return medStr;
                    });
                    paragraphParts.push(`Medications: ${medParts.join("; ")}`);
                }
            }
        }
    });

    if (!note.sections["Medical record observations"] &&
        (Object.keys(note.vitals).length > 0 ||
            Object.keys(note.labs).length > 0 ||
            note.medications.length > 0)) {

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

        // Add medications
        if (note.medications.length > 0) {
            const medParts = note.medications.map(med => {
                let medStr = `${med.name}`;
                if (med.formulation) medStr += ` (${med.formulation})`;
                if (med.dose && med.doseUnit) medStr += ` ${med.dose} ${med.doseUnit}`;
                if (med.frequency) medStr += ` ${med.frequency}`;
                if (med.duration && med.durationUnit) medStr += ` for ${med.duration} ${med.durationUnit}`;
                if (med.description) medStr += ` - ${med.description}`;
                return medStr;
            });
            objectiveParts.push(`Medications: ${medParts.join("; ")}`);
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
    interface TempNote {
        time: string;
        creator: string;
        observations: Record<string, {
            value: any;
            creator: string;
            time: string;
        }>;
        abnormalities: Record<string, string[]>;
    }

    const notes: ComponentNote[] = [];
    let currentNote: TempNote | null = null;

    // Sort observations by datetime
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    // Process each observation
    for (const ob of sortedObs) {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (name === "Is Patient Actively Bleeding") {
            if (currentNote) {
                const hasObservations = Object.keys(currentNote.observations).length > 0;
                const hasAbnormalities = Object.keys(currentNote.abnormalities).length > 0;

                if (hasObservations || hasAbnormalities) {
                    notes.push(createComponentNote(currentNote));
                }
            }

            // Initialize new note
            currentNote = {
                time,
                creator,
                observations: {},
                abnormalities: {}
            };
        }

        if (!currentNote) continue;

        // Handle abnormalities
        if ((name === "Is There Any Other Abnomalities" || name === "Is Femur Tibia Normal") &&
            value === "Yes" && ob.children) {
            for (const child of ob.children) {
                const childName = child.names?.[0]?.name;
                const childValue = child.value;

                if (childName === "Image Part Name") {
                    if (!currentNote.abnormalities[childValue]) {
                        currentNote.abnormalities[childValue] = [];
                    }
                    if (child.children) {
                        for (const grandChild of child.children) {
                            const grandChildName = grandChild.names?.[0]?.name;
                            const grandChildValue = grandChild.value;

                            if (grandChildName === "Description" || grandChildName === "Abnormalities") {
                                currentNote.abnormalities[childValue].push(grandChildValue);
                            }
                        }
                    }
                }
            }
        }
        else if (name) {
            currentNote.observations[name] = { value, creator, time };
        }
    }

    if (currentNote) {
        const hasObservations = Object.keys(currentNote.observations).length > 0;
        const hasAbnormalities = Object.keys(currentNote.abnormalities).length > 0;

        if (hasObservations || hasAbnormalities) {
            notes.push(createComponentNote(currentNote));
        }
    }

    function createComponentNote(note: TempNote): ComponentNote {
        const messages: string[] = [];
        const obs = note.observations;
        messages.push(obs["Is Patient Actively Bleeding"]?.value === "Yes"
            ? "The patient is actively bleeding."
            : "The patient is not actively bleeding.");

        // Pulse status
        if (obs["Is The Patient Have Pulse"]?.value === "No") {
            messages.push("The patient has no palpable pulse.");
        } else {
            messages.push("The patient has a palpable pulse.");
            if (obs["Pulse Rate"]?.value) {
                messages.push(`Pulse rate: ${obs["Pulse Rate"].value} bpm.`);
            }
            if (obs["Pulse Rate Weak"]?.value) {
                messages.push(`Pulse quality: ${obs["Pulse Rate Weak"].value}.`);
            }
        }

        // Blood pressure
        if (obs["Blood Pressure Measured"]) {
            if (obs["Blood Pressure Measured"].value === "NOT done") {
                messages.push("Blood pressure was not measured.");
                if (obs["Description"]?.value === "Batteries Not Available") {
                    messages.push("Reason: Batteries not available for the device.");
                }
            } else if (obs["Blood Pressure Measured"].value === "BP Not Recordable") {
                messages.push("Blood pressure was not recordable.");
                if (obs["Reason Not Recorded"]?.value) {
                    messages.push(`Reason: ${obs["Reason Not Recorded"].value}.`);
                }
            } else if (obs["Systolic blood pressure"]?.value) {
                messages.push(`Blood pressure: ${obs["Systolic blood pressure"].value}/${obs["Diastolic blood pressure"]?.value || '--'} mmHg.`);
            }
        }

        // Capillary refill
        if (obs["Capillary refill time"]?.value) {
            messages.push(`Capillary refill time: ${obs["Capillary refill time"].value}.`);
        }

        // IV access
        if (obs["Patient Intravenous"]?.value === "Yes") {
            messages.push("IV access established.");
            if (obs["Size Of Catheter"]?.value) {
                messages.push(`Catheter size: ${obs["Size Of Catheter"].value}.`);
            }
            if (obs["Cannulation site"]?.value) {
                messages.push(`Cannulation site: ${obs["Cannulation site"].value}.`);
            }
            if (obs["Diagram cannulation site"]?.value) {
                messages.push(`Specific site: ${obs["Diagram cannulation site"].value}.`);
            }
        } else if (obs["Patient Intravenous"]?.value === "No") {
            messages.push("No IV access established.");
        }

        // Trauma status
        if (obs["Is Patient Traumatized"]?.value === "Yes") {
            messages.push("The patient has traumatic injuries.");
        } else if (obs["Is Patient Traumatized"]?.value === "No") {
            messages.push("The patient has no traumatic injuries.");
        }

        // Pelvis stability
        if (obs["Is Pelvis Stable"]?.value === "No") {
            messages.push("The pelvis is unstable.");
        } else if (obs["Is Pelvis Stable"]?.value === "Yes") {
            messages.push("The pelvis is stable.");
        }

        // Femur/Tibia status
        if (obs["Is Femur Tibia Normal"]?.value === "No") {
            messages.push("Abnormal femur/tibia findings.");
        } else if (obs["Is Femur Tibia Normal"]?.value === "Yes") {
            messages.push("Femur/tibia appear normal.");
        }

        // Mucous membranes
        if (obs["Mucous Membranes"]?.value === "Abnormal") {
            messages.push("Mucous membranes appear abnormal.");
            if (obs["Mucous abnormal"]?.value) {
                messages.push(`Specific finding: ${obs["Mucous abnormal"].value}.`);
            }
        } else if (obs["Mucous Membranes"]?.value === "Normal") {
            messages.push("Mucous membranes appear normal.");
        }

        // Peripheries
        if (obs["Assess Peripheries"]?.value) {
            messages.push(`Peripheral assessment: ${obs["Assess Peripheries"].value}.`);
        }

        // Headache
        if (obs["Headache"]?.value === "Yes") {
            messages.push("The patient reports headache.");
        } else if (obs["Headache"]?.value === "No") {
            messages.push("The patient reports no headache.");
        }

        // Skin color
        if (obs["Skin Color"]?.value) {
            messages.push(`Skin color: ${obs["Skin Color"].value}.`);
        }

        // Temperature
        if (obs["Temperature"]?.value) {
            messages.push(`Temperature: ${obs["Temperature"].value}.`);
        }

        // Heart sounds
        if (obs["Heart Sounds"]?.value) {
            messages.push(`Heart sounds: ${obs["Heart Sounds"].value}.`);
        }

        // Respiratory rate
        if (obs["Respiratory Rate"]?.value) {
            messages.push(`Respiratory rate: ${obs["Respiratory Rate"].value} breaths/min.`);
        }

        // Oxygen saturation
        if (obs["Oxygen Saturation"]?.value) {
            messages.push(`Oxygen saturation: ${obs["Oxygen Saturation"].value}%.`);
        }

        // Abnormalities
        for (const [region, findings] of Object.entries(note.abnormalities)) {
            if (findings.length > 0) {
                messages.push(`${region} abnormalities: ${findings.join(", ")}.`);
            }
        }

        // Additional notes
        if (obs["Additional Notes"]?.value) {
            messages.push(`Additional notes: ${obs["Additional Notes"].value}.`);
        }

        return {
            paragraph: messages.join(" "),
            time: note.time,
            creator: note.creator,
            rawTime: new Date(note.time).getTime()
        };
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};
const formatDisabilityAssessmentNotes = (obs: any[]): ComponentNote[] => {
    type DisabilityAssessment = {
        time: string;
        creator: string;
        consciousnessLevel?: string;
        eyeOpening?: string;
        verbalResponse?: string;
        motorResponse?: string;
        pupils?: {
            leftSize?: string;
            leftReaction?: string;
            rightSize?: string;
            rightReaction?: string;
        };
        focalNeurology?: string;
        posture?: string;
        serumGlucose?: string;
        activeSeizures?: string;
        additionalNotes?: string;
    };

    const createDisabilityAssessmentNote = (assessment: DisabilityAssessment): ComponentNote => {
        const messages: string[] = [];

        // Consciousness level
        if (assessment.consciousnessLevel) {
            messages.push(assessment.consciousnessLevel === "No"
                ? "The patient is alert with no reduced level of consciousness."
                : "The patient has a reduced level of consciousness requiring evaluation.");
        }

        // GCS components if available
        if (assessment.eyeOpening && assessment.verbalResponse && assessment.motorResponse) {
            const gcsTotal = parseInt(assessment.eyeOpening) + parseInt(assessment.verbalResponse) + parseInt(assessment.motorResponse);

            // GCS summary
            messages.push(`GCS score: ${gcsTotal} (E${assessment.eyeOpening}V${assessment.verbalResponse}M${assessment.motorResponse}).`);

            // GCS interpretation
            if (gcsTotal === 15) {
                messages.push("Patient is fully conscious with normal neurological function.");
            } else if (gcsTotal >= 13 && gcsTotal <= 14) {
                messages.push("Mild brain injury - close monitoring advised.");
            } else if (gcsTotal >= 9 && gcsTotal <= 12) {
                messages.push("Moderate brain injury - requires further assessment.");
            } else if (gcsTotal >= 3 && gcsTotal <= 8) {
                messages.push("Severe brain injury/coma - needs immediate intervention.");
            }
        }

        // Pupil assessment
        if (assessment.pupils) {
            const leftSize = assessment.pupils.leftSize || "not measured";
            const leftReaction = assessment.pupils.leftReaction || "not assessed";
            const rightSize = assessment.pupils.rightSize || "not measured";
            const rightReaction = assessment.pupils.rightReaction || "not assessed";

            messages.push(`Pupils: Left (${leftSize}mm, ${leftReaction}), Right (${rightSize}mm, ${rightReaction}).`);
        }

        // Focal neurology
        if (assessment.focalNeurology) {
            messages.push(`Focal neurology: ${assessment.focalNeurology}.`);
        }

        // Posture
        if (assessment.posture) {
            messages.push(`Posture: ${assessment.posture}.`);
        }

        // Serum glucose
        if (assessment.serumGlucose) {
            const glucose = parseFloat(assessment.serumGlucose);
            if (glucose < 3.9) {
                messages.push(`Hypoglycemia (${glucose} mmol/L).`);
            } else if (glucose > 11.1) {
                messages.push(`Hyperglycemia (${glucose} mmol/L).`);
            } else {
                messages.push(`Normal glucose (${glucose} mmol/L).`);
            }
        }

        // Active seizures
        if (assessment.activeSeizures) {
            messages.push(assessment.activeSeizures === "Yes"
                ? "Active seizures present - requires immediate intervention."
                : "No active seizures observed.");
        }

        // Additional notes
        if (assessment.additionalNotes) {
            messages.push(`Notes: ${assessment.additionalNotes}.`);
        }

        return {
            paragraph: messages.join(" "),
            time: assessment.time,
            creator: assessment.creator,
            rawTime: new Date(assessment.time).getTime()
        };
    };

    const notes: ComponentNote[] = [];
    let currentAssessment: Partial<DisabilityAssessment> = {};

    // Sort observations by datetime (newest first)
    const sortedObs = [...obs].sort((a, b) =>
        new Date(b.obs_datetime).getTime() - new Date(a.obs_datetime).getTime()
    );

    // Process each observation
    for (const ob of sortedObs) {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        // Initialize new assessment if we don't have one
        if (!currentAssessment.time) {
            currentAssessment = { time, creator };
        }

        // Update current assessment time and creator with latest observation
        currentAssessment.time = time;
        currentAssessment.creator = creator;

        // Handle observations
        switch (name) {
            case "Does the patient have a reduced Level of consciousness":
                currentAssessment.consciousnessLevel = value;
                break;

            case "Eye Opening response":
                currentAssessment.eyeOpening = value;
                break;

            case "Verbal Response":
                currentAssessment.verbalResponse = value;
                break;

            case "Motor response":
                currentAssessment.motorResponse = value;
                break;

            case "Focal Neurology":
                currentAssessment.focalNeurology = value;
                break;

            case "Posture":
                currentAssessment.posture = value;
                break;

            case "Serum glucose":
                currentAssessment.serumGlucose = value;
                break;

            case "Active Seizures":
                currentAssessment.activeSeizures = value;
                break;

            case "Additional Notes":
                currentAssessment.additionalNotes = value;
                break;

            case "Eyes":
                // Initialize pupils object if not exists
                if (!currentAssessment.pupils) {
                    currentAssessment.pupils = {};
                }

                const eyeSide = value; // "Left Eye" or "Right Eye"
                for (const child of ob.children || []) {
                    const childName = child.names?.[0]?.name;
                    const childValue = child.value;

                    if (childName === "Pupil size") {
                        if (eyeSide === "Left Eye") {
                            currentAssessment.pupils.leftSize = childValue;
                        } else {
                            currentAssessment.pupils.rightSize = childValue;
                        }
                    } else if (childName === "Pupil Reaction") {
                        const reaction = childValue === "Yes" ? "reactive" : "non-reactive";
                        if (eyeSide === "Left Eye") {
                            currentAssessment.pupils.leftReaction = reaction;
                        } else {
                            currentAssessment.pupils.rightReaction = reaction;
                        }
                    }
                }
                break;
        }

        // Create note if we have enough data
        if (currentAssessment.consciousnessLevel ||
            currentAssessment.eyeOpening ||
            currentAssessment.verbalResponse ||
            currentAssessment.motorResponse ||
            currentAssessment.pupils ||
            currentAssessment.focalNeurology
        ) {
            notes.push(createDisabilityAssessmentNote(currentAssessment as DisabilityAssessment));
            currentAssessment = {};
        }
    }

    const uniqueNotes = notes.reduce((acc: ComponentNote[], note) => {
        const exists = acc.some(n => n.paragraph === note.paragraph && n.time === note.time);
        return exists ? acc : [...acc, note];
    }, []);

    return uniqueNotes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
};
const formatExposureAssessmentNotes = (obs: any[]): ComponentNote[] => {
    type ExposureAbnormality = {
        bodyPart: string;
        skinRash?: string;
        injury?: string;
        abnormalities?: string;
        descriptions: string[];
        additionalNotes?: string;
    };

    type ExposureNote = {
        time: string;
        creator: string;
        temperature?: string;
        abnormalities: ExposureAbnormality[];
        clinicianNotes?: string;
        additionalNotes?: string;
    };

    const createExposureAssessmentNote = (note: ExposureNote): ComponentNote => {
        const messages: string[] = [];

        if (note.temperature) {
            messages.push(`Temperature: ${note.temperature}°C.`);
        }

        if (note.abnormalities.length > 0) {
            const bodyParts = note.abnormalities.map(ab => ab.bodyPart);
            messages.push(`${bodyParts.join(' and ')} ${bodyParts.length > 1 ? 'were' : 'was'} assessed.`);
        }

        note.abnormalities.forEach(abnormality => {
            const parts: string[] = [];
            parts.push(`${abnormality.bodyPart} has`);
            if (abnormality.skinRash === 'Present') {
                const rashDesc = abnormality.descriptions.filter(d =>
                    abnormality.skinRash === 'Present' &&
                    (d.toLowerCase().includes('rash') || d.toLowerCase().includes('petechiae') || d.toLowerCase().includes('burns'))
                ).join(', ');
                parts.push(`skin rash (${rashDesc})`);
            } else if (abnormality.skinRash === 'Absent') {
                parts.push(`no skin rash`);
            }
            if (abnormality.injury === 'Present') {
                const injuryDesc = abnormality.descriptions.filter(d =>
                    abnormality.injury === 'Present' &&
                    d.toLowerCase().includes('injury')
                ).join(', ');
                parts.push(injuryDesc ? `injury (${injuryDesc})` : 'injury');
            } else if (abnormality.injury === 'Absent') {
                parts.push(`no injury`);
            }

            if (abnormality.abnormalities === 'Present') {
                const otherAbnormalities = abnormality.descriptions.filter(d =>
                    abnormality.abnormalities === 'Present' &&
                    !d.toLowerCase().includes('rash') &&
                    !d.toLowerCase().includes('injury')
                ).join(', ');
                parts.push(otherAbnormalities ? `other abnormalities (${otherAbnormalities})` : 'other abnormalities');
            } else if (abnormality.abnormalities === 'Absent') {
                parts.push(`no other abnormalities`);
            }

            let description = parts.join(', ');
            description = description.replace(/, ([^,]*)$/, ' and $1'); // Replace last comma with 'and'
            messages.push(`${description}.`);
        });

        if (note.additionalNotes) {
            messages.push(`Additional notes: ${note.additionalNotes}.`);
        }


        return {
            paragraph: messages.join(' '),
            time: note.time,
            creator: note.creator,
            rawTime: new Date(note.time).getTime()
        };
    };

    const notes: ComponentNote[] = [];
    let currentNote: Partial<ExposureNote> = {
        abnormalities: []
    };

    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        if (name === "Temperature (c)") {
            if (currentNote.time) {
                notes.push(createExposureAssessmentNote(currentNote as ExposureNote));
            }
            currentNote = {
                time,
                creator,
                abnormalities: []
            };
        }

        currentNote.time = time;
        currentNote.creator = creator;

        switch (name) {
            case "Temperature (c)":
                currentNote.temperature = value;
                break;
            case "Additional Notes":
                currentNote.additionalNotes = value;
                break;
            case "Image Part Name":
                if (value === "full body anterior" || value === "full body posterior") {
                    ob.children?.forEach((child: any) => {
                        const childName = child.names?.[0]?.name;
                        if (childName === "Image Part Name") {
                            const abnormality: ExposureAbnormality = {
                                bodyPart: child.value,
                                descriptions: []
                            };

                            child.children?.forEach((grandChild: any) => {
                                const grandChildName = grandChild.names?.[0]?.name;
                                const grandChildValue = grandChild.value;

                                switch (grandChildName) {
                                    case "Skin rash":
                                        abnormality.skinRash = grandChildValue === "Yes" ? "Present" : "Absent";
                                        if (grandChildValue === "Yes") {
                                            grandChild.children?.forEach((descChild: any) => {
                                                if (descChild.names?.[0]?.name === "Description") {
                                                    abnormality.descriptions.push(descChild.value);
                                                }
                                            });
                                        }
                                        break;
                                    case "Injury":
                                        abnormality.injury = grandChildValue === "Yes" ? "Present" : "Absent";
                                        if (grandChildValue === "Yes") {
                                            grandChild.children?.forEach((descChild: any) => {
                                                if (descChild.names?.[0]?.name === "Description of injury") {
                                                    abnormality.descriptions.push(descChild.value);
                                                }
                                            });
                                        }
                                        break;
                                    case "Abnormalities":
                                        abnormality.abnormalities = grandChildValue === "Yes" ? "Present" : "Absent";
                                        if (grandChildValue === "Yes") {
                                            grandChild.children?.forEach((descChild: any) => {
                                                if (descChild.names?.[0]?.name === "Abnormality description") {
                                                    abnormality.descriptions.push(descChild.value);
                                                }
                                            });
                                        }
                                        break;
                                    case "Description":
                                        abnormality.descriptions.push(grandChildValue);
                                        break;
                                    case "Additional Notes":
                                        abnormality.additionalNotes = grandChildValue;
                                        break;
                                    case "Image Part Name":
                                        abnormality.bodyPart = grandChildValue;
                                        break;
                                }
                            });

                            if (abnormality.skinRash || abnormality.injury || abnormality.abnormalities || abnormality.descriptions.length > 0) {
                                currentNote.abnormalities?.push(abnormality);
                            }
                        }
                    });
                } else {
                    const abnormality: ExposureAbnormality = {
                        bodyPart: value,
                        descriptions: []
                    };

                    ob.children?.forEach((child: any) => {
                        const childName = child.names?.[0]?.name;
                        const childValue = child.value;

                        switch (childName) {
                            case "Skin rash":
                                abnormality.skinRash = childValue === "Yes" ? "Present" : "Absent";
                                if (childValue === "Yes") {
                                    child.children?.forEach((descChild: any) => {
                                        if (descChild.names?.[0]?.name === "Description") {
                                            abnormality.descriptions.push(descChild.value);
                                        }
                                    });
                                }
                                break;
                            case "Injury":
                                abnormality.injury = childValue === "Yes" ? "Present" : "Absent";
                                if (childValue === "Yes") {
                                    child.children?.forEach((descChild: any) => {
                                        if (descChild.names?.[0]?.name === "Description of injury") {
                                            abnormality.descriptions.push(descChild.value);
                                        }
                                    });
                                }
                                break;
                            case "Abnormalities":
                                abnormality.abnormalities = childValue === "Yes" ? "Present" : "Absent";
                                if (childValue === "Yes") {
                                    child.children?.forEach((descChild: any) => {
                                        if (descChild.names?.[0]?.name === "Abnormality description") {
                                            abnormality.descriptions.push(descChild.value);
                                        }
                                    });
                                }
                                break;
                            case "Description":
                                abnormality.descriptions.push(childValue);
                                break;
                            case "Additional Notes":
                                abnormality.additionalNotes = childValue;
                                break;
                        }
                    });

                    if (abnormality.skinRash || abnormality.injury || abnormality.abnormalities || abnormality.descriptions.length > 0) {
                        currentNote.abnormalities?.push(abnormality);
                    }
                }
                break;
            case "Clinician notes":
                currentNote.clinicianNotes = value;
                break;
        }
    });

    if (currentNote.time && (
        currentNote.temperature ||
        (currentNote.abnormalities && currentNote.abnormalities.length > 0) ||
        currentNote.clinicianNotes ||
        currentNote.additionalNotes
    )) {
        notes.push(createExposureAssessmentNote(currentNote as ExposureNote));
    }

    return notes;
};
const formatDispositionNotes = (obs: any[]): ComponentNote[] => {
    const notes: ComponentNote[] = [];
    let currentNote: {
        dispositionType: string;
        details: Record<string, any>;
        time: string;
        creator: string;
    } | null = null;

    // Sort observations by datetime
    const sortedObs = [...obs].sort((a, b) =>
        new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
    );

    // Process each observation
    sortedObs.forEach((ob: any) => {
        const name = ob.names?.[0]?.name;
        const value = ob.value;
        const time = ob.obs_datetime || new Date().toISOString();
        const creator = ob.created_by || "Unknown";

        // Check for disposition type observations
        if ([
            "Discharge Home",
            "Referral",
            "Admission",
            "Death",
            "Absconded",
            "Awaiting Speciality Review",
            "Short stay",
            "Transfer To Another Facility",
            "Refused Hospital Treatment"
        ].includes(name)) {
            if (currentNote) {
                notes.push(createDispositionNote(currentNote));
            }

            // Start new note
            currentNote = {
                dispositionType: name,
                details: {},
                time,
                creator
            };

            if (currentNote && ob.children) {
                ob.children.forEach((child: any) => {
                    const childName = child.names?.[0]?.name;
                    const childValue = child.value;

                    if (childName) {
                        currentNote!.details[childName] = childValue;
                    }
                });
            }
        }
    });

    if (currentNote) {
        notes.push(createDispositionNote(currentNote));
    }

    return notes.sort((a, b) => b.rawTime - a.rawTime);
};

const createDispositionNote = (note: {
    dispositionType: string;
    details: Record<string, any>;
    time: string;
    creator: string;
}): ComponentNote => {
    const parts: string[] = [];
    const details = note.details;

    switch (note.dispositionType) {
        case "Discharge Home":
            parts.push("Patient was discharged home.");

            if (details["Discharge Plan"]) {
                parts.push(`Discharge plan: ${details["Discharge Plan"]}`);
            }
            if (details["Followup Plan"] === "Yes") {
                parts.push("Follow-up is required.");
                if (details["Followup Details"]) {
                    parts.push(`Follow-up details: ${details["Followup Details"]}`);
                }
            } else if (details["Followup Plan"] === "No") {
                parts.push("No follow-up required.");
            }
            if (details["Home Care Instructions"]) {
                parts.push(`Home care instructions: ${details["Home Care Instructions"]}`);
            }
            if (details["Discharge Notes"]) {
                parts.push(`Discharge notes: ${details["Discharge Notes"]}`);
            }
            if (details["Specialist clinic"]) {
                parts.push(`Referred to specialist clinic: ${details["Specialist clinic"]}`);
            }
            break;

        case "Referral":
            parts.push("Patient was referred to another facility.");
            if (details["Referral Facility"]) {
                parts.push(`Referral facility: ${details["Referral Facility"]}`);
            }
            if (details["Referral Reason"]) {
                parts.push(`Reason for referral: ${details["Referral Reason"]}`);
            }
            if (details["Referral Notes"]) {
                parts.push(`Referral notes: ${details["Referral Notes"]}`);
            }
            break;

        case "Admission":
            parts.push("Patient was admitted to the hospital.");
            if (details["Speciality Department"]) {
                parts.push(`Department: ${details["Speciality Department"]}`);
            }
            if (details["Bed number"]) {
                parts.push(`Bed number: ${details["Bed number"]}`);
            }
            break;
        case "Short stay":
            parts.push("Patient was admitted for a short stay.");
            if (details["Reason for short stay"]) {
                parts.push(`Reason: ${details["Reason for short stay"]}`);
            }
            if (details["Expected duration"]) {
                parts.push(`Expected duration: ${details["Expected duration"]}`);
            }
            if (details["Additional Notes"]) {
                parts.push(`Additional notes: ${details["Additional Notes"]}`);
            }
            break;
        case "Transfer To Another Facility":
            parts.push("Patient was transferred to another facility.");
            if (details["Facility Name"]) {
                parts.push(`Transferred to: ${details["Facility Name"]}`);
            }
            if (details["Reason For Transfer"]) {
                parts.push(`Reason for transfer: ${details["Reason For Transfer"]}`);
            }
            break;

        case "Death":
            parts.push("Patient was declared deceased.");
            if (details["Cause of death"]) {
                parts.push(`Cause of death: ${details["Cause of death"]}`);
            }
            if (details["Time of death"]) {
                parts.push(`Time of death: ${details["Time of death"]}`);
            }
            if (details["Family Informed"]) {
                if (details["Family Informed"] === "Yes") {
                    parts.push("Family was informed.");
                } else if (details["Family Informed"] === "No") {
                    parts.push("Family was not informed.");
                }
            }
            if (details["Relationship To Deceased"]) {
                parts.push(`Reported by: ${details["Relationship To Deceased"]}`);
            }
            if (details["Mortuary"]) {
                parts.push(`Body taken to: ${details["Mortuary"]}`);
            }
            if (details["Last Office Conducted"]) {
                if (details["Last Office Conducted"] === "Yes") {
                    parts.push("Last office was conducted.");
                } else if (details["Last Office Conducted"] === "No") {
                    parts.push("Last office was not conducted.");
                }
            }
            if (details["Name Of Health Worker Who Conducted Last Office"]) {
                parts.push(`Last office conducted by: ${details["Name Of Health Worker Who Conducted Last Office"]}`);
            }
            if (details["Date Of Last Office"]) {
                parts.push(`Date of last office: ${details["Date Of Last Office"]}`);
            }
            if (details["Additional Notes"]) {
                parts.push(`Additional notes: ${details["Additional Notes"]}`);
            }
            break;

        case "Absconded":
            parts.push("Patient absconded from care.");
            if (details["Last Seen Location"]) {
                parts.push(`Last seen at ${details["Last Seen Location"]}`);
            }
            if (details["Date Of Absconding"]) {
                parts.push(`Date of absconding: ${details["Date Of Absconding"]}`);
            }
            if (details["Time Of Absconding"]) {
                parts.push(`Time of absconding: ${details["Time Of Absconding"]}`);
            }
            break;
        case "Refused Hospital Treatment":
            parts.push("Patient refused hospital treatment.");
            if (details["Date Of Refusal"]) {
                parts.push(`Date of refusal: ${details["Date Of Refusal"]}`);
            }
            if (details["Witness Name"]) {
                parts.push(`Witness name: ${details["Witness Name"]}`);
            }
            if (details["Reason For Refusal"]) {
                parts.push(`Reason for refusal: ${details["Reason For Refusal"]}`);
            }
            if (details["Plans To Return For Treatment"]) {
                if (details["Plans To Return For Treatment"] === "Yes") {
                    parts.push("The patient plans to return for treatment.");
                } else if (details["Plans To Return For Treatment"] === "No") {
                    parts.push("The patient does not plan to return for treatment.");
                }
            }
            break;

        case "Transfer":
            parts.push("Patient was transferred to another facility.");
            if (details["Transfer Facility"]) {
                parts.push(`Transfer facility: ${details["Transfer Facility"]}`);
            }
            if (details["Transfer Reason"]) {
                parts.push(`Reason for transfer: ${details["Transfer Reason"]}`);
            }
            if (details["Transfer Notes"]) {
                parts.push(`Transfer notes: ${details["Transfer Notes"]}`);
            }
            break;

        case "Awaiting Speciality Review":
            parts.push("Patient is awaiting specialty review.");

            if (details["Speciality Department"]) {
                parts.push(`Specialty department: ${details["Speciality Department"]}`);
            }
            if (details["Reason for request"]) {
                parts.push(`Reason for review: ${details["Reason for request"]}`);
            }
            break;

        default:
            parts.push(`Patient disposition: ${note.dispositionType}`);
            break;
    }

    const handledDetails = [
        "Discharge Plan", "Followup Plan", "Followup Details", "Home Care Instructions",
        "Discharge Notes", "Specialist clinic", "Referral Facility", "Referral Reason",
        "Referral Notes", "Admission Ward", "Admission Reason", "Admission Notes",
        "Cause of death", "Time of death", "Family Informed", "Relationship To Deceased",
        "Mortuary", "Last Office Conducted", "Name Of Health Worker Who Conducted Last Office", "Date Of Last Office",
         "Last Seen", "Absconded Notes", "Transfer Facility", "Transfer Reason", "Transfer Notes",
        "Speciality Department", "Reason for request", "Speciality Department",
        "Bed number",  "Reason for short stay", "Expected duration",  "Additional Notes","Facility Name",
        "Reason For Transfer","Date Of Absconding", "Time Of Absconding", "Last Seen Location", "Date Of Refusal",
        "Witness Name", "Reason For Refusal", "Plans To Return For Treatment",
    ];

    Object.entries(details).forEach(([key, value]) => {
        if (!handledDetails.includes(key) && value) {
            parts.push(`${key}: ${value}`);
        }
    });

    return {
        paragraph: parts.join(". "),
        time: note.time,
        creator: note.creator,
        rawTime: new Date(note.time).getTime()
    };
};