import { TriageResult } from "@/interfaces";
import {
  GenericDialog,
  MainButton,
  MainPaper,
  MainTypography,
} from "@/components";
import { useState } from "react";
import { Button } from "@mui/material";

export const TriageContainer = ({
  message,
  result,
  onCompleteTriage,
  setContinueTriage,
}: {
  message?: string;
  result: TriageResult;
  onCompleteTriage: () => void;
  setContinueTriage: (continueTriage: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const styles = {
    red: { backgroundColor: "#FECDCA", color: "#B42318" },
    yellow: { backgroundColor: "#FEDF89", color: "#B54708" },
    green: { backgroundColor: "#DDEEDD", color: "#016302" },
    "": {},
  };

  if (result == "green") return null;

  return (
    <MainPaper elevation={0} sx={{ ...styles[result], p: "1ch" }}>
      <MainTypography variant="h4" textTransform={"capitalize"}>
        Triage {result}
      </MainTypography>

      <MainTypography fontStyle={"italic"} variant="subtitle1">
        {result == "yellow"
          ? "Continue Triage"
          : result == "red"
          ? "Proceed to interventions"
          : ""}
      </MainTypography>

      {result == "red" && (
        <>
          <MainButton
            sx={{
              backgroundColor: "#B42318",
              "&:hover": { backgroundColor: "#B42318" },
              mr: "0.5ch",
            }}
            title={"Complete Triage"}
            onClick={() => setOpen(true)}
            // onClick={handleClickCompleteTriage}
          />
          <MainButton
            variant="secondary"
            title={"Continue Triage"}
            onClick={() => setContinueTriage(true)}
          />
        </>
      )}

      <GenericDialog
        maxWidth="sm"
        title="Complete Triage"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>
          Once you confirm you will not be able to proceed with the current
          triage for this patient
        </p>
        <br />
        <Button onClick={onCompleteTriage} variant="contained">
          Yes, Complete
        </Button>
        <Button onClick={() => setOpen(false)} variant="text">
          cancel
        </Button>
      </GenericDialog>
    </MainPaper>
  );
};
