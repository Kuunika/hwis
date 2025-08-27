import { useState, useEffect } from "react";
import { getPatientsEncounters } from "@/hooks/encounter";
import { encounters } from "@/constants";
import { useVisitDates } from "@/contexts/visitDatesContext";

export interface ClinicalNote {
  paragraph: string;
  creator: string;
  time: string;
  rawTime: number;
}

export const useClinicalNotes = (patientId: string) => {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: patientEncounters,
    isLoading: queryLoading,
    refetch,
  } = getPatientsEncounters(patientId);
  const { visitDate } = useVisitDates();

  useEffect(() => {
    if (!queryLoading && patientEncounters && visitDate) {
      // First, strictly filter encounters by the exact visit date
      const encountersForVisitDate = patientEncounters.filter(
        (encounter: any) => encounter.visit.date_started === visitDate
      );

      const noteEncounter = encountersForVisitDate.find(
        (encounter: any) =>
          encounter?.encounter_type?.uuid === encounters.CLINICAL_NOTES
      );

      if (noteEncounter) {
        const formattedNotes = noteEncounter.obs.map((ob: any) => ({
          paragraph: ob.value_text,
          creator: ob.created_by,
          time: ob.obs_datetime,
          rawTime: new Date(ob.obs_datetime).getTime(),
        }));
        setNotes(formattedNotes.sort((a, b) => b.rawTime - a.rawTime));
      } else {
        setNotes([]);
      }
      setIsLoading(false);
    }
  }, [patientEncounters, visitDate, queryLoading]);

  return {
    notes,
    isLoading,
    refresh: refetch,
  };
};
