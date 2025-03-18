import React from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import { useNavigation } from "@/hooks";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { CiMedicalClipboard } from "react-icons/ci";

interface FlowStarterProps {
  patient: any;
}

const FlowStarter: React.FC<FlowStarterProps> = ({ patient }) => {
  const { navigateTo } = useNavigation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const startFlow = (path: string) => {
    handleClose();
    navigateTo(path);
  };

  return (
    <Box>
      <ButtonGroup
        variant="contained"
        sx={{
          borderRadius: "9999px",
          overflow: "hidden",
          minWidth: "130px",
          "& .MuiButtonGroup-grouped:not(:last-of-type)": {
            borderRight: 0,
          },
        }}
      >
        <Button
          sx={{
            backgroundColor: "#006401",
            color: "white",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
            flexGrow: 1,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#004d00",
            },
          }}
        >
          Start Assessment
        </Button>
        <Button
          onClick={handleClick}
          sx={{
            backgroundColor: "#008000",
            color: "white",
            borderLeft: "1px solid #135a14",
            fontSize: "14px",
            padding: "0px",
            minWidth: "unset",
            "&:hover": {
              backgroundColor: "#006b00",
            },
          }}
        >
          <Typography sx={{ fontSize: "18px" }}>▾</Typography>
        </Button>
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "10px",
            marginTop: "105px",
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => startFlow(`/patient/${patient?.id}/medicalHistory`)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <FaPlus />
          <Typography variant="body2">Update Medical History</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => startFlow(`/triage/${patient?.id}/history`)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <FaPlus />
          <Typography variant="body2">Start Triage</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            startFlow(`/patient/${patient?.id}/primary-assessment`)
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <FaPlus />
          <Typography variant="body2">Start Primary Survey</Typography>
        </MenuItem>
        <MenuItem
          onClick={() =>
            startFlow(`/patient/${patient?.id}/secondary-assessment`)
          }
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <FaPlus />
          <Typography variant="body2">Start Secondary Survey</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FlowStarter;
