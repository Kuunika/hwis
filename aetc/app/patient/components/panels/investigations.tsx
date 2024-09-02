import { MainButton, MainTypography, WrapperBox } from "@/components";
import { FaPlus } from "react-icons/fa";
import { Panel } from ".";
import {
  checkPatientIfOnWaitingAssessment,
  useNavigation,
  useParameters,
} from "@/hooks";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";

import { LabRequestModal } from "../labRequest";
import { LabOrderTable } from "./labOrderTable";
import { LabRequest } from "@/interfaces";
import { Box, Button, Popover, Typography } from "@mui/material";

export const Investigations = () => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [open, setOpen] = useState(false);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  const addRequest = (lab: LabRequest) => {
    setLabRequests((requests) => [...requests, lab]);
    setOpen(false);
  };

  return (
    <Panel
      title="Investigations"
      icon={<MainButton variant="text" icon={<FaPlus />} onClick={() => { }} />}
    >
      <WrapperBox>
        <BasicPopover />
      </WrapperBox>
      <LabOrderTable />
    </Panel>
  );
};





export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Add Lab Order
      </Button>
      <Popover

        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ padding: "2ch" }}>
          <Typography variant="h4">Lab Order</Typography>
          <br />
          <LabRequestModal
            addRequest={() => { }}
            onClose={() => setAnchorEl(null)}
          />
        </Box>
      </Popover>
    </>
  );
}
