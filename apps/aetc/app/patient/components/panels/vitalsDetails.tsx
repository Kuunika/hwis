import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation, useParameters } from "@/hooks";
import { BasicSelect } from "../basicSelect";
import { getPatientsEncounters } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { useEffect, useState } from "react";

export const VitalsPanel = () => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [vitals, setVitals] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const encounter = data?.find(
        (d) => d?.encounter_type.uuid == encounters.VITALS
      );

      const obs = encounter?.obs;
      const initialVitals = [
        {
          name: "Oxygen Saturation (%)",
          value: getObservationValue(obs, concepts.SATURATION_RATE),
        },

        {
          name: "Heart Rate (bpm)",
          value: getObservationValue(obs, concepts.HEART_RATE),
        },
        {
          name: "Blood Pressure (mmHg)",
          value: `${getObservationValue(
            obs,
            concepts.BLOOD_PRESSURE_SYSTOLIC
          )}/${getObservationValue(obs, concepts.BLOOD_PRESSURE_DIASTOLIC)}`,
        },
        {
          name: "Respiratory Rate (bpm)",
          value: getObservationValue(obs, concepts.RESPIRATORY_RATE),
        },
        {
          name: "Temperature (°C)",
          value: getObservationValue(obs, concepts.TEMPERATURE),
        },
        {
          name: "Glucose (mg/dL)",
          value: getObservationValue(obs, concepts.GLUCOSE),
        },
        {
          name: "AVPU",
          value: getObservationValue(obs, concepts.AVPU),
        },
      ];
      setVitals(initialVitals);
    }
  }, [data]);

  const options = [
    { label: "1", value: "1" },
    { label: "2 ", value: "2" },
    { label: "3", value: "3" },
  ];
  return (
    <Panel
      title="Vitals"
      icon={<MainButton variant="text" icon={<FaPlus />} onClick={() => {}} />}
    >
      <br />
      <WrapperBox>
        <WrapperBox width={"20%"}>
          <BasicSelect label="" options={options} />
        </WrapperBox>
      </WrapperBox>
      <br />
      <WrapperBox sx={{ display: "flex", flexWrap: "wrap" }}>
        {vitals.map(({ name, value }: any) => (
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
        my: "0.5ch",
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
