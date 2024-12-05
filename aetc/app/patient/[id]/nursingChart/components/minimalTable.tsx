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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
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
  borderBottom: `1px solid ${theme.palette.divider}`, // Add row border
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
}

const MinimalTable: React.FC<TableProps> = ({
  columns,
  data,
  actions = false,
}) => {
  return (
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
            <StyledTableRow key={index}>
              {columns.map((column, colIndex) => (
                <StyledTableCell key={colIndex}>
                  {row[column.field]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default MinimalTable;
