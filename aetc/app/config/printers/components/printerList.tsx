import { BaseTable } from "@/components";
import { getPrinters } from "@/hooks/loadStatic";

export const PrinterList = () => {
  const { isPending, data } = getPrinters();

  console.log({ data });
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "ip_address", headerName: "Link", flex: 1 },
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
