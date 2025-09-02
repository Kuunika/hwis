import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

type ResultItem = {
  test: string;
  result: string;
};

type PlanData = {
  plan: string;
  result: ResultItem[];
};

interface Props {
  data: PlanData[];
  title?: string;
}

const ResultsTableWithRowSpan: React.FC<Props> = ({ data, title }) => {
  return (
    <TableContainer component={Paper}>
        <h3>{title}</h3>
        <br />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Plan</strong>
            </TableCell>
            <TableCell>
              <strong>Test(s)</strong>
            </TableCell>
            <TableCell>
              <strong>Result(s)</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((planItem, planIndex) => {
            const results =
              planItem.result.length > 0
                ? planItem.result
                : [{ test: "—", result: "—" }];

            return results.map((r, i) => (
              <TableRow key={`${planIndex}-${i}`}>
                {i === 0 && (
                  <TableCell
                    rowSpan={results.length}
                    sx={{ verticalAlign: "top", backgroundColor: "#fafafa" }}
                  >
                    <Typography variant="body2">{planItem.plan}</Typography>
                  </TableCell>
                )}

                {/* Test Cell */}
                <TableCell sx={{ p: 0 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderBottom:
                        i < results.length - 1 ? "1px solid #eee" : "none",
                    }}
                  >
                    <Typography variant="body2">{r.test}</Typography>
                  </Box>
                </TableCell>

                {/* Result Cell */}
                <TableCell sx={{ p: 0 }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderBottom:
                        i < results.length - 1 ? "1px solid #eee" : "none",
                    }}
                  >
                    <Typography variant="body2">{r.result}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTableWithRowSpan;
