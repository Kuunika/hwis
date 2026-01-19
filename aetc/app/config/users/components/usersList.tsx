import { useNavigation } from "@/hooks";
import { getAllUsers } from "@/hooks/users";

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
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { useState, useMemo } from "react";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// 🎨 Utility: generate pastel color from a string (username or role)
const stringToPastelColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 80%)`;
};

export const UsersList = () => {
  const { navigateTo } = useNavigation();
  const { data: users, isLoading } = getAllUsers();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // 🔍 Filter users
  const filteredUsers = useMemo(() => {
    if (!users || !users.results) return [];
    return users.results.filter((u) => {
      const fullName =
        `${u?.person?.names[0]?.given_name} ${u?.person?.names[0]?.family_name}`.toLowerCase();
      return (
        u?.username?.toLowerCase().includes(search.toLowerCase()) ||
        fullName.includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (isLoading) {
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
          placeholder="Search user..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          sx={{ width: "300px" }}
        />
      </Box>

      {/* 🧑 User Cards Grid */}
      <Grid container spacing={2}>
        {paginatedUsers.map((user) => {
          const userId = user?.uuid;
          const roles = user?.roles?.map((r) => r?.role).filter(Boolean) || [];
          const firstName = user?.person?.names[0]?.given_name || "";
          const lastName = user?.person?.names[0]?.family_name || "";
          const username = user?.username || "User";

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={userId}>
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
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: stringToPastelColor(username),
                        mr: 2,
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      {username}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {firstName} {lastName}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {roles.length > 0 ? (
                      roles.map((role:any, idx) => (
                        <Chip
                          key={idx}
                          label={String(role)}
                          size="small"
                          sx={{
                            backgroundColor: stringToPastelColor(role),
                            fontSize: "12px",
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        — No roles
                      </Typography>
                    )}
                  </Stack>
                </CardContent>

                {/* 🔘 Icon Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    p: 1,
                  }}
                >
                  <IconButton color="primary" size="small" onClick={() => {}}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => navigateTo(`config/users/${userId}`)}
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
