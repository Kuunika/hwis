
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FaRegBell, FaCircleUser } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MainTypography } from "..";

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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#006401",
          px: { lg: "8ch", xs: "1ch" },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <img height={25} width={30} src="/Flag_of_Malawi.svg" alt="malawiflag" />
            {/* <FaAlignJustify /> */}
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
            MAHIS AETC
          </Typography>
          {search}
          {loggedIn &&
            (<><MainTypography sx={{ mx: "1ch" }} variant="h5">
              <FaRegBell />
            </MainTypography>
              <MainTypography sx={{ cursor: "pointer" }} variant="h5">
                <FaCircleUser onClick={handleClick} />
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
