import {
  MainButton,
  MainCard,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation } from "@/hooks";

export const VitalsPanel = () => {
  const { navigateTo } = useNavigation();

  const vitals = [
    {
      name: "Oxygen Saturation (%)",
      value: "98",
    },

    {
      name: "Heart Rate (bpm)",
      value: "98",
    },
    {
      name: "Blood Pressure (mmHg)",
      value: "120/80",
    },
    {
      name: "Respiratory Rate (bpm)",
      value: "16",
    },
    {
      name: "Temperature (°C)",
      value: "37",
    },
    {
      name: "Glucose (mg/dL)",
      value: "90",
    },
    {
      name: "AVPU",
      value: "Alert",
    },
  ];
  return (
    <Panel
      title="Vitals"
      icon={
        <MainButton
          variant="text"
          icon={<FaPlus />}
          onClick={() => navigateTo("/investigations")}
        />
      }
    >
      <WrapperBox sx={{ display: "flex", flexWrap: "wrap" }}>
        {vitals.map(({ name, value }) => (
          <Cell title={name} value={value} />
        ))}
      </WrapperBox>
    </Panel>
  );
};

const Cell = ({ title, value }: { title: string; value: string }) => {
  return (
    <WrapperBox
      sx={{
        width: "15ch",
        display: "flex",
        flexDirection: "column",
        my: "1ch",
        alignItems: "center",
      }}
    >
      <MainTypography variant="caption" textAlign={"center"}>
        {title}
      </MainTypography>
      <MainTypography variant="h5">{value}</MainTypography>
    </WrapperBox>
  );
};
