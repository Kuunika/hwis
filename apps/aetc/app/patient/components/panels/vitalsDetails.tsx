import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import { useNavigation, useParameters } from "@/hooks";
import { BasicSelect } from "../basicSelect";
import { getPatientsEncounters } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { useContext, useEffect, useState } from "react";

import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { PatientProfileContext, PatientProfileContextType } from "@/contexts";

export const VitalsPanel = () => {

  const { activeVisit, setVisits, setActiveVisit } = useContext(PatientProfileContext) as PatientProfileContextType
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [vitals, setVitals] = useState<any>([]);




  useEffect(() => {

    if (data) {

      const uniqueArray: any = {};
      data?.forEach(item => {
        uniqueArray[item.visit_id] = false
      });
      const visits = Object.keys(uniqueArray);
      setVisits(visits)
      setActiveVisit(visits[0]);
    }

  }, [data])




  // useEffect(() => {
  //   if (data && activeVisit !== 0) {
  //     const encounter = data.filter(
  //       (d) => d?.encounter_type.uuid == encounters.VITALS
  //     ).find(d => d.visit_id == activeVisit);

  //     const obs = encounter?.obs;

  //     updateVitals(obs);

  //   }
  // }, [data]);


  useEffect(() => {
    if (data && activeVisit !== 0) {
      const encounter = data.filter(
        (d) => d?.encounter_type.uuid == encounters.VITALS
      ).find(d => d.visit_id == activeVisit);
      const obs = encounter?.obs;

      updateVitals(obs);

    }
  }, [activeVisit]);




  const updateVitals = (obs: any) => {
    const initialVitals = [
      {
        name: "Oxygen Saturation (%)",
        value: getObservationValue(obs, concepts.OXYGEN_SATURATION),
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

  const options = [
    { label: "1", value: "1" },
    { label: "2 ", value: "2" },
    { label: "3", value: "3" },
  ];

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  return (
    <Panel
      title="Vitals"
      icon={<MainButton variant="text" icon={<FaPlus />} onClick={() => { }} />}
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
          <Cell key={`${value}${name}`} title={name} value={value} />
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
