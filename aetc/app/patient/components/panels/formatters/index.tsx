import { Obs } from "@/interfaces";
import { ClinicalNotesDataType } from "../displayInformation";
import { VitalFormConfig } from "@/app/vitals/components/vitalsForm";
import { filterObservations, getObservationValue } from "@/helpers/emr";
import { concepts } from "@/constants";
import {
  airwayFormConfig,
  breathingFormConfig,
  circulationFormConfig,
  disabilityFormConfig,
  exposureFormConfig,
} from "@/app/patient/[id]/primary-assessment/components";
import { soapierFormConfig } from "@/app/patient/[id]/soap/components/soapForm";
import { getObservations } from "@/helpers";

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
      children: [
        { item: getObservationValue(data, concepts.TRIAGE_RESULT) || "N/A" },
      ],
    },
    {
      heading: "Patient Care Area",
      children: [
        { item: getObservationValue(data, concepts.CARE_AREA) || "N/A" },
      ],
    },
  ];
};

export const formatPrimarySurvey = (data: {
  airwayObs: Obs[];
  breathingObs: Obs[];
  circulationObs: Obs[];
  disabilityObs: Obs[];
  exposureObs: Obs[];
}): ClinicalNotesDataType[] => {
  return [
    {
      heading: "Airway",
      children: buildNotesObject(airwayFormConfig, data.airwayObs),
    },
    {
      heading: "Breathing",
      children: buildNotesObject(breathingFormConfig, data.breathingObs),
    },
    {
      heading: "Circulation",
      children: buildNotesObject(circulationFormConfig, data.circulationObs),
    },
    {
      heading: "Disability",
      children: buildNotesObject(disabilityFormConfig, data.disabilityObs),
    },
    {
      heading: "Exposure",
      children: buildNotesObject(exposureFormConfig, data.exposureObs),
    },
  ];
};

export const formatSoapierNotes = (data: any) => {
  return [
    {
      heading: "Soapier Notes",
      children: buildNotesObject(soapierFormConfig, data),
    },
  ];
};
export const formatDiagnosisNotes = (data: any) => {

console.log({data});

  const diagnosisNotesConfig = {
    diagnosis: {
      name: concepts.DIFFERENTIAL_DIAGNOSIS,
      label: "Diagnosis",
      type: "title",
      children:[
        {
          concept: concepts.DIFFERENTIAL_DIAGNOSIS,
          label: "Differential",
          type: "string",
          multiple:true
        },
        {
          concept: concepts.FINAL_DIAGNOSIS,
          label: "Final",
          type: "string",
          multiple:true
        },
      ]
    },
  };

  return [
    {
      heading: "Soapier Notes",
      children: buildNotesObject(diagnosisNotesConfig, data),
    },
  ];
};

const buildNotesObject = (formConfig: any, obs: Obs[]) => {
  return (Object.keys(formConfig) as Array<keyof typeof formConfig>)
    .filter((key) => {
      const config = formConfig[key];
      return !config.child;
    })
    .map((key) => {
      const config = formConfig[key];
      const value = getObservationValue(obs, config.name);
      const displayValue = config.options?.[value] ?? value;
      const topParentType = config?.type || "N/A";
      let children = buildChildren(obs, config.children) ?? [];

      if (config.hasGroupMembers) {
        const parentObs: any = filterObservations(obs, config.name);
        if (parentObs?.length > 0) {
          children = [
            ...children,
            ...parentObs[0].children.map((child: any) => ({
              item: child.value,
            })),
          ];
        }
      }

      const result: any = {
        item:
          topParentType == "string"
            ? displayValue
            : topParentType == "title"
              ? config.label
              : { [config.label]: displayValue || "N/A" },
      };
      if (children && children.length > 0) {
        result.children = children;
      }
      return result;
    });
};

const buildChildren = (obs: Obs[], children: any) => {
  if (!children) return;
  return (
    obs.length > 0 &&
    children?.flatMap((child: any) => {
      const innerObs = filterObservations(obs, child.concept);
      let transformedObs;

      if (child?.multiple) {
        console.log(child.concept, { innerObs });
      }

      if (child?.type == "string") {
        const obValue = getObservationValue(obs, child?.concept);

        const childValue = child?.multiple
          ? innerObs?.map((innerOb) => {
              return {
                item: child?.options
                  ? child.options[innerOb.value]
                  : innerOb.value,
              };
            })
          : child?.options
            ? child.options[obValue]
            : obValue;

        transformedObs = {
          item: child.label,
          children: child?.children
            ? buildChildren(obs, child?.children)
            : childValue,
        };
      } else {
        const obValue = getObservationValue(obs, child?.concept);

        const childValue = child?.multiple
          ? innerObs?.map((innerOb) => {
              return {
                item: child?.options
                  ? child.options[innerOb.value]
                  : innerOb.value,
              };
            })
          : { [child.label]: obValue };

        //  console.log({childValue});

        //  child?.options
        //    ? child.options[obValue]
        //    : obValue;

        transformedObs = {
          item: childValue,
          children: child?.children
            ? buildChildren(obs, child?.children)
            : childValue,
        };

        // transformedObs = obs?.map((ob) => {
        //   return {
        //     item: { [child?.label]: ob.value || "N/A" },
        //     children: child?.children ? buildChildren(obs, child?.children) : childValue,
        //   };
        // });
      }
      return transformedObs;
    })
  );
};

// export const formatPrimarySurvey = (data: {
//   airwayObs: Obs[];
//   breathingObs: Obs[];
//   circulationObs: Obs[];
//   disabilityObs: Obs[];
//   exposureObs: Obs[];
// }): ClinicalNotesDataType[] => {
//   const formatConfig = (
//     key: keyof typeof airwayFormConfig,
//     config = airwayFormConfig[key]
//   ): any => {
//     const value = getObservationValue(data.airwayObs, config.name);
//     const displayValue = config.options?.[value] ?? value ?? "N/A";

//     const result: any = {
//       item: { [config.label]: displayValue },
//     };

//     // Recursively format children
//     const directChildren = config.children ?? [];
//     const nestedChildren = Object.entries(airwayFormConfig)
//       .filter(([_, v]) => v.child && v.name && v.name === config.name)
//       .map(([k]) => k as keyof typeof airwayFormConfig);

//     const allChildren = [
//       ...directChildren
//         .map((child: any) => {
//           const obs = filterObservations(data.airwayObs, child.concept);
//           if (child?.type === "string") {
//             return {
//               item: child.label,
//               children: obs?.map((ob) => ({
//                 item: ob?.value ?? "N/A",
//               })),
//             };
//           } else {
//             return obs?.map((ob) => ({
//               item: { [child.label]: ob?.value ?? "N/A" },
//             }));
//           }
//         })
//         .flat(),

//       ...nestedChildren.map((childKey) =>
//         formatConfig(childKey, airwayFormConfig[childKey])
//       ),
//     ].filter(Boolean);

//     if (allChildren.length > 0) {
//       result.children = allChildren;
//     }

//     return result;
//   };

//   const topLevelKeys = Object.keys(airwayFormConfig).filter(
//     (key) => !airwayFormConfig[key as keyof typeof airwayFormConfig].child
//   ) as Array<keyof typeof airwayFormConfig>;

//   const items = topLevelKeys.map((key) => formatConfig(key));

//   return [{ heading: "Airway", children: items }];
// };
