import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { getActivePatientDetails } from "@/hooks";
import { useVisitDates } from "@/contexts/visitDatesContext";

export function ListVisitDates() {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientVisits }: { data: any } =
    getPatientVisitTypes(patientId);

  const [dates, setDates] = useState<
    { visit_id: number; date_started: string; uuid: string }[]
  >([]);
  const { visitDate, setVisitDates, setSelectedVisit } = useVisitDates();

  // Extract dates from patient visits
  useEffect(() => {
    if (patientVisits?.length > 0) {
      const visitDates = patientVisits.map((visit: any) => {
        return {
          visit_id: visit.visit_id,
          date_started: visit.date_started,
          uuid: visit.uuid,
        };
      });

      // Sort dates in descending order (newest first)
      const sortedDates: any = [...visitDates].sort(
        (a, b) =>
          new Date(b.date_started).getTime() -
          new Date(a.date_started).getTime()
      );

      setDates(sortedDates);

      // Set the initial active date to the most recent date if not already set
      if (visitDate === null && sortedDates.length > 0) {
        setVisitDates(sortedDates[0]?.date_started);
        setSelectedVisit({
          id: sortedDates[0]?.visit_id,
          uuid: sortedDates[0]?.uuid,
        });
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
            key={date.visit_id}
            onClick={() => {
              setSelectedVisit({
                id: date.visit_id,
                uuid: date.uuid,
              });
              setVisitDates(date?.date_started);
            }}
            size="large"
            style={{
              width: "100%",
              backgroundColor: date.date_started === visitDate ? "#DDEEDD" : "",
              marginBottom: "8px",
            }}
            variant="outlined"
          >
            {formatDate(date.date_started)}
          </Button>
        ))}
      </div>
    </>
  );
}
