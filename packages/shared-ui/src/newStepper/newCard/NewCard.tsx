import { Card, CardContent, Typography } from '@mui/material';
import NewStepper from '../NewStepper';

const NewCard = () => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: 5,
        border: "2px",
        borderRadius: "8px", 
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          The Consultation Plan
        </Typography>
        <NewStepper />
      </CardContent>
    </Card>
  );
}

export default NewCard
