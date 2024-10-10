import React from 'react';
import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import { useNavigation } from '@/hooks';
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
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Button
        variant="contained"
        color="primary"
        endIcon={anchorEl ? <IoIosArrowUp  /> : <IoIosArrowDown />}
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '20px',
          padding: '10px 10px 10px 10px',
          color: '#fff',
        }}
      >
        <CiMedicalClipboard style={{ margin: '1ch'}} />
        Start Assessment
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '10px',
            marginTop: '-5px',
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => startFlow(`/medical-history/${patient?.id}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <FaPlus/>
          <Typography variant="body2">Update Medical History</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => startFlow(`/triage/${patient?.id}/history`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <FaPlus/>
          <Typography variant="body2">Start Triage</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => startFlow(`/primary-assessment/${patient?.id}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <FaPlus/>
          <Typography variant="body2">Start Primary Survey</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => startFlow('/primary-assessment')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <FaPlus/>
          <Typography variant="body2">Start Secondary Survey</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FlowStarter;
