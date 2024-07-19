import { MainPaper, MainTypography, WrapperBox } from "@/components";
import { Chip, Typography } from "@mui/material";
import { getOnePatient } from "@/hooks/patientReg";
import { useNavigation, useParameters } from "@/hooks";
import { calculateAge } from "@/helpers/dateTime";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";

export const PersonalDetailsCard = ({ sx }: { sx?: any }) => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation()
  const { data: patient, isLoading } = getOnePatient(params.id as string);

  // const patient = patients?.find((p) => p.uuid == params.id);

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  return (
    <MainPaper elevation={0} sx={{ backgroundColor: "#fff", p: 1, ...sx }}>
      <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
        <WrapperBox
          sx={{
            background: "#E6E6E6",
            height: "5ch",
            width: "5ch",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: "2ch",
            color: "#636363",
          }}
        >
          <MainTypography variant="h6" fontWeight={"700"}>
            J
          </MainTypography>
        </WrapperBox>
        <WrapperBox>
          <MainTypography variant="h5" fontWeight={"700"}>
            {patient?.given_name + " " + patient?.family_name}
          </MainTypography>
        </WrapperBox>
      </WrapperBox>
      <br />

      <LabelValue label="ID" value="100777-1111-00000-999" />
      <LabelValue label="Gender" value={patient?.gender} />
      <LabelValue
        label="DOB"
        value={
          patient?.birthdate +
          `  (Age ${patient?.birthdate && calculateAge(patient?.birthdate)})`
        }
      />
      <LabelValue label="" value={<MainTypography onClick={() => navigateTo(`/patient/${params.id}/view`)} sx={{ color: "blue", cursor: "pointer" }} variant="inherit">see more</MainTypography>} />
      <WrapperBox
        sx={{
          display: "flex",
          alignItems: "flex-start",
          mb: "0.5ch",
          justifyContent: "space-between",
        }}
      >
        <WrapperBox sx={{ width: "10ch" }}>
          <MainTypography sx={{ fontSize: "0.8rem" }}>Allergies</MainTypography>
        </WrapperBox>
        <Allergies />
      </WrapperBox>
    </MainPaper>
  );
};

const LabelValue = ({ label, value }: { label: string; value: any }) => {
  return (
    <WrapperBox sx={{ display: "flex", alignItems: "flex-start", mb: "0.5ch" }}>
      <MainTypography width={"10ch"} sx={{ fontSize: "0.8rem" }}>
        {label}
      </MainTypography>
      <MainTypography sx={{ fontSize: "0.8rem" }}>{value}</MainTypography>
    </WrapperBox>
  );
};

export const Allergies = () => {
  const allergies:Array<{allergy:string, id:string}> = [
    // { id: "1", allergy: "Penicillin" },
    // { id: "3", allergy: "Aspirin" },
    // { id: "2", allergy: "Anticonvulsants" },
    // { id: "4", allergy: "Sulfa drugs" },
    // { id: "5", allergy: "Ibuprofen" },
  ];
  return (
    <WrapperBox sx={{ display: "flex", flexWrap: "wrap", width: "20ch" }}>
      {allergies.length==0 ? <Typography variant="caption">No Allergies added</Typography>:allergies.map(({ allergy, id }) => (
        // <WrapperBox sx={{ backgroundColor: "gray", m: "1px" }}>
        //   <MainTypography>{allergy}</MainTypography>
        // </WrapperBox>
        <Chip
          variant="outlined"
          size="small"
          color="error"
          key={id}
          sx={{
            m: "2px",
            backgroundColor: "#FECDCA",
            color: "#B42318",
            fontSize: "0.7rem",
            borderRadius: "1ch",
          }}
          label={allergy}
        />
      ))}
    </WrapperBox>
  );
};
