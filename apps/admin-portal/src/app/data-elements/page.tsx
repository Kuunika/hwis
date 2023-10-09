"use client";
import { useState, useEffect, FC } from "react";
import { BaseTable, MainButton, MainCard, WrapperBox } from "shared-ui/src";
import { useRouter } from "next/navigation";
import { HiPencilAlt, HiEye, HiTrash } from "react-icons/hi";
import {
  TableOptionDrop,
  TableOptionMenuItem,
  TitleWithBack,
} from "../../components/common";

export default function Page() {
  const [rows, setRows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getDataElements = async () => {
      const response = await fetch("http://localhost:3000/data-elements");

      if (response.ok) {
        setRows(await response.json());
      }
    };

    getDataElements();
  }, []);
  const columns = [
    {
      field: "label",
      headerName: "Data Element",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",

      renderCell: (cell: any) => {
        return (
          <TableOptions
            onDelete={() => {}}
            onView={() => {}}
            onEdit={() => {}}
            onResetPassword={() => {}}
          />
        );
      },
    },
  ];

  return (
    <WrapperBox sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <MainCard sx={{ py: 2, px: 2, width: "50%", alignItems: "flex-start" }}>
        <TitleWithBack title="Data Elements" />
        <MainButton
          sx={{ mb: 2, fontSize: "0.7rem" }}
          onClick={() => router.push("/data-elements/create")}
          title="Create Data Element"
        />
        <BaseTable columns={columns} rows={rows} />
      </MainCard>
    </WrapperBox>
  );
}

export const TableOptions: FC<{
  onView: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onDelete: () => void;
  buttonText?: string;
  sx?: any;
}> = ({ onDelete, onResetPassword, onEdit, onView, buttonText, sx }) => {
  return (
    <TableOptionDrop buttonText={buttonText} sx={sx}>
      <TableOptionMenuItem
        onClick={() => onView()}
        icon={<HiEye />}
        title="view"
      />
      <TableOptionMenuItem
        onClick={() => onEdit()}
        icon={<HiPencilAlt />}
        title="edit"
      />
      <TableOptionMenuItem
        onClick={() => onDelete()}
        icon={<HiTrash />}
        title="delete"
      />
    </TableOptionDrop>
  );
};
