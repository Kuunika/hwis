import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `0px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  maxHeight: "300px",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  padding: theme.spacing(1),
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableRow = styled(TableRow)(({ theme, index }: any) => ({
  backgroundColor:
    index % 2 === 0 ? theme.palette.grey[50] : theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer", // Add cursor pointer to indicate clickable rows
}));

const HeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: "bold",
  border: `1px solid ${theme.palette.divider}`,
}));

interface TableProps {
  columns: { label: string; field: string }[];
  data: any[];
  actions?: boolean;
  getSelectedRow?: (row: any) => void;
}

const MinimalTable: React.FC<TableProps> = ({
  columns,
  data,
  actions = false,
  getSelectedRow,
}) => {
  return (
    <>
      <StyledTableContainer>
        <Table stickyHeader>
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
                  <StyledTableCell key={colIndex}>
                    {row[column.field]}
                  </StyledTableCell>
                ))}
                {actions && (
                  <StyledTableCell>
                    <IconButton aria-label="edit" color="primary" size="small">
                      {/* Action icons can be added here */}
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      size="small"
                    >
                      {/* Action icons can be added here */}
                    </IconButton>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </>
  );
};

export default MinimalTable;
