import { useNavigation } from "@/hooks";
import { BaseTable, MainButton } from "shared-ui/src";

export const BroughtInDeadList = () => {
  const { navigateTo } = useNavigation();
  const rows = [
    {
      id: "1",
      placeOfDeath: "Ndirande",
      dateOfDeath: "08 December 2023",
      timeOfDeath: "12:01 PM",
      gender: "Male",
      broughtBy: "John Doe",
      contact: "+26599999990",
      confirmedBy: "Dr Jane Doe",
      dateOfConfirmation: "08 December 2023",
      timeOfConfirmingDeath: "14:01 PM",
    },
    {
      id: "2",
      placeOfDeath: "Kanengo",
      dateOfDeath: "09 December 2023",
      timeOfDeath: "10:30 AM",
      gender: "Female",
      broughtBy: "Jane Smith",
      contact: "+26598765432",
      confirmedBy: "Dr John Smith",
      dateOfConfirmation: "09 December 2023",
      timeOfConfirmingDeath: "12:30 PM",
    },
    {
      id: "3",
      placeOfDeath: "Lilongwe",
      dateOfDeath: "10 December 2023",
      timeOfDeath: "09:45 AM",
      gender: "Male",
      broughtBy: "James Johnson",
      contact: "+26591234567",
      confirmedBy: "Dr Sarah White",
      dateOfConfirmation: "10 December 2023",
      timeOfConfirmingDeath: "11:45 AM",
    },
    {
      id: "4",
      placeOfDeath: "Blantyre",
      dateOfDeath: "11 December 2023",
      timeOfDeath: "03:15 PM",
      gender: "Female",
      broughtBy: "Emily Brown",
      contact: "+26587654321",
      confirmedBy: "Dr Michael Black",
      dateOfConfirmation: "11 December 2023",
      timeOfConfirmingDeath: "05:15 PM",
    },
    {
      id: "5",
      placeOfDeath: "Zomba",
      dateOfDeath: "12 December 2023",
      timeOfDeath: "07:30 AM",
      gender: "Male",
      broughtBy: "Robert Green",
      contact: "+26599912345",
      confirmedBy: "Dr Lisa Gray",
      dateOfConfirmation: "12 December 2023",
      timeOfConfirmingDeath: "09:30 AM",
    },
    {
      id: "6",
      placeOfDeath: "Mzuzu",
      dateOfDeath: "13 December 2023",
      timeOfDeath: "01:45 PM",
      gender: "Female",
      broughtBy: "Ella White",
      contact: "+26598761234",
      confirmedBy: "Dr William Taylor",
      dateOfConfirmation: "13 December 2023",
      timeOfConfirmingDeath: "03:45 PM",
    },
    {
      id: "7",
      placeOfDeath: "Dedza",
      dateOfDeath: "14 December 2023",
      timeOfDeath: "11:00 AM",
      gender: "Male",
      broughtBy: "Peter Gray",
      contact: "+26591122334",
      confirmedBy: "Dr Emma Davis",
      dateOfConfirmation: "14 December 2023",
      timeOfConfirmingDeath: "01:00 PM",
    },
    {
      id: "8",
      placeOfDeath: "Karonga",
      dateOfDeath: "15 December 2023",
      timeOfDeath: "05:20 AM",
      gender: "Female",
      broughtBy: "Sophia Johnson",
      contact: "+26599887766",
      confirmedBy: "Dr Richard Black",
      dateOfConfirmation: "15 December 2023",
      timeOfConfirmingDeath: "07:20 AM",
    },
    {
      id: "9",
      placeOfDeath: "Mchinji",
      dateOfDeath: "16 December 2023",
      timeOfDeath: "02:10 PM",
      gender: "Male",
      broughtBy: "David Brown",
      contact: "+26598765432",
      confirmedBy: "Dr Olivia Green",
      dateOfConfirmation: "16 December 2023",
      timeOfConfirmingDeath: "04:10 PM",
    },
    {
      id: "10",
      placeOfDeath: "Thyolo",
      dateOfDeath: "17 December 2023",
      timeOfDeath: "08:45 AM",
      gender: "Female",
      broughtBy: "Maria Taylor",
      contact: "+26591122334",
      confirmedBy: "Dr Charles White",
      dateOfConfirmation: "17 December 2023",
      timeOfConfirmingDeath: "10:45 AM",
    },
  ];

  const columns = [
    { field: "placeOfDeath", headerName: "Place Of Death", flex: 1 },
    { field: "dateOfDeath", headerName: "Date Of Death", flex: 1 },
    { field: "timeOfDeath", headerName: "Time Of Death" },
    { field: "gender", headerName: "Gender" },
    { field: "broughtBy", headerName: "Brought By", flex: 1 },
    { field: "confirmedBy", headerName: "Confirmed By", flex: 1 },
    {
      field: "dateOfConfirmation",
      headerName: "Date Of Confirmation",
      flex: 1,
    },
    {
      field: "timeOfConfirmingDeath",
      headerName: "Time Of confirming Death",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"view"}
            onClick={() => {}}
          />
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={rows} />;
};
