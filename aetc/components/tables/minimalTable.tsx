import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  maxHeight: "400px",
  boxShadow: theme.shadows[3],
}));

const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: "separate",
  borderSpacing: "0px 4px",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  padding: "12px 16px",
  borderBottom: "none",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "200px", // Limit cell width to prevent excessive row height
}));

const HeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: "bold",
  backgroundColor: theme.palette.background.default,
  textTransform: "uppercase",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  transition: "background 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
  boxShadow: theme.shadows[1],
}));

interface TableProps {
  columns: { label: string; field: string }[];
  data: any[];
  actions?: boolean;
  getSelectedRow?: (row: any) => void;
}

export const MinimalTable: React.FC<TableProps> = ({
  columns,
  data,
  actions = false,
  getSelectedRow,
}) => {
  return (
    <StyledTableContainer>
      <StyledTable stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <HeaderCell key={index}>{column.label}</HeaderCell>
            ))}
            {actions && <HeaderCell>Actions</HeaderCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={index}
              onClick={() => getSelectedRow && getSelectedRow(row)}
            >
              {columns.map((column, colIndex) => (
                <Tooltip key={colIndex} title={row[column.field]} arrow>
                  <StyledTableCell>{row[column.field]}</StyledTableCell>
                </Tooltip>
              ))}
              {actions && (
                <StyledTableCell>
                  <IconButton aria-label="edit" color="primary" size="small">
                    {/* Edit Icon */}
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    size="small"
                  >
                    {/* Delete Icon */}
                  </IconButton>
                </StyledTableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
