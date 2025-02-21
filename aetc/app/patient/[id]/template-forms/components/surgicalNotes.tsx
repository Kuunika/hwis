"use client";

import React, { useEffect, useState, useRef } from "react";
import { MainGrid, MainPaper, BackButton, } from "@/components";
import { Typography, Button } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters, concepts } from "@/constants";
import { useReactToPrint } from "react-to-print";  // Import react-to-print



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
  id: string;
  description: string;
  obsDatetime: string;
}
interface ChestObservation {
  id: string;
  status: string; // Normal or Abnormal
  description?: string; // For abnormal cases
  obsDatetime: string;
}


interface AbdomenPelvisObservation {
  id: string;
  description: string;
  obsDatetime: string;
}
interface LungsObservation {
  id: string;
  description: string;
  obsDatetime: string;
}

interface PrimaryLungsObservation {
  id: string;
  description: string;
  obsDatetime: string;
}

interface DeathObservation {
  id: string;
  concept: string;
  value: string;
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
  partOfBody: string;
  abnormality: string;
  obsDatetime: string;
}

// Interface for Investigation (Bedside Assessment)
interface Investigation {
  id: string;
  assessment: string;
  obsDatetime: string;
}




function SurgicalNotesTemplate() {
  const { params } = useParameters();
  const printRef = useRef(null); // Reference for printing

  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<Diagnosis[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [neurologicalExaminations, setNeurologicalExaminations] = useState<NeurologicalObservation[]>([]);
  const [extremitiesExaminations, setExtremitiesExaminations] = useState<ExtremitiesObservation[]>([]);
  const [skinExaminations, setSkinExaminations] = useState<SkinObservation[]>([]);
  const [headAndNeckExaminations, setHeadAndNeckExaminations] = useState<HeadAndNeckObservation[]>([]);
  const [chestAssessments, setChestAssessments] = useState<ChestObservation[]>([]);
  const [abdomenPelvisAssessments, setAbdomenPelvisAssessments] = useState<AbdomenPelvisObservation[]>([]);
  const [lungsAssessments, setLungsAssessments] = useState<LungsObservation[]>([]);
  const [primaryLungsAssessments, setPrimaryLungsAssessments] = useState<PrimaryLungsObservation[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);



  const [presentingComplaints, setPresentingComplaints] = useState<PresentingComplaint[]>([]);
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



  const { data: patientEncounters, isLoading, error } = getPatientsEncounters(params.id as string);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Surgical Notes",
  });


  const handlePrintToPDF = () => {
    console.log("Implement PDF export functionality here.");
  };
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
          obs.names.some((name) => name.name === "Acquired immunodeficiency syndrome")
        )
      );

      setHIVStatus(isHIVPositive ? "Positive" : "Negative");


      //past surgical history

      // Extract past surgical history
      const historyRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.SURGICAL_HISTORY)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.children?.length > 0) // Check parent observations
            .map((parentObs) => {
              const groupMembers = parentObs.children || [];

              // Extract the Date of Surgery from parent observation
              const date = parentObs.value_datetime ? new Date(parentObs.value_datetime).toLocaleDateString() : "No Date";

              // Extract the Procedure
              const procedure = groupMembers.find((member) => member.concept_id === 11884)?.names?.[0]?.name || "No Procedure";

              // Extract the Indication
              const indication = groupMembers.find((member) => member.concept_id === 12031)?.value_text || "No Indication";

              // Extract the Complications
              const complications = groupMembers.find((member) => member.concept_id === 6406)?.value_text || "No Complications";

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
        (encounter) => encounter.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
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
            groupedSkinAssessment[obsDate].temperature = `${obs.value_numeric || obs.value}°C`;
          }

          if (obs.concept_id === 2592) {
            groupedSkinAssessment[obsDate].additionalNotes = obs.value_text || obs.value || "N/A";
          }
        });
      });

      // Convert object values to array and sort by date (latest first)
      const sortedSkinAssessment = Object.values(groupedSkinAssessment).sort(
        (a, b) => new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
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
      const latestFamilyHistoryRecords = familyHistoryRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

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
              const dateOfLastMeal = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === concepts.DATE_OF_LAST_MEAL
              )?.value || "Unknown";

              // Extracting Events (History of Presenting Complaints)
              const events = groupMembers.find(
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
                .map((member: { concept: string; value: string; group_members?: any[] }) => {
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
                });

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
                groupMembers.find((member) => member.concept_id === 11269)?.names?.[0]?.name || "Unknown Medication";

              const formulation =
                groupMembers.find((member) =>
                  [11950 /* Example concept ID for FORMULATION */].includes(member.concept_id)
                )?.names?.[0]?.name || "Unknown Formulation";

              const doseObs = groupMembers.find((member) =>
                [3122 /* Example concept ID for DOSE */].includes(member.concept_id)
              );
              const dose = doseObs?.value || "No Dose";
              const doseUnit = doseObs?.names?.[0]?.name || "Unknown Dose Unit";

              const frequency =
                groupMembers.find((member) =>
                  [3321 /* Example concept ID for FREQUENCY */].includes(member.concept_id)
                )?.names?.[0]?.name || "Unknown Frequency";

              const durationObs = groupMembers.find((member) =>
                [11946 /* Example concept ID for DURATION */].includes(member.concept_id)
              );
              const duration = durationObs?.value || "No Duration";
              const durationUnit = durationObs?.names?.[0]?.name || "Unknown Duration Unit";

              const lastTaken =
                groupMembers.find((member) =>
                  [11909 /* Example concept ID for LAST TAKEN */].includes(member.concept_id)
                )?.value_text || "Not Recorded";

              const lastPrescribed =
                groupMembers.find((member) =>
                  [11910 /* Example concept ID for LAST PRESCRIBED */].includes(member.concept_id)
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
            .filter((obs) => obs.names[0]?.uuid === concepts.DIFFERENTIAL_DIAGNOSIS)
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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Keep only the latest diagnosis

      setDifferentialDiagnoses(latestDiagnoses);

      // Allergies
      // Allergies
      const allergyRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.ALLERGIES
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => Array.isArray(obs.children) && obs.children.length > 0)
            .map((obs) => {
              // Get the allergy name dynamically
              const allergen = obs.children.find((child: any) =>
                child.names.some((name: any) => name.name.includes("Allergy"))
              )?.names[0]?.name || "Unknown Allergen";

              // Get the allergy comment
              const allergyComment = obs.children.find((child: any) =>
                child.names.some((name: any) => name.name === "Allergy comment")
              )?.value_text || "No Comment";

              return {
                id: obs.obs_id.toString(),
                allergen: allergen || "Unknown Allergen",
                comment: allergyComment || "No Comment",
                obsDatetime: obs.obs_datetime || "",
              };
            })
        );

      const latestAllergyRecords = allergyRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() -
            new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Select the latest record

      setNeurologicalExaminations(latestNeurologicalRecords);

      // Extremities Assessment
      const extremitiesRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.EXTREMITIES_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.OEDEMA ||
                obs.names[0]?.uuid === concepts.OEDEMA_DETAILS ||
                obs.names[0]?.uuid === concepts.COLD_CLAMMY ||
                obs.names[0]?.uuid === concepts.ABNORMALITIES_UPPER_LIMB ||
                obs.names[0]?.uuid === concepts.ABNORMALITIES_LOWER_LIMB
            )
        )
        .reduce((acc, obs) => {
          const obsId = obs.obs_id.toString();
          const obsDatetime = obs.obs_datetime || "";

          const existingRecord = acc.find((record) => record.id === obsId);

          if (existingRecord) {
            // Update existing record with the correct observation field
            if (obs.names[0]?.uuid === concepts.OEDEMA) {
              existingRecord.oedema = obs.value_text || "";
            }
            if (obs.names[0]?.uuid === concepts.OEDEMA_DETAILS) {
              existingRecord.oedemaDetails = obs.value_text || "";
            }
            if (obs.names[0]?.uuid === concepts.COLD_CLAMMY) {
              existingRecord.coldClammy = obs.value_text || "";
            }
            if (obs.names[0]?.uuid === concepts.ABNORMALITIES_UPPER_LIMB) {
              existingRecord.abnormalitiesUpperLimb = obs.value_text || "";
            }
            if (obs.names[0]?.uuid === concepts.ABNORMALITIES_LOWER_LIMB) {
              existingRecord.abnormalitiesLowerLimb = obs.value_text || "";
            }
          } else {
            // Create a new record
            acc.push({
              id: obsId,
              oedema: obs.names[0]?.uuid === concepts.OEDEMA ? obs.value_text || "" : "",
              oedemaDetails:
                obs.names[0]?.uuid === concepts.OEDEMA_DETAILS ? obs.value_text || "" : "",
              coldClammy:
                obs.names[0]?.uuid === concepts.COLD_CLAMMY ? obs.value_text || "" : "",
              abnormalitiesUpperLimb:
                obs.names[0]?.uuid === concepts.ABNORMALITIES_UPPER_LIMB ? obs.value_text || "" : "",
              abnormalitiesLowerLimb:
                obs.names[0]?.uuid === concepts.ABNORMALITIES_LOWER_LIMB ? obs.value_text || "" : "",
              obsDatetime,
            });
          }
          return acc;
        }, [] as ExtremitiesObservation[]);

      // Sort by latest observation date and get the most recent one
      const latestExtremitiesRecords = extremitiesRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Keep only the latest assessment

      setInvestigations(latestAssessments);



      //  // Ensure the data is stored as an array
      //  const latestExtremitiesRecords = [...extremitiesRecords].sort(
      //    (a, b) =>
      //      new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
      //  );

      //  setExtremitiesExaminations(latestExtremitiesRecords);

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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setSkinExaminations(latestSkinRecords);

      // Head & Neck Examinations
      // Filter for HEAD AND NECK ASSESSMENT encounters
      const headAndNeckRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.HEAD_AND_NECK_ASSESSMENT
        )
        .flatMap((encounter) => {
          const groupedObservations: Record<string, HeadAndNeckObservation> = {};

          encounter.obs.forEach((obs) => {
            const groupId = obs.obs_group_id || obs.obs_id; // Use obs_id if obs_group_id is null

            if (!groupedObservations[groupId]) {
              groupedObservations[groupId] = {
                id: groupId.toString(),
                region: "",
                partOfBody: "",
                abnormality: "",
                obsDatetime: obs.obs_datetime || "",
              };
            }

            // Identify the type of observation
            if (obs.names[0]?.name === "Image Part Name") {
              if (!obs.obs_group_id) {
                // If obs_group_id is null, it's a region
                groupedObservations[groupId].region = obs.value || "Unknown";
              } else {
                // Otherwise, it's a part of the body
                groupedObservations[groupId].partOfBody = obs.value || "Unknown";
              }
            }
            else if (obs.names[0]?.name === "Abnormalities") {
              groupedObservations[groupId].abnormality =
                abnormalityMap[obs.value] || obs.value || "None";
            }

            // Check if this observation has children (abnormalities)
            if (obs.children?.length > 0) {
              groupedObservations[groupId].abnormality = obs.children
                .map((child) => child.value)
                .join(", ");
            }
          });


          return Object.values(groupedObservations);
        });

      // Sort by latest observation date
      const sortedRecords = headAndNeckRecords.sort(
        (a, b) =>
          new Date(b.obsDatetime).getTime() -
          new Date(a.obsDatetime).getTime()
      )
        .slice(0, 1); // Get the latest record

      setHeadAndNeckExaminations(sortedRecords);

      // Chest Assessments
      // Extract Chest Assessments
      const chestRecords = patientEncounters
        .filter(
          (encounter) => encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT
        )
        .flatMap((encounter) => {
          const observations = encounter.obs;

          // Find the Heart Sounds observation
          const heartSoundsObs = observations.find(
            (obs) => obs.names[0]?.name === "Heart sounds"
          );

          if (!heartSoundsObs) return [];

          // Determine the status based on the coded value
          const status =
            heartSoundsObs.value === concepts.NORMAL
              ? "Normal"
              : heartSoundsObs.value === concepts.ABNORMAL
                ? "Abnormal"
                : "Unknown";

          // Find the Abnormal Description (only if status is Abnormal)
          let description;
          if (status === "Abnormal") {
            const abnormalObs = observations.find(
              (obs) =>
                [
                  concepts.LOUD_P2,
                  concepts.SPLITTING_P2,
                  concepts.GALLOP_RHYTHM,
                  concepts.MURMUR,
                  concepts.OTHER,
                ].includes(obs.value)
            );

            description = abnormalObs ? abnormalObs.names?.[0]?.name : "No Description";
          }

          return [
            {
              id: heartSoundsObs.obs_id.toString(),
              status,
              description,
              obsDatetime: heartSoundsObs.obs_datetime || "",
            },
          ];
        });

      // Sort by date and keep the latest record
      const latestChestRecords = chestRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setAbdomenPelvisAssessments(latestAbdomenPelvisRecords);

      // Lungs Assessments - (Secondary Assessment)
      const lungsRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.RESPIRATORY_RATE ||
                obs.names[0]?.uuid === concepts.BREATHING_SOUNDS
            )
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by the latest observation date and keep only the most recent record
      const latestLungsRecords = lungsRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
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
            .filter(
              (obs) => obs.names[0]?.uuid === concepts.RESPIRATORY_RATE
            ) // Include only RESPIRATORY_RATE
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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
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
                const complaintName = symptom.names?.[0]?.name || "Unknown Symptom";

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
                  durationObs?.value_numeric || durationObs?.value || "No Value";
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
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
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


    <>
      <section style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print to PDF
        </Button>
      </section>


      <div ref={printRef}> {/* Wrap content inside ref for printing */}

        <MainGrid container spacing={2}>
          {/* Print to PDF */}
          {/* <section style={{ width: "100%", display: "flex", justifyContent: "flex-end", }}>
        <Button variant="contained" color="primary" onClick={handlePrintToPDF}>
          Print to PDF
        </Button>
      </section> */}
          <MainGrid item xs={12}>
            <MainPaper>
              {/* <Typography variant="h4">Surgical Notes</Typography>
          <br /> */}

              {/* 1. Past Presenting Complaint(s) */}
              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Past Presenting Complaint(s)
                </Typography>

                {/* Triage Subsection */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mb: 1 }}>
                  Triage
                </Typography>

                {/* SAMPLE History Subsection */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  SAMPLE History
                </Typography>
                <section>
                  {presentingComplaints.length > 0 ? (
                    <ul style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                      {presentingComplaints.map((complaint) => (
                        <li key={complaint.id}>
                          <strong>Symptom:</strong> {complaint.complaint} <br />
                          <strong> {complaint.duration || "No Duration"} </strong><br />
                          <strong>Date:</strong> {new Date(complaint.obsDatetime).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography sx={{ pl: 4, fontStyle: "italic" }}>No presenting complaints recorded.</Typography>
                  )}
                </section>
              </section>



              {/* 2. Drug History */}
              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Drug History
                </Typography>

                {/* SAMPLE History Subsection */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mb: 1 }}>
                  SAMPLE History
                </Typography>
                {drugHistory.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                    {drugHistory.map((drug) => (
                      <li key={drug.id} style={{ marginBottom: "8px" }}>
                        <strong>Medication Name:</strong> {drug.medicationName}  <br />
                        <strong> Formulation:</strong> {drug.formulation}  <br />
                        <strong> {drug.doseUnit}:</strong> {drug.dose}  <br />
                        <strong> Frequency:</strong> {drug.frequency}  <br />
                        <strong>  {drug.durationUnit}:</strong> {drug.duration}  <br />
                        <strong> Last Taken:</strong> {drug.lastTaken} |
                        <strong> Last Prescribed:</strong> {drug.lastPrescribed}  <br />
                        <strong> Date:</strong> {new Date(drug.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No drug history recorded.</Typography>
                )}

                {/* AETC Prescriptions Subsection */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  AETC Prescriptions
                </Typography>
                <Typography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>
                  No Prescriptions recorded.</Typography>

                {/* AETC Dispensation Subsection */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  AETC Dispensation
                </Typography>
                <Typography sx={{ pl: 4 }}>No Dispensations recorded.</Typography>
              </section>

              <br />


              {/* 3. PAST MEDICAL HISTORY */}
              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Past Medical History
                </Typography>

                {/* HIV Status Subsection */}
                <Typography sx={{ pl: 4, mb: 2 }}>
                  <strong>HIV Status:</strong> {HIVStatus}
                </Typography>

                {/* Past Surgical History */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mb: 1 }}>
                  Past Surgical History
                </Typography>
                {surgicalHistory.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                    {surgicalHistory.map((history) => (
                      <li key={history.id} style={{ marginBottom: "8px" }}>
                        <strong>Procedure:</strong> {history.procedure} <br />
                        <strong>Indication:</strong> {history.indication} <br />
                        <strong>Date of Surgery:</strong> {new Date(history.date).toLocaleDateString()} <br />
                        <strong>Complications:</strong> {history.complications}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>No past surgical history recorded.</Typography>
                )}

                {/* Allergy Section */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Allergy
                </Typography>
                {allergies.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                    {allergies.map((allergy) => (
                      <li key={allergy.id} style={{ marginBottom: "8px" }}>
                        <strong>Allergy Name:</strong> {allergy.allergen} <br />
                        <strong>Allergy Details:</strong> {allergy.comment} <br />
                        <strong>Date:</strong> {new Date(allergy.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>No allergies recorded.</Typography>
                )}

                {/* Social History */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Social History
                </Typography>
                <Typography sx={{ pl: 4, mb: 2 }}>Social history details here.</Typography>

                {/* Family History */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Family History
                </Typography>
                {familyHistory.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                    {familyHistory.map((history) => (
                      <li key={history.id} style={{ marginBottom: "8px" }}>
                        <strong>Condition:</strong> {history.condition} <br />
                        <strong>Relationship:</strong> {history.relationship} <br />
                        <strong>Date:</strong> {new Date(history.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>No family history recorded.</Typography>
                )}

                {/* Review of Systems */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Review of Systems
                </Typography>
                {reviewOfSystems.length > 0 ? (
                  reviewOfSystems.map((ros) => (
                    <div key={ros.id} style={{ paddingLeft: "2ch", marginBottom: "16px" }}>
                      <Typography>
                        <strong>Date of Last Meal:</strong> {ros.dateOfLastMeal}
                      </Typography>
                      <Typography>
                        <strong>Events:</strong> {ros.events}
                      </Typography>

                      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>General History:</Typography>
                      <ul>
                        {ros.generalHistory.map((history) => (
                          <li key={history.id}>
                            {history.symptom} - {history.duration} {history.durationUnit}{" "}
                            {history.site && `(Site: ${history.site})`} on{" "}
                            {new Date(history.obsDatetime).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>

                      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>Specific History:</Typography>
                      <ul>
                        {ros.dropdownHistory.map((dropdown) => (
                          <li key={dropdown.id}>
                            {dropdown.category}: {dropdown.selection} on{" "}
                            {new Date(dropdown.obsDatetime).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic", mb: 2 }}>No review of systems recorded.</Typography>
                )}

                {/* Vital Signs */}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Vital Signs
                </Typography>
                <Typography sx={{ pl: 4 }}>-- Triage and Monitoring Chart Data</Typography>
              </section>

              <br />

              {/* Body System Assessments */}
              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Body System Assessments</Typography>

                <Typography
                  variant="h6"
                  sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mb: 1 }}
                >
                  Head & Neck Assessment
                </Typography>
                {headAndNeckExaminations.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {headAndNeckExaminations.map((exam) => (
                      <li key={exam.id}>
                        <strong>Region:</strong> {exam.region} {" "}  <br />
                        <strong>Part:</strong> {exam.partOfBody} {" "}  <br />
                        <strong>Abnormality:</strong> {exam.abnormality} {" "}  <br />
                        <strong>Date:</strong> {new Date(exam.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No head and neck observations recorded.
                  </Typography>
                )}
                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Chest (Secondary Assessment)
                </Typography>
                {chestAssessments.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {chestAssessments.map((exam) => (
                      <li key={exam.id}>
                        <strong>Status:</strong> {exam.status} <br />
                        {exam.status === "Abnormal" && (
                          <>
                            <strong>Description:</strong> {exam.description} <br />
                          </>
                        )}
                        <strong>Date:</strong> {new Date(exam.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No chest observations recorded.</Typography>
                )}

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Lungs
                </Typography>
                {/* <Typography sx={{ pl: 4, mb: 2 }}>
              Primary Assessment</Typography> */}
                {/* {primaryLungsAssessments.length > 0 ? (
              <ul style={{ paddingLeft: "2ch" }}>
                {primaryLungsAssessments.map((exam) => (
                  <li key={exam.id}>
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : ( */}
                <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                  No  primary lungs assessment observations recorded.</Typography>
                {/* )} */}

                {/* <Typography sx={{ pl: 4, mb: 2 }}>
              Secondary Assessment</Typography> */}
                {/* {lungsAssessments.length > 0 ? (
              <ul style={{ paddingLeft: "2ch" }}>
                {lungsAssessments.map((exam) => (
                  <li key={exam.id}>
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : ( */}
                <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                  No secondary lungs assessment observations recorded.</Typography>
                {/* )} */}

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Abdomen (Secondary Assessment)
                </Typography>
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
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No abdomen and pelvis observations recorded.</Typography>
                )}

                <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Extremities Assessment
                </Typography>

                {extremitiesExaminations.length > 0 ? (
                  extremitiesExaminations.map((exam) => (
                    <ul style={{ paddingLeft: "2ch" }}>

                      <li key={exam.id}>
                        <strong>Oedema:</strong> {exam.oedema}
                        {exam.oedema === "Yes" && <p><strong>Oedema Details:</strong> {exam.oedemaDetails}</p>} <br />
                        <strong>Cold Clammy:</strong> {exam.coldClammy} <br />
                        <strong>Abnormalities Upper Limb:</strong> {exam.abnormalitiesUpperLimb} <br />
                        <strong>Abnormalities Lower Limb:</strong> {exam.abnormalitiesLowerLimb} <br />
                        <em>Recorded on: {new Date(exam.obsDatetime).toLocaleDateString()}</em>
                      </li>
                    </ul>
                  ))
                ) : (
                  <Typography sx={{ fontStyle: "italic" }}>No extremities observations recorded.</Typography>
                )}

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Skin Assessment
                </Typography>
                {skinAssessment.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {skinAssessment.map((assessment) => (
                      <li key={assessment.id}>
                        <strong>Temperature:</strong> {assessment.temperature || "N/A"} <br />
                        <strong>Additional Notes:</strong> {assessment.additionalNotes || "N/A"} <br />
                        <strong>Date:</strong> {new Date(assessment.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No skin assessment recorded.</Typography>
                )}

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Neurological Examination
                </Typography>
                {neurologicalExaminations.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {neurologicalExaminations.map((exam) => (
                      <li key={exam.id}>
                        <strong>Notes:</strong> {exam.notes || "N/A"} <br />
                        <strong>Date:</strong> {new Date(exam.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No neurological observations recorded.</Typography>
                )}

              </section>

              {/* Differential Diagnosis Sections */}
              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Differential Diagnosis</Typography>
                {differentialDiagnoses.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {differentialDiagnoses.map((diagnosis) => (
                      <li key={diagnosis.id}>
                        <strong>Condition:</strong> {diagnosis.condition} <br />
                        <strong>Date:</strong> {new Date(diagnosis.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No differential diagnosis observations added.</Typography>
                )}
              </section>


              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Investigation (Bedside Assessment)
                </Typography>

                {investigations.length > 0 ? (
                  <ul style={{ paddingLeft: "2ch" }}>
                    {investigations.map((investigation) => (
                      <li key={investigation.id}>
                        <strong>Assessment:</strong> {investigation.assessment} <br />
                        <strong>Date:</strong>{" "}
                        {new Date(investigation.obsDatetime).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                    No bedside assessment observations added.
                  </Typography>
                )}
              </section>

              <section style={{ paddingBottom: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Management Plan</Typography>

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Prescription
                </Typography>
                <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                  No Prescription observations added.</Typography>

                <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold", textDecoration: "underline", mt: 2 }}>
                  Monitoring Chart
                </Typography>
                <Typography sx={{ pl: 4, fontStyle: "italic" }}>
                  No Monitoring chart observations added.</Typography>
              </section>

              {/* Print to PDF */}
              {/* <section style={{ marginTop: "2rem" }}>
            <Button variant="contained" color="primary" onClick={handlePrintToPDF}>
              Print to PDF
            </Button>
          </section> */}


            </MainPaper>
          </MainGrid>
        </MainGrid>
      </div>
    </>
  );
}

export default SurgicalNotesTemplate;
