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
      headerName: "Option Set",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "options",
      headerName: "Options",
      renderCell: (cell: any) => {
        return 9;
      },
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
          />
        );
      },
    },
  ];

  return (
    <WrapperBox sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <MainCard sx={{ py: 2, px: 2, width: "50%", alignItems: "flex-start" }}>
        <TitleWithBack title="Option Sets" />
        <MainButton
          sx={{ mb: 2, fontSize: "0.7rem" }}
          onClick={() => router.push("/option-sets/create")}
          title="Create Option Set"
        />
        <BaseTable columns={columns} rows={rows} />
      </MainCard>
    </WrapperBox>
  );
}

export const TableOptions: FC<{
  onView: () => void;
  onEdit: () => void;

  onDelete: () => void;
  buttonText?: string;
  sx?: any;
}> = ({ onDelete, onEdit, onView, buttonText, sx }) => {
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
