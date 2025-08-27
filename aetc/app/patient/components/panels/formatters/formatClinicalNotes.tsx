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

export const formatClinicalNotesData = (
  getEncountersByType: (type: string) => any[]
) => {
  return [
    {
      title: "Continuation Notes",
      content: (
        <ContinuationNotes
          obs={getEncountersByType(encounters.CLINICAL_NOTES)}
        />
      ),
    },
    {
      title: "Triage Information",
      content: [
        formatPresentingComplaints(
          getEncountersByType(encounters.PRESENTING_COMPLAINTS)
        ),
        ...formatVitals(getEncountersByType(encounters.VITALS)),
      ],
    },
    {
      title: "Soapier Notes",
      content: formatSoapierNotes(
        getEncountersByType(encounters.NURSING_CARE_NOTES)
      ),
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
      title: "Patient Management Plan",
      content: formatPatientManagamentPlan({
        nonPharmalogical: getEncountersByType(encounters.NON_PHARMACOLOGICAL),
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
      title: " Laboratory or Radiology Findings",
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
      title: "Sample History",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            {
              type: encounters.PRESENTING_COMPLAINTS,
              title: "-Presenting Complaints",
              config: NotesConfig.PRESENTING_COMPLAINTS,
            },
            {
              type: encounters.ALLERGIES,
              title: "-Allergies",
              config: NotesConfig.ALLERGIES,
            },
            {
              type: encounters.PRESCRIPTIONS,
              title: "-Medications",
              config: NotesConfig.MEDICATIONS,
            },
            {
              type: encounters.DIAGNOSIS,
              title: "Prior/existing conditions",
              config: NotesConfig.DIAGNOSIS,
            },
            {
              type: encounters.SURGICAL_HISTORY,
              title: "-Surgical History",
              config: NotesConfig.SURGICAL_HISTORY,
            },
            {
              type: encounters.PATIENT_ADMISSIONS,
              title: "-Previous Admissions",
              config: NotesConfig.ADMISSIONS,
            },
            {
              type: encounters.SUMMARY_ASSESSMENT,
              title: "-Last Meal",
              config: NotesConfig.LAST_MEAL,
            },
            {
              type: encounters.FAMILY_MEDICAL_HISTORY,
              title: "-Family Medical History",
              config: NotesConfig.FAMILY_HISTORY,
            },
          ].map((item) => (
            <GenericNotes
              key={item.type}
              data={getEncountersByType(item.type)}
              title={item.title}
              config={item.config}
            />
          ))}
        </Box>
      ),
    },
    {
      title: "Disposition Notes",
      content: formatDisposition(
       [ ...getEncountersByType(encounters.DISPOSITION)
        ,...getEncountersByType(encounters.AWAITING_SPECIALTY)]
      ),
    },
  ];
};
