import { TriagePrintTemplate } from "../barcode";
import { GenericDialog } from "../dialog";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Button } from "@mui/material";
import { concepts, encounters } from "@/constants";
import { useEffect, useState } from "react";
import { VitalFormConfig } from "@/app/vitals/components/vitalsForm";
import { getObservationValue } from "@/helpers/emr";
import { Encounter, Obs } from "@/interfaces";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

type Props = {
  open: boolean;
  onClose: () => void;
  presentingComplaints: string;
  triageCategory: string;
  date: string;
  referredFrom: string;
  triagedBy: string;
  vitals: Array<any>;
  arrivalTime: string;
};

export const PatientTriageBarcodePrinter = (props: Props) => {
  return (
    <GenericDialog
      maxWidth="sm"
      open={props.open}
      onClose={props.onClose}
      title="Print Triage details"
    >
      <TriagePrintTemplate
        presentingComplaints={props.presentingComplaints}
        triageCategory={props.triageCategory}
        date={props.date}
        arrivalTime={props.arrivalTime}
        referredFrom={props.referredFrom}
        triagedBy={props.triagedBy}
        vitals={props.vitals}
      />
    </GenericDialog>
  );
};

export const FetchAndDisplayTriageBarcode = ({
  patientId,
  activeVisitId,
  arrivalDateTime,
}: {
  patientId: string;
  activeVisitId: any;
  arrivalDateTime: string;
}) => {
  const { data: referralData, isLoading } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.REFERRAL}`
  );
  const { data: vitalsData, isLoading: loadingVitals } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.VITALS}`
  );
  const { data: presentingComplaintsData, isLoading: presentingLoading } =
    getPatientsEncounters(
      patientId as string,
      `encounter_type=${encounters.PRESENTING_COMPLAINTS}`
    );
  const { data: triageResultData, isLoading: triageResultLoading } =
    getPatientsEncounters(
      patientId as string,
      `encounter_type=${encounters.TRIAGE_RESULT}`
    );
  const [vitals, setVitals] = useState<Array<{ name: string; value: string }>>(
    []
  );

  const [presentingComplaints, setPresentingComplaints] = useState<string>("");
  const [referred, setReferred] = useState("");
  const [triageCategory, setTriageCategory] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [triagedBy, setTriagedBy] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    extractTriageEncounters();
  }, [referralData, presentingComplaintsData, triageResultData, vitalsData]);

  const extractTriageEncounters = () => {
    const referral = getActiveEncounter(referralData as Encounter[]);

    setReferred(
      referral ? getObservationValue(referral?.obs, concepts.REFERRED_FROM) : ""
    );
    const presentingComplaints = getActiveEncounter(
      presentingComplaintsData as Encounter[]
    );

    console.log({ presentingComplaints });

    setPresentingComplaints(
      presentingComplaints?.obs.reduce((prev: any, current: Obs) => {
        return prev == "" ? current.value : prev + "," + current.value;
      }, "") as string
    );
    const triage = getActiveEncounter(triageResultData as Encounter[]);

    setTriageCategory(triage?.obs[0].value);
    setDateTime(getHumanReadableDateTime(triage?.encounter_datetime));
    setTriagedBy(triage?.created_by as string);

    const obs = getActiveEncounter(vitalsData as Encounter[])?.obs ?? [];
    const vitals = [
      {
        name: VitalFormConfig.saturationRate.short,
        value: getObservationValue(obs, VitalFormConfig.saturationRate.name),
      },
      {
        name: VitalFormConfig.heartRate.short,
        value: getObservationValue(obs, VitalFormConfig.heartRate.name),
      },
      {
        name: VitalFormConfig.bloodPressure.short,
        value: `${getObservationValue(obs, VitalFormConfig.bloodPressure.name)}/${getObservationValue(obs, VitalFormConfig.bloodPressureDiastolic.name)}`,
      },
      {
        name: VitalFormConfig.respiratoryRate.short,
        value: getObservationValue(obs, VitalFormConfig.respiratoryRate.name),
      },
      {
        name: VitalFormConfig.temperature.short,
        value: getObservationValue(obs, VitalFormConfig.temperature.name),
      },
      {
        name: VitalFormConfig.avpu.label,
        value: getObservationValue(obs, VitalFormConfig.avpu.name),
      },
      {
        name: `${VitalFormConfig.glucose.label}(${getObservationValue(obs, VitalFormConfig.units.name)}`,
        value: getObservationValue(obs, VitalFormConfig.glucose.name),
      },
    ];
    setVitals(vitals);
  };

  const getActiveEncounter = (data: Encounter[]) => {
    return data?.find((d) => d.visit.uuid == activeVisitId);
  };

  return (
    <>
      <Button
        variant="text"
        sx={{
          fontSize: "12px",
          color: "ButtonText",
          textTransform: "capitalize",
          textAlign: "left",
        }}
        onClick={() => setOpen(true)}
      >
        Triage
      </Button>
      <PatientTriageBarcodePrinter
        arrivalTime={getHumanReadableDateTime(arrivalDateTime)}
        open={open}
        onClose={() => setOpen(false)}
        triageCategory={triageCategory}
        triagedBy={triagedBy}
        referredFrom={referred}
        date={dateTime}
        presentingComplaints={presentingComplaints}
        vitals={vitals}
      />
    </>
  );
};
