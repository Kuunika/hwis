// utils/formatNotesData.tsx
import { encounters } from "@/constants";
import { Box } from "@mui/material";
import {
  formatPresentingComplaints,
  formatVitals,
  formatSoapierNotes,
  formatPrimarySurvey,
  formatSecondarySurvey,
  formatPatientManagamentPlan,
  formatDiagnosisNotes,
  formatInvestigationPlans,
  formatDisposition,
} from ".";
import {
  NotesConfig,
  GenericNotes,
} from "../../clinicalNotes/updated-clinical-notes/genericNotes";
import ResultsTable from "../tabularDisplayInformation";
import { ContinuationNotes } from "../continuationNotes";
import { MonitoringCharts } from "@/app/patient/components/clinicalNotes/monitoringCharts";

export const formatClinicalNotesData = (
  getEncountersByType: (type: string) => any[]
) => {
  return [

    {
      title: "Soapier Notes",
      content: formatSoapierNotes(
        getEncountersByType(encounters.NURSING_CARE_NOTES)
      ),
    },
    {
      title: "Monitoring Charts",
      content: <MonitoringCharts />,
    },

    {
      title: "Primary Survey",
      content: formatPrimarySurvey({
        airwayObs: getEncountersByType(encounters.AIRWAY_ASSESSMENT),
        breathingObs: getEncountersByType(encounters.BREATHING_ASSESSMENT),
        circulationObs: getEncountersByType(encounters.CIRCULATION_ASSESSMENT),
        disabilityObs: getEncountersByType(
          encounters.PRIMARY_DISABILITY_ASSESSMENT
        ),
        exposureObs: getEncountersByType(encounters.EXPOSURE_ASSESSMENT),
      }),
    },
    {
      title: "Sample History",
      content: (
        <Box>
          <style>
            {`
              .sample-history-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                width: 100%;
              }

              .sample-history-item {
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 10px;
                background-color: #fafafa;
                min-height: 100px;
                display: flex;
                flex-direction: column;
              }

              .sample-history-title {
                font-weight: bold;
                margin-bottom: 6px;
                margin-top: 0;
                font-size: 0.9rem;
                border-bottom: 1px solid #ddd;
                padding-bottom: 4px;
              }

              .sample-history-content {
                padding-left: 8px;
                font-size: 0.85rem;
                flex-grow: 1;
              }

              .sample-history-empty {
                color: #999;
                font-style: italic;
                font-size: 0.8rem;
              }

              @media print {
                .sample-history-grid {
                  gap: 8px;
                }

                .sample-history-item {
                  padding: 6px;
                  min-height: auto;
                  page-break-inside: avoid;
                  break-inside: avoid;
                }

                .sample-history-title {
                  font-size: 0.8rem;
                  margin-bottom: 4px;
                }

                .sample-history-content {
                  font-size: 0.75rem;
                  padding-left: 4px;
                }
              }
            `}
          </style>

          <div className="sample-history-grid">
            {/* Row 1, Column 1: Symptoms - Presenting Complaints */}
            <div className="sample-history-item">
              <div className="sample-history-content">
                <GenericNotes
                  data={getEncountersByType(encounters.PRESENTING_COMPLAINTS)}
                  title="Symptoms - Presenting Complaints"
                  config={NotesConfig.PRESENTING_COMPLAINTS}
                />
              </div>
            </div>

            {/* Row 1, Column 2: Events */}
            <div className="sample-history-item">
              <h4 className="sample-history-title">Events</h4>
              <div className="sample-history-content">
                {(() => {
                  const historyData = getEncountersByType(encounters.SUMMARY_ASSESSMENT);
                  const traumaData = getEncountersByType(encounters.REVIEW_OF_SYSTEMS);
                  const hasHistory = historyData && historyData.length > 0;
                  const hasTrauma = traumaData && traumaData.length > 0;

                  if (!hasHistory && !hasTrauma) {
                    return <div className="sample-history-empty">Notes not entered</div>;
                  }

                  return (
                    <>
                      <GenericNotes
                        data={historyData}
                        title="History of Presenting Complaints"
                        config={NotesConfig.HISTORY_OF_PRESENTING_COMPLAINTS}
                      />
                      <GenericNotes
                        data={traumaData}
                        title="Trauma/Injury History"
                        config={NotesConfig.TRAUMA_HISTORY}
                      />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Row 1, Column 3: Allergies */}
            <div className="sample-history-item">
              <h4 className="sample-history-title">Allergies</h4>
              <div className="sample-history-content">
                {(() => {
                  const allergiesData = getEncountersByType(encounters.ALLERGIES);
                  const hasAllergies = allergiesData && allergiesData.length > 0;

                  if (!hasAllergies) {
                    return <div className="sample-history-empty">Notes not entered</div>;
                  }

                  return (
                    <GenericNotes
                      data={allergiesData}
                      title=""
                      config={NotesConfig.ALLERGIES}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Row 2, Column 1: Medications */}
            <div className="sample-history-item">
              <h4 className="sample-history-title">Medications</h4>
              <div className="sample-history-content">
                {(() => {
                  const medicationsData = getEncountersByType(encounters.PRESCRIPTIONS);
                  const hasMedications = medicationsData && medicationsData.length > 0;

                  if (!hasMedications) {
                    return <div className="sample-history-empty">Notes not entered</div>;
                  }

                  return (
                    <GenericNotes
                      data={medicationsData}
                      title=""
                      config={NotesConfig.MEDICATIONS}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Row 2, Column 2: Prior/Existing Conditions */}
            <div className="sample-history-item">
              <h4 className="sample-history-title">Prior/Existing Conditions</h4>
              <div className="sample-history-content">
                {(() => {
                  const conditionsData = getEncountersByType(encounters.DIAGNOSIS);
                  const surgeryData = getEncountersByType(encounters.SURGICAL_HISTORY);
                  const admissionsData = getEncountersByType(encounters.PATIENT_ADMISSIONS);
                  const hasConditions = conditionsData && conditionsData.length > 0;
                  const hasSurgery = surgeryData && surgeryData.length > 0;
                  const hasAdmissions = admissionsData && admissionsData.length > 0;

                  if (!hasConditions && !hasSurgery && !hasAdmissions) {
                    return <div className="sample-history-empty">Notes not entered</div>;
                  }

                  return (
                    <>
                      <GenericNotes
                        data={conditionsData}
                        title="Conditions"
                        config={NotesConfig.DIAGNOSIS}
                      />
                      <GenericNotes
                        data={surgeryData}
                        title="Surgical History"
                        config={NotesConfig.SURGICAL_HISTORY}
                      />
                      <GenericNotes
                        data={admissionsData}
                        title="Previous Admissions"
                        config={NotesConfig.ADMISSIONS}
                      />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Row 2, Column 3: Last Meal */}
            <div className="sample-history-item">
              <h4 className="sample-history-title">Last Meal</h4>
              <div className="sample-history-content">
                {(() => {
                  const lastMealData = getEncountersByType(encounters.SUMMARY_ASSESSMENT);
                  const hasLastMeal = lastMealData && lastMealData.length > 0;

                  if (!hasLastMeal) {
                    return <div className="sample-history-empty">Notes not entered</div>;
                  }

                  return (
                    <GenericNotes
                      data={lastMealData}
                      title=""
                      config={NotesConfig.LAST_MEAL}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </Box>
      ),
    },
    {
      title: "Secondary Survey",
      content: formatSecondarySurvey({
        generalInformationObs: getEncountersByType(
          encounters.GENERAL_INFORMATION_ASSESSMENT
        ),
        headAndNeckObs: getEncountersByType(
          encounters.HEAD_AND_NECK_ASSESSMENT
        ),
        chestObs: getEncountersByType(encounters.CHEST_ASSESSMENT),
        abdomenAndPelvisObs: getEncountersByType(
          encounters.ABDOMEN_AND_PELVIS_ASSESSMENT
        ),
        extremitiesObs: getEncountersByType(encounters.EXTREMITIES_ASSESSMENT),
        neurologicalObs: getEncountersByType(
          encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT
        ),
      }),
    },
    {
      title: "Diagnosis",
      content: formatDiagnosisNotes([
        ...getEncountersByType(encounters.OUTPATIENT_DIAGNOSIS),
        ...getEncountersByType(encounters.DIAGNOSIS),
      ]),
    },
    {
      title: "Laboratory or Radiology Findings",
      content: (
        <ResultsTable
          title="Beside Tests"
          data={formatInvestigationPlans(
            getEncountersByType(encounters.BED_SIDE_TEST)
          )}
        />
      ),
    },
    {
      title: "Patient Management Plan",
      content: formatPatientManagamentPlan({
        nonPharmalogical: getEncountersByType(encounters.NON_PHARMACOLOGICAL),
      }),
    },
    {
      title: "Continuation Notes",
      content: (
        <ContinuationNotes
          obs={getEncountersByType(encounters.CLINICAL_NOTES)}
        />
      ),
    },

    {
      title: "Disposition Notes",
      content: formatDisposition(
        [...getEncountersByType(encounters.DISPOSITION)
          , ...getEncountersByType(encounters.AWAITING_SPECIALTY)]
      ),
    },
  ];
};