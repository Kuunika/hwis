import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { getActivePatientDetails } from "@/hooks";
import { useVisitDates } from "@/contexts/visitDatesContext";
import { Visit } from "@/interfaces";

export function ListVisitDates() {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientVisits }: { data: any } =
    getPatientVisitTypes(patientId);

  const [dates, setDates] = useState([]);
  const { visitDate, setVisitDates } = useVisitDates();

  // Extract dates from patient visits
  useEffect(() => {
    if (patientVisits?.length > 0) {
      const visitDates = patientVisits.map((visit: any) => visit.date_started);

      // Sort dates in descending order (newest first)
      const sortedDates: any = [...visitDates].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );

      setDates(sortedDates);

      // Set the initial active date to the most recent date if not already set
      if (visitDate === null && sortedDates.length > 0) {
        setVisitDates(sortedDates[0]);
      }
    }
  }, [patientVisits, visitDate]);

  // Format date for display
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${day} ${month}, ${year} (${time})`;
  };
  return (
    <>
      <div>
        {dates.map((date) => (
          <Button
            key={date}
            onClick={() => setVisitDates(date)}
            size="large"
            style={{
              width: "100%",
              backgroundColor: date === visitDate ? "#DDEEDD" : "",
              marginBottom: "8px",
            }}
            variant="outlined"
          >
            {formatDate(date)}
          </Button>
        ))}
      </div>
    </>
  );
}
