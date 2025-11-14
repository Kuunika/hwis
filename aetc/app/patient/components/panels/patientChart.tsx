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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Blood Pressure
          </Typography>
          <BP />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Heart Rate
          </Typography>
          <HeartRate />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            O₂ Saturation
          </Typography>
          <O_2Sat />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Temperature
          </Typography>
          <Temp />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Respiratory Rate
          </Typography>
          <RespiratoryRate />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Glucose
          </Typography>
          <Glucose />
        </Paper>
      </Grid>
    </Grid>
  );
};
