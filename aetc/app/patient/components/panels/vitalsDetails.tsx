import { MainTypography, WrapperBox } from "@/components";
import { useParameters, useVitals } from "@/hooks";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { Paper } from "@mui/material";
import FlowStarter from "../flowStarter";

export const VitalsPanel = () => {
  const { isLoading, vitals } = useVitals();

  const { params } = useParameters();

  if (isLoading) {
    return <ProfilePanelSkeletonLoader height={120} />;
  }
  return (
    <Paper elevation={3}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem", padding: "1ch" }}>
          Most recent Vitals & Biometrics
        </div>
        <div style={{ padding: "1ch" }}>
          <FlowStarter patient={params} />
        </div>
      </div>
      <div
        style={{ overflowX: "scroll", marginLeft: "10px", marginRight: "10px" }}
      >
        <WrapperBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: "1ch",
            minWidth: "854px",
          }}
        >
          {vitals.map(({ name, value }: any) => (
            <Cell key={`${value}${name}`} title={name} value={value} />
          ))}
        </WrapperBox>
      </div>
    </Paper>
  );
};

const Cell = ({ title, value }: { title: string; value: string }) => {
  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <MainTypography
          style={{ marginBottom: " 15px", fontSize: "14px", padding: "10px" }}
          variant="caption"
          textAlign={"center"}
        >
          {title}
        </MainTypography>
        <MainTypography
          sx={{ fontWeight: "bold", padding: "5px" }}
          variant="h5"
          textAlign={"center"}
        >
          {value}
        </MainTypography>
      </div>
    </WrapperBox>
  );
};
