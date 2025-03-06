import { MainButton, MainTypography, WrapperBox } from "@/components";
import {
  BP,
  HeartRate,
  RespiratoryRate,
  Temp,
  O_2Sat,
  Glucose,
} from "../graphs";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import {
  checkPatientIfOnWaitingAssessment,
  useNavigation,
  useParameters,
} from "@/hooks";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect, useRef } from "react";

import { LabRequestModal } from "../labRequest";
import { LabOrderTable } from "./labOrderTable";
import { LabRequest } from "@/interfaces";
import {
  Grid,
  Box,
  Button,
  Popover,
  Typography,
  Paper,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const PatientChart = () => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);
  const [isLoading, setIsLoading] = useState(true);

  const graph1Options = ["Respiratory Rate", " Heart Rate", "Glucose"];
  const graph2Options = ["BP", "Temperature", " O₂ Sat"];

  const anchorRef1 = useRef<HTMLDivElement>(null);
  const anchorRef2 = useRef<HTMLDivElement>(null);
  const [graph1SelectedIndex, setGraph1SelectedIndex] = useState(0);
  const [graph2SelectedIndex, setGraph2SelectedIndex] = useState(0);
  const [openGraph1, setOpenGraph1] = useState(false);
  const [openGraph2, setOpenGraph2] = useState(false);

  const handleMenuItemClick = (
    index: number,
    setGraphIndex: React.Dispatch<React.SetStateAction<number>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setGraphIndex(index);
    setOpen(false);
  };

  const handleToggle = (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (
    event: MouseEvent | TouchEvent,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    anchorRef: React.RefObject<HTMLDivElement>
  ) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, position: "relative", zIndex: 1 }}>
          <ButtonGroup variant="outlined" ref={anchorRef1}>
            <Button>{graph1Options[graph1SelectedIndex]}</Button>
            <Button size="small" onClick={() => handleToggle(setOpenGraph1)}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={openGraph1}
            anchorEl={anchorRef1.current}
            transition
            disablePortal={false}
            sx={{ zIndex: 2000 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "bottom",
                }}
              >
                <Paper sx={{ zIndex: 2000 }}>
                  <ClickAwayListener
                    onClickAway={(event) =>
                      handleClose(event, setOpenGraph1, anchorRef1)
                    }
                  >
                    <MenuList autoFocusItem>
                      {graph1Options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === graph1SelectedIndex}
                          onClick={() =>
                            handleMenuItemClick(
                              index,
                              setGraph1SelectedIndex,
                              setOpenGraph1
                            )
                          }
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {graph1SelectedIndex === 0 && <RespiratoryRate />}
          {graph1SelectedIndex === 1 && <HeartRate />}
          {graph1SelectedIndex === 2 && <Glucose />}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, position: "relative", zIndex: 1 }}>
          <ButtonGroup variant="outlined" ref={anchorRef2}>
            <Button>{graph2Options[graph2SelectedIndex]}</Button>
            <Button size="small" onClick={() => handleToggle(setOpenGraph2)}>
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={openGraph2}
            anchorEl={anchorRef2.current}
            transition
            disablePortal={false}
            sx={{ zIndex: 2000 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "bottom",
                }}
              >
                <Paper sx={{ zIndex: 2000 }}>
                  <ClickAwayListener
                    onClickAway={(event) =>
                      handleClose(event, setOpenGraph2, anchorRef2)
                    }
                  >
                    <MenuList autoFocusItem>
                      {graph2Options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === graph2SelectedIndex}
                          onClick={() =>
                            handleMenuItemClick(
                              index,
                              setGraph2SelectedIndex,
                              setOpenGraph2
                            )
                          }
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {graph2SelectedIndex === 0 && <BP />}
          {graph2SelectedIndex === 1 && <Temp />}
          {graph2SelectedIndex === 2 && <O_2Sat />}
        </Paper>
      </Grid>
    </Grid>
  );
};
