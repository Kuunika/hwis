import { TriageContext, TriageContextType } from "@/contexts";

import Button from "@mui/material/Button";
import { useContext } from "react";
import { BaseTable, MainButton, WrapperBox } from "shared-ui/src";

export const TriageHistoryList = () => {
  const { setShow } = useContext(TriageContext) as TriageContextType;
  const rows = [
    {
      id: "1",
      date: "12-dec-2023",
      time: "08:00AM",
      triageCategory: "red",
      collectedBy: "Jane Doe",
    },
    {
      id: "2",
      date: "12-dec-2023",
      time: "08:00AM",
      triageCategory: "green",
      collectedBy: "John Doe",
    },
  ];

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    {
      field: "triageCategory",
      headerName: "Category",
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
    { field: "collectedBy", headerName: "Collected By", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <Button onClick={() => setShow(true)} variant="text">
            View
          </Button>
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={rows} />;
};
