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
import { LabResultsTable } from "./labResults";

import { LabOrderTable } from "./labOrderTable";
import { LabRequest } from "@/interfaces";
import { Box, Button, Popover, Typography } from "@mui/material";
import { TestAccordion } from "../../[id]/consultation/components/testAccordion";
import { MinimalTable } from "@/components/tables/minimalTable"; // Import MinimalTable


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
        <TestAccordion /> {/* Replacing LabRequestModal with TestAccordion */}

      </WrapperBox>

      {/* Flex container for inline tables */}
      {/* <Box display="flex" gap={2} width="100%">
        <Box flex={1}>
          <LabOrderTable />
        </Box>
        <Box flex={1}>
          <LabResultsTable rows={[]} />
        </Box>
      </Box> */}
      

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
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Add Investigation
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
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box sx={{ padding: "2ch" }}>
          <Typography variant="h4">Lab Order</Typography>
          <br />
          <TestAccordion /> {/* Replacing LabRequestModal with TestAccordion */}

        </Box>
      </Popover>
    </>
  );
}
