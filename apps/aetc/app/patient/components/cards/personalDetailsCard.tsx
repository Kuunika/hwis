import { MainCard, MainPaper, MainTypography, WrapperBox } from "shared-ui/src";

export const PersonalDetailsCard = () => {
  return (
    <MainPaper elevation={0} sx={{ backgroundColor: "#fff", p: 1 }}>
      <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
        <WrapperBox
          sx={{
            background: "#EBFFEB",
            height: "5ch",
            width: "5ch",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: "2ch",
          }}
        >
          <MainTypography variant="h6" fontWeight={"700"}>
            J
          </MainTypography>
        </WrapperBox>
        <WrapperBox>
          <MainTypography variant="h5" fontWeight={"700"}>
            John Doe
          </MainTypography>
        </WrapperBox>
      </WrapperBox>
      <br />

      <LabelValue label="ID" value="100777-1111-00000-999" />
      <LabelValue label="Gender" value="Female" />
      <LabelValue label="DOB" value="08 January, 1995" />
    </MainPaper>
  );
};

const LabelValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <WrapperBox sx={{ display: "flex", alignItems: "center", mb: "1ch" }}>
      <MainTypography width={"10ch"} variant="subtitle2">
        {label}
      </MainTypography>
      <MainTypography variant="subtitle2">{value}</MainTypography>
    </WrapperBox>
  );
};
