import { getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import {
  getPatientsWaitingForAssessment,
  getPatientsWaitingForTriage,
} from "@/hooks/patientReg";
import { getPatientEncounters } from "@/services/encounter";
import { BaseTable, MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import Image from "next/image";

export const ClientWaitingForAssessment = () => {
  const { navigateTo } = useNavigation();
  const { data: patients, isLoading } = getPatientsWaitingForAssessment();


  // const customOrder = { "red": 0, "yellow": 1, "green": 2 };

  const rows = patients?.map((p) => ({ id: p?.uuid, ...p, arrival_time: getTime(p.arrival_time) }));

  // const rows = [
  //   {
  //     id: "1",
  //     firstName: "John",
  //     lastName: "Doe",
  //     gender: "Male",
  //     dob: "08 January 1995",
  //     triageCategory: "red",
  //     patientWaitingTime: "10 min",
  //     aggreWaitingTime: "30 min",
  //   },
  //   {
  //     id: "2",
  //     firstName: "Jane",
  //     lastName: "Doe",
  //     gender: "Female",
  //     dob: "08 January 1995",
  //     triageCategory: "green",
  //     patientWaitingTime: "5 min",
  //     aggreWaitingTime: "30 min",
  //   },
  // ];

  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number", flex: 1 },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "arrival_time", headerName: "Arrival Time", flex: 1 },
    { field: "birthdate", headerName: "Date Of Birth", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
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
      field: "triage_result",
      headerName: "Triage Category",
      flex: 1,
      sortModel: { field: "triage_result", sort: triageResultSort },
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
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"start"}
            onClick={() => navigateTo(`/patient/${cell.id}/profile`)}
          />
        );
      },
    },
  ];

  return (
    <BaseTable loading={isLoading} columns={columns} rows={rows ? rows : []} />
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

  const currentTime = Date.now();

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

  return (
    <MainTypography>{aggTime}</MainTypography>
  )
}

function CalculateWaitingTime({ patientId }: { patientId: string }) {
  const { data, isLoading } = getPatientsEncounters(patientId);


  const encounter = data?.find(encounter => encounter.encounter_type.name === 'Triage Result');

  if (isLoading) {
    return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  }

  if (!encounter) {
    return "No encounter data available";
  }

  const encounterDatetime = encounter.encounter_datetime;

  const currentTime = Date.now();

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

const triageResultSort = (rowA: any, rowB: any, sortBy: string) => {
  const triageA = rowA.values.triage_result;
  const triageB = rowB.values.triage_result;

  if (triageA === "red") {
    return -1;
  } else if (triageB === "red") {
    return 1;
  } else if (triageA === "yellow") {
    return -1;
  } else {
    return 0;
  }
};




