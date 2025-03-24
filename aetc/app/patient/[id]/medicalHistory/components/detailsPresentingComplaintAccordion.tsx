import { AccordionComponent } from "@/components/accordion";
import { MinimalTable } from "@/components/tables/minimalTable";
import { encounters } from "@/constants";
import { getHumanReadableDate } from "@/helpers/dateTime";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientEncounters } from "@/services/encounter";

const Complaints = () => {
  const { patientId } = getActivePatientDetails();
  const { data } = getPatientsEncounters(patientId as string);
  const presentingComplaintsEncounter = data?.filter((enc) => {
    return enc.encounter_type.uuid === encounters.PRESENTING_COMPLAINTS;
  });

  let dataObs: any = [];

  if (presentingComplaintsEncounter) {
    dataObs = presentingComplaintsEncounter[
      presentingComplaintsEncounter?.length - 1
    ].obs.map((ob) => {
      return {
        complaint: ob.value,
        dateTime: getHumanReadableDate(ob.obs_datetime),
      };
    });
  }

  return (
    <MinimalTable
      columns={[
        { label: "Complaint", field: "complaint" },
        { label: "Date", field: "dateTime" },
      ]}
      data={dataObs}
    />
  );
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
