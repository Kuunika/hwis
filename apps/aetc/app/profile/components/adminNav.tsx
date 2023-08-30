import React, { useState } from "react";
import { Avatar, Button, Menu, MenuItem, Box, Typography } from "@mui/material";

interface AdminNavProps {
  username: string;
}

export const AdminNav: React.FC<AdminNavProps> = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: { md: "column", sm: "column", lg: "row" },
      }}
    >
      <Avatar alt="Patient Profile" src="" />
      <Typography sx={{ marginLeft: 8 }}>{username}/</Typography>
      <Button
        aria-controls="admin-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* Sample Menu Items, you can modify them as needed */}
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};
