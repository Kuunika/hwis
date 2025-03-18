import React from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import { checkPatientIfOnWaitingAssessment, useNavigation } from "@/hooks";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { CiMedicalClipboard } from "react-icons/ci";
import { ConsultationCard } from "./cards";
import { ConsultationContext, ConsultationContextType } from "@/contexts";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

interface FlowStarterProps {
  patient: any;
}

const FlowStarter: React.FC<FlowStarterProps> = ({ patient }) => {
  const { navigateTo } = useNavigation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isOnList } = checkPatientIfOnWaitingAssessment(patient?.id as string);
  const { setActiveStep } = React.useContext(
    ConsultationContext
  ) as ConsultationContextType;

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
  const setData = (data: any) => {
    setActiveStep(data.id);
    startFlow(data.link);
  };

  const [openTemplateForm, setOpenClickTemplateForm] = React.useState(false);
  const [openConsultation, setOpenConsultation] = React.useState(false);

  const handleClickTemplateForm = () => {
    setOpenClickTemplateForm(!openTemplateForm);
  };
  const handleClickConsultation = () => {
    setOpenConsultation(!openConsultation);
  };
  return (
    <>
      <style>
        {`
          .listItemButton {
            gap: 10px !important;
            line-height: 1 !important;
            border-bottom: 1px solid #ccc   !important;
          } 
        `}
      </style>
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
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton
              onClick={() =>
                startFlow(`/patient/${patient?.id}/medicalHistory`)
              }
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Update Medical History" />
            </ListItemButton>
            <ListItemButton
              onClick={() => startFlow(`/triage/${patient?.id}/history`)}
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Start Triage" />
            </ListItemButton>

            <ListItemButton
              onClick={() =>
                startFlow(`/patient/${patient?.id}/primary-assessment`)
              }
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Start Primary Assessment" />
            </ListItemButton>

            <ListItemButton
              onClick={() =>
                startFlow(`/patient/${patient?.id}/secondary-assessment`)
              }
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Start Secondary Assessment" />
            </ListItemButton>
            <ListItemButton
              onClick={() =>
                startFlow(`/patient/${patient?.id}/medicalHistory`)
              }
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Sample History" />
            </ListItemButton>
            <ListItemButton
              onClick={() =>
                startFlow(`/patient/${patient.id}/patient-management-plan`)
              }
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Patient Management Plan" />
            </ListItemButton>
            <ListItemButton
              onClick={() => startFlow(`/patient/${patient.id}/disposition`)}
              className="listItemButton"
            >
              <FaPlus />
              <ListItemText primary="Disposition" />
            </ListItemButton>

            <ListItemButton
              className="listItemButton"
              onClick={handleClickConsultation}
            >
              <FaPlus />
              <ListItemText primary="Consultation" />
              {openConsultation ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openConsultation} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    setData({
                      id: 0,
                      title: "Differential Diagnosis",
                      link: `/patient/${patient.id}/consultation`,
                    })
                  }
                >
                  <ListItemText primary="Differential Diagnosis" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    setData({
                      id: 1,
                      title: "Investigations",
                      link: `/patient/${patient.id}/consultation`,
                    })
                  }
                >
                  <ListItemText primary="Investigations" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    setData({
                      id: 2,
                      title: "Final Diagnosis",
                      link: `/patient/${patient.id}/consultation`,
                    })
                  }
                >
                  <ListItemText primary="Final Diagnosis" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton
              className="listItemButton"
              onClick={handleClickTemplateForm}
            >
              <FaPlus />
              <ListItemText primary="Template Forms" />
              {openTemplateForm ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openTemplateForm} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    startFlow(`/patient/${patient.id}/medicalInpatient`)
                  }
                >
                  <ListItemText primary="Medical Inpatient" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    startFlow(`/patient/${patient.id}/template-forms`)
                  }
                >
                  <ListItemText primary="Surgical Notes" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    startFlow(`/patient/${patient.id}/gynacological`)
                  }
                >
                  <ListItemText primary="Gynacological" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() =>
                    startFlow(`/patient/${patient.id}/nursingChart`)
                  }
                >
                  <ListItemText primary="Monitoring Chart" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 7 }}
                  onClick={() => startFlow(`/patient/${patient.id}/referral`)}
                >
                  <ListItemText primary="Referral" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Menu>
      </Box>
    </>
  );
};

export default FlowStarter;
