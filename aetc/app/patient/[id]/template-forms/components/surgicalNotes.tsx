"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MainGrid,
  MainPaper,
  MainTypography,
  WrapperBox,
  BackButton,
  MainButton,
  PatientInfoTab,
} from "@/components";
import { Typography, Button, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters, concepts } from "@/constants";
import { FaAngleLeft } from "react-icons/fa6";

import { useReactToPrint } from "react-to-print"; // Import react-to-print
import { TemplateWrapper } from "@/components/templateForm";

interface Diagnosis {
  id: string;
  condition: string;
  obsDatetime: string;
}

interface Allergy {
  id: string;
  allergen: string;
  comment: string;
  obsDatetime: string;
}

interface NeurologicalObservation {
  id: string;
  notes: string;
  obsDatetime: string;
}
interface ExtremitiesObservation {
  id: string;
  oedema: string;
  oedemaDetails?: string;
  coldClammy: string;
  abnormalitiesUpperLimb: string;
  abnormalitiesLowerLimb: string;
  obsDatetime: string;
}
interface SkinObservation {
  id: string;
  observation: string;
  obsDatetime: string;
}

interface Observation {
  obs_id: number;
  person_id: number;
  concept_id: number;
  encounter_id: number;
  value_text?: string;
  value_coded?: string;
  obs_datetime: string;
  children?: Observation[];
}

interface ChestObservation {
  id: string;
  heartSound: string;
  abnormality: string;
  obsDatetime: string;
}

interface AbdomenPelvisObservation {
  id: string;
  description: string;
  obsDatetime: string;
}
interface LungsObservation {
  id: string;
  respiratoryRate: string;
  chestWallAbnormality: string;
  abnormality: string;
  chestExpansion: string;
  tactileFemitus: string;
  obsDatetime: string;
}

interface PrimaryLungsObservation {
  id: string;
  description: string;
  obsDatetime: string;
}

interface PresentingComplaint {
  id: string;
  complaint: string;
  duration: string; // Add duration here
  obsDatetime: string;
}

interface SurgicalHistory {
  id: string;
  procedure: string;
  indication: string;
  date: string;
  complications: string;
}

interface FamilyHistory {
  id: string;
  condition: string;
  relationship: string;
  obsDatetime: string;
  otherDetails?: string;
}

interface ROSGeneralHistory {
  id: string;
  symptom: string;
  duration: string;
  durationUnit: string;
  site: string;
  obsDatetime: string;
}

interface ROSDropdownHistory {
  id: string;
  category: string;
  selection: string;
  obsDatetime: string;
}

interface ReviewOfSystem {
  id: string;
  dateOfLastMeal: string;
  events: string;
  generalHistory: ROSGeneralHistory[];
  dropdownHistory: ROSDropdownHistory[];
}

interface DrugHistory {
  id: string;
  medicationName: string;
  formulation: string;
  dose: string;
  doseUnit: string;
  frequency: string;
  duration: string;
  durationUnit: string;
  lastTaken: string;
  lastPrescribed: string;
  obsDatetime: string;
}

interface SkinAssessment {
  id: string;
  temperature: string;
  additionalNotes: string;
  obsDatetime: string;
}
interface HeadAndNeckObservation {
  id: string;
  region: string;
  description: string;
  abnormality: string;
  obsDatetime: string;
}

// Interface for Investigation (Bedside Assessment)
interface Investigation {
  id: string;
  assessment: string;
  obsDatetime: string;
}

interface BedsideAssessment {
  mrdt: string | null;
  pregnancyTest: string | null;
  pc02: string | null;

  vdrl: string | null;
  hiv: string | null;
  pointOfCareUltrasound: string | null;
  ecg: string | null;
  other: string | null;
  obsDatetime: string;
}

const YES_UUID = "b9a0bbfc-8d80-11d8-abbb-0024217bb78e";
const NO_UUID = "b9a0bd28-8d80-11d8-abbb-0024217bb78e";

function getYesNo(value: string) {
  return value === YES_UUID ? "Yes" : value === NO_UUID ? "No" : value;
}

