import { Obs } from "@/interfaces";
import { ClinicalNotesDataType } from "../displayInformation";
import { VitalFormConfig } from "@/app/vitals/components/vitalsForm";
import { getObservation, getObservationValue } from "@/helpers/emr";
import { concepts } from "@/constants";

export const formatPresentingComplaints = (
  data: Obs[]
): ClinicalNotesDataType => {
  const items = data?.map((item) => {
    return { item: item?.value };
  });
  return { heading: "Presenting Complaints", children: items };
};

export const formatVitals = (data: Obs[]): ClinicalNotesDataType[] => {

    const items = (
    Object.keys(VitalFormConfig) as Array<keyof typeof VitalFormConfig>
  ).map((key) => {
    const vital = VitalFormConfig[key];
    const value = getObservationValue(data, vital.name);
    return { item: { [vital.label]: value || "N/A" } };
  });


  return [
    { heading: "Vitals", children: items },
    {
      heading: "Triage Result",
      children: [{ item: getObservationValue(data, concepts.TRIAGE_RESULT) || "N/A" }]
    },
    {
      heading: "Patient Care Area",
      children: [{ item: getObservationValue(data, concepts.CARE_AREA) || "N/A" }]
    }
  ];
};
