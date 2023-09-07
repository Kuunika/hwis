import React, { useState } from "react";
import {  Avatar, Button, Menu, MenuItem, Box, Typography } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import { Header, MainCard } from "shared-ui/src";




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
    <MainCard elevation={1} sx={{ display: "flex", marginBottom: 1}}>
       <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Header variant="h2" title={"Adult Emergency Truama Center"}/>
      <Box display={"flex"} alignItems={"center"}>
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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
      </Box>
    </Box>
  </MainCard>
   
  );
};
