import { MainButton, MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { getPatientsWaitingForAssessment } from "@/hooks/patientReg";
import { concepts, encounters } from "@/constants";
import { getDateTime, getHumanReadableDateTime } from "@/helpers/dateTime";
import { Obs } from "@/interfaces";

export const ClinicalNotes = () => {
  const [clinicalNotes, setClinicalNotes] = useState<
    Array<{ note: string | null; creator: string; time:any }>
  >([]);
  const { mutate, isSuccess, isPending, isError, data } = addEncounter();
  const { params } = useParameters();
  const { data: patients } = getPatientsWaitingForAssessment();
  const {
    data: patientEncounters,
    isLoading,
    isSuccess: encountersFetched,
  } = getPatientsEncounters(params.id as string);


  useEffect(()=>{

    if(encountersFetched){
     const noteEncounter= patientEncounters.find(encounter=>encounter.encounter_type.uuid==encounters.CLINICAL_NOTES)

     if(noteEncounter)
      formatNotes(noteEncounter.obs)
    }

  },[patientEncounters])

  useEffect(() => {
    if (isSuccess) {
      formatNotes(data.obs);
    }
  }, [data]);

  const formatNotes = (obs: Obs[]) => {
    const notes = obs.map((ob) => ({
      note: ob.value_text,
      creator: ob.created_by,
      time: getHumanReadableDateTime(ob.obs_datetime)
    }));

    setClinicalNotes(notes);
  };

  const addClinicalNote = (note: any) => {
    const patient = patients?.find((d) => d.uuid == params.id);
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // });

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
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}> 
                <Typography>~ {note.creator}</Typography>
                <Typography variant="caption">{note.time}</Typography>
                </Box>
              </Box>
            );
          })
        )}
      </WrapperBox>
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
