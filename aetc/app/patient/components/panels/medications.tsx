import { MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";

import { PrescribedMedicationList } from "../../[id]/nursingChart/components/prescribedMedicationList";

export const Medications = () => {
  return (
    <Panel title="Medications">
      <br />
      {/* <MedicationRow medicine="Metformin Extended" />
      <MedicationRow medicine="Metformin Extended" />
      <MedicationRow medicine="Metformin Extended" /> */}
      <PrescribedMedicationList />
    </Panel>
  );
};

const MedicationRow = ({ medicine }: { medicine: string }) => {
  return (
    <WrapperBox
      sx={{
        borderBottom: "1px solid #E6E6E6",
        borderBottomStyle: "dashed",
        mb: "1ch",
        py: "1ch",
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
          color: "#00190E",
          lineHeight: "21px",
          letterSpacing: "0em",
          textAlign: "left",
        }}
      >
        {medicine}
      </MainTypography>
      <MainTypography color={"#636363"}>
        750mg / Twice / daily / 30 days / until 2023-12-24
      </MainTypography>
    </WrapperBox>
  );
};
