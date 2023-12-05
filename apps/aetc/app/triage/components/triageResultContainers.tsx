import { TriageResult } from "@/interfaces";
import { MainButton, MainPaper, MainTypography } from "shared-ui/src";

export const TriageContainer = ({
  message,
  result,
}: {
  message?: string;
  result: TriageResult;
}) => {
  const styles = {
    red: { backgroundColor: "#FECDCA", color: "#B42318" },
    yellow: { backgroundColor: "#FEDF89", color: "#B54708" },
    green: { backgroundColor: "#DDEEDD", color: "#016302" },
    "": {},
  };

  return (
    <MainPaper elevation={0} sx={{ ...styles[result], p: "1ch" }}>
      <MainTypography variant="h4" textTransform={"capitalize"}>
        Triage {result}
      </MainTypography>

      <MainTypography fontStyle={"italic"} variant="subtitle1">
        {result == "yellow" ? "Continue Assessment" : message}
      </MainTypography>

      {result == "red" && (
        <>
          <MainButton
            sx={{
              backgroundColor: "#B42318",
              "&:hover": { backgroundColor: "#B42318" },
            }}
            title={"Complete Triage"}
            onClick={() => {}}
          />
        </>
      )}
    </MainPaper>
  );
};
