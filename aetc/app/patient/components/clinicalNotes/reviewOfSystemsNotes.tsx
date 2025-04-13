import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

interface SystemReview {
  systemName: string;
  symptoms: {
    name: string;
    duration?: string;
    location?: string;
  }[];
  creator: string;
  time: string;
}

export const ReviewOfSystemsNotes = () => {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
  const [systemsReviewData, setSystemsReviewData] = useState<{
    paragraph: string;
    time: string;
    creator: string;
  }[]>([]);

  useEffect(() => {
    if (!historyLoading && patientHistory) {
      const systemsReviewEncounter = patientHistory.find(
          (encounter: any) => encounter?.encounter_type?.uuid === encounters.REVIEW_OF_SYSTEMS
      );

      if (systemsReviewEncounter) {
        const formattedData = formatSystemsReviewData(systemsReviewEncounter.obs);
        setSystemsReviewData(formattedData);
      }
    }
  }, [patientHistory, historyLoading]);

  const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
  };

  const formatSystemsReviewData = (obs: any[]) => {
    const systemsReviews: {
      paragraph: string;
      time: string;
      creator: string;
      rawTime: number;
    }[] = [];

    let currentSystem: SystemReview | null = null;

    obs.forEach((ob: any) => {
      const name = ob.names?.[0]?.name;
      const value = ob.value;
      const creator = ob.creator || ob.created_by;
      const obsTime = ob.obs_datetime || new Date().toISOString();
      console.log("HAibo", name, value, creator, obsTime);

      if (name.startsWith("Review Of Systems") || name.startsWith("Review of systems")) {
        // Push previous system if exists
        if (currentSystem && currentSystem.symptoms.length > 0) {
          systemsReviews.push(createSystemReviewParagraph(currentSystem));
        }
        // Start new system
        currentSystem = {
          systemName: name.replace("Review Of Systems", "")
              .replace("Review of systems", "")
              .trim(),
          symptoms: [],
          creator: creator,
          time: obsTime
        };
      }
      else if (currentSystem) {
        if (name === "Duration Of Symptoms Days") {
          if (currentSystem.symptoms.length > 0) {
            currentSystem.symptoms[currentSystem.symptoms.length - 1].duration = value;
          }
        }
        else if (name === "Anatomic locations") {
          if (currentSystem.symptoms.length > 0) {
            currentSystem.symptoms[currentSystem.symptoms.length - 1].location = value;
          }
        }
        else if (value === true || value === "true") {
          // This is a symptom
          currentSystem.symptoms.push({
            name: name,
            duration: undefined,
            location: undefined
          });
          currentSystem.creator = creator;
          currentSystem.time = obsTime;
        }
      }
    });

    // Push the last system if it has data
    // if (currentSystem && currentSystem.symptoms.length > 0) {
    //   systemsReviews.push(createSystemReviewParagraph(currentSystem));
    // }

    // Sort by time (newest first)
    return systemsReviews.sort((a, b) => b.rawTime - a.rawTime);
  };

  const createSystemReviewParagraph = (system: SystemReview) => {
    const parts: string[] = [];

    // Add system name
    parts.push(`${system.systemName} System:`);

    // Add each symptom with details
    system.symptoms.forEach(symptom => {
      let symptomText = symptom.name;

      if (symptom.duration) {
        symptomText += ` (${symptom.duration} days)`;
      }

      if (symptom.location) {
        symptomText += ` in ${symptom.location}`;
      }

      parts.push(symptomText);
    });

    return {
      paragraph: parts.join(". "),
      time: system.time,
      creator: system.creator,
      rawTime: new Date(system.time).getTime()
    };
  };

  if (historyLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
          Review of Systems
        </Typography>
        {systemsReviewData.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No systems review recorded.
            </Typography>
        ) : (
            systemsReviewData.map((data, index) => (
                <Box key={index} sx={{ mb: 2, position: 'relative' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                    {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary", mb: 0 }}>
                    {data.paragraph}
                  </Typography>
                  <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        mt: 0
                      }}
                  >
                    ~ {data.creator}
                  </Typography>
                </Box>
            ))
        )}
      </Box>
  );
};