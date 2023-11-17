import { Box} from '@mui/material'
import NewCard from './newCard/NewCard';
import AccordionInput from '../accordion/accordionInput';
import { MainButton } from '..';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { steps } from './steps';
const MainStepper = () => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        <NewCard />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "200px",
          marginTop: "45px",
        }}
      >
        <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
          <MainButton
            title="Back to All Consultations"
            onClick={() => {}}
            startIcon={<ArrowBackIcon />}
            sx={{ backgroundColor: "#006401" }}
          />
        </Box>
        <br />

        {steps.map((label)=>(
            <AccordionInput key={label} name={label}/>
        ))}

        <Box display="flex" justifyContent="space-between" width="100%" mt={10}>
          <Box flex="1" />
          <MainButton
            title="Finish and Save"
            onClick={() => {}}
            sx={{ backgroundColor: "#006401"}}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MainStepper
