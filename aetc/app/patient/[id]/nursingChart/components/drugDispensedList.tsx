import { MinimalTable } from "@/components/tables/minimalTable";
import { conceptNames } from "@/constants";
import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { Encounter } from "@/interfaces";

export const formatDispensed = (data: Encounter, givenMedication: string) => {
  return data?.obs
    ?.filter((ob) => ob.value_coded_uuid == givenMedication)
    .map((ob) => {
      return {
        route: ob.children.find(
          (b) => b.names[0].name == conceptNames.MEDICATION_ROUTE
        )?.value,
        dose: ob.children.find(
          (b) => b.names[0].name == conceptNames.PRESCRIBED_DOSE
        )?.value,
        createdBy: ob.created_by,
        createdTime: getHumanReadableDateTime(ob.obs_datetime),
      };
    });
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
