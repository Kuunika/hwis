import { useNavigation } from "@/hooks";
import {
  getPatientsWaitingForAssessment,
  getPatientsWaitingForTriage,
} from "@/hooks/patientReg";
import { BaseTable, MainButton, WrapperBox } from "shared-ui/src";

export const ClientWaitingForAssessment = () => {
  const { navigateTo } = useNavigation();
  const { data: patients, isLoading } = getPatientsWaitingForTriage();

  const rows = patients?.map((p) => ({ id: p?.uuid, ...p }));

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
    { field: "dob", headerName: "Date Of Birth", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    {
      field: "triageCategory",
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
                  : cell.value == "green"
                  ? "#016302"
                  : "#B54708",
              marginY: 1,
            }}
          ></WrapperBox>
        );
      },
    },
    { field: "patientWaitingTime", headerName: "Waiting Time", flex: 1 },
    {
      field: "aggreWaitingTime",
      headerName: "Aggre Waiting Time since arrival",
      flex: 1,
    },
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
