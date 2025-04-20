"use client";
import { useEffect, useMemo, useState } from "react";
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
import { searchDDEPatient, searchLocalPatient } from "@/hooks/patientReg";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ReusableTable } from "../tables/table";
import { ObjectRow } from "@/app/patient/components/visits";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MRT_ColumnDef } from "material-react-table";
import { searchNPID } from "@/hooks/people";

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

  // Search state
  const [searchText, setSearchText] = useState("");
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const searchOpen = Boolean(searchAnchorEl) && searchText.trim() !== "";
  const searchPopoverId = searchOpen ? "search-popover" : undefined;
  const [search, setSearch] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  // Custom debounce hook
  function useDebounce(value: any, delay: any) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  // Debounced search text
  const debouncedSearch = useDebounce(searchText, 300);

  // Update anchor element for popover when search text changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim() !== "") {
      const searchInput = document.getElementById("search-input");
      setSearchAnchorEl(searchInput);
    } else {
      setSearchAnchorEl(null);
    }
  }, [debouncedSearch]);

  // Update search parameters when debounced search text changes
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.trim() === "") return;

    const payload = splitSearchText(debouncedSearch);
    setSearch({
      firstName: payload.given_name,
      lastName: payload.family_name,
      gender: payload.gender,
    });
  }, [debouncedSearch]);

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

  const {
    refetch: refetchDDE,
    isFetching: isFetchingDDE,
    isSuccess: searchDDEComplete,
    data: ddeData,
    isError: isErrorDDE,
  } = searchDDEPatient(search.firstName, search.lastName, search.gender);

  const {
    refetch: refetchLocal,
    isFetching: isFetchingLocal,
    isSuccess: searchLocalComplete,
    data: localData,
    isError: isErrorLocal,
  }: {
    refetch: any;
    isFetching: any;
    isSuccess: any;
    data: any;
    isError: any;
  } = searchLocalPatient(search.firstName, search.lastName, search.gender);

  const {
    refetch: refetchNPID,
    isFetching: isFetchingNPID,
    isSuccess: isSuccessNPID,
    data: dataNPID,
    isError: isErrorNPID,
  } = searchNPID(search.firstName);

  // Trigger API search when search parameters change
  useEffect(() => {
    // Only run local search with first name
    if (search.firstName.length > 12) {
      refetchNPID();
    }
    if (search.firstName) {
      refetchLocal();
    }

    // Only run DDE search when all required fields are available
    if (search.firstName && search.lastName && search.gender) {
      refetchDDE();
    }
  }, [search, refetchDDE, refetchLocal, refetchNPID]);

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
  };

  const DDETransformedData: any = useMemo(() => {
    if (!ddeData) return [];
    const patientRecords = [
      ...(ddeData.locals || []),
      ...(ddeData.remotes || []),
    ];

    return patientRecords.map((item: any) => ({
      fullname: item?.given_name + " " + item?.family_name,
      birthday: item?.birthdate,
      gender: item?.gender,
      currentAddress: `${item?.addresses?.[0]?.current_district ?? ""},${item?.addresses?.[0]?.current_traditional_authority ?? ""},${item?.addresses?.[0]?.address2 ?? ""} `,
      homeAddress: `${item?.addresses?.[0]?.address1 ?? ""},${item?.addresses?.[0]?.county_district ?? ""},${item?.addresses?.[1]?.address1 ?? ""} `,
      phone: "",
      id: item.uuid,
    }));
  }, [ddeData]);

  const localTransformData = useMemo(() => {
    if (!localData) return [];
    return localData.map((item: any) => ({
      fullname: item?.given_name + " " + item?.family_name,
      birthday: item?.birthdate,
      gender: item?.gender,
      currentAddress: `${item?.addresses?.[0]?.current_district ?? ""},${item?.addresses?.[0]?.current_traditional_authority ?? ""},${item?.addresses?.[0]?.address2 ?? ""} `,
      homeAddress: `${item?.addresses?.[0]?.address1 ?? ""},${item?.addresses?.[0]?.county_district ?? ""},${item?.addresses?.[1]?.address1 ?? ""} `,
      phone: "",
      id: item.uuid,
    }));
  }, [localData]);

  const NPIDTransformData = useMemo(() => {
    if (!dataNPID) return [];
    const patientRecords = [
      ...(dataNPID.locals || []),
      ...(dataNPID.remotes || []),
    ];
    console.log("🚀 ~ returndataNPID.map ~ dataNPID:", patientRecords);
    if (!patientRecords) return [];
    return patientRecords.map((item: any) => ({
      fullname: item?.given_name + " " + item?.family_name,
      birthday: item?.birthdate,
      gender: item?.gender,
      currentAddress: `${item?.addresses?.[0]?.current_district ?? ""},${item?.addresses?.[0]?.current_traditional_authority ?? ""},${item?.addresses?.[0]?.address2 ?? ""} `,
      homeAddress: `${item?.addresses?.[0]?.address1 ?? ""},${item?.addresses?.[0]?.county_district ?? ""},${item?.addresses?.[1]?.address1 ?? ""} `,
      phone: "",
      id: item.uuid,
    }));
  }, [dataNPID]);

  // Combine data with local taking priority
  const transformedData = useMemo(() => {
    if (NPIDTransformData.length > 0) return NPIDTransformData;
    return DDETransformedData.length > 0
      ? DDETransformedData
      : localTransformData;
  }, [localTransformData, DDETransformedData]);

  // Define columns for vitals
  const columns = useMemo<MRT_ColumnDef<ObjectRow>[]>(
    () => [
      {
        accessorKey: "fullname",
        id: "fullname",
        header: "Fullname",
      },
      {
        accessorKey: "birthday",
        header: "Birthday",
        size: 100,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 40,
      },
      {
        accessorKey: "currentAddress",
        header: "Current Address",
      },
      {
        accessorKey: "homeAddress",
        header: "Home Address",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 100,
      },
    ],
    []
  );

  return (
    <>
      {loggedIn && (
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
                component="div"
                id="search-input"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  minWidth: "45%",
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
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
                sx={{
                  mt: 0.1,
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: "97.5vw",
                      maxWidth: "none",
                    },
                  },
                }}
                disableEnforceFocus
                disableAutoFocus
              >
                <div style={{ width: "100%" }}>
                  {(isFetchingDDE || isFetchingLocal) && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress />
                    </Box>
                  )}

                  {!isFetchingDDE &&
                    !isFetchingLocal &&
                    transformedData.length > 0 && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ReusableTable<ObjectRow>
                          data={transformedData}
                          columns={columns}
                          title=""
                          showGlobalFilter={false}
                          enableColumnOrdering={false}
                          enableColumnActions={false}
                          enableColumnFilters={false}
                          enableSorting={false}
                          initialState={{
                            showColumnFilters: false,
                            showGlobalFilter: false,
                            columnPinning: {
                              left: ["fullname"],
                              right: ["mrt-row-actions"],
                            },
                          }}
                          onRowClick={(rowData) => {
                            handleSearchPopoverClose();
                            navigateTo(
                              `/patient/${rowData.row.original.id}/profile`
                            );
                          }}
                        />
                      </LocalizationProvider>
                    )}

                  {!isFetchingDDE &&
                    !isFetchingLocal &&
                    transformedData.length === 0 && (
                      <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography>No matching patients found</Typography>
                      </Box>
                    )}
                </div>
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
      )}
    </>
  );
}
