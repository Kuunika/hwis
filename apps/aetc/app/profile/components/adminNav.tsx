import React, { useState } from "react";
import { Avatar, Button, Menu, MenuItem, Box, Typography } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";



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
      }}
    >
      <Avatar alt="Patient Profile" />
      <Typography sx={{ marginLeft: 2 }}>{username}</Typography>
      <Button
        aria-controls="admin-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<FaAngleDown/>}
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
