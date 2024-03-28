import { getCATTime, getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientsWaitingForPrescreening } from "@/hooks/patientReg";
import { getVisitNum } from "@/hooks/visitNumber";
import { useEffect, useState } from "react";
import { BaseTable, MainButton, MainTypography } from "shared-ui/src";
import Image from "next/image";
import { AbscondButton } from "@/components/abscondButton";

export const InitialRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const { data } = getVisitNum();
  const [deleted, setDeleted] = useState('')
  const {
    data: patients,
    isLoading,
    isRefetching
  } = getPatientsWaitingForPrescreening();

  const rows = patients?.sort((p1, p2) => {
    return Number(p1.aetc_visit_number) - Number(p2.aetc_visit_number)
  })?.map((p) => ({ id: p?.uuid, ...p, arrival_time: getTime(p.arrival_time) })).filter(p => p.id != deleted)



  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number", flex: 1 },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "arrival_time", headerName: "Arrival Time", flex: 1 },
    {
      field: "waiting", headerName: "WaitingTime", flex: 1, renderCell: (cell: any) => {
        return <CalculateWaitingTime patientId={cell.row.id} />
      }
    },

    {
      field: "action",
      flex: 1,
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <>
            <MainButton
              sx={{ fontSize: "12px" }}
              title={"screen"}
              onClick={() => navigateTo(`/prescreening/${cell.id}`)}
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

function CalculateWaitingTime({ patientId }: { patientId: string }) {
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

  console.log(Date.now())

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

  return (
    <MainTypography>{waitingTime}</MainTypography>
  )
}