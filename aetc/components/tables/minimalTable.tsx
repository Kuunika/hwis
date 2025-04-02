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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  maxHeight: "400px",
  minHeight: "200px", // Add minimum height
  boxShadow: theme.shadows[3],
  position: "relative", // Ensure this is set for absolute children
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
  maxWidth: "200px",
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

const LoadingWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
  zIndex: 1, // Ensure it appears above the table
}));

interface TableProps {
  columns: { label: string; field: string }[];
  data: any[];
  actions?: boolean;
  getSelectedRow?: (row: any) => void;
  loading?: boolean;
}

export const MinimalTable: React.FC<TableProps> = ({
  columns,
  data,
  actions = false,
  getSelectedRow,
  loading = false,
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                <LoadingWrapper>
                  <CircularProgress />
                </LoadingWrapper>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
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
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
