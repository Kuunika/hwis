import { Typography, Box, Paper } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { useVisitDates } from "@/contexts/visitDatesContext";
import CircularProgress from "@mui/material/CircularProgress";

export const MedicationsNotes = () => {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
  const { visitDate } = useVisitDates();
  const [medications, setMedicationsAssessments] = useState<{ paragraph: string; time: string }[]>([]);

  const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
  };

  useEffect(() => {
    if (!historyLoading && patientHistory) {
      const MedicationsEncounters = patientHistory.filter(
          (encounter: any) => encounter?.encounter_type?.uuid === encounters.PRESCRIPTIONS
      );

      const formattedAssessments: { paragraph: string; time: string }[] = [];

      MedicationsEncounters.forEach(encounter => {
        const obs = encounter.obs;
        const medicationDetails: string[] = [];
        let assessmentTime = isValidDate(encounter.encounter_datetime)
            ? encounter.encounter_datetime
            : new Date().toISOString();

        obs?.forEach((item: any) => {
          if (item.names?.[0]?.name) {
            medicationDetails.push(item.value);
          }
        });

        if (medicationDetails.length > 0) {
          formattedAssessments.push({
            paragraph: `Medications: ${medicationDetails.join(', ')}.`,
            time: assessmentTime
          });
        } else {
          formattedAssessments.push({
            paragraph: "No medications available.",
            time: assessmentTime
          });
        }
      });

      setMedicationsAssessments(formattedAssessments);
    }
  }, [patientHistory, historyLoading]);

  if (historyLoading) {
    return (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Medications given
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress size={40} />
          </Box>
        </Box>
    );
  }

  return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
          Medications given
        </Typography>
        {medications.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No Medications data available.
            </Typography>
        ) : (
            medications.map((data, index) => (
                <Box key={index} sx={{ mb: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                    {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {data.paragraph}
                  </Typography>
                </Box>
            ))
        )}
      </Box>
  );
};