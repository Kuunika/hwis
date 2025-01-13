"use client";

import React, { useEffect, useState } from "react";
import { MainGrid, MainPaper } from "@/components";
import { Typography } from "@mui/material";
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
  description: string;
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
  obsDatetime: string;
}

// interface TriageComplaint {
//   id: string;
//   complaint: string;
//   obsDatetime: string;
// }



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


  const { data: patientEncounters, isLoading, error } = getPatientsEncounters(params.id as string);

  useEffect(() => {
    if (patientEncounters) {
      // Differential Diagnoses
      const diagnoses = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.OUTPATIENT_DIAGNOSIS)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.DIFFERENTIAL_DIAGNOSIS)
            .map((obs) => ({
              id: obs.obs_id.toString(),
              condition: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setDifferentialDiagnoses(diagnoses);

      // Allergies
      const allergyRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.ALLERGIES)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.ALLERGY)
            .map((obs) => ({
              id: obs.obs_id.toString(),
              allergen: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setAllergies(allergyRecords);

      // Neurological Examination
      const neurologicalRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.EXTREMITIES_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.ADDITIONAL_NOTES)
            .map((obs) => ({
              id: obs.obs_id.toString(),
              notes: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setNeurologicalExaminations(neurologicalRecords);

      // Extremities Assessment
      const extremitiesRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.EXTREMITIES_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.ABNORMALITIES_UPPER_LIMB || obs.names[0]?.uuid === concepts.ABNORMALITIES_LOWER_LIMB)
            .map((obs) => ({
              id: obs.obs_id.toString(),
              finding: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setExtremitiesExaminations(extremitiesRecords);

      // Skin Assessment
      const skinRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.SKIN_RASH || obs.names[0]?.uuid === concepts.ADDITIONAL_NOTES)
            .map((obs) => ({
              id: obs.obs_id.toString(),
              observation: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setSkinExaminations(skinRecords);

      // Head & Neck Examinations
      const headAndNeckRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.HEAD_AND_NECK_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs.map((obs) => ({
            id: obs.obs_id.toString(),
            description: obs.value,
            obsDatetime: obs.obs_datetime || "",
          }))
        );
      setHeadAndNeckExaminations(headAndNeckRecords);

      // Chest Assessments
      const chestRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) => obs.names[0]?.uuid === concepts.HEART_SOUNDS) // Only HEART_SOUNDS
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setChestAssessments(chestRecords);


      // Abdomen and Pelvis Assessments
      const abdomenPelvisRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter((obs) =>
              obs.names[0]?.uuid === concepts.ABNORMALITIES_PRESENT ||
              obs.names[0]?.uuid === concepts.TENDERNESS
            ) // Include the two specific concepts
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setAbdomenPelvisAssessments(abdomenPelvisRecords);

      // Lungs Assessments - (Secondary Assessment)
      const lungsRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.CHEST_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.RESPIRATORY_RATE ||
                obs.names[0]?.uuid === concepts.BREATHING_SOUNDS
            ) // Include RESPIRATORY_RATE and BREATHING_SOUNDS
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setLungsAssessments(lungsRecords);


      // Lungs Assessments - (Primary Assessment)
      const primaryLungsRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.BREATHING_ASSESSMENT)
        .flatMap((encounter) =>
          encounter.obs
            .filter(
              (obs) =>
                obs.names[0]?.uuid === concepts.RESPIRATORY_RATE
            ) // Include RESPIRATORY_RATE and BREATHING_SOUNDS
            .map((obs) => ({
              id: obs.obs_id.toString(),
              description: obs.value,
              obsDatetime: obs.obs_datetime || "",
            }))
        );
      setPrimaryLungsAssessments(primaryLungsRecords);


      //Presenting complaints SAMPLE history
      const presentingComplaints = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.PRESENTING_COMPLAINTS)
        .flatMap((encounter) =>
          encounter.obs.map((obs) => ({
            id: obs.obs_id.toString(),
            complaint: obs.value || "No Complaint",
            obsDatetime: obs.obs_datetime || "",
          }))
        );

      setPresentingComplaints(presentingComplaints);



      // const triageComplaintsData = patientEncounters
      //   .filter((encounter) => encounter.encounter_type.uuid === encounters.TRIAGE_RESULT)
      //   .flatMap((encounter) =>
      //     encounter.obs
      //       .filter((obs) => obs.names[0]?.uuid === concepts.COMPLAINTS) // Filter by COMPLAINTS Concept
      //       .map((obs) => ({
      //         id: obs.obs_id.toString(),
      //         complaint: obs.value || "No Complaint",
      //         obsDatetime: obs.obs_datetime || "",
      //       }))
      //   );

      // setTriageComplaints(triageComplaintsData);










      //Death form testing
      const deathRecords = patientEncounters
        .filter((encounter) => encounter.encounter_type.uuid === encounters.DISCHARGE_PATIENT)
        .flatMap((encounter) =>
          encounter.obs
            // .filter((obs) => obs.names[0]?.uuid === concepts.DEATH) // Filter by Death Concept
            .map((obs) => ({
              id: obs.obs_id.toString(),
              concept: obs.names[0]?.name || "Unknown Concept",
              value: obs.value || "No Value",
              obsDatetime: obs.obs_datetime || "",
            }))
        );

      // Display all relevant observations with the latest observation date
      const latestDeathObservationDate = deathRecords.length
        ? new Date(
          Math.max(...deathRecords.map((obs) => new Date(obs.obsDatetime).getTime()))
        )
        : null;

      // Get observations from the latest date
      const latestDeathRecords = deathRecords.filter(
        (obs) => new Date(obs.obsDatetime).getTime() === latestDeathObservationDate?.getTime()
      );
      console.log("All Observations for Latest Death Encounter:", latestDeathRecords);


      setDeathObservations(latestDeathRecords);







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
                      {complaint.complaint} -{" "}
                      {new Date(complaint.obsDatetime).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No presenting complaints recorded.</Typography>
              )}
            </section>






          </section>

          {/* 2. Drug History */}
          <section>
            <Typography variant="h5">2) Drug History</Typography>
            <Typography variant="h6" sx={{ pl: 2 }}>
              - Sub-section SAMPLE HISTORY
            </Typography>
            <Typography sx={{ pl: 4 }}>Details from SAMPLE history.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Sub-section AETC prescriptions
            </Typography>
            <Typography sx={{ pl: 4 }}>Prescription data from AETC.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Sub-section AETC dispensation
            </Typography>
            <Typography sx={{ pl: 4 }}>Dispensation details here.</Typography>
          </section>

          {/* 3. PAST MEDICAL HISTORY */}
          <section>
            <Typography variant="h5">3) PAST MEDICAL HISTORY</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - HIV STATUS
            </Typography>
            <Typography sx={{ pl: 4 }}>HIV status data here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Past surgical history
            </Typography>
            <Typography sx={{ pl: 4 }}>Past surgical data here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Allergy
            </Typography>
            {allergies.length > 0 ? (
              <ul style={{ paddingLeft: "2ch" }}>
                {allergies.map((allergy) => (
                  <li key={allergy.id}>
                    {allergy.allergen} -{" "}
                    {new Date(allergy.obsDatetime).toLocaleDateString()}
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
            <Typography sx={{ pl: 4 }}>Family history data here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Review of systems
            </Typography>
            <Typography sx={{ pl: 4 }}>Review of systems here.</Typography>

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Vital signs
            </Typography>
            <Typography sx={{ pl: 4 }}>
              -- Triage and Monitoring Chart Data
            </Typography>
          </section>

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
                    {exam.description} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
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
              - Skin Assessment</Typography>
            {skinExaminations.length > 0 ? (
              <ul>
                {skinExaminations.map((exam) => (
                  <li key={exam.id}>
                    {exam.observation} -{" "}
                    {new Date(exam.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No skin observations recorded.</Typography>
            )}

            <Typography variant="h6" sx={{ pl: 2 }}>
              - Neurological Examination</Typography>
            {neurologicalExaminations.length > 0 ? (
              <ul>
                {neurologicalExaminations.map((exam) => (
                  <li key={exam.id}>
                    {exam.notes} -{" "}
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
                    {diagnosis.condition} -{" "}
                    {new Date(diagnosis.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No differential diagnosis added.</Typography>
            )}
          </section>

          {/* Death Observations Section */}
          {/* <section>
            <Typography variant="h5">2) Death Observations</Typography>
            {deathObservations.length > 0 ? (
              <ul>
                {deathObservations.map((obs) => (
                  <li key={obs.id}>
                    {obs.concept}: {obs.value} -{" "}
                    {new Date(obs.obsDatetime).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No death observations recorded.</Typography>
            )}
          </section> */}




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


        </MainPaper>
      </MainGrid>
    </MainGrid>
  );
}

export default SurgicalNotesTemplate;
