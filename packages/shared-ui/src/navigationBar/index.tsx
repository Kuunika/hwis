import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FaRegBell, FaCircleUser } from "react-icons/fa6";

import { FaAlignJustify } from "react-icons/fa";
import { MainTypography } from "..";

export function NavigationBar({
  search,
  onTitleClick,
}: {
  search?: any;
  onTitleClick: () => void;
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#006401",
          px: "8ch",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <FaAlignJustify />
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
          <MainTypography sx={{ mx: "1ch" }} variant="h5">
            <FaRegBell />
          </MainTypography>
          <MainTypography variant="h5">
            <FaCircleUser />
          </MainTypography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
