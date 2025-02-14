"use client";

import React, { useEffect, useState } from "react";
import { MainGrid, MainPaper } from "@/components";
import { Typography, Button } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { encounters, concepts } from "@/constants";

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
  finding: string;
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




function SurgicalNotesTemplate() {
  const { params } = useParameters();
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<Diagnosis[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [neurologicalExaminations, setNeurologicalExaminations] = useState<NeurologicalObservation[]>([]);
  const [extremitiesExaminations, setExtremitiesExaminations] = useState<ExtremitiesObservation[]>([]);
  const [skinExaminations, setSkinExaminations] = useState<SkinObservation[]>([]);
  const [headAndNeckExaminations, setHeadAndNeckExaminations] = useState<Observation[]>([]);
  const [chestAssessments, setChestAssessments] = useState<ChestObservation[]>([]);
  const [abdomenPelvisAssessments, setAbdomenPelvisAssessments] = useState<AbdomenPelvisObservation[]>([]);
  const [lungsAssessments, setLungsAssessments] = useState<LungsObservation[]>([]);
  const [primaryLungsAssessments, setPrimaryLungsAssessments] = useState<PrimaryLungsObservation[]>([]);

  const [deathObservations, setDeathObservations] = useState<DeathObservation[]>([]);

  const [presentingComplaints, setPresentingComplaints] = useState<PresentingComplaint[]>([]);
  // const [triageComplaints, setTriageComplaints] = useState<TriageComplaint[]>([]);

  const [HIVStatus, setHIVStatus] = useState("Unknown");
  const [surgicalHistory, setSurgicalHistory] = useState<SurgicalHistory[]>([]);
  const [familyHistory, setFamilyHistory] = useState<FamilyHistory[]>([]);
  const [reviewOfSystems, setReviewOfSystems] = useState<ReviewOfSystem[]>([]);
  const [drugHistory, setDrugHistory] = useState<DrugHistory[]>([]);
  const [skinAssessment, setSkinAssessment] = useState<SkinAssessment[]>([]);


  const { data: patientEncounters, isLoading, error } = getPatientsEncounters(params.id as string);


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

      const historyRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.SURGICAL_HISTORY
          // "ba063e50-8d80-11d8-abbb-0024217bb78e" // Surgical History Encounter
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.group_members?.length > 0) // Parent observations with group members
            .map((parentObs) => {
              const groupMembers = parentObs.group_members || [];
              const procedure = groupMembers.find((member: { concept: string; value: string }) =>
                member.concept === "b9b580e6-8d80-11d8-abbb-0024217bb78e"
              )?.value || "No Procedure";

              const indication = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === "b1d31030-f5f3-492b-8c94-bf31728ddc83"
              )?.value || "No Indication";

              const complications = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === "b9caa728-8d80-11d8-abbb-0024217bb78e"
              )?.value || "No Complications";

              const date = parentObs.obs_datetime || "No Date";

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
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === "88564b30-abaf-4744-8ea6-6e1c15465d9e" // Drug History Encounter
        )
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.group_members?.length > 0) // Parent observations with group members
            .map((parentObs) => {
              const groupMembers = parentObs.group_members || [];

              const medicationName = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === "concepts.MEDICATION_NAME"
              )?.value || "Unknown Medication";

              const formulation = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  [
                    concepts.TABLET,
                    concepts.VIAL,
                    concepts.INTRAVENOUS,
                    concepts.POWDER,
                    concepts.SOLUTION,
                    concepts.EYE_OINTMENT,
                    concepts.EYE_DROPS,
                    concepts.CREAM,
                    concepts.OINTMENT,
                    concepts.INHALER,
                    concepts.SUPPOSITORY,
                    concepts.PESSARY,
                    concepts.SUSPENSION,
                    concepts.SHAMPOO,
                    concepts.EAR_DROPS,
                    concepts.EYE_PASTE,
                  ].includes(member.concept)
              )?.value || "Unknown Formulation";

              const doseObs = groupMembers.find(
                (member: { concept: string; value: string; names: { name: string }[] }) =>
                  [
                    concepts.DOSE_IN_MILLIGRAMS,
                    concepts.DOSE_IN_MICROGRAMS,
                    concepts.DOSE_IN_GRAMS,
                    concepts.DOSE_IN_IU,
                    concepts.DOSE_IN_MILLIMOLES,
                  ].includes(member.concept)
              );

              const dose = doseObs?.value || "No Dose";
              const doseUnit = doseObs?.names?.[0]?.name || "Unknown Dose Unit";


              const frequency = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  [
                    concepts.ONCE_A_DAY,
                    concepts.TWICE_A_DAY,
                    concepts.THREE_TIMES_A_DAY,
                    concepts.FOUR_TIMES_A_DAY,
                    concepts.SIX_TIMES_A_DAY,
                    concepts.ONCE_A_WEEK,
                    concepts.ONCE_A_MONTH,
                  ].includes(member.concept)
              )?.value || "Unknown Frequency";

              const durationObs = groupMembers.find(
                (member: { concept: string; value: string; names: { name: string }[] }) =>
                  [
                    concepts.DURATION_ON_MEDICATION_DAYS,
                    concepts.DURATION_ON_MEDICATION_WEEKS,
                    concepts.DURATION_ON_MEDICATION_MONTHS,
                    concepts.DURATION_ON_MEDICATION_YEARS,
                  ].includes(member.concept)
              );

              const duration = durationObs?.value || "No Duration";
              const durationUnit = durationObs?.names?.[0]?.name || "Unknown Duration Unit";


              const lastTaken = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === concepts.MEDICATION_DATE_LAST_TAKEN
              )?.value || "Not Recorded";

              const lastPrescribed = groupMembers.find(
                (member: { concept: string; value: string }) =>
                  member.concept === concepts.MEDICATION_DATE_OF_LAST_PRESCRIPTION
              )?.value || "Not Recorded";

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

      setDrugHistory(drugHistoryRecords);




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
                obs.names[0]?.uuid === concepts.ABNORMALITIES_UPPER_LIMB ||
                obs.names[0]?.uuid === concepts.ABNORMALITIES_LOWER_LIMB
            )
            .map((obs) => ({
              id: obs.obs_id.toString(),
              finding: obs.value || "No Finding",
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Sort by observation date and select the most recent record
      const latestExtremitiesRecords = extremitiesRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Get the latest record

      setExtremitiesExaminations(latestExtremitiesRecords);

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
      const headAndNeckRecords = patientEncounters
        .filter(
          (encounter) =>
            encounter.encounter_type.uuid === encounters.HEAD_AND_NECK_ASSESSMENT
        )
        .flatMap((encounter) =>
          encounter.obs.map((obs) => ({
            id: obs.obs_id.toString(),
            description: obs.value || "No Description",
            obsDatetime: obs.obs_datetime || "",
          }))
        );

      // Sort by the latest observation date and select the most recent record
      const latestHeadAndNeckRecords = headAndNeckRecords
        .sort(
          (a, b) =>
            new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime()
        )
        .slice(0, 1); // Select the latest record

      setHeadAndNeckExaminations(latestHeadAndNeckRecords);

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
    <MainGrid container spacing={2}>
      <MainGrid item xs={12}>
        <MainPaper>
          <Typography variant="h4">Surgical Notes</Typography>
          <br />


          {/* 1. Past Presenting Complaint(s) */}
          <section>
            <Typography variant="h5">1) Past Presenting Complaint(s)</Typography>
            <Typography variant="h6" sx={{ pl: 2 }}>
              -Triage.</Typography>
            {/* <section>
              <Typography variant="h5">Triage Complaints</Typography>
              {triageComplaints.length > 0 ? (
                <ul>
                  {triageComplaints.map((complaint) => (
                    <li key={complaint.id}>
                      {complaint.complaint} - {new Date(complaint.obsDatetime).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No triage complaints recorded.</Typography>
              )}
            </section> */}



            <Typography variant="h6" sx={{ pl: 2 }}>
              -SAMPLE history</Typography>
            <section>
              {presentingComplaints.length > 0 ? (
                <ul>
                  {presentingComplaints.map((complaint) => (
                    <li key={complaint.id}>
                      <p><b>Symptom:</b> {complaint.complaint}</p>
                      <p> {complaint.duration || "No Duration"}</p>
                      <p><b>Date:</b> {new Date(complaint.obsDatetime).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No presenting complaints recorded.</Typography>
              )}
            </section>


          </section>
          <br />


          {/* 2. Drug History */}
          <section>
            <Typography variant="h5">2) Drug History</Typography>
            <Typography variant="h6" sx={{ pl: 2 }}>
              - SAMPLE History
            </Typography>
            {drugHistory.length > 0 ? (
              <ul>
                {drugHistory.map((drug) => (
                  <li key={drug.id}>
                    <b>Medication Name:</b> {drug.medicationName} | <b>Formulation:</b> {drug.formulation} |{" "}
                    <b>Dose:</b> {drug.dose} {drug.doseUnit} | <b>Frequency:</b> {drug.frequency} |{" "}
                    <b>Duration:</b> {drug.duration} {drug.durationUnit} | <b>Last Taken:</b> {drug.lastTaken} |{" "}
                    <b>Last Prescribed:</b> {drug.lastPrescribed} | <b>Date:</b>{" "}
                    {new Date(drug.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No drug history recorded.</Typography>
            )}
            <Typography variant="h6" sx={{ pl: 2 }}>
              - AETC prescriptions
            </Typography>
            <Typography sx={{ pl: 4 }}>Prescription data from AETC.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - AETC dispensation
            </Typography>
            <Typography sx={{ pl: 4 }}>Dispensation details here.</Typography>
          </section>
          <br />


          {/* 3. PAST MEDICAL HISTORY */}
          <section>
            <Typography variant="h5">3) PAST MEDICAL HISTORY</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - HIV STATUS
            </Typography>
            <Typography sx={{ pl: 4 }}>            <b>Status:</b> {HIVStatus}
            </Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Past surgical history
            </Typography>
            {surgicalHistory.length > 0 ? (
              <ul>
                {surgicalHistory.map((history) => (
                  <li key={history.id}>
                    <b>Procedure:</b> {history.procedure} | <b>Indication:</b> {history.indication} |{" "}
                    <b>Date:</b> {new Date(history.date).toLocaleDateString()} |{" "}
                    <b>Complications:</b> {history.complications}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No past surgical history recorded.</Typography>
            )}
            <Typography variant="h6" sx={{ pl: 2 }}>- Allergy</Typography>
            {allergies.length > 0 ? (
              <ul style={{ paddingLeft: "2ch" }}>
                {allergies.map((allergy) => (
                  <li key={allergy.id}>
                    <strong>Allergy Name:</strong> {allergy.allergen} <br />
                    <strong>Allergy Details:</strong> {allergy.comment} <br />
                    <strong>Date:</strong> {new Date(allergy.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography sx={{ pl: 4 }}>No allergies recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Social history
            </Typography>
            <Typography sx={{ pl: 4 }}>Social history details here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Family history
            </Typography>
            {familyHistory.length > 0 ? (
              <ul>
                {familyHistory.map((history) => (
                  <li key={history.id}>
                    <b>Condition:</b> {history.condition} | <b>Relationship:</b> {history.relationship}{" "}
                    | <b>Date:</b> {new Date(history.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography sx={{ pl: 4 }}>No family history recorded.</Typography>
            )}
            <Typography variant="h6" sx={{ pl: 2 }}>
              - Review of systems
            </Typography>
            {reviewOfSystems.length > 0 ? (
              <div>
                {reviewOfSystems.map((ros) => (
                  <div key={ros.id}>
                    <Typography>
                      <b>Date of Last Meal:</b> {ros.dateOfLastMeal}
                    </Typography>
                    <Typography>
                      <b>Events:</b> {ros.events}
                    </Typography>
                    <Typography variant="subtitle1">General History:</Typography>
                    <ul>
                      {ros.generalHistory.map((history) => (
                        <li key={history.id}>
                          {history.symptom} - {history.duration} {history.durationUnit}{" "}
                          {history.site && `(Site: ${history.site})`} on{" "}
                          {new Date(history.obsDatetime).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                    <Typography variant="subtitle1">Specific History:</Typography>
                    <ul>
                      {ros.dropdownHistory.map((dropdown) => (
                        <li key={dropdown.id}>
                          {dropdown.category}: {dropdown.selection} on{" "}
                          {new Date(dropdown.obsDatetime).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <Typography sx={{ pl: 4 }}>No review of systems recorded.</Typography>
            )}
            <Typography variant="h6" sx={{ pl: 2 }}>
              - Vital signs
            </Typography>
            <Typography sx={{ pl: 4 }}>
              -- Triage and Monitoring Chart Data
            </Typography>
          </section>
          <br />

          {/* Body System Assessments */}
          <section>
            <Typography variant="h5">4) Body System Assessments</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Head & Neck Assessment</Typography>
            {headAndNeckExaminations.length > 0 ? (
              <ul>
                {headAndNeckExaminations.map((exam) => (
                  <li key={exam.id}>
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No head and neck observations recorded.</Typography>
            )}
            <Typography variant="h6" sx={{ pl: 2 }}>
              - Chest (Secondary Assessment)
            </Typography>
            {chestAssessments.length > 0 ? (
              <ul>
                {chestAssessments.map((exam) => (
                  <li key={exam.id}>
                    <p>
                      <b>Status:</b> {exam.status}
                    </p>
                    {exam.status === "Abnormal" && (
                      <p>
                        <b>Description:</b> {exam.description}
                      </p>
                    )}
                    <p>
                      <b>Date:</b> {new Date(exam.obsDatetime).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No chest observations recorded.</Typography>
            )}


            <Typography variant="h6" sx={{ pl: 2 }}>
              - Lungs
            </Typography>
            <Typography sx={{ pl: 4 }}>-- Primary Assessment</Typography>
            {primaryLungsAssessments.length > 0 ? (
              <ul>
                {primaryLungsAssessments.map((exam) => (
                  <li key={exam.id}>
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No  primary lungs assessment observations recorded.</Typography>
            )}


            <Typography sx={{ pl: 4 }}>-- Secondary Assessment</Typography>
            {lungsAssessments.length > 0 ? (
              <ul>
                {lungsAssessments.map((exam) => (
                  <li key={exam.id}>
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No  secondary lungs assessment observations recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Abdomen (Secondary Assessment)
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
              <Typography>No abdomen and pelvis observations recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Extremities Assessment</Typography>
            {extremitiesExaminations.length > 0 ? (
              <ul>
                {extremitiesExaminations.map((exam) => (
                  <li key={exam.id}>
                    {exam.finding} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No extremities observations recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Skin Assessment
            </Typography>
            {skinAssessment.length > 0 ? (
              <ul>
                {skinAssessment.map((assessment) => (
                  <li key={assessment.id}>
                    <b>Temperature:</b> {assessment.temperature || "N/A"} |
                    <b> Additional Notes:</b> {assessment.additionalNotes || "N/A"} |
                    <b> Date:</b> {new Date(assessment.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography sx={{ pl: 4 }}>No skin assessment recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Neurological Examination
            </Typography>
            {neurologicalExaminations.length > 0 ? (
              <ul>
                {neurologicalExaminations.map((exam) => (
                  <li key={exam.id}>
                    <b>Notes:</b> {exam.notes} | <b>Date:</b>{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No neurological observations recorded.</Typography>
            )}
          </section>

          {/* Other Sections */}
          <section>
            <Typography variant="h5">5) Differential Diagnosis</Typography>
            {differentialDiagnoses.length > 0 ? (
              <ul>
                {differentialDiagnoses.map((diagnosis) => (
                  <li key={diagnosis.id}>
                    <p><b>Condition:</b> {diagnosis.condition}</p>
                    <p><b>Date:</b> {new Date(diagnosis.obsDatetime).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No differential diagnosis added.</Typography>
            )}
          </section>


          <section>
            <Typography variant="h5">6) Investigations</Typography>
            <Typography>Investigation data here.</Typography>
          </section>

          <section>
            <Typography variant="h5">7) Management Plan</Typography>
            <Typography>Management plan details here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              -- Prescription
            </Typography>
            <Typography sx={{ pl: 4 }}>Prescription details here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              -- Monitoring Chart
            </Typography>
            <Typography sx={{ pl: 4 }}>Monitoring chart data here.</Typography>
          </section>

          {/* Print to PDF */}
          <section style={{ marginTop: "2rem" }}>
            <Button variant="contained" color="primary" onClick={handlePrintToPDF}>
              Print to PDF
            </Button>
          </section>


        </MainPaper>
      </MainGrid>
    </MainGrid>
  );
}

export default SurgicalNotesTemplate;
