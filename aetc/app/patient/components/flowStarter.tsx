import React, { useState } from 'react';
import { Box, Button, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography} from '@mui/material';
import { useNavigation } from '@/hooks';

const FlowStarter = () => {
  const [open, setOpen] = useState(false);
  const { navigateTo } = useNavigation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startFlow = (path) => {
    handleClose();
    navigateTo(path);
  };

  return (
    <SpeedDial
      ariaLabel="Flow Starter"
      sx={{ position: 'absolute', bottom: 16, right: 16,  width:200, margin: '1ch', backgroundcolor: 'green'}}
      icon={<SpeedDialIcon/>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <SpeedDialAction
        key="Triage Flow"
        icon={ <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            bgcolor="White" 
            borderRadius={5} 
            p={1}
            sx={{ 
                color: 'green',
                fontWeight: 'bold',
                padding: '5px',
              display: 'flex', 
              alignItems: 'left',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'Green',
                color: 'white',
              }
            }}
          >
            <Typography variant="body2">Triage</Typography>
          </Box>} // Replace with your icons
        tooltipTitle="Start Triage Flow"
        onClick={() => startFlow('/triageflow')}
      />
      <SpeedDialAction
        key="Primary Survey"
        icon={ <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            bgcolor="White" 
            borderRadius={5} 
            p={1}
            sx={{ 
                color: 'green',
                fontWeight: 'bold',
                padding: '5px',
              display: 'flex', 
              alignItems: 'left',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'Green',
                color: 'white',
              }
            }}
          >
            <Typography variant="body2">Primary Survey</Typography>
          </Box>} // Replace with your icons
        tooltipTitle="Start Primary Survey"
        onClick={() => startFlow('/triageflow')}
      />
 
      <SpeedDialAction
        key="Secondary Survey"
        icon={<Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            bgcolor="White" 
            borderRadius={5} 
            p={1}
            sx={{ 
                color: 'green',
                fontWeight: 'bold',
                padding: '5px',
              display: 'flex', 
              alignItems: 'left',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'Green',
                color: 'white',
              }
            }}
          >
            <Typography variant="body2">Secondary Survey</Typography>
          </Box>} // Replace with your icons
        onClick={() => startFlow('/secondarysurveyflow')}
        tooltipTitle="Start Secondary Survey"
      />
    </SpeedDial>
  );
};

export default FlowStarter;
