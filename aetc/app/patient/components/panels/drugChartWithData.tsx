import { DrugChart } from "./drugChart";

export function DrugChartWithData() {
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
            { time: "08:00", initial: "LM" },
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
