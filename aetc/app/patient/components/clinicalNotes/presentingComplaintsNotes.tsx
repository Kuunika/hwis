import { Typography, Box, Paper } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { useVisitDates } from "@/contexts/visitDatesContext";
import CircularProgress from "@mui/material/CircularProgress";

export const PresentingComplaintsNotes = () => {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
  const { visitDate } = useVisitDates();
  const [complaintAssessments, setComplaintAssessments] = useState<{ paragraph: string; time: string }[]>([]);

  const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
  };

  useEffect(() => {
    if (!historyLoading && patientHistory) {
      const presentingComplaintsEncounters = patientHistory.filter(
          (encounter: any) => encounter?.encounter_type?.uuid === encounters.PRESENTING_COMPLAINTS
      );

      const formattedAssessments: { paragraph: string; time: string }[] = [];

      presentingComplaintsEncounters.forEach(encounter => {
        const obs = encounter.obs;
        const complaintDetails: string[] = [];
        let assessmentTime = isValidDate(encounter.encounter_datetime)
            ? encounter.encounter_datetime
            : new Date().toISOString();

        obs?.forEach((item: any) => {
          if (item.names?.[0]?.name) {
            complaintDetails.push(item.value);
          }
        });

        if (complaintDetails.length > 0) {
          formattedAssessments.push({
            paragraph: `Presenting complaints: ${complaintDetails.join(', ')}.`,
            time: assessmentTime
          });
        } else {
          formattedAssessments.push({
            paragraph: "No presenting complaints documented.",
            time: assessmentTime
          });
        }
      });

      setComplaintAssessments(formattedAssessments);
    }
  }, [patientHistory, historyLoading]);

  if (historyLoading) {
    return (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Presenting Complaints
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
          Presenting Complaints
        </Typography>
        {complaintAssessments.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No presenting complaints available.
            </Typography>
        ) : (
            complaintAssessments.map((data, index) => (
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