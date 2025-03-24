import { AccordionComponent } from "@/components/accordion";
import { encounters } from "@/constants";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientEncounters } from "@/services/encounter";

const Complaints = () => {
  const { patientId } = getActivePatientDetails();
  const { data } = getPatientsEncounters(patientId as string);
  const presentingComplaintsEncounter = data?.filter((enc) => {
    return enc.encounter_type.uuid === encounters.PRESENTING_COMPLAINTS;
  });
  console.log({ presentingComplaintsEncounter });
  return <></>;
};

export const DetailsPresentingComplaintsAccordion = () => {
  const sections = [
    {
      id: "complaints",
      title: "Complains",
      content: <Complaints />,
    },
  ];
  return <AccordionComponent sections={sections} />;
};
