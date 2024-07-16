import {
  PatientProfileContext,
  PatientProfileContextType,
  TriageContext,
  TriageContextType,
} from "@/contexts";

import Button from "@mui/material/Button";
import { ReactNode, useContext, useEffect, useState } from "react";
import { BaseTable, MainButton, WrapperBox } from "@/components";
import {
  findEncounterObs,
  formatAllAirwayBreathing,
  formatAllCirculation,
  formatAllConsciousness,
  formatAllPersistentPain,
  formatAllVitalsToObject,
  getObservationValue,
} from "@/helpers/emr";
import { concepts, encounters } from "@/constants";
import { VitalFormConfig } from "@/app/vitals/components/vitalsForm";
import { AirwayBreathingForm } from "./airwayBreathingForm";
import { BloodFormConfig } from "./bloodCirculationForm";
import { ConsciousnessFormConfig } from "./consciousnessForm";
import { PersistentFormConfig } from "./persistentPainForm";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import { Box, Typography } from "@mui/material";
import { VisitsBar } from "@/app/patient/components";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { FaAngleDown } from "react-icons/fa";


export const TriageHistoryList = () => {
  const { activeVisit } = useContext(
    PatientProfileContext
  ) as PatientProfileContextType;
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);

  ///
  const [activePage, setActivePage] = useState<number>(0);
  const [vitals, setVitals] = useState<Array<any>>([]);
  const [airwayBreathing, setAirwayBreathing] = useState<Array<any>>([]);
  const [blood, setBlood] = useState<Array<any>>([]);
  const [consciousness, setConsciousness] = useState<Array<any>>([]);
  const [persistent, setPersistent] = useState<Array<any>>([]);
  ////////
  const [formattedVitals, setFormattedVitals] = useState<any>({});
  const [formattedAirway, setFormattedAirway] = useState<any>({});
  const [formattedConsciousness, setFormattedConsciousness] = useState<any>({});
  const [formattedBloodCirculation, setFormattedBloodCirculation] =
    useState<any>({});
  const [formattedPersistent, setFormattedPersistent] = useState<any>({});
  const [options, setOptions] = useState<Array<any>>([]);

  useEffect(() => {
    setOptions(
      Object.keys(formattedVitals).map((key) => ({
        value: Number(key),
        label: Number(key) + 1,
      }))
    );
    updateData();
  }, [formattedVitals, formattedAirway]);

  const updateData = () => {

    console.log("formatted==>",formattedAirway)
    updateAirwayBreathing(
      Object.keys(formattedAirway).length > 0 ? formattedAirway[activePage] : []
    );
    updateConsciousness(
      Object.keys(formattedConsciousness).length > 0
        ? formattedConsciousness[activePage]
        : []
    );
    updatePersistentForm(
      Object.keys(formattedPersistent).length > 0
        ? formattedPersistent[activePage]
        : []
    );
    updateVitals(
      Object.keys(formattedVitals).length > 0 ? formattedVitals[activePage] : []
    );
    updateBloodCirculation(
      Object.keys(formattedBloodCirculation).length > 0
        ? formattedBloodCirculation[activePage]
        : []
    );
  };

  useEffect(() => {
    if (data && activeVisit !== 0) {
      const vitalsObs = findEncounterObs(data, encounters.VITALS, activeVisit);
      const airwayObs = findEncounterObs(
        data,
        encounters.AIRWAY_ASSESSMENT,
        activeVisit
      );
      const consciousnessObs = findEncounterObs(
        data,
        encounters.CONSCIOUSNESS,
        activeVisit
      );
      const painObs = findEncounterObs(
        data,
        encounters.PERSISTENT_PAIN,
        activeVisit
      );
      const bloodObs = findEncounterObs(
        data,
        encounters.BLOOD_CIRCULATION,
        activeVisit
      );
      
      console.log("airway====>",{airwayObs})

      setFormattedVitals(formatAllVitalsToObject(vitalsObs));
      setFormattedAirway(formatAllAirwayBreathing(airwayObs));
      setFormattedConsciousness(formatAllConsciousness(consciousnessObs));
      setFormattedPersistent(formatAllPersistentPain(painObs));
      setFormattedBloodCirculation(formatAllCirculation(bloodObs));
    }
  }, [data, activeVisit]);

  const updateVitals = (obs: any) => {
    const initialVitals = [
      {
        name: `${VitalFormConfig.saturationRate.label} (%)`,
        value: getObservationValue(obs, concepts.OXYGEN_SATURATION),
      },

      {
        name: `${VitalFormConfig.heartRate.label} (bpm)`,
        value: getObservationValue(obs, concepts.HEART_RATE),
      },
      {
        name: `Blood Pressure (mmHg)`,
        value: `${getObservationValue(
          obs,
          concepts.BLOOD_PRESSURE_SYSTOLIC
        )}/${getObservationValue(obs, concepts.BLOOD_PRESSURE_DIASTOLIC)}`,
      },
      {
        name: `${VitalFormConfig.respiratoryRate.label} (bpm)`,
        value: getObservationValue(obs, concepts.RESPIRATORY_RATE),
      },
      {
        name: `${VitalFormConfig.temperature.label} (°C)`,
        value: getObservationValue(obs, concepts.TEMPERATURE),
      },
      {
        name: `${VitalFormConfig.glucose.label} (mg/dL)`,
        value: getObservationValue(obs, concepts.GLUCOSE),
      },
      {
        name: `${VitalFormConfig.avpu.label}`,
        value: getObservationValue(obs, concepts.AVPU),
      },
    ];
    setVitals(initialVitals);
  };

  const updateAirwayBreathing = (obs: any) => {
    const initialAirwayBreathing = [
      {
        name: `${AirwayBreathingForm.airway.label}`,
        value: getObservationValue(obs, concepts.IS_AIRWAY_COMPROMISED),
      },
      {
        name: `${AirwayBreathingForm.breathing.label}`,
        value: getObservationValue(obs, concepts.IS_BREATHING_ABNORMAL),
      },
      {
        name: `${AirwayBreathingForm.oxygenStats.label}`,
        value: getObservationValue(obs, concepts.OXYGEN_STATS_89),
      },
      {
        name: `${AirwayBreathingForm.respiratoryRate.label}`,
        value: getObservationValue(obs, concepts.RESPIRATORY_RATE_8_31),
      },
      {
        name: `${AirwayBreathingForm.respiratoryDysfunction.label}`,
        value: getObservationValue(obs, concepts.SEVERE_RESPIRATORY),
      },
      {
        name: `${AirwayBreathingForm.inabilityToSpeak.label}`,
        value: getObservationValue(obs, concepts.INABILITY_TO_SPEAK),
      },
      {
        name: `${AirwayBreathingForm.stridor.label}`,
        value: getObservationValue(obs, concepts.STRIDOR),
      },
      {
        name: `${AirwayBreathingForm.reducedLevelOfConsciousness.label}`,
        value: getObservationValue(obs, concepts.REDUCED_LEVEL_CONSCIOUSNESS),
      },
      {
        name: `${AirwayBreathingForm.oxygenSats9092.label}`,
        value: getObservationValue(obs, concepts.OXYGEN_STATS_90_92),
      },
      {
        name: `${AirwayBreathingForm.respiratoryRate92130.label}`,
        value: getObservationValue(obs, concepts.RESPIRATORY_RATE_9_21_30),
      },
    ];

    console.log("======>",initialAirwayBreathing);
    setAirwayBreathing(initialAirwayBreathing);
  };
  const updateBloodCirculation = (obs: any) => {
    const initialBloodForm = [
      {
        name: `${BloodFormConfig.isCirculationAbnormal.label}`,
        value: getObservationValue(obs, concepts.IS_CIRCULATION_ABNORMAL),
      },
      {
        name: `${BloodFormConfig.weakIrregularPulse.label}`,
        value: getObservationValue(obs, concepts.WEAK_THREADY),
      },
      {
        name: `${BloodFormConfig.heartRate.label}`,
        value: getObservationValue(obs, concepts.HEART_RATE),
      },
      {
        name: `${BloodFormConfig.pulseRate.label}`,
        value: getObservationValue(obs, concepts.PULSE_RATE),
      },
      {
        name: `${BloodFormConfig.reducedUrinaryOutput.label}`,
        value: getObservationValue(obs, concepts.REDUCED_URINARY_OUTPUT),
      },
      {
        name: `${BloodFormConfig.clammyPeripherals.label}`,
        value: getObservationValue(obs, concepts.CAPILLARY_REFILL),
      },
      {
        name: `${BloodFormConfig.hemorrhage.label}`,
        value: getObservationValue(obs, concepts.HEMORRHAGE),
      },
      {
        name: `${BloodFormConfig.dehydration.label}`,
        value: getObservationValue(obs, concepts.DEHYDRATION_SKIN),
      },
      {
        name: `${BloodFormConfig.heartRate5060.label}`,
        value: getObservationValue(obs, concepts.HEART_RATE_50),
      },
      {
        name: `${BloodFormConfig.temperature3738.label}`,
        value: getObservationValue(obs, concepts.TEMPERATURE),
      },
    ];

    setBlood(initialBloodForm);
  };

  const updateConsciousness = (obs: any) => {
    const initialConsciousnessForm = [
      {
        name: `${ConsciousnessFormConfig.consciousness.label}`,
        value: getObservationValue(
          obs,
          concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS
        ),
      },
      {
        name: `${ConsciousnessFormConfig.bloodGlucose.label}`,
        value: getObservationValue(obs, concepts.BLOOD_GLUCOSE),
      },
      {
        name: `${ConsciousnessFormConfig.gcs.label}`,
        value: getObservationValue(obs, concepts.GCS),
      },
    ];

    setConsciousness(initialConsciousnessForm);
  };
  const updatePersistentForm = (obs: any) => {
    const initialPersistentForm = [
      {
        name: `${PersistentFormConfig.activeSeizures.label}`,
        value: getObservationValue(obs, concepts.ACTIVE_SEIZURES),
      },
      {
        name: `${PersistentFormConfig.focalNeurological.label}`,
        value: getObservationValue(obs, concepts.FOCAL_NEUROLOGICAL),
      },
      {
        name: `${PersistentFormConfig.headache.label}`,
        value: getObservationValue(obs, concepts.HEADACHE),
      },
      {
        name: `${PersistentFormConfig.weakness.label}`,
        value: getObservationValue(obs, concepts.WEAKNESS),
      },
      {
        name: `${PersistentFormConfig.confusion.label}`,
        value: getObservationValue(obs, concepts.CONFUSION),
      },
      {
        name: `${PersistentFormConfig.severePain.label}`,
        value: getObservationValue(obs, concepts.SEVERE_PAIN),
      },
      {
        name: `${PersistentFormConfig.moderatePain.label}`,
        value: getObservationValue(obs, concepts.MODERATE_PAIN),
      },
    ];

    setPersistent(initialPersistentForm);
  };

  return (
    <>
    <VisitsBar />
    <Box>
    <Accordion>
    <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         Vitals
        </AccordionSummary>
        <AccordionDetails>
        <CellContainer>
        {vitals.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
        </CellContainer>
        </AccordionDetails>
    </Accordion>
    <Accordion>
    <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         Airway
        </AccordionSummary>
        <AccordionDetails>
        <CellContainer>
        {airwayBreathing.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
        </CellContainer>
        </AccordionDetails>
    </Accordion>
    <Accordion>
    <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         Blood Circulation
        </AccordionSummary>
        <AccordionDetails>
        <CellContainer>
        {blood.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
        </CellContainer>
        </AccordionDetails>
    </Accordion>
    <Accordion>
    <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         Disability
        </AccordionSummary>
        <AccordionDetails>
        <CellContainer>
        {consciousness.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
        </CellContainer>
        </AccordionDetails>
    </Accordion>
    <Accordion>
    <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
         Persistent Pain
        </AccordionSummary>
        <AccordionDetails>
        <CellContainer>
        {persistent.map(({ name, value }: any) => (
          <Cell key={`${value}${name}`} title={name} value={value} />
        ))}
        </CellContainer>
        </AccordionDetails>
    </Accordion>
    
    </Box>
      </>
  );
};


const CellContainer = ({children, }:{children: ReactNode})=>{
return <Box>
  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
    {children}
  </Box>
</Box>
}

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
      <Typography variant="caption" textAlign={"center"}>
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </WrapperBox>
  );
};

// export const TriageHistoryList = () => {
//   const { setShow } = useContext(TriageContext) as TriageContextType;
//   const rows = [
//     {
//       id: "1",
//       date: "12-dec-2023",
//       time: "08:00AM",
//       triageCategory: "red",
//       collectedBy: "Jane Doe",
//     },
//     {
//       id: "2",
//       date: "12-dec-2023",
//       time: "08:00AM",
//       triageCategory: "green",
//       collectedBy: "John Doe",
//     },
//   ];

//   const columns = [
//     { field: "date", headerName: "Date", flex: 1 },
//     { field: "time", headerName: "Time", flex: 1 },
//     {
//       field: "triageCategory",
//       headerName: "Category",
//       renderCell: (cell: any) => {
//         return (
//           <WrapperBox
//             sx={{
//               borderRadius: "2px",
//               width: "100%",
//               height: "80%",
//               backgroundColor:
//                 cell.value == "red"
//                   ? "#B42318"
//                   : cell.value == "green"
//                   ? "#016302"
//                   : "#B54708",
//               marginY: 1,
//             }}
//           ></WrapperBox>
//         );
//       },
//     },
//     { field: "collectedBy", headerName: "Collected By", flex: 1 },

//     {
//       field: "action",
//       headerName: "Action",
//       renderCell: (cell: any) => {
//         return (
//           <Button onClick={() => setShow(true)} variant="text">
//             View
//           </Button>
//         );
//       },
//     },
//   ];

//   return <BaseTable columns={columns} rows={rows} />;
// };
