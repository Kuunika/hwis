import { MainPaper, MainTypography } from "shared-ui/src";

export const TriageContainer = ({
  message,
  result,
}: {
  message?: string;
  result: "red" | "yellow";
}) => {
  const styles = {
    red: { backgroundColor: "#FECDCA", color: "#B42318" },
    yellow: { backgroundColor: "#FEDF89", color: "#B54708" },
  };
  return (
    <MainPaper elevation={0} sx={{ ...styles[result], p: "1ch" }}>
      <MainTypography variant="h4" textTransform={"capitalize"}>
        Triage {result}
      </MainTypography>

      <MainTypography variant="subtitle1">
        {result == "yellow" ? "Continue Assessment" : message}
      </MainTypography>
    </MainPaper>
  );
};
