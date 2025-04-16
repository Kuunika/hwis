
'use client'
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FaRegBell, FaCircleUser } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MainTypography, WrapperBox } from "..";
import MenuIcon from '@mui/icons-material/Menu';
import { getHumanReadableShortDate,getDateTime } from "@/helpers/dateTime";
import { Divider, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';  
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';




export function NavigationBar({
  search,
  onTitleClick,
  handleLogout,
  loggedIn

}: {
  search?: any;
  onTitleClick: () => void;
  handleLogout?: () => void;
  loggedIn?: boolean
}) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();

    if (handleLogout)
      handleLogout();
  }

   const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    // Only runs on the client
    setCurrentDateTime(getHumanReadableShortDate(getDateTime()));
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#006401",
        }}
      >
        <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => onTitleClick()}
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block", cursor: "pointer" },
            }}
          >
            <div style={{lineHeight: "1em"}}>
            <div style={{fontSize: "16px"}}>MaHIS (AETC)</div>
            <div><span style={{fontSize: "14px"}}>Queen Elizabeth Central Hospital | <span style={{color: "rgb(116, 255, 21)"}}>{currentDateTime} </span></span></div> 
            </div>
          </Typography>
            <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
       <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1,width:"100%" }}
        placeholder="Add or search for a client by MRN, name, or by scanning a barcode/QR code."
        inputProps={{ 'aria-label': 'search google maps' }}
      />
     
      <IconButton color="primary" sx={{ p: '10px', color: "#000" }} aria-label="directions">
        <PersonAddAltIcon />
      </IconButton>
    </Paper>
          {search}
          {loggedIn &&
            (<><MainTypography sx={{ mx: "1ch" }} variant="h5">
              <IconButton sx={{ color: "#fff" }}>
                <FaRegBell />
              </IconButton>
            </MainTypography>
              <MainTypography sx={{ cursor: "pointer" }} variant="h5">
                <IconButton sx={{ color: "#fff" }} onClick={handleClick} >
                  <FaCircleUser />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </MainTypography></>)}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
