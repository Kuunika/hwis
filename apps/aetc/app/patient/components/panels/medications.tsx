import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import { Panel } from ".";
import { useNavigation } from "@/hooks";
import { FaPlus } from "react-icons/fa";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";

export const Medications = () => {
  const { navigateTo } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel
      title="Medications"
      icon={
        <MainButton
          variant="text"
          icon={<FaPlus />}
          onClick={() => navigateTo("/medications")}
        />
      }
    >
      <br />
      <MedicationRow medicine="Metformin Extended" />
      <MedicationRow medicine="Metformin Extended" />
      <MedicationRow medicine="Metformin Extended" />
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
          //fontFamily: "Inter",
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
