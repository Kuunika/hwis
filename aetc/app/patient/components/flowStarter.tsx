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
      label: "Update Medical History",
      path: `/patient/${patient.id}/medicalHistory`,
    },
    {
      label: "Start/Continue monitoring",
      path: `/triage/${patient.id}/history`,
    },
    {
      label: "Start Primary Assessment",
      path: `/patient/${patient.id}/primary-assessment`,
    },
    {
      label: "Nursing Care Notes (SOAP)",
      path: `/patient/${patient.id}/soap`,
    },
    {
      label: "Continuation Sheet",
      path: `/patient/${patient.id}/continuationSheet`,
    },
    {
      label: "Start Secondary Assessment",
      path: `/patient/${patient.id}/secondary-assessment`,
    },
    { label: "Sample History", path: `/patient/${patient.id}/medicalHistory` },
    {
      label: "Patient Management Plan",
      path: `/patient/${patient.id}/patient-management-plan`,
    },
    { label: "Disposition", path: `/patient/${patient.id}/disposition` },
  ];

  // Define collapsible sections
  const collapsibleSections: { [key: string]: CollapsibleMenuSection } = {
    consultation: {
      label: "Consultation",
      items: [
        {
          id: 0,
          title: "Differential Diagnosis",
          label: "Differential Diagnosis",
        },
        { id: 1, title: "Investigations", label: "Investigations" },
        { id: 2, title: "Final Diagnosis", label: "Final Diagnosis" },
      ],
    },
    templateForms: {
      label: "Template Forms",
      items: [
        {
          label: "Medical Inpatient",
          path: `/patient/${patient.id}/medicalInpatient`,
        },
        {
          label: "Surgical Notes",
          path: `/patient/${patient.id}/surgicalNotes`,
        },
        {
          label: "Gynacological",
          path: `/patient/${patient.id}/gynacological`,
        },
        {
          label: "Monitoring Chart",
          path: `/patient/${patient.id}/nursingChart`,
        },
        { label: "Referral", path: `/patient/${patient.id}/referral` },
        {
          label: "Trauma Specialty Review",
          path: `/patient/${patient.id}/trauma-specialty-review`,
        },
        {
          label: "Orthopaedic Specialty Review",
          path: `/patient/${patient.id}/orthopaedic-specialty-review`,
        },
      ],
    },
  };

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

          {/* Collapsible sections */}
          {Object.entries(collapsibleSections).map(([key, section]) => (
            <React.Fragment key={key}>
              <ListItemButton
                className="listItemButton"
                onClick={() => toggleSection(key)}
              >
                <FaPlus />
                <ListItemText primary={section.label} />
                {openSections[key] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openSections[key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map((item, i) => (
                    <ListItemButton
                      key={i}
                      sx={{ pl: 7 }}
                      onClick={() => {
                        if ("path" in item) {
                          startFlow(item.path);
                        } else {
                          handleConsultationItem(item);
                        }
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Menu>
    </Box>
  );
};

export default FlowStarter;
