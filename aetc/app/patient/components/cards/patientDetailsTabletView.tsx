import { MainPaper, MainTypography, WrapperBox } from "@/components";
import { Chip } from "@mui/material";
import { Panel } from "../panels";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useParameters } from "@/hooks";
import { getOnePatient, getPatientsWaitingForTriage } from "@/hooks/patientReg";
import { calculateAge } from "@/helpers/dateTime";

export const PersonalDetailsTabletView = ({ sx }: { sx?: any }) => {
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params.id as string);


  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel title="">
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
      <LabelValue label="Chronic Conditions" value="Diabetes, BP" />
      <LabelValue
        label="Medications"
        value="Insulin, Metaformin, Calcium Channel Blockers (CCBs):"
      />
    </Panel>
  );
};

const LabelValue = ({ label, value }: { label: string; value: any }) => {
  return (
    <WrapperBox sx={{ display: "flex", alignItems: "flex-start", mb: "0.5ch" }}>
      <MainTypography width={"15ch"} sx={{ fontSize: "0.8rem" }}>
        {label}
      </MainTypography>
      <MainTypography sx={{ fontSize: "0.8rem", fontWeight: "600" }}>
        {value}
      </MainTypography>
    </WrapperBox>
  );
};

export const Allergies = () => {
  const allergies = [
    { id: "1", allergy: "Penicillin" },
    { id: "3", allergy: "Aspirin" },
    { id: "2", allergy: "Anticonvulsants" },
    { id: "4", allergy: "Sulfa drugs" },
    { id: "5", allergy: "Ibuprofen" },
  ];
  return (
    <WrapperBox sx={{ display: "flex", flexWrap: "wrap", width: "20ch" }}>
      {allergies.map(({ allergy, id }) => (
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
