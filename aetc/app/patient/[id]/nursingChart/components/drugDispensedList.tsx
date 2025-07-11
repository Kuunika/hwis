import { MinimalTable } from "@/components/tables/minimalTable";
import { conceptNames, concepts } from "@/constants";
import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { Encounter, Obs } from "@/interfaces";

export const formatDispensedMedicationObs = (obs: Obs[]) => {
  return obs.map((ob) => {
    return {
      route: ob.children.find(
        (b) =>
          b.names?.length > 0 &&
          b.names[0]?.name == conceptNames.MEDICATION_ROUTE
      )?.value,
      dose: ob.children.find(
        (b) =>
          b.names?.length > 0 && b.names[0]?.name == concepts.MEDICATION_DOSE
      )?.value,
      createdBy: ob.created_by,
      createdTime: getHumanReadableDateTime(ob.obs_datetime),
      medication: ob.value,
    };
  });
};

export const formatDispensed = (data: Encounter, givenMedication?: string) => {
  const row = data?.obs?.filter((ob) => ob.value_coded_uuid == givenMedication);

  return formatDispensedMedicationObs(row);
};

export const DrugDispensedList = ({
  data,
  givenMedication,
}: {
  data: Encounter;
  givenMedication: string;
}) => {
  const rows = formatDispensed(data, givenMedication);

  return (
    <MinimalTable
      columns={[
        { label: "Dose", field: "dose" },
        { label: "Route", field: "route" },
        { label: "Dispensed Time", field: "createdTime" },
        { label: "Dispenser", field: "createdBy" },
      ]}
      data={rows ? rows : []}
    />
  );
};
