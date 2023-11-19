import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import { Chip } from "@mui/material";

export const AllergiesCard = () => {
  const allergies = [
    { id: "1", allergy: "Penicillin" },
    { id: "2", allergy: "Anticonvulsants" },
    { id: "3", allergy: "Aspirin" },
    { id: "4", allergy: "Sulfa drugs" },
    { id: "5", allergy: "Ibuprofen" },
  ];
  return (
    <MainPaper elevation={0} sx={{ p: 1 }}>
      <MainTypography variant="h5" fontWeight={"700"}>
        Allergies
      </MainTypography>
      <br />
      <WrapperBox>
        {allergies.map(({ allergy, id }) => (
          <Chip key={id} sx={{ mr: 1, mb: 1 }} label={allergy} />
        ))}
      </WrapperBox>
    </MainPaper>
  );
};
