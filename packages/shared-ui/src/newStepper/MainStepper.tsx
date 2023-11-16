import { Box} from '@mui/material'
import NewCard from './newCard/NewCard';
import AccordionInput from '../accordion/accordionInput';
import { MainButton } from '..';
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
        <Box display="flex" flexDirection="column" justifyContent="flex-left">
          <MainButton title="Back to All Consultations" onClick={() => {}} />
          <Box mt={2} />
        </Box>

        <AccordionInput name="Vitals and Other Measures" />
        <AccordionInput name="Provisional diagnosis" />
        <AccordionInput name="Investigations" />
        <AccordionInput name="Comfirm diagnosis" />
        <AccordionInput name="Complications" />
        <AccordionInput name="Treatment" />
        <AccordionInput name="Desposition" />

        <Box display="flex" justifyContent="space-between" width="100%" mt={10}>
          <Box flex="1" />
          <MainButton title="Finish and Save" onClick={() => {}} />
        </Box>
      </Box>
    </Box>
  );
}

export default MainStepper
