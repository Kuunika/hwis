"use client";
import { useForm } from "@/hooks";
import { BaseTable } from "shared-ui/src";
import { FC } from "react";
import {
  TableOptionDrop,
  TableOptionMenuItem,
  TitleWithBack,
} from "@/components/common";
import { HiPencilAlt, HiEye, HiTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function () {
  const { data: forms } = useForm().getForms();
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: " Form Name",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (cell: any) => {
        return (
          <TableOptions
            onDelete={() => {}}
            onView={() => router.push(`forms/${cell.id}`)}
            onEdit={() => {}}
          />
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={forms ? forms : []} />;
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
        title="preview"
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
