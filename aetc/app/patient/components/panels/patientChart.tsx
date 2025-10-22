import { MainButton, MainTypography, WrapperBox } from "@/components";
import { CombinedVitals } from "../graphs";
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
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <CombinedVitals />
        </Paper>
      </Grid>
    </Grid>
  );
};
