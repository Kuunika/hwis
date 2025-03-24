import { MainButton, MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import { AirwayAssessment } from "@/app/patient/components/clinicalNotes/airwayAssement";
import { BreathingAssessment } from "@/app/patient/components/clinicalNotes/breathingAssement";
import { SoapierNotes } from "@/app/patient/components/clinicalNotes/soapierNotes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCirculationAssessment } from "./CirculationAssessment";
import { useDisabilityAssessment } from "./DisabilityAssessment";
import { useExposureAssessment } from "./ExposureAssessment";

interface AddClinicalNotesProps {
  onAddNote: (value: string) => void;
}

const AddClinicalNotes: React.FC<AddClinicalNotesProps> = ({ onAddNote }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (values: string) => {
    setAnchorEl(null);
    onAddNote(values);
  };

  return (
    <div>
      <MainButton
        aria-describedby={id}
        title={"Add Notes"}
        variant="secondary"
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MarkdownEditor onSubmit={onSubmit} />
      </Popover>
    </div>
  );
};

export const ClinicalNotes = () => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [clinicalNotes, setClinicalNotes] = useState<Array<{ note: string | null; creator: string; time: string }>>([]);
  
  const { mutate, isSuccess, isPending, isError, data } = addEncounter();
  const { params } = useParameters();
  const { data: pData } = getPatientsEncounters(params.id as string);
  const { data: patient } = getOnePatient(params.id as string);

  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);

  // Use the custom hooks for each assessment
  const circulationMessage = useCirculationAssessment(pData);
  const disabilityMessage = useDisabilityAssessment(pData);
  const exposureMessage = useExposureAssessment(pData);

  useEffect(() => {
    if (encountersFetched) {
      const noteEncounter = patientEncounters.find(
        (encounter) => encounter?.encounter_type?.uuid == encounters.CLINICAL_NOTES
      );
      if (noteEncounter) formatNotes(noteEncounter.obs);
    }
  }, [patientEncounters]);

  useEffect(() => {
    if (isSuccess) {
      formatNotes(data.obs);
    }
  }, [data]);

  const formatNotes = (obs: Obs[]) => {
    const notes = obs.map((ob) => ({
      note: ob.value_text,
      creator: ob.created_by,
      time: getHumanReadableDateTime(ob.obs_datetime),
    }));
    setClinicalNotes(notes);
  };

  const addClinicalNote = (note: string) => {
    const dateTime = getDateTime();
    mutate({
      encounterType: encounters.CLINICAL_NOTES,
      visit: patient?.visit_uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [{
        concept: concepts.ADDITIONAL_NOTES,
        value: note,
        obsDatetime: dateTime,
      }],
    });
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  const expandIcon = (
    <WrapperBox
      sx={{
        padding: "0.5ch",
        ml: "5px",
        backgroundColor: "#DDEEDD",
        borderRadius: "0.5ch",
        color: (theme) => theme.palette.primary.main,
      }}
    >
      <FaExpandAlt />
    </WrapperBox>
  );

  const renderClinicalNotes = () => (
    <WrapperBox sx={{ mt: "1ch", overflow: "scroll", maxHeight: "15ch", pl: "2ch" }}>
      {clinicalNotes.length === 0 ? (
        <Typography>No Notes added</Typography>
      ) : (
        clinicalNotes.map((note) => (
          <Box key={note.note} sx={{ my: "1ch", py: "1ch", borderBottom: "1px solid #E0E0E0" }}>
            <ReactMarkdown>{note.note}</ReactMarkdown>
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>~ {note.creator}</Typography>
              <Typography variant="caption">{note.time}</Typography>
            </Box>
          </Box>
        ))
      )}
    </WrapperBox>
  );

  return (
    <>
      <Panel title="Clinical Notes" icon={expandIcon}>
        <WrapperBox display={"flex"} justifyContent={"space-between"}>
          <AddClinicalNotes onAddNote={addClinicalNote} />
          <FaRegChartBar />
        </WrapperBox>
        {renderClinicalNotes()}
      </Panel>

      <Panel title="Detailed Assessments" icon={expandIcon}>
        <Accordion
          expanded={expandedAccordion === 'circulation-assessment'}
          onChange={handleAccordionChange('circulation-assessment')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Circulation Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {circulationMessage ? (
              <Typography dangerouslySetInnerHTML={{ __html: circulationMessage }} />
            ) : (
              <Typography>No Information Available</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === 'disability-assessment'}
          onChange={handleAccordionChange('disability-assessment')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Disability Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {disabilityMessage ? (
              <Typography dangerouslySetInnerHTML={{ __html: disabilityMessage }} />
            ) : (
              <Typography>No Information Available</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === 'exposure-assessment'}
          onChange={handleAccordionChange('exposure-assessment')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Exposure Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {exposureMessage ? (
              <Typography dangerouslySetInnerHTML={{ __html: exposureMessage }} />
            ) : (
              <Typography>No Information Available</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === 'airway-assessment'}
          onChange={handleAccordionChange('airway-assessment')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Airway Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AirwayAssessment />
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === 'breathing-assessment'}
          onChange={handleAccordionChange('breathing-assessment')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">Breathing Assessment</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BreathingAssessment />
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expandedAccordion === 'soapier-notes'}
          onChange={handleAccordionChange('soapier-notes')}
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">SOAPIER Notes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SoapierNotes />
          </AccordionDetails>
        </Accordion>
      </Panel>
    </>
  );
};

const VitalsPill = ({
  textColor,
  backgroundColor,
  iconBackgroundColor,
  text,
}: {
  textColor: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  text: string;
}) => {
  return (
    <WrapperBox
      display={"flex"}
      alignItems={"center"}
      sx={{
        backgroundColor,
        px: "2ch",
        py: "1ch",
        width: "49%",
        borderRadius: "1ch",
        color: textColor,
      }}
    >
      <WrapperBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBackgroundColor,
          p: "0.7ch",
          borderRadius: "0.7ch",
        }}
      >
        <FaRegSquare />
      </WrapperBox>
      <WrapperBox
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainTypography>{text}</MainTypography>
      </WrapperBox>
    </WrapperBox>
  );
};