import {
  MainButton,
  MainTypography,
  PatientInfoTab,
  WrapperBox,
} from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaPlus, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect, useMemo, useRef } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters, useSubmitEncounter } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import { AirwayAssessment } from "@/app/patient/components/clinicalNotes/airwayAssement";
import { BreathingAssessment } from "@/app/patient/components/clinicalNotes/breathingAssement";
import { SoapierNotes } from "@/app/patient/components/clinicalNotes/soapierNotes";
import { ChestAssessment } from "@/app/patient/components/clinicalNotes/chestAssement";
import { GeneralInformation } from "@/app/patient/components/clinicalNotes/generalInformation";
import { HeadAndNeck } from "@/app/patient/components/clinicalNotes/headAndNeck";
import { DisabilityAssessment } from "@/app/patient/components/clinicalNotes/DisabilityAssessment";
import { ExposureAssessment } from "@/app/patient/components/clinicalNotes/ExposureAssessment";
import { AbdomenAndPelvisAssessment } from "@/app/patient/components/clinicalNotes/abdomenAndPelvisAssessment";
import { getObservations } from "@/helpers";
import { Extremities } from "@/app/patient/components/clinicalNotes/extremities";
import { NeurologicalExamination } from "@/app/patient/components/clinicalNotes/neurogicalExamination";
import { PresentingComplaintsNotes } from "@/app/patient/components/clinicalNotes/presentingComplaintsNotes";
import AllergiesNotes from "@/app/patient/components/clinicalNotes/allergies";
import { MedicationsNotes } from "@/app/patient/components/clinicalNotes/medicationsNotes";
import { ExistingConditionsNotes } from "@/app/patient/components/clinicalNotes/existingConditionsNotes";
import { SurgicalNotes } from "@/app/patient/components/clinicalNotes/surgicalNotes";
import { PreviousAdmissionsNotes } from "@/app/patient/components/clinicalNotes/previousAdmissionsNotes";
import { FamilyHistoryNotes } from "@/app/patient/components/clinicalNotes/familyHistory";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { CirculationAssessment } from "@/app/patient/components/clinicalNotes/CirculationAssessment";
import { ReviewOfSystems } from "@/app/patient/components/clinicalNotes/reviewOfSystemsNotes";
import { useReactToPrint } from "react-to-print";

export const ClinicalNotes = () => {
  const [filterSoapierState, setFilterSoapierState] = useState(false);
  const { handleSubmit } = useSubmitEncounter(
    encounters.CLINICAL_NOTES,
    () => ""
  );
  const { params } = useParameters();
  const patientId = params.id as string;
  const { notes: clinicalNotes, refresh } = useClinicalNotes(patientId);
  const { notes: airwayNotes } = useComponentNotes(
    encounters.AIRWAY_ASSESSMENT
  );
  const { notes: breathingNotes } = useComponentNotes(
    encounters.BREATHING_ASSESSMENT
  );
  const { notes: circulationNotes } = useComponentNotes(
    encounters.CIRCULATION_ASSESSMENT
  );
  const { notes: disabilityNotes } = useComponentNotes(
    encounters.DISABILITY_ASSESSMENT
  );
  const { notes: exposureNotes } = useComponentNotes(
    encounters.EXPOSURE_ASSESSMENT
  );
  const { notes: presentingComplaintsNotes } = useComponentNotes(
    encounters.PRESENTING_COMPLAINTS
  );
  const { notes: allergiesNotes } = useComponentNotes(encounters.ALLERGIES);
  const { notes: medicationsNotes } = useComponentNotes(
    encounters.PRESCRIPTIONS
  );
  const { notes: existingConditionsNotes } = useComponentNotes(
    encounters.DIAGNOSIS
  );
  const { notes: surgicalNotes } = useComponentNotes(
    encounters.SURGICAL_HISTORY
  );
  const { notes: previousAdmissionsNotes } = useComponentNotes(
    encounters.PATIENT_ADMISSIONS
  );
  const { notes: gyneacologyNotes } = useComponentNotes(
    encounters.OBSTETRIC_HISTORY
  );
  const { notes: lastMealNotes } = useComponentNotes(
    encounters.SUMMARY_ASSESSMENT
  );
  const { notes: reviewOfSystemsNotes } = useComponentNotes(
    encounters.REVIEW_OF_SYSTEMS
  );
  const { notes: familyHistoryNotes } = useComponentNotes(
    encounters.FAMILY_MEDICAL_HISTORY
  );
  const { notes: generalInfoNotes } = useComponentNotes(
    encounters.GENERAL_INFORMATION_ASSESSMENT
  );
  const { notes: headNeckNotes } = useComponentNotes(
    encounters.HEAD_AND_NECK_ASSESSMENT
  );
  const { notes: chestNotes } = useComponentNotes(encounters.CHEST_ASSESSMENT);
  const { notes: abdomenPelvisNotes } = useComponentNotes(
    encounters.ABDOMEN_AND_PELVIS_ASSESSMENT
  );
  const { notes: extremitiesNotes } = useComponentNotes(
    encounters.EXTREMITIES_ASSESSMENT
  );
  const { notes: neurologicalNotes } = useComponentNotes(
    encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT
  );
  const { notes: soapierNotes } = useComponentNotes(
    encounters.NURSING_CARE_NOTES
  );
  const { notes: dispositionNotes } = useComponentNotes(encounters.DISPOSITION);

  const { data: patient } = getOnePatient(params.id as string);
  const { data: pData } = getPatientsEncounters(params.id as string);

  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);

  const allNotes = useMemo(() => {
    const combinedNotes = filterSoapierState
      ? [...soapierNotes]
      : [
          ...clinicalNotes,
          ...airwayNotes,
          ...breathingNotes,
          ...circulationNotes,
          ...disabilityNotes,
          ...exposureNotes,
          ...presentingComplaintsNotes,
          ...allergiesNotes,
          ...medicationsNotes,
          ...existingConditionsNotes,
          ...surgicalNotes,
          ...previousAdmissionsNotes,
          ...gyneacologyNotes,
          ...lastMealNotes,
          ...reviewOfSystemsNotes,
          ...familyHistoryNotes,
          ...generalInfoNotes,
          ...headNeckNotes,
          ...chestNotes,
          ...abdomenPelvisNotes,
          ...extremitiesNotes,
          ...neurologicalNotes,
          ...soapierNotes,
          ...dispositionNotes,
        ];

    return combinedNotes.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }, [
    clinicalNotes,
    airwayNotes,
    breathingNotes,
    circulationNotes,
    disabilityNotes,
    exposureNotes,
    presentingComplaintsNotes,
    allergiesNotes,
    medicationsNotes,
    existingConditionsNotes,
    surgicalNotes,
    previousAdmissionsNotes,
    gyneacologyNotes,
    lastMealNotes,
    reviewOfSystemsNotes,
    familyHistoryNotes,
    generalInfoNotes,
    headNeckNotes,
    chestNotes,
    abdomenPelvisNotes,
    extremitiesNotes,
    neurologicalNotes,
    soapierNotes,
    dispositionNotes,
    filterSoapierState, // respond to toggle change
  ]);

  useEffect(() => {
    refresh();
  }, []);

  const addClinicalNote = (note: string) => {
    const data = { "Clinical notes construct": note };
    handleSubmit(getObservations(data, getDateTime())).then(() => refresh());
  };
  const contentRef = useRef<HTMLDivElement>(null); // <--- move here
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });
  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  return (
    <Panel title="">
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <AddClinicalNotes
          onAddNote={addClinicalNote}
          filterSoapierState={filterSoapierState}
          setFilterSoapierState={setFilterSoapierState}
          onDownload={handlePrint} // <--- pass handler to child
        />
      </WrapperBox>

      <WrapperBox
        sx={{
          overflow: "scroll",
          maxHeight: "40ch",
          pl: "2ch",
        }}
      >
        <div
          ref={contentRef}
          style={{
            margin: "10px",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <div className="print-only">
            <PatientInfoTab />
            <div
              style={{
                fontWeight: 700,
                fontSize: "20px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Clinical Notes
            </div>
          </div>

          {allNotes.length === 0 ? (
            <Typography>No clinical notes available</Typography>
          ) : (
            allNotes.map((data, index) => (
              <Box
                key={`${data.time}-${index}`}
                sx={{
                  my: "1ch",
                  py: "1ch",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", mb: 0 }}
                >
                  {data.paragraph}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption">~ {data.creator}</Typography>
                  <Typography variant="caption">
                    {getHumanReadableDateTime(data.time)}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </div>
      </WrapperBox>
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
    </Panel>
  );
};

const AddClinicalNotes = ({
  onAddNote,
  filterSoapierState,
  setFilterSoapierState,
  onDownload,
}: {
  onAddNote: (value: any) => any;
  filterSoapierState: boolean;
  setFilterSoapierState: (value: boolean) => void;
  onDownload: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Ref for printing
  const contentRef = useRef<HTMLDivElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (values: any) => {
    setAnchorEl(null);
    onAddNote(values);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        <MainButton
          aria-describedby={id}
          title="Add Notes"
          variant="contained"
          onClick={handleClick}
          startIcon={<FaPlus />}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            px: 3,
            py: 1,
            maxWidth: "calc(100% - 40px)",
            borderRadius: "8px",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              "& svg": {
                fontSize: "14px",
              },
            },
          }}
        />

        <div>
          <Button
            onClick={onDownload}
            sx={{
              color: "white",
              backgroundColor: "primary.main",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(0, 70, 0)",
              },
            }}
          >
            Download PDF
          </Button>
          <span
            style={{
              width: "10px",
              borderRight: "1px solid #000",
              marginRight: "10px",
              height: "30px",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          ></span>
          <Button
            onClick={() => setFilterSoapierState(true)}
            sx={{
              backgroundColor: filterSoapierState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            SOAPIER Notes
          </Button>
          <Button
            onClick={() => setFilterSoapierState(false)}
            sx={{
              backgroundColor: !filterSoapierState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            All
          </Button>
        </div>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MarkdownEditor onSubmit={onSubmit} />
      </Popover>
    </>
  );
};
