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
import { nonPharmacologicalFormConfig } from "@/app/patient/[id]/patient-management-plan/components/forms/nonPharmacologicalForm";
import {
  abdomenAndPelvisFormConfig,
  chestFormConfig, extremitiesFormConfig,
  generalInformationFormConfig,
  headAndNeckFormConfig, neurologicalFormConfig
} from "@/app/patient/[id]/secondary-assessment/components";
import {allergiesFormConfig, lastMealFormConfig} from "@/app/patient/[id]/medicalHistory/components";
import { dispositionFormConfig } from "@/app/patient/[id]/disposition/components/DischargeHomeForm";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

export const formatPresentingComplaints = (
  data: Obs[]
): ClinicalNotesDataType => {
  const items = data?.map((item) => {
    return { item: item?.value };
  });
  return {
    heading: "Presenting Complaints",
    children: items,
    user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
  };
};

export const formatVitals = (data: Obs[]): ClinicalNotesDataType[] => {
  const items = (
    Object.keys(VitalFormConfig) as Array<keyof typeof VitalFormConfig>
  ).map((key) => {
    const vital = VitalFormConfig[key];
    const value = getObservationValue(data, vital.name);
    return { item: { [vital.label]: value || "N/A" } };
  });

  console.log({data});

  return [
    {
      heading: "Vitals",
      children: items,
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
    },
    {
      heading: "Triage Result",
      children: [
        { item: getObservationValue(data, concepts.TRIAGE_RESULT) || "N/A" },
      ],
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
    },
    {
      heading: "Patient Care Area",
      children: [
        { item: getObservationValue(data, concepts.CARE_AREA) || "N/A" },
      ],
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
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
      user: `${data.airwayObs[0]?.created_by} ${getHumanReadableDateTime(data.airwayObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Breathing",
      children: buildNotesObject(breathingFormConfig, data.breathingObs),
      user: `${data.breathingObs[0]?.created_by} ${getHumanReadableDateTime(data.breathingObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Circulation",
      children: buildNotesObject(circulationFormConfig, data.circulationObs),
      user: `${data.circulationObs[0]?.created_by} ${getHumanReadableDateTime(data.circulationObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Disability",
      children: buildNotesObject(disabilityFormConfig, data.disabilityObs),
      user: `${data.disabilityObs[0]?.created_by} ${getHumanReadableDateTime(data.disabilityObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Exposure",
      children: buildNotesObject(exposureFormConfig, data.exposureObs),
      user: `${data.exposureObs[0]?.created_by} ${getHumanReadableDateTime(data.exposureObs[0]?.obs_datetime)}`,
    },
  ];
};

export const formatPatientManagamentPlan = (data: {
  nonPharmalogical: Obs[];
}): ClinicalNotesDataType[] => {
  return [
    {
      heading: "Non-Pharmacological",
      children: buildNotesObject(
        nonPharmacologicalFormConfig,
        data.nonPharmalogical
      ),
      user: `${data.nonPharmalogical[0]?.created_by} ${getHumanReadableDateTime(data.nonPharmalogical[0]?.obs_datetime)}`,
    },
  ];
};

export const formatSecondarySurvey = (data: {
  generalInformationObs: Obs[];
  headAndNeckObs: Obs[];
  chestObs: Obs[];
  abdomenAndPelvisObs: Obs[];
  extremitiesObs: Obs[];
  neurologicalObs: Obs[];
}): ClinicalNotesDataType[] => {
  return [
    {
      heading: "General Information",
      children: buildNotesObject(
        generalInformationFormConfig,
        data.generalInformationObs
      ),
      user: `${data.generalInformationObs[0]?.created_by} ${getHumanReadableDateTime(data.generalInformationObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Head and Neck",
      children: buildNotesObject(headAndNeckFormConfig, data.headAndNeckObs),
      user: `${data.headAndNeckObs[0]?.created_by} ${getHumanReadableDateTime(data.headAndNeckObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Chest",
      children: buildNotesObject(chestFormConfig, data.chestObs),
      user: `${data.chestObs[0]?.created_by} ${getHumanReadableDateTime(data.chestObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Abdomen and Pelvis",
      children: buildNotesObject(
        abdomenAndPelvisFormConfig,
        data.abdomenAndPelvisObs
      ),
      user: `${data.abdomenAndPelvisObs[0]?.created_by} ${getHumanReadableDateTime(data.abdomenAndPelvisObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Extremities",
      children: buildNotesObject(extremitiesFormConfig, data.extremitiesObs),
      user: `${data.extremitiesObs[0]?.created_by} ${getHumanReadableDateTime(data.extremitiesObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Neurological",
      children: buildNotesObject(neurologicalFormConfig, data.neurologicalObs),
      user: `${data.neurologicalObs[0]?.created_by} ${getHumanReadableDateTime(data.neurologicalObs[0]?.obs_datetime)}`,
    },
  ];
};
export const formatSampleHistory = (data: {
  presentingComplaintsObs: Obs[];
  allergiesObs: Obs[];
  medicationsObs: Obs[];
  existingConditionsObs: Obs[];
  lastMealObs: Obs[];
  eventsObs: Obs[];
}): ClinicalNotesDataType[] => {
  return [
    {
      heading: "Presenting Complaints",
      children: buildNotesObject(
        generalInformationFormConfig,
        data.presentingComplaintsObs
      ),
      user: `${data.presentingComplaintsObs[0]?.created_by} ${getHumanReadableDateTime(data.presentingComplaintsObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Allergies",
      children: buildNotesObject(allergiesFormConfig, data.allergiesObs),
      user: `${data.allergiesObs[0]?.created_by} ${getHumanReadableDateTime(data.allergiesObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Medications",
      children: buildNotesObject(chestFormConfig, data.medicationsObs),
      user: `${data.medicationsObs[0]?.created_by} ${getHumanReadableDateTime(data.medicationsObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Existing Conditions",
      children: buildNotesObject(
        abdomenAndPelvisFormConfig,
        data.existingConditionsObs
      ),
      user: `${data.existingConditionsObs[0]?.created_by} ${getHumanReadableDateTime(data.existingConditionsObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Last Meal",
      children: buildNotesObject(lastMealFormConfig, data.lastMealObs),
      user: `${data.lastMealObs[0]?.created_by} ${getHumanReadableDateTime(data.lastMealObs[0]?.obs_datetime)}`,
    },
    {
      heading: "Events",
      children: buildNotesObject(neurologicalFormConfig, data.eventsObs),
      user: `${data.eventsObs[0]?.created_by} ${getHumanReadableDateTime(data.eventsObs[0]?.obs_datetime)}`,
    },
  ];
};


export const formatSoapierNotes = (data: Obs[]) => {
  return [
    {
      heading: "Soapier Notes",
      children: buildNotesObject(soapierFormConfig, data),
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
    },
  ];
};
export const formatDiagnosisNotes = (data: Obs[]) => {

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
      heading: "Diagnosis Notes",
      children: buildNotesObject(diagnosisNotesConfig, data),
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
    },
  ];
};

export const formatInvestigationPlans = (data: Obs[]) => {

 return data.map(ob=>{
    const plan = ob.value;
    const result= ob.children.map((child: Obs) => {
      return {
        test: child.names[0].name,
        result: child.value,
      }
      });

    return { plan, result };

  })


}
export const formatManagementPlan  = (
    data: Obs[]
): ClinicalNotesDataType => {
    const items = data?.map((item) => {
        return { item: item?.value };
    });
    return {
        heading: "Non Pharmacological", children: items };
};
const handleImagesObsRestructure = (children: Obs[]) => {
    return children
        .filter((ob: Obs) => ob.value || (ob.children && ob.children.length > 0))
        .map((ob: Obs) => {
            const childItems = ob.children
                ?.filter((childOb: Obs) => childOb.value || (childOb.children && childOb.children.length > 0)) // skip empty
                .map((childOb: Obs) => {
                    let nestedChildren: any[] = [];

                    if (childOb?.children && childOb.children.length > 0) {
                        nestedChildren = childOb.children
                            .filter((cOb: Obs) => cOb.value)
                            .map((cOb: Obs) => ({
                                item: {
                                    [cOb.names?.[0]?.name || "Unnamed"]: cOb.value,
                                },
                            }));
                    }

                    return {
                        item:
                            nestedChildren.length === 0
                                ? { [childOb.names?.[0]?.name || "Unnamed"]: childOb.value }
                                : childOb.value,
                        children: nestedChildren.length > 0 ? nestedChildren : undefined,
                    };
                }) ?? [];

            return {
                item: ob.value,
                children: childItems.length > 0 ? childItems : undefined,
            };
        });
};
export const formatDisposition = (data: Obs[]) => {
  return [
    {
      heading: "Disposition",
      children: buildNotesObject(dispositionFormConfig, data),
      user: `${data[0]?.created_by} ${getHumanReadableDateTime(data[0]?.obs_datetime)}`,
    },
  ];
};

const buildChildren = (obs: Obs[], children: any) => {
    if (!children) return [];
    return (
        obs.length > 0 &&
        children.flatMap((child: any) => {
            const innerObs = filterObservations(obs, child.concept);

            if (!innerObs || innerObs.length === 0) return [];

            // Handle image-type obs
            if (child?.image) {
                const parentOb = filterObservations(obs, child?.parentConcept);
                if (!parentOb?.length) return [];
                return handleImagesObsRestructure(parentOb[0].children);
            }

            const obValue = getObservationValue(obs, child?.concept);

            // If there's no usable value, skip this child
            if (
                (!obValue || obValue === "" || obValue === null) &&
                (!child.multiple || innerObs.length === 0)
            ) {
                return [];
            }

            let transformedObs: any;

            if (child?.type === "string") {
                const childValue = child?.multiple
                    ? innerObs
                        .map((innerOb) => {
                            const val = child?.options
                                ? child.options[innerOb.value]
                                : innerOb.value;
                            return val ? { item: val } : null;
                        })
                        .filter(Boolean) // filter out null/empty
                    : child?.options
                        ? child.options[obValue]
                        : obValue;

                if (
                    childValue === undefined ||
                    childValue === null ||
                    (Array.isArray(childValue) && childValue.length === 0)
                ) {
                    return [];
                }

                transformedObs = {
                    item: child.label,
                    children: child?.children
                        ? buildChildren(obs, child?.children)
                        : childValue,
                };
            } else {
                const childValue = child?.multiple
                    ? innerObs
                        .map((innerOb) => {
                            const val = child?.options
                                ? child.options[innerOb.value]
                                : innerOb.value;
                            return val ? { item: val } : null;
                        })
                        .filter(Boolean)
                    : obValue
                        ? { [child.label]: obValue }
                        : null;

                if (!childValue || (Array.isArray(childValue) && childValue.length === 0)) {
                    return [];
                }

                transformedObs = {
                    item: childValue,
                    children: child?.children
                        ? buildChildren(obs, child?.children)
                        : childValue,
                };
            }

            return transformedObs;
        })
    );
};


const buildNotesObject = (formConfig: any, obs: Obs[]) => {
    return (Object.keys(formConfig) as Array<keyof typeof formConfig>)
        .filter((key) => {
            const config = formConfig[key];
            return !config.child;
        })
        .flatMap((key) => {
            const config = formConfig[key];
            const value = getObservationValue(obs, config.name);

            if (!value && !config.hasGroupMembers && !config.image) {
                return [];
            }

            const displayValue = config.options?.[value] ?? value;
            const topParentType = config?.type || "N/A";

            let groupMemberChildren = [];

            if (config.groupMembersWithLabel)
            {
               const parentObs: any = filterObservations(obs, config.name);
               if(parentObs?.length > 0) {
                groupMemberChildren = parentObs[0]?.children
               }
            }
            let children = buildChildren([...obs, ...groupMemberChildren], config.children) ?? [];

            if (config.hasGroupMembers) {
                const parentObs: any = filterObservations(obs, config.name);
                if (parentObs?.length > 0) {
                    children = [
                        ...children,
                        ...parentObs[0]?.children
                            .filter((child: any) => child.value) // only keep ones with values
                            .map((child: any) => ({
                                item: child.value,
                            })),
                    ];
                }

                if (!value && children.length === 0) {
                    return [];
                }
            }

            if (config?.image) {
                const parentObs: any = filterObservations(obs, config.name);
                const imagesObs = parentObs
                    .filter((ob: Obs) => ob.value || (ob.children?.length ?? 0) > 0)
                    .map((ob: Obs) => ({
                        item: ob.value,
                        children: handleImagesObsRestructure(ob.children),
                    }));
                return imagesObs;
            }

            const result: any = {
                item:
                    topParentType === "string"
                        ? displayValue
                        : topParentType === "title"
                            ? config.label
                            : { [config.label]: displayValue },
            };

            if (children.length > 0) {
                result.children = children;
            }

            return result;
        });
};
