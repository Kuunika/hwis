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
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";
import { VisitTable } from "../visits/visitTable";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";



export const ClinicalNotes = () => {

  //-------------------------------------------

  const [clinicalNotes, setClinicalNotes] = useState<
    Array<{ note: string | null; creator: string; time: any }>
  >([]);
  
  const { mutate, isSuccess, isPending, isError, data } = addEncounter();
  const { params } = useParameters();
  const { data:pData } = getPatientsEncounters(params.id as string);
  const { data: patient } = getOnePatient(params.id as string);

  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);

  //---------------------------------------
  const [traumaMessage, setDisabilityMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;
  
    const reviewOfSystemsEncounter = pData.find(
      (d) => d.encounter_type.uuid === encounters.DISABILITY_ASSESSMENT
    );
  
    const levelOfConsciousnessObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS)
    );
    const GCSObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.GCS)
    );

    console.log("whats going on!!",reviewOfSystemsEncounter?.obs)

    const eyeOpeingObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() == concepts.EYE_OPENING_RESPONSE.toLowerCase())
    );

    const verbalResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.VERBAL_RESPONSE)
    );

    const motorResponseObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name === concepts.MOTOR_RESPONSE)
    );

    const pupilSizeObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() === concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT.toLowerCase())
    );

    const focalNeurologyObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name == concepts.FOCAL_NEUROLOGY)
    );

    const postureObs = reviewOfSystemsEncounter?.obs.find(
      (ob) => ob.names.some((n) => n.name.toLowerCase() === concepts.FOCAL_NEUROLOGY.toLowerCase())
    );




    // if (levelOfConsciousnessObs?.value  === "No") {
    //   setDisabilityMessage("The patient is alert and does not exhibit a low level of consciousness.");
    // } else {
    //   setDisabilityMessage("The patient exhibits a low level of consciousness and requires further evaluation and monitoring.");
    // } 


    // if (GCSObs?.value === 15) {
    //   setDisabilityMessage("The GCS is 15: patient is fully conscious with normal neurological function.");
    //   } else if (GCSObs?.value >= 13 && GCSObs?.value <= 14) {
    //       setDisabilityMessage("GCS is 13–14: Mild brain injury. Close monitoring advised.");
    //   } else if (GCSObs?.value >= 9 && GCSObs?.value <= 12) {
    //       setDisabilityMessage("GCS is 9–12: Moderate brain injury. Further assessment required.");
    //   } else if (GCSObs?.value >= 3 && GCSObs?.value <= 8) {
    //       setDisabilityMessage("GCS is 3–8: Severe brain injury or coma. Immediate intervention required.");
    //   } else {
    //       setDisabilityMessage("Invalid GCS score.");
    //   }
 

      // if (eyeOpeingObs?.value == 4) {
      //   setDisabilityMessage("Eyes open spontaneously is 4: patient is fully conscious.");
      // } else if (eyeOpeingObs?.value == 3) {
      //   setDisabilityMessage("Eyes open to speech is 3 is 3: mild impairment in consciousness.");
      // } else if (eyeOpeingObs?.value ==2) {
      //   setDisabilityMessage("Eyes open to pain is 2: more significant impairment in consciousness.");
      // } else if (eyeOpeingObs?.value == 1) {
      //   setDisabilityMessage("No eye opening response is 1: patient may be in a deep coma.");
      // } else {
      //   setDisabilityMessage("Invalid eye opening response value.");
      // }

      


        // if (verbalResponseObs?.value == 5) {
        //   setDisabilityMessage("Verbal response is 5: patient is oriented and converses normally.");
        // } else if (verbalResponseObs?.value == 4) {
        //   setDisabilityMessage("Verbal response is 4: patient is confused but able to speak.");
        // } else if (verbalResponseObs?.value == 3) {
        //   setDisabilityMessage("Verbal response is 3: inappropriate words, not making sense.");
        // } else if (verbalResponseObs?.value == 2) {
        //   setDisabilityMessage("Verbal response is 2: incomprehensible sounds, moaning or groaning.");
        // } else if (verbalResponseObs?.value == 1) {
        //   setDisabilityMessage("Verbal response is 1: no verbal response, patient is unresponsive.");
        // } else {
        //   setDisabilityMessage("Invalid verbal response value.");
        // }
      
        // setDisabilityMessage(`Pupil Size and Reaction to Light: ${pupilSizeObs?.value || "Not available"}`);

        //setDisabilityMessage(`Focal Neurology : ${focalNeurologyObs?.value || "Not available"}`);

        setDisabilityMessage(`Posture : ${postureObs?.value || "Not available"}`);
        console.log("Lets see the text behind it",postureObs )


        




  
  }, [pData]);

  
  
  //-------------------------------------------

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
    <>
        <Panel title="Clinical Notes" icon={expandIcon}>
      <br />
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <AddClinicalNotes onAddNote={addClinicalNote} />
        <FaRegChartBar />
      </WrapperBox>
      <WrapperBox
        sx={{ mt: "1ch", overflow: "scroll", maxHeight: "15ch", pl: "2ch" }}
      >
        {clinicalNotes.length == 0 ? (
          <Typography>No Notes added</Typography>
        ) : (
          clinicalNotes.map((note: any) => {
            return (
              <Box
                key={note.note}
                sx={{ my: "1ch", py: "1ch", borderBottom: "1px solid #E0E0E0" }}
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
            );
          })
        )}
      </WrapperBox>
    </Panel>
---
    <Panel title="Disability Assessment" icon={expandIcon}>
      <br />
      {traumaMessage && (
  <Typography sx={{}}>{traumaMessage}</Typography>
)}
      <WrapperBox
        sx={{ mt: "1ch", overflow: "scroll", maxHeight: "15ch", pl: "2ch" }}
      >
        {clinicalNotes.length == 0 ? (
          <Typography>No Information Availbale</Typography>
        ) : (
          clinicalNotes.map((note: any) => {
            return (
              <Box
                key={note.note}
                sx={{ my: "1ch", py: "1ch", borderBottom: "1px solid #E0E0E0" }}
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
            );
          })
        )}
      </WrapperBox>
    </Panel>
    </>
    

    
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
