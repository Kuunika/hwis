import { useNavigation } from "@/hooks";
import { getPrinters } from "@/hooks/loadStatic";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Avatar,
  TextField,
  Pagination,
  IconButton,
} from "@mui/material";
import { useState, useMemo } from "react";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";

export const PrinterList = () => {
  const { isPending, data } = getPrinters();
  const { navigateTo } = useNavigation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // 🔍 Filter printers
  const filteredPrinters = useMemo(() => {
    if (!data) return [];
    return data.filter((p) =>
      p?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredPrinters.length / pageSize);
  const paginatedPrinters = filteredPrinters.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 🔍 Search Input */}
      <Box mb={2} display="flex" justifyContent="space-between">
        <TextField
          size="small"
          placeholder="Search printer..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          sx={{ width: "300px" }}
        />
      </Box>

      {/* 🖨️ Printer Cards Grid */}
      <Grid container spacing={2}>
        {paginatedPrinters.map((printer) => {
          const printerId = printer?.id;
          const name = printer?.name || "Unknown";
          const ip = printer?.ip_address || "—";

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={printerId}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" sx={{flexDirection:"column"}} alignItems="start" mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: "gray", // <-- Avatar background is now gray
                        mr: 2,
                      }}
                    >
                      <PrintIcon /> {/* icon color is default */}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      {name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {ip}
                  </Typography>
                </CardContent>

                {/* 🔘 Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    p: 1,
                  }}
                >
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() =>
                      navigateTo(`/config/printers/${printerId}/edit`)
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
