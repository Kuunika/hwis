import { getCATTime, getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientsWaitingForRegistrations } from "@/hooks/patientReg";
import { BaseTable, MainButton, MainTypography } from "shared-ui/src";

import Image from "next/image";
import { AbscondButton } from "@/components/abscondButton";
import { useContext, useState } from "react";
import { Identifier } from "@/interfaces";
import { SearchRegistrationContext, SearchRegistrationContextType } from "@/contexts";


export const WaitingRegistrationList = () => {
  const [deleted, setDeleted] = useState('')
  const { navigateTo } = useNavigation();
  const {
    data: patients,
    isLoading,
    isRefetching
  } = getPatientsWaitingForRegistrations();
  const rows = patients?.map((p) => ({ id: p?.uuid, ...p, arrival_time: getTime(p.arrival_time) })).filter(p => p.id != deleted);
  const { setPatient, setRegistrationType, setSearchedPatient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number" },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "arrival_time", headerName: "Arrival Time", flex: 1 },
    {
      field: "waiting", headerName: "WaitingTime", flex: 1, renderCell: (cell: any) => {
        return <CalculateWaitingTime patientId={cell.row.id} />
      }
    },
    {
      field: "aggreg", headerName: "Aggregate", flex: 1, renderCell: (cell: any) => {
        return <CalculateAggregateTime patientId={cell.row.id} />
      }
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (cell: any) => {

        // const id = cell.row?.identifiers?.find((id: Identifier) => id.identifier_type.name == 'National id');

        // console.log({ id })



        const link = cell.row.gender != 'N/A' ? `/registration/${cell.id}/new` : `/registration/${cell.id}/search`;

        return (
          <>

            <MainButton
              sx={{ fontSize: "12px" }}
              title={"start"}
              onClick={() => {
                if (cell.row.gender != 'N/A') {
                  setSearchedPatient({
                    firstName: cell.row.given_name,
                    lastName: cell.row.family_name,
                    gender: cell.row.gender
                  })
                  setPatient(cell.row)
                  setRegistrationType('local');
                }
                navigateTo(link)
              }}
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

function CalculateAggregateTime({ patientId }: { patientId: string }) {
  const { data, isLoading } = getPatientsEncounters(patientId);


  const encounter = data?.find(encounter => encounter.encounter_type.name === 'Initial Registration');

  if (isLoading) {
    return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  }
  if (!encounter) {
    return "No encounter data available";
  }

  const encounterDatetime = encounter.encounter_datetime;

  const currentTime: any = getCATTime()

  const differenceInMilliseconds = currentTime - Date.parse(encounterDatetime);

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
  if (isLoading) {
    return "loading..."
  }
  return (
    <MainTypography>{aggTime}</MainTypography>
  )
}

function CalculateWaitingTime({ patientId }: { patientId: string }) {
  const { data, isLoading } = getPatientsEncounters(patientId);



  const encounter = data?.find(encounter => encounter.encounter_type.name === 'Screening');

  if (isLoading) {
    return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  }

  if (!encounter) {
    return "No encounter data available";
  }

  const encounterDatetime = encounter.encounter_datetime;

  const currentTime: any = getCATTime()

  const differenceInMilliseconds = currentTime - Date.parse(encounterDatetime);

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
  if (isLoading) {
    return "loading..."
  }
  return (
    <MainTypography>{waitingTime}</MainTypography>
  )
}