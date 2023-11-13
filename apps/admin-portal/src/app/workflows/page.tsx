"use client";
import { getWorkflows } from "@/hooks";
import {
  BaseTable,
  MainButton,
  MainPaper,
  MainTypography,
} from "shared-ui/src";
import { FC } from "react";
import {
  BackButton,
  TableOptionDrop,
  TableOptionMenuItem,
} from "@/components/common";
import { HiPencilAlt, HiEye, HiTrash } from "react-icons/hi";
import { useNavigation } from "@/helpers";

export default function () {
  const { data: workflows } = getWorkflows();
  const { navigateTo } = useNavigation();

  const columns = [
    {
      field: "name",
      headerName: " Workflow Name",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (cell: any) => {
        return (
          <TableOptions
            onDelete={() => {}}
            onView={() => navigateTo(`workflows/${cell.id}/preview`)}
            onEdit={() => navigateTo(`workflows/${cell.id}/edit`)}
          />
        );
      },
    },
  ];

  return (
    <MainPaper elevation={0} sx={{ p: "2ch", m: "2ch" }}>
      <BackButton />
      <br />
      <MainTypography variant="h4">Workflows</MainTypography>
      <br />
      <br />
      <MainButton
        title={"Create Workflow"}
        onClick={() => navigateTo("workflows/create")}
      />
      <br />
      <br />
      <BaseTable columns={columns} rows={workflows ? workflows : []} />
    </MainPaper>
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
