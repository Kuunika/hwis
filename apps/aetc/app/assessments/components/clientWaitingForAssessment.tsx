import { getCATTime, getTime } from "@/helpers/dateTime";
import { useState } from "react"
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import {
  getPatientsWaitingForAssessment,
  getPatientsWaitingForTriage,
} from "@/hooks/patientReg";
import { getPatientEncounters } from "@/services/encounter";
import { BaseTable, MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import Image from "next/image";
import { AbscondButton } from "@/components/abscondButton";

export const ClientWaitingForAssessment = () => {
  const [deleted, setDeleted] = useState('')
  const { navigateTo } = useNavigation();
  const { data: patients, isLoading, isRefetching } = getPatientsWaitingForAssessment();


  const rows = patients?.sort((p1, p2) => {
    if (p1.triage_result == 'red' && p2.triage_result == 'yellow') return -1;
    if (p1.triage_result == 'red' && p2.triage_result == 'green') return -1;
    if (p1.triage_result == 'yellow' && p2.triage_result == 'green') return -1;
    return 1

  }).map((p) => ({ id: p?.uuid, ...p, patient_arrival_time: getTime(p.arrival_time) }));


  const columns = [
    { field: "aetc_visit_number", headerName: "Visit No", },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "patient_arrival_time", headerName: "Arrival Time", flex: 1 },
    { field: "birthdate", headerName: "Date Of Birth", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    {
      field: "waiting", headerName: "WaitingTime", flex: 1, renderCell: (cell: any) => {
        return <CalculateWaitingTime arrival_time={cell.row.latest_encounter_time} patientId={cell.row.id} />
      }
    },
    {
      field: "aggreg", headerName: "Aggregate", flex: 1, renderCell: (cell: any) => {
        return <CalculateAggregateTime arrival_time={cell.row.arrival_time} patientId={cell.row.id} />
      }
    },
    {
      field: "triage_result",
      headerName: "Triage Category",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <WrapperBox
            sx={{
              borderRadius: "2px",
              width: "100%",
              height: "80%",
              backgroundColor:
                cell.value == "red"
                  ? "#B42318"
                  : cell.value == "yellow"
                    ? "#ede207"
                    // : "#B54708",
                    : "#016302",
              marginY: 1,
            }}
          ></WrapperBox>
        );
      },
    },
    // { field: "patientWaitingTime", headerName: "Waiting Time", flex: 1 },
    // {
    //   field: "aggreWaitingTime",
    //   headerName: "Aggre Waiting Time since arrival",
    //   flex: 1,
    // },
    {
      field: "action",
      headerName: "Action",
      flex: 1.2,
      renderCell: (cell: any) => {
        return (
          <>
            <MainButton
              sx={{ fontSize: "12px" }}
              title={"start"}
              onClick={() => navigateTo(`/patient/${cell.id}/profile`)}
            />
            <AbscondButton onDelete={() => setDeleted(cell.id)} visitId={cell.row.visit_uuid} patientId={cell.id} />
          </>
        );
      },
    },
  ];



  return (
    <BaseTable loading={isLoading || isRefetching} columns={columns} rows={rows ? rows : []} />
  );
};


function CalculateAggregateTime({ patientId, arrival_time }: { patientId: string, arrival_time: any }) {
  // const { data, isLoading } = getPatientsEncounters(patientId);


  // const encounter = data?.find(encounter => encounter.encounter_type.name === 'Initial Registration');

  // if (isLoading) {
  //   return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  // }


  // if (!encounter) {
  //   return "No encounter data available";
  // }

  // const encounterDatetime = encounter.encounter_datetime;

  const currentTime: any = getCATTime()

  const differenceInMilliseconds = currentTime - Date.parse(arrival_time);

  let aggTime;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  if (seconds < 60) {
    aggTime = `${seconds} seconds`;
  } else {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      aggTime = `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      aggTime = `${hours} hours`;
    }
  }

  return (
    <MainTypography>{aggTime}</MainTypography>
  )
}

function CalculateWaitingTime({ patientId, arrival_time }: { patientId: string, arrival_time: any }) {
  // const { data, isLoading } = getPatientsEncounters(patientId);


  // const encounter = data?.find(encounter => encounter.encounter_type.name === 'Triage Result');

  // if (isLoading) {
  //   return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  // }

  // if (!encounter) {
  //   return "No encounter data available";
  // }

  // const encounterDatetime = encounter.encounter_datetime;

  const currentTime: any = getCATTime()

  const differenceInMilliseconds = currentTime - Date.parse(arrival_time);

  let waitingTime;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  if (seconds < 60) {
    waitingTime = `${seconds} seconds`;
  } else {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      waitingTime = `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      waitingTime = `${hours} hours`;
    }
  }

  return (
    <MainTypography>{waitingTime}</MainTypography>
  )
}