function SurgicalNotesTemplate() {
  const { params } = useParameters();
  const printRef = useRef(null); // Reference for printing

  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<
    Diagnosis[]
  >([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [neurologicalExaminations, setNeurologicalExaminations] = useState<
    NeurologicalObservation[]
  >([]);
  const [extremitiesExaminations, setExtremitiesExaminations] = useState<
    ExtremitiesObservation[]
  >([]);
  const [skinExaminations, setSkinExaminations] = useState<SkinObservation[]>(
    []
  );
  const [headAndNeckExaminations, setHeadAndNeckExaminations] = useState<
    HeadAndNeckObservation[]
  >([]);
  const [chestAssessments, setChestAssessments] = useState<ChestObservation[]>(
    []
  );
  const [abdomenPelvisAssessments, setAbdomenPelvisAssessments] = useState<
    AbdomenPelvisObservation[]
  >([]);
  const [lungsAssessments, setLungsAssessments] = useState<LungsObservation[]>(
    []
  );
  const [primaryLungsAssessments, setPrimaryLungsAssessments] = useState<
    PrimaryLungsObservation[]
  >([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [bedsideAssessment, setBedsideAssessment] =
    useState<BedsideAssessment | null>(null);

  const [presentingComplaints, setPresentingComplaints] = useState<
    PresentingComplaint[]
  >([]);
  // const [triageComplaints, setTriageComplaints] = useState<TriageComplaint[]>([]);

  const [HIVStatus, setHIVStatus] = useState("Unknown");
  const [surgicalHistory, setSurgicalHistory] = useState<SurgicalHistory[]>([]);
  const [familyHistory, setFamilyHistory] = useState<FamilyHistory[]>([]);
  const [reviewOfSystems, setReviewOfSystems] = useState<ReviewOfSystem[]>([]);
  const [drugHistory, setDrugHistory] = useState<DrugHistory[]>([]);
  const [skinAssessment, setSkinAssessment] = useState<SkinAssessment[]>([]);

  const abnormalityMap: Record<string, string> = {
    "147c7e5c-7da5-40a4-a3d7-1cedba7f9404": "BRUISE",
    "b90b5256-8d80-11d8-abbb-0024217bb78e": "HAEMATOMA",
    "b8bbc2f4-8d80-11d8-abbb-0024217bb78e": "FRACTURE",
    "b9caa8b8-8d80-11d8-abbb-0024217bb78e": "OTHER",
    "b8bac0ac-8d80-11d8-abbb-0024217bb78e": "LACERATION",
  };

  const {
    data: patientEncounters,
    isLoading,
    error,
  } = getPatientsEncounters(params.id as string);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Surgical Notes",
  });

  useEffect(() => {
    if (patientEncounters) {
      // Filter for HIV-related observations
      const hivEncounters = patientEncounters.filter(
        (encounter) =>
          encounter.encounter_type.name === "DIAGNOSIS" ||
          encounter.encounter_type.name === "SURGICAL HISTORY"
      );

      const isHIVPositive = hivEncounters.some((encounter) =>
        encounter.obs.some((obs) =>
          obs.names.some(
            (name) => name.name === "Acquired immunodeficiency syndrome"
          )
        )
      );

      setHIVStatus(isHIVPositive ? "Positive" : "Negative");

      //past surgical history

      // Extract past surgical history
      const historyRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.SURGICAL_HISTORY
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.children?.length > 0) // Check parent observations
            .map((parentObs) => {
              const groupMembers = parentObs.children || [];

              // Extract the Date of Surgery from parent observation
              const date = parentObs.value_datetime
                ? new Date(parentObs.value_datetime).toLocaleDateString()
                : "No Date";

              // Extract the Procedure
              const procedure =
                groupMembers.find((member) => member.concept_id === 11884)
                  ?.names?.[0]?.name || "No Procedure";

              // Extract the Indication
              const indication =
                groupMembers.find((member) => member.concept_id === 12031)
                  ?.value_text || "No Indication";

              // Extract the Complications
              const complications =
                groupMembers.find((member) => member.concept_id === 6406)
                  ?.value_text || "No Complications";

              return {
                id: parentObs.obs_id.toString(),
                procedure,
                indication,
                date,
                complications,
              };
            })
        );

      setSurgicalHistory(historyRecords);

      //skin assessment
      // Filter encounters with type "DISABILITY-ASSESSMENT"
      const disabilityEncounters = patientEncounters.filter(
        (encounter) =>
          encounter.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
      );

      const groupedSkinAssessment: Record<string, SkinAssessment> = {};

      // Iterate over each encounter and group observations by obs_datetime
      disabilityEncounters.forEach((encounter) => {
        encounter.obs.forEach((obs) => {
          const obsDate = obs.obs_datetime || "No Date";
          const obsId = obs.obs_id.toString();

          if (!groupedSkinAssessment[obsDate]) {
            groupedSkinAssessment[obsDate] = {
              id: obsId,
              temperature: "",
              additionalNotes: "",
              obsDatetime: obsDate,
            };
          }

          if (obs.concept_id === 5088) {
            groupedSkinAssessment[obsDate].temperature = `${
              obs.value_numeric || obs.value
            }°C`;
          }

          if (obs.concept_id === 2592) {
            groupedSkinAssessment[obsDate].additionalNotes =
              obs.value_text || obs.value || "N/A";
          }
        });
      });

      // Convert object values to array and sort by date (latest first)
      const sortedSkinAssessment = Object.values(groupedSkinAssessment).sort(
        (a, b) =>
          new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
      );

      // Take the latest record
      setSkinAssessment(sortedSkinAssessment.slice(0, 1));

      //family history
      // Family history mapping for dynamic conditions
      const familyHistoryRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.FAMILY_MEDICAL_HISTORY // Ensure correct encounter type
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.children?.length > 0) // Check if the observation has children
            .map((parentObs) => {
              const children = parentObs.children || [];

              // Extract the condition (Concept Name)
              const condition =
                children.find((child) => child.names?.[0]?.name)?.names?.[0]
                  ?.name || "Unknown Condition";

              // Extract the relationship
              const relationship =
                children.find((child) => child.concept_id === 11958)?.value ||
                "Unknown Relationship";

              // Extract observation date
              const obsDatetime = parentObs.obs_datetime || "No Date";

              return {
                id: parentObs.obs_id.toString(),
                condition,
                relationship,
                obsDatetime,
              };
            })
        );
      const latestFamilyHistoryRecords = familyHistoryRecords;
      // .sort(
      //   (a, b) =>
      //     new Date(b.obsDatetime).getTime() -
      //     new Date(a.obsDatetime).getTime()
      // )
      // .slice(0, 1); // Get the latest record

      // setAllergies(latestAllergyRecords);

      setFamilyHistory(latestFamilyHistoryRecords);

      //Review of systems
      const reviewOfSystemsRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.SUMMARY_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.group_members?.length > 0) // Parent observations with group members
            .map((parentObs) => {
              const groupMembers = parentObs.group_members || [];

              // Extracting Date of Last Meal
              const dateOfLastMeal =
                groupMembers.find(
                  (member: { concept: string; value: string }) =>
                    member.concept === concepts.DATE_OF_LAST_MEAL
                )?.value || "Unknown";

              // Extracting Events (History of Presenting Complaints)
              const events =
                groupMembers.find(
                  (member: { concept: string; value: string }) =>
                    member.concept === concepts.PRESENTING_HISTORY
                )?.value || "No Events";

              // Extracting General History
              const generalHistory = groupMembers
                .filter((member: { concept: string }) =>
                  [
                    concepts.PAIN,
                    concepts.RASH,
                    concepts.ITCHING,
                    concepts.EAR_DISCHARGE,
                    concepts.RED_EYE,
                    concepts.DIZZINESS,
                    concepts.EXCESSIVE_THIRST,
                    concepts.PAINFUL_EAR,
                    concepts.POOR_VISION,
                    concepts.TOOTHACHE,
                    concepts.RUNNY_NOSE,
                    concepts.NOSE_BLEED,
                    concepts.SWELLING_JOINT,
                    concepts.JOINT_PAIN,
                    concepts.DEFORMITY,
                    concepts.FEVER,
                    concepts.NIGHT_SWEATS,
                    concepts.WEIGHT_LOSS,
                    concepts.HEAT_INTOLERANCE,
                    concepts.COLD_INTOLERANCE,
                    concepts.SWELLING,
                    concepts.FATIGUE,
                    concepts.POISONING,
                    concepts.ULCER_OR_WOUND,
                  ].includes(member.concept)
                )
                .map(
                  (member: {
                    concept: string;
                    value: string;
                    group_members?: any[];
                  }) => {
                    const durationObs = member.group_members?.find(
                      (subMember: { concept: string }) =>
                        [
                          concepts.DURATION_OF_SYMPTOMS_DAYS,
                          concepts.DURATION_OF_SYMPTOMS_WEEKS,
                          concepts.DURATION_OF_SYMPTOMS_MONTHS,
                          concepts.DURATION_OF_SYMPTOMS_YEARS,
                        ].includes(subMember.concept)
                    );

                    const siteObs = member.group_members?.find(
                      (subMember: { concept: string }) =>
                        subMember.concept === concepts.ANATOMIC_LOCATIONS
                    );

                    return {
                      symptom: member.value || "Unknown Symptom",
                      duration: durationObs?.value || "No Duration",
                      durationUnit: durationObs?.concept || "Unknown Unit",
                      site: siteObs?.value || "No Site",
                    };
                  }
                );

              // Extracting Dropdown History
              const dropdownHistory = groupMembers
                .filter((member: { concept: string }) =>
                  [
                    concepts.REVIEW_OF_SYSTEMS_CARDIOPULMONARY,
                    concepts.REVIEW_OF_SYSTEMS_NERVOUS,
                    concepts.REVIEW_OF_SYSTEMS_GENITOURINARY,
                    concepts.REVIEW_OF_SYSTEMS_GASTROINTESTINAL,
                  ].includes(member.concept)
                )
                .map((member: { concept: string; value: string }) => ({
                  category: member.concept,
                  selection: member.value || "No Selection",
                }));

              const obsDatetime = parentObs.obs_datetime || "No Date";

              return {
                id: parentObs.obs_id.toString(),
                dateOfLastMeal,
                events,
                generalHistory,
                dropdownHistory,
                obsDatetime,
              };
            })
        );

      setReviewOfSystems(reviewOfSystemsRecords);

      //Drug history from SAMPLE history
      const drugHistoryRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.name === "PRESCRIPTION")
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.children?.length > 0) // Parent obs with children
            .map((parentObs) => {
              const groupMembers = parentObs.children || [];

              const medicationName =
                groupMembers.find((member) => member.concept_id === 11269)
                  ?.names?.[0]?.name || "Unknown Medication";

              const formulation =
                groupMembers.find((member) =>
                  [11950 /* Example concept ID for FORMULATION */].includes(
                    member.concept_id
                  )
                )?.names?.[0]?.name || "Unknown Formulation";

              const doseObs = groupMembers.find((member) =>
                [3122 /* Example concept ID for DOSE */].includes(
                  member.concept_id
                )
              );
              const dose = doseObs?.value || "No Dose";
              const doseUnit = doseObs?.names?.[0]?.name || "Unknown Dose Unit";

              const frequency =
                groupMembers.find((member) =>
                  [3321 /* Example concept ID for FREQUENCY */].includes(
                    member.concept_id
                  )
                )?.names?.[0]?.name || "Unknown Frequency";

              const durationObs = groupMembers.find((member) =>
                [11946 /* Example concept ID for DURATION */].includes(
                  member.concept_id
                )
              );
              const duration = durationObs?.value || "No Duration";
              const durationUnit =
                durationObs?.names?.[0]?.name || "Unknown Duration Unit";

              const lastTaken =
                groupMembers.find((member) =>
                  [11909 /* Example concept ID for LAST TAKEN */].includes(
                    member.concept_id
                  )
                )?.value_text || "Not Recorded";

              const lastPrescribed =
                groupMembers.find((member) =>
                  [11910 /* Example concept ID for LAST PRESCRIBED */].includes(
                    member.concept_id
                  )
                )?.value_text || "Not Recorded";

              const obsDatetime = parentObs.obs_datetime || "No Date";

              return {
                id: parentObs.obs_id.toString(),
                medicationName,
                formulation,
                dose,
                doseUnit,
                frequency,
                duration,
                durationUnit,
                lastTaken,
                lastPrescribed,
                obsDatetime,
              };
            })
        );

      // setDrugHistory(drugHistoryRecords);

      const latestDrugRecords = drugHistoryRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setDrugHistory(latestDrugRecords);

      // Differential Diagnoses
      const diagnoses = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) => obs.names[0]?.name === concepts.DIFFERENTIAL_DIAGNOSIS
            )
            .map((obs) => ({
              id: obs.obs_id.toString(),
              condition: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by most recent observation date and limit to the latest one
      const latestDiagnoses = diagnoses
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Keep only the latest diagnosis

      setDifferentialDiagnoses(latestDiagnoses);

      // Allergies
      // Allergies
      const allergyRecords = patientEncounters
        .filter(
          (encounter) => encounter.encounter_type.uuid === encounters.ALLERGIES
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) => Array.isArray(obs.children) && obs.children.length > 0
            )
            .map((obs) => {
              // Get the allergy name dynamically
              const allergen =
                obs.children.find((child: any) =>
                  child.names.some((name: any) => name.name.includes("Allergy"))
                )?.names[0]?.name || "Unknown Allergen";

              // Get the allergy comment
              const allergyComment =
                obs.children.find((child: any) =>
                  child.names.some(
                    (name: any) => name.name === "Allergy comment"
                  )
                )?.value_text || "No Comment";

              return {
                id: obs.obs_id.toString(),
                allergen: allergen || "Unknown Allergen",
                comment: allergyComment || "No Comment",
                obsDatetime: obs.obs_datetime || "",
              };
            })
        );

      const latestAllergyRecords = allergyRecords;
      // .sort(
      //   (a, b) =>
      //     new Date(b.obsDatetime).getTime() -
      //     new Date(a.obsDatetime).getTime()
      // )
      // .slice(0, 1); // Get the latest record

      setAllergies(latestAllergyRecords);

      // Neurological Examination
      const neurologicalRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.EXTREMITIES_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.concept_id === 2592) // Correct way to filter Clinician Notes
            .map((obs) => ({
              id: obs.obs_id.toString(),
              notes: obs.value_text || obs.value || "No Notes", // Use value_text for text-based notes
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by latest observation date and select the most recent record
      const latestNeurologicalRecords = neurologicalRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Select the latest record

      setNeurologicalExaminations(latestNeurologicalRecords);

      //Extremities assessment
      const extremitiesRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.EXTREMITIES_ASSESSMENT
        )
        .map((encounter) => {
          const obsMap = new Map<number, string>();

          // Populate the map with observations
          encounter.obs.forEach((obs) => {
            obsMap.set(obs.concept_id, obs.value || "Not Recorded");
          });

          return {
            id: encounter.encounter_id.toString(),
            oedema: obsMap.get(18705) || "Not Recorded",
            oedemaDetails: obsMap.get(18705) || "Not Recorded",
            coldClammy: getYesNo(obsMap.get(11624) || "Not Recorded"),
            abnormalitiesUpperLimb: getYesNo(
              obsMap.get(11625) || "Not Recorded"
            ),
            abnormalitiesLowerLimb: getYesNo(
              obsMap.get(11626) || "Not Recorded"
            ),
            obsDatetime: encounter.encounter_datetime || "No Date",
          };
        });

      // const mapConceptValue = (obs) => {
      //   return obs.value || "Not Recorded";
      // };

      // const extremitiesRecords = patientEncounters
      //   .filter((encounter) => encounter.encounter_type.name === "EXTREMITIES ASSESSMENT")
      //   .flatMap((encounter) =>
      //     encounter.obs.map((obs) => {
      //       return {
      //         id: obs.obs_id.toString(),
      //         oedema: mapConceptValue(obs),
      //         oedemaDetails: mapConceptValue(
      //           encounter.obs.find((o) => o.obs_id === 18705) || {}
      //         ),
      //         coldClammy: getYesNo(
      //           mapConceptValue(encounter.obs.find((o) => o.concept_id === 11624) || {})
      //         ),
      //         abnormalitiesUpperLimb: getYesNo(
      //           mapConceptValue(encounter.obs.find((o) => o.concept_id === 11625) || {})
      //         ),
      //         abnormalitiesLowerLimb: getYesNo(
      //           mapConceptValue(encounter.obs.find((o) => o.concept_id === 11626) || {})
      //         ),
      //         obsDatetime: obs.obs_datetime || "No Date",
      //       };
      //     })
      //   );

      // Sorting and selecting the latest record
      const latestExtremitiesRecords = extremitiesRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1);

      setExtremitiesExaminations(latestExtremitiesRecords);

      // Extract Bedside Assessments
      const bedsideAssessments = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) => obs.names[0]?.uuid === concepts.POINT_OF_CARE_ULTRASOUND
            )
            .map((obs) => ({
              id: obs.obs_id.toString(),
              assessment: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by most recent observation date and limit to the latest one
      const latestAssessments = bedsideAssessments
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Keep only the latest assessment

      setInvestigations(latestAssessments);

      // Find the latest "Triage Result" encounter
      const triageEncounters = patientEncounters.filter(
        (encounter) => encounter.encounter_type.name === "Triage Result"
      );

      // Map encounters to extract relevant observations
      const obsRecords = triageEncounters.flatMap((encounter) => encounter.obs);

      // Create a map for quick access by concept_id
      const obsMap = new Map<number, string>();

      obsRecords.forEach((obs) => {
        obsMap.set(
          obs.concept_id,
          obs.value_text || obs.value || "Not Recorded"
        );
      });

      // Store assessment values
      const assessment = {
        mrdt: obsMap.get(10124) || "Not Recorded", // Concept ID for Point of Care Ultrasound
        pc02: obsMap.get(11701) || "Not Recorded", // Concept ID for Point of Care Ultrasound

        pregnancyTest: obsMap.get(45) || "Not Recorded", // Concept ID for Point of Care Ultrasound

        vdrl: obsMap.get(299) || "Not Recorded", // Concept ID for Point of Care Ultrasound
        hiv: obsMap.get(822) || "Not Recorded", // Concept ID for Point of Care Ultrasound

        pointOfCareUltrasound: obsMap.get(11716) || "Not Recorded", // Concept ID for Point of Care Ultrasound
        ecg: obsMap.get(3403) || "Not Recorded", // Concept ID for ECG
        other: obsMap.get(8) || "Not Recorded", // Concept ID for Other
        obsDatetime: obsRecords.length ? obsRecords[0].obs_datetime : "No Date",
      };

      setBedsideAssessment(assessment);

      // Skin Assessment
      const skinRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.SKIN_RASH ||
                obs.names[0]?.uuid === concepts.ADDITIONAL_NOTES
            )
            .map((obs) => ({
              id: obs.obs_id.toString(),
              observation: obs.value || "No Observation",
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by observation date and select the most recent record
      const latestSkinRecords = skinRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setSkinExaminations(latestSkinRecords);

      // Head & Neck Examinations
      // Filter for HEAD AND NECK ASSESSMENT encounters
      const headAndNeckRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid ===
            encounters.HEAD_AND_NECK_ASSESSMENT
        )
        .flatMap((encounter) => {
          const groupedObservations: Record<string, HeadAndNeckObservation> =
            {};

          encounter.obs.forEach((obs) => {
            const groupId = obs.obs_group_id || obs.obs_id;

            if (!groupedObservations[groupId]) {
              groupedObservations[groupId] = {
                id: groupId.toString(),
                region: "",
                description: "",
                abnormality: "",
                obsDatetime: obs.obs_datetime || "",
              };
            }

            // ✅ Extract Region
            if (obs.names[0]?.name === "Image Part Name") {
              groupedObservations[groupId].region = obs.value || "Unknown";
            }

            // ✅ Extract values from group_members correctly
            if (obs.group_members?.length > 0) {
              obs.group_members.forEach(
                (member: { concept: string; value: string }) => {
                  if (member.concept === "Abnormalities") {
                    groupedObservations[groupId].abnormality =
                      member.value || "None";
                  }
                  if (member.concept === "Description") {
                    groupedObservations[groupId].description =
                      member.value || "None";
                  }
                }
              );
            }
          });

          return Object.values(groupedObservations);
        });

      // ✅ Sort by latest date
      const sortedRecords = headAndNeckRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setHeadAndNeckExaminations(sortedRecords);

      // Chest Assessments
      const chestRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT
        )
        .map((encounter) => {
          const obsMap = new Map<number, string>();

          // Populate the map with observations
          encounter.obs.forEach((obs) => {
            obsMap.set(obs.concept_id, obs.value || "Not Recorded");
          });

          return {
            id: encounter.encounter_id.toString(),
            heartSound: obsMap.get(11570) || "Not Recorded",
            abnormality: obsMap.get(599) || "Not Recorded",
            obsDatetime: encounter.encounter_datetime || "No Date",
          };
        });
      // Sort by date and keep the latest record
      const latestChestRecords = chestRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1);

      setChestAssessments(latestChestRecords);

      // Abdomen and Pelvis Assessments
      const abdomenPelvisRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.ABNORMALITIES_PRESENT ||
                obs.names[0]?.uuid === concepts.TENDERNESS
            ) // Include specific concepts
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value || "No Description",
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by observation date and select the most recent record
      const latestAbdomenPelvisRecords = abdomenPelvisRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setAbdomenPelvisAssessments(latestAbdomenPelvisRecords);

      // Lungs Assessments - (Secondary Assessment)
      const lungsRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT
        )
        .map((encounter) => {
          const obsMap = new Map<number, string>();

          // Populate the map with observations
          encounter.obs.forEach((obs) => {
            obsMap.set(obs.concept_id, obs.value || "Not Recorded");
          });

          return {
            id: encounter.encounter_id.toString(),
            respiratoryRate: obsMap.get(5242) || "Not Recorded",
            chestWallAbnormality: obsMap.get(10832) || "Not Recorded",
            abnormality: obsMap.get(599) || "Not Recorded",
            chestExpansion: obsMap.get(10833) || "Not Recorded",
            tactileFemitus: obsMap.get(11553) || "Not Recorded",
            obsDatetime: encounter.encounter_datetime || "No Date",
          };
        });

      // Sort by the latest observation date and keep only the most recent record
      const latestLungsRecords = lungsRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Select the latest record

      setLungsAssessments(latestLungsRecords);

      // Lungs Assessments - (Primary Assessment)
      const primaryLungsRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.BREATHING_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.RESPIRATORY_RATE) // Include only RESPIRATORY_RATE
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by the latest observation date and keep only the most recent record
      const latestPrimaryLungsRecords = primaryLungsRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Select the latest record

      setPrimaryLungsAssessments(latestPrimaryLungsRecords);

      //Presenting complaints SAMPLE history
      const presentingComplaints = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.PRESENTING_COMPLAINTS
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.concept_id === 2310) // Find parent observations
            .flatMap((parentObs) => {
              // Extract Symptoms (Child Observations under the same parent, EXCLUDE durations)
              const symptomObs = encounter.obs.filter(
                (obs) =>
                  obs.obs_group_id === parentObs.obs_id &&
                  !obs.names?.some((name) =>
                    name.name.includes("Duration of symptom")
                  ) // Exclude duration observations
              );

              return symptomObs.map((symptom) => {
                const complaintName =
                  symptom.names?.[0]?.name || "Unknown Symptom";

                // Look for associated Duration Observation
                const durationObs = encounter.obs.find(
                  (childObs) =>
                    childObs.obs_group_id === parentObs.obs_id &&
                    childObs.names?.some((name) =>
                      name.name.includes("Duration of symptom")
                    )
                );

                // Extract Duration Name & Value
                const durationName =
                  durationObs?.names?.[0]?.name || "Unknown Duration";
                const durationValue =
                  durationObs?.value_numeric ||
                  durationObs?.value ||
                  "No Value";
                const formattedDuration = `${durationName}: ${durationValue}`;

                return {
                  id: symptom.obs_id.toString(),
                  complaint: complaintName,
                  duration: formattedDuration,
                  obsDatetime: symptom.obs_datetime || "",
                };
              });
            })
        );

      // Sort by most recent observation date and limit to the latest one
      const latestPresentingComplaints = presentingComplaints
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Keep only the latest complaint

      setPresentingComplaints(latestPresentingComplaints);

      //End Here
    }
  }, [patientEncounters]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching encounters: {error.message}</Typography>;
  }
  return (
    <TemplateWrapper>
      {/* Surgical Notes Content */}

      {/* 1. Past Presenting Complaint(s) */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Past Presenting Complaint(s)
      </MainTypography>
      <MainGrid container spacing={2} sx={{ background: "white" }}>
        <MainGrid item xs={12}>
          {/* SAMPLE History Subsection */}

          <section style={{ paddingBottom: "16px" }}>
            {presentingComplaints.length > 0 ? (
              <ul
                style={{
                  paddingLeft: "2ch",
                  marginBottom: "16px",
                  listStyleType: "none",
                }}
              >
                {presentingComplaints.map((complaint) => (
                  <li key={complaint.id}>
                    <strong>Symptom:</strong> {complaint.complaint} <br />
                    <strong> {complaint.duration || "No Duration"} </strong>
                    <br />
                    <em>
                      Recorded on:{" "}
                      {new Date(complaint.obsDatetime).toLocaleDateString()}
                    </em>
                  </li>
                ))}
              </ul>
            ) : (
              <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
                No presenting complaints recorded.
              </MainTypography>
            )}
          </section>
        </MainGrid>
      </MainGrid>
      <br />
      {/* 2. Drug History */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Drug History
      </MainTypography>
      <MainGrid container spacing={2} sx={{ background: "white" }}>
        {/* SAMPLE History Subsection */}
        <MainGrid item xs={12}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Medication
          </MainTypography>
          {drugHistory.length > 0 ? (
            <ul
              style={{
                paddingLeft: "2ch",
                marginBottom: "16px",
                listStyleType: "none",
              }}
            >
              {drugHistory.map((drug) => (
                <li key={drug.id} style={{ marginBottom: "8px" }}>
                  <strong>Medication Name:</strong> {drug.medicationName} <br />
                  <strong> Formulation:</strong> {drug.formulation} <br />
                  <strong> {drug.doseUnit}:</strong> {drug.dose} <br />
                  <strong> Frequency:</strong> {drug.frequency} <br />
                  <strong> {drug.durationUnit}:</strong> {drug.duration} <br />
                  <strong> Last Taken:</strong>{" "}
                  {new Date(drug.lastTaken).toLocaleDateString()} |
                  <strong> Last Prescribed:</strong>{" "}
                  {new Date(drug.lastPrescribed).toLocaleDateString()} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(drug.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No drug history recorded.
            </MainTypography>
          )}
        </MainGrid>

        {/* AETC Prescriptions Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Prescriptions
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No Prescriptions recorded.
          </MainTypography>
        </MainGrid>

        {/* AETC Dispensation Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Dispensation
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No Dispensations recorded.
          </MainTypography>
        </MainGrid>
      </MainGrid>

      <br />

      {/* 3. PAST MEDICAL HISTORY */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Past Medical History
      </MainTypography>
      <MainGrid
        container
        spacing={2}
        paddingBottom={"16px"}
        sx={{ background: "white" }}
      >
        {/* HIV Status Subsection */}
        <MainGrid item xs={6}>
          <MainTypography sx={{ pl: 4, mb: 2 }}>
            <strong>HIV Status:</strong> {HIVStatus}
          </MainTypography>
        </MainGrid>
        {/* Past Surgical History */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Past Surgical History
          </MainTypography>
          {surgicalHistory.length > 0 ? (
            <ul
              style={{
                paddingLeft: "2ch",
                marginBottom: "16px",
                listStyleType: "none",
              }}
            >
              {surgicalHistory.map((history) => (
                <li key={history.id} style={{ marginBottom: "8px" }}>
                  <strong>Procedure:</strong> {history.procedure} <br />
                  <strong>Indication:</strong> {history.indication} <br />
                  <strong>Date of Surgery:</strong>{" "}
                  {new Date(history.date).toLocaleDateString()} <br />
                  <strong>Complications:</strong> {history.complications}
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
              No past surgical history recorded.
            </MainTypography>
          )}
        </MainGrid>

        {/* Allergy Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Allergy
          </MainTypography>
          {allergies.length > 0 ? (
            <ul
              style={{
                paddingLeft: "2ch",
                marginBottom: "16px",
                listStyleType: "none",
              }}
            >
              {allergies.map((allergy) => (
                <li key={allergy.id} style={{ marginBottom: "8px" }}>
                  <strong>Allergy Name:</strong> {allergy.allergen} <br />
                  <strong>Allergy Details:</strong> {allergy.comment} |
                  <em>
                    Recorded on:{" "}
                    {new Date(allergy.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
              No allergies recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Family History Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Family History
          </MainTypography>
          {familyHistory.length > 0 ? (
            <ul
              style={{
                paddingLeft: "2ch",
                marginBottom: "16px",
                listStyleType: "none",
              }}
            >
              {familyHistory.map((history) => (
                <li key={history.id} style={{ marginBottom: "8px" }}>
                  <strong>Condition:</strong> {history.condition} <br />
                  <strong>Relationship:</strong> {history.relationship} |
                  <em>
                    Recorded on:{" "}
                    {new Date(history.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
              No family history recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Social History Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Social History
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No Social History recorded.
          </MainTypography>
        </MainGrid>

        {/* Review of Systems Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Review of Systems
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No review of systems recorded.
          </MainTypography>
        </MainGrid>
        {/* Vital Signs Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Vital Signs (Triage)
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No vital signs recorded.
          </MainTypography>
        </MainGrid>
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Vital Signs (Monitoring Chart)
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
            No vital signs recorded.
          </MainTypography>
        </MainGrid>
      </MainGrid>
      <br />

      {/* 4. Body System Assessments */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Body System Assessments
      </MainTypography>
      <MainGrid
        container
        spacing={2}
        paddingBottom={"16px"}
        sx={{ background: "white" }}
      >
        {/* Head and Neck Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Head & Neck Assessment
          </MainTypography>
          {headAndNeckExaminations.length > 0 ? (
            <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
              {headAndNeckExaminations.map((exam) => (
                <li key={exam.id}>
                  <strong>Region:</strong> {exam.region} <br />
                  <strong>Description:</strong> {exam.description} <br />
                  <strong>Abnormality:</strong> {exam.abnormality} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No head and neck observations recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Chest Assessment */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Chest Assessment
          </MainTypography>
          {chestAssessments.length > 0 ? (
            <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
              {chestAssessments.map((exam) => (
                <li key={exam.id}>
                  <strong>Heart Sounds:</strong> {exam.heartSound} <br />
                  <strong>Abnormality:</strong> {exam.abnormality} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No chest observations recorded.
            </MainTypography>
          )}
        </MainGrid>

        {/* Primary Lung Assesment */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Primary Lung Assessment
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
            No lung assessment observations recorded.
          </MainTypography>
        </MainGrid>
        {/* Secondary Lung Assessment */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Secondary Lung Assessment{" "}
          </MainTypography>

          {lungsAssessments.length > 0 ? (
            <ul
              style={{
                paddingLeft: "2ch",
                marginBottom: "16px",
                listStyleType: "none",
              }}
            >
              {lungsAssessments.map((exam) => (
                <li key={exam.id} style={{ marginBottom: "8px" }}>
                  <strong>Respiratory Rate:</strong> {exam.respiratoryRate}{" "}
                  <br />
                  <strong>Chest Wall Abnormality:</strong>{" "}
                  {exam.chestWallAbnormality} <br />
                  <strong>Abnormality:</strong> {exam.abnormality} <br />
                  <strong>Chest Expansion:</strong> {exam.chestExpansion} <br />
                  <strong>Tactile Fremitus:</strong> {exam.tactileFemitus}{" "}
                  <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
              No lung assessment observations recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Abdomen Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Abdomen Assessment
          </MainTypography>
          {abdomenPelvisAssessments.length > 0 ? (
            <ul>
              {abdomenPelvisAssessments.map((assessment) => (
                <li key={assessment.id}>
                  {assessment.description} -{" "}
                  {new Date(assessment.obsDatetime).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No abdomen and pelvis observations recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Extremities Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Extremities Assessment
          </MainTypography>
          {extremitiesExaminations.length > 0 ? (
            extremitiesExaminations.map((exam) => (
              <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
                <li key={exam.id}>
                  {/* <strong>Oedema:</strong> {exam.oedema} */}
                  <strong>Oedema Details:</strong> {exam.oedemaDetails}
                  <br />
                  <strong>Cold Clammy:</strong> {exam.coldClammy} <br />
                  <strong>Abnormalities Upper Limb:</strong>{" "}
                  {exam.abnormalitiesUpperLimb} <br />
                  <strong>Abnormalities Lower Limb:</strong>{" "}
                  {exam.abnormalitiesLowerLimb} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              </ul>
            ))
          ) : (
            <MainTypography sx={{ fontStyle: "italic" }}>
              No extremities observations recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Skin Assessment Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Skin Assessment
          </MainTypography>
          {skinAssessment.length > 0 ? (
            <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
              {skinAssessment.map((assessment) => (
                <li key={assessment.id}>
                  <strong>Temperature:</strong>{" "}
                  {assessment.temperature || "N/A"} <br />
                  <strong>Additional Notes:</strong>{" "}
                  {assessment.additionalNotes || "N/A"} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(assessment.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No skin assessment recorded.
            </MainTypography>
          )}
        </MainGrid>
        {/* Neurological Assessment Section */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Neurological Examination
          </MainTypography>
          {neurologicalExaminations.length > 0 ? (
            <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
              {neurologicalExaminations.map((exam) => (
                <li key={exam.id}>
                  <strong>Notes:</strong> {exam.notes || "N/A"} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No neurological observations recorded.
            </MainTypography>
          )}
        </MainGrid>
      </MainGrid>
      <br />
      {/* 5. Differential Diagnosis Sections */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Differential Diagnosis
      </MainTypography>
      <MainGrid
        container
        spacing={2}
        paddingBottom={"16px"}
        sx={{ background: "white" }}
      >
        {/* Differential Diagnosis Subsection */}
        <MainGrid item xs={12}>
          {differentialDiagnoses.length > 0 ? (
            <ul style={{ paddingLeft: "2ch", listStyleType: "none" }}>
              {differentialDiagnoses.map((diagnosis) => (
                <li key={diagnosis.id}>
                  <strong>Condition:</strong> {diagnosis.condition} <br />
                  <em>
                    Recorded on:{" "}
                    {new Date(diagnosis.obsDatetime).toLocaleDateString()}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No differential diagnosis observations added.
            </MainTypography>
          )}
        </MainGrid>
      </MainGrid>
      <br />

      {/* 6. Investigation Sections */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Investigation
      </MainTypography>
      <MainGrid
        container
        spacing={2}
        paddingBottom={"16px"}
        sx={{ background: "white" }}
      >
        {/* Bedside Subsection */}
        {/* Bedside Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Bedside Assessment
          </MainTypography>
          {bedsideAssessment ? (
            <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
              <p>
                <strong>MRDT:</strong> {bedsideAssessment.mrdt}
              </p>
              <p>
                <strong>PC02:</strong> {bedsideAssessment.pc02}
              </p>

              <p>
                <strong>Pregnancy Test:</strong>{" "}
                {bedsideAssessment.pregnancyTest}
              </p>

              <p>
                <strong>VDRL:</strong> {bedsideAssessment.vdrl}
              </p>
              <p>
                <strong>HIV:</strong> {bedsideAssessment.hiv}
              </p>

              <p>
                <strong>Point of Care Ultrasound:</strong>{" "}
                {bedsideAssessment.pointOfCareUltrasound}
              </p>
              <p>
                <strong>ECG:</strong> {bedsideAssessment.ecg}
              </p>
              <p>
                <strong>Other:</strong> {bedsideAssessment.other}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(bedsideAssessment.obsDatetime).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
              No bedside assessment observations recorded.
            </MainTypography>
          )}
        </MainGrid>

        {/* Lab order Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Lab Order Assessment
          </MainTypography>
          <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
            No lab Order observations recorded.
          </MainTypography>
        </MainGrid>
      </MainGrid>
      <br />

      {/* 7. Management Plan Sections */}
      <MainTypography
        sx={{ fontWeight: "bold", color: "green", fontSize: "20px" }}
      >
        Management Plan
      </MainTypography>
      <MainGrid
        container
        spacing={2}
        paddingBottom={"16px"}
        sx={{ background: "white" }}
      >
        {/* Prescription Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Prescription
          </MainTypography>

          <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
            No Prescription observations added.
          </MainTypography>
        </MainGrid>

        {/* Monitoring Chart Subsection */}
        <MainGrid item xs={6}>
          <MainTypography
            sx={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Monitoring Chart
          </MainTypography>

          <MainTypography sx={{ pl: 4, fontStyle: "italic" }}>
            No Monitoring chart observations added.
          </MainTypography>
        </MainGrid>
      </MainGrid>
    </TemplateWrapper>
  );
}

export default SurgicalNotesTemplate;
