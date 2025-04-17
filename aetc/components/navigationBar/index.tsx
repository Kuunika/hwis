"use client";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FaRegBell, FaCircleUser } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MainTypography, WrapperBox } from "..";
import MenuIcon from "@mui/icons-material/Menu";
import { getHumanReadableShortDate, getDateTime } from "@/helpers/dateTime";
import {
  Divider,
  InputBase,
  Paper,
  Popover,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useNavigation } from "@/hooks";
import { searchDDEPatient } from "@/hooks/patientReg";

export function NavigationBar({
  onTitleClick,
  handleLogout,
  loggedIn,
}: {
  onTitleClick: () => void;
  handleLogout?: () => void;
  loggedIn?: boolean;
}) {
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Search state
  const [searchText, setSearchText] = useState("");
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const searchOpen = Boolean(searchAnchorEl);
  const searchPopoverId = searchOpen ? "search-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchPopoverClose = () => {
    setSearchAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    if (handleLogout) handleLogout();
  };

  const { navigateTo } = useNavigation();
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    // Only runs on the client
    setCurrentDateTime(getHumanReadableShortDate(getDateTime()));
  }, []);

  const [search, setSearch] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  const {
    refetch,
    isFetching,
    isSuccess: searchComplete,
    data,
    isError,
  } = searchDDEPatient(search.firstName, search.lastName, search.gender);

  useEffect(() => {
    if (!Boolean(search.firstName)) return;
    refetch();
  }, [search, refetch]);

  const splitSearchText = (searchText: string) => {
    const splittedArray = searchText.split(" ");
    return {
      given_name: splittedArray[0] || "",
      family_name: splittedArray.length >= 2 ? splittedArray[1] : "",
      gender: splittedArray.length >= 3 ? splittedArray[2] : "",
    };
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    const searchInput = document.getElementById("search-input");
    setSearchAnchorEl(searchInput);
    const payload = splitSearchText(searchText);
    setSearch({
      firstName: payload.given_name,
      lastName: payload.family_name,
      gender: payload.gender,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#006401",
        }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
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
              <div style={{ lineHeight: "1em" }}>
                <div style={{ fontSize: "16px" }}>MaHIS (AETC)</div>
                <div>
                  <span style={{ fontSize: "14px" }}>
                    Queen Elizabeth Central Hospital |{" "}
                    <span style={{ color: "rgb(116, 255, 21)" }}>
                      {currentDateTime}{" "}
                    </span>
                  </span>
                </div>
              </div>
            </Typography>
          </div>

          <Paper
            component="form"
            id="search-input"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              minWidth: "45%",
            }}
          >
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              value={searchText}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1, width: "100%" }}
              placeholder="Add or search for a client by MRN, name, or by scanning a barcode/QR code."
              inputProps={{ "aria-label": "search patients" }}
            />

            <IconButton
              color="primary"
              sx={{ p: "10px", color: "#000" }}
              aria-label="add new patient"
              onClick={() => {
                navigateTo(`/registration/new`);
              }}
            >
              <PersonAddAltIcon />
            </IconButton>
          </Paper>

          {/* Search Results Popover */}
          <Popover
            id={searchPopoverId}
            open={searchOpen}
            anchorEl={searchAnchorEl}
            onClose={handleSearchPopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{ mt: 1 }}
          >
            <Box sx={{ p: 2, minWidth: 300, maxWidth: 500 }}>
              {isFetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : isError ? (
                <Typography color="error">
                  Search error. Please try again.
                </Typography>
              ) : data && data.length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Search Results
                  </Typography>
                  {Array.isArray(data) &&
                    data.map((patient: any, index: number) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Box
                          sx={{
                            p: 1,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                          onClick={() => {
                            navigateTo(`/patient/${patient.id || patient._id}`);
                            handleSearchPopoverClose();
                          }}
                        >
                          <Typography variant="body1">
                            {patient.given_name} {patient.family_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.gender || "Unknown gender"} • ID:{" "}
                            {patient.id || patient._id || "N/A"}
                          </Typography>
                        </Box>
                        {index < data.length - 1 && <Divider />}
                      </Box>
                    ))}
                </>
              ) : searchComplete ? (
                <Typography>No patients found matching your search.</Typography>
              ) : (
                <Typography>Enter a search term to find patients.</Typography>
              )}
            </Box>
          </Popover>

          <div style={{ display: "flex", alignItems: "center" }}>
            {loggedIn && (
              <>
                <MainTypography sx={{ mx: "1ch" }} variant="h5">
                  <IconButton sx={{ color: "#fff" }}>
                    <FaRegBell />
                  </IconButton>
                </MainTypography>
                <MainTypography sx={{ cursor: "pointer" }} variant="h5">
                  <IconButton sx={{ color: "#fff" }} onClick={handleClick}>
                    <FaCircleUser />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </MainTypography>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
