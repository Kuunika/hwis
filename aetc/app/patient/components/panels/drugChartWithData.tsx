import { getPatientsEncounters } from "@/hooks/encounter";
import { DrugChart } from "./drugChart";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { useParams } from "next/navigation";
import { concepts, encounters } from "@/constants";
import { Encounter, Obs } from "@/interfaces";
import { getObservationValue } from "@/helpers/emr";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { useEffect, useState } from "react";

export function DrugChartWithData() {
  const params = useParams();
  const { activeVisitId } = getActivePatientDetails();

  const { data } = getPatientsEncounters(
    params?.id as string,
    `encounter_type=${encounters.PRESCRIPTIONS}&visit=${activeVisitId}`
  );
  const [medicationFormattedData, setMedicationFormattedData] = useState<
    Array<any>
  >([]);

  useEffect(() => {
    if (!data) return;

    const medicineObs = data[0].obs;
    const formattedData =
      medicineObs?.map((ob: Obs) => {
        return {
          date: getHumanReadableDate(data[0].encounter_datetime),
          medication: {
            name: ob.value,
            frequency: getObservationValue(
              ob?.children,
              concepts.MEDICATION_FREQUENCY
            ),
            dose: `${getObservationValue(
              ob?.children,
              concepts.MEDICATION_DOSE
            )} ${getObservationValue(
              ob?.children,
              concepts.MEDICATION_DOSE_UNIT
            )}`,
            route: getObservationValue(ob?.children, concepts.MEDICATION_ROUTE),
            prescriber: ob.created_by,
            stopDate: "",
          },
          administrationDatesAndInitials: [],
        };
      }) || [];

    setMedicationFormattedData(formattedData);
  }, [data]);

  const medications = [
    {
      date: "02 Apr 2025",
      medication: {
        name: "Paracetamol 500mg",
        dose: "2 tablets",
        frequency: "4x/day",
        route: "Oral",
        prescriber: "Dr. L. Mapata",
        stopDate: "5 Apr",
      },
      administrationDatesAndInitials: [
        {
          date: "02 Apr 2025",
          initials: [
            { time: "08:00", initial: "L. Mapata" },
            { time: "12:00", initial: "GK" },
            { time: "15:00", initial: "LK" },
            { time: "18:00", initial: "MK" },
          ],
        },
        {
          date: "03 Apr 2025",
          initials: [
            { time: "08:00", initial: "LM" },
            { time: "12:00", initial: "GK" },
            { time: "15:00", initial: "LK" },
            { time: "18:00", initial: "MK" },
          ],
        },
        {
          date: "04 Apr 2025",
          initials: [
            { time: "08:00", initial: "LM" },
            { time: "12:00", initial: "GK" },
            { time: "15:00", initial: "LK" },
            { time: "18:00", initial: "MK" },
          ],
        },
        {
          date: "04 Apr 2025",
          initials: [
            { time: "08:00", initial: "LM" },
            { time: "12:00", initial: "GK" },
            { time: "15:00", initial: "LK" },
            { time: "18:00", initial: "MK" },
          ],
        },
        {
          date: "04 Apr 2025",
          initials: [
            { time: "08:00", initial: "LM" },
            { time: "12:00", initial: "GK" },
            { time: "15:00", initial: "LK" },
            { time: "18:00", initial: "MK" },
          ],
        },
      ],
    },
    {
      date: "03 Apr 2025",
      medication: {
        name: "Amoxicillin 250mg",
        dose: "1 capsule",
        frequency: "3x/day",
        route: "Oral",
        prescriber: "Dr. N. Banda",
        stopDate: "6 Apr",
      },
      administrationDatesAndInitials: [
        {
          date: "03 Apr 2025",
          initials: [
            { time: "08:00", initial: "LM" },
            { time: "14:00", initial: "GK" },
            { time: "20:00", initial: "MK" },
            { time: "00:00", initial: "LK" },
          ],
        },
      ],
    },
  ];

  return <DrugChart medications={medications} />;
}
