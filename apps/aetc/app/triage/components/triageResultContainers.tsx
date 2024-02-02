import { confirmationDialog } from "@/helpers";
import { TriageResult } from "@/interfaces";
import { MainButton, MainPaper, MainTypography } from "shared-ui/src";

export const TriageContainer = ({
  message,
  result,
  onCompleteTriage,
}: {
  message?: string;
  result: TriageResult;
  onCompleteTriage: () => void;
}) => {
  const styles = {
    red: { backgroundColor: "#FECDCA", color: "#B42318" },
    yellow: { backgroundColor: "#FEDF89", color: "#B54708" },
    green: { backgroundColor: "#DDEEDD", color: "#016302" },
    "": {},
  };

  const handleClickCompleteTriage = () => {
    confirmationDialog({
      title: "Complete Triage?",
      text: "Once you confirm you will not be able to proceed with the current triage for this patient",
      icon: "warning",
      confirmButtonText: "Yes, Complete",
      onConfirm: () => {
        onCompleteTriage();
      },
    });
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
            }}
            title={"Complete Triage"}
            onClick={handleClickCompleteTriage}
          />
        </>
      )}
    </MainPaper>
  );
};
