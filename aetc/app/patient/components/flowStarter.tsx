import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  ButtonGroup,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FaPlus } from "react-icons/fa6";
import { checkPatientIfOnWaitingAssessment, useNavigation } from "@/hooks";
import { ConsultationContext, ConsultationContextType } from "@/contexts";

// Define types for menu items
interface MenuItemConfig {
  label: string;
  path: string;
  id?: number;
}

interface CollapsibleMenuSection {
  label: string;
  items: Array<MenuItemConfig | ConsultationItemConfig>;
}

interface ConsultationItemConfig {
  id: number;
  title: string;
  label: string;
}

interface FlowStarterProps {
  patient: any;
}

const FlowStarter: React.FC<FlowStarterProps> = ({ patient }) => {
  const { navigateTo } = useNavigation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isOnList } = checkPatientIfOnWaitingAssessment(patient?.id);
  const { setActiveStep } = useContext(
    ConsultationContext
  ) as ConsultationContextType;

  // State for collapsible menu sections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    templateForms: false,
    consultation: false,
  });

  // Handle button click to open menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to the specified path
  const startFlow = (path: string) => {
    handleClose();
    navigateTo(path);
  };

  // Set active step and navigate for consultation items
  const handleConsultationItem = (item: ConsultationItemConfig) => {
    setActiveStep(item.id);
    startFlow(`/patient/${patient.id}/consultation`);
  };

  // Toggle section open/closed state
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Define main menu items
  const mainMenuItems: MenuItemConfig[] = [
    {
      label: "Nursing Care Notes",
      path: `/patient/${patient.id}/soap`,
    },
    {
      label: "Primary Survey",
      path: `/patient/${patient.id}/primary-assessment`,
    },
    {
      label: "SAMPLE History",
      path: `/patient/${patient.id}/medicalHistory`,
    },
    {
      label: "Secondary Survey",
      path: `/patient/${patient.id}/secondary-assessment`,
    },
    {
      id: 0,
      path: "Differential Diagnosis",
      label: "Differential Diagnosis",
    },
    { id: 1, path: "Investigations", label: "Investigations" },
    { id: 2, path: "Final Diagnosis", label: "Final Diagnosis" },
    {
      label: "Patient Management Plan",
      path: `/patient/${patient.id}/patient-management-plan`,
    },
    { label: "Disposition", path: `/patient/${patient.id}/disposition` },
    {
      label: "Continue monitoring",
      path: `/patient/${patient.id}/nursingChart`,
    },

    {
      label: "Continuation Sheet",
      path: `/patient/${patient.id}/continuationSheet`,
    },
  ];

  return (
    <Box>
      <style>
        {`
          .listItemButton {
            gap: 10px !important;
            line-height: 1 !important;
            border-bottom: 1px solid #ccc !important;
          } 
        `}
      </style>

      {/* Assessment Button Group */}
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

      {/* Dropdown Menu */}
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
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {/* Main menu items */}
          {mainMenuItems.map((item, index) => (
            <ListItemButton
              key={index}
              onClick={() => startFlow(item.path)}
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Menu>
    </Box>
  );
};

export default FlowStarter;
