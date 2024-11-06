import { BaseTable } from "@/components";
import { useNavigation } from "@/hooks";
import { getPrinters } from "@/hooks/loadStatic";
import { Button } from "@mui/material";

export const PrinterList = () => {
  const { isPending, data } = getPrinters();
  const { navigateTo } = useNavigation();

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "ip_address", headerName: "Link", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        const userId = cell.row.id;
        return (
          <>
            <Button
              variant="contained"
              sx={{ fontSize: "12px", marginLeft: "2px" }}
              onClick={() => {
                navigateTo(`/config/printers/${cell.id}/edit`);
              }}
            >
              edit
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <BaseTable
      searchPlaceHolder="search printer"
      showSearchSwitchButton={false}
      loading={isPending}
      rows={data ? data : []}
      columns={columns}
    />
  );
};
