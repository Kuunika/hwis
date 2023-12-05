import { useNavigation } from "@/hooks";
import { BaseTable, MainButton, WrapperBox } from "shared-ui/src";

export const ClientWaitingForAssessment = () => {
  const { navigateTo } = useNavigation();
  const rows = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dob: "08 January 1995",
      triageCategory: "red",
      patientWaitingTime: "10 min",
      aggreWaitingTime: "30 min",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Doe",
      gender: "Female",
      dob: "08 January 1995",
      triageCategory: "green",
      patientWaitingTime: "5 min",
      aggreWaitingTime: "30 min",
    },
  ];

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "dob", headerName: "Date Of Birth", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    {
      field: "triageCategory",
      headerName: "Triage Category",
      renderCell: (cell: any) => {
        console.log({ cell });
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
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"start"}
            onClick={() => navigateTo("/patient")}
          />
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={rows} />;
};
