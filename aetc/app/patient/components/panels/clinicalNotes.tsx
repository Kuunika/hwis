"use client";
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
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import { AirwayAssessment } from "@/app/patient/components/clinicalNotes/airwayAssement";
import { BreathingAssessment } from "@/app/patient/components/clinicalNotes/breathingAssement";
import { SoapierNotes } from "@/app/patient/components/clinicalNotes/soapierNotes";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ClinicalNotes = () => {
  const [value, setValue] = useState(0);
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };
  const [clinicalNotes, setClinicalNotes] = useState<
    Array<{ note: string | null; creator: string; time: any }>
  >([]);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    false
  );
  const { mutate, isSuccess, isPending, isError, data } = addEncounter();
  const { params } = useParameters();
  const { data: patient } = getOnePatient(params.id as string);

  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);

  useEffect(() => {
    if (encountersFetched) {
      const noteEncounter = patientEncounters.find(
        (encounter) =>
          encounter?.encounter_type?.uuid == encounters.CLINICAL_NOTES
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

  const addClinicalNote = (note: any) => {
    const dateTime = getDateTime();
    mutate({
      encounterType: encounters.CLINICAL_NOTES,
      visit: patient?.visit_uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: [
        {
          concept: concepts.ADDITIONAL_NOTES,
          value: note,
          obsDatetime: dateTime,
        },
      ],
    });
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
  return (
    <Panel title="" icon={expandIcon}>
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <AddClinicalNotes onAddNote={addClinicalNote} />
        <FaRegChartBar />
      </WrapperBox>
      <WrapperBox
        sx={{
          overflow: "scroll",
          maxHeight: "15ch",
          pl: "2ch",
        }}
      >
        {clinicalNotes.length === 0 ? (
          <Typography></Typography>
        ) : (
          clinicalNotes.map((note: any) => (
            <Box
              key={note.note}
              sx={{
                my: "1ch",
                py: "1ch",
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              <ReactMarkdown>{note.note}</ReactMarkdown>
              <br />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>~ {note.creator}</Typography>
                <Typography variant="caption">{note.time}</Typography>
              </Box>
            </Box>
          ))
        )}
      </WrapperBox>
      <Accordion
        expanded={expandedAccordion === "airway-assessment"}
        onChange={handleAccordionChange("airway-assessment")}
        sx={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="airway-assessment-content"
          id="airway-assessment-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Airway assessment notes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AirwayAssessment />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedAccordion === "breathing-assessment"}
        onChange={handleAccordionChange("breathing-assessment")}
        sx={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="breathing-assessment-content"
          id="breathing-assessment-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Breathing assessment notes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BreathingAssessment />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedAccordion === "soapier-notes"}
        onChange={handleAccordionChange("soapier-notes")}
        sx={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="soap-notes-content"
          id="soap-notes-header"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            SOAPIER notes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SoapierNotes />
        </AccordionDetails>
      </Accordion>
    </Panel>
  );
};

const AddClinicalNotes = ({
  onAddNote,
}: {
  onAddNote: (value: any) => any;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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
    </div>
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
