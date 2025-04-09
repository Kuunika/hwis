import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const usePatientManagementPlan = (pData: any) => {
  const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>('');


  useEffect(() => {
    if (!pData) return;
  
    const nonPharmacologicalEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.NON_PHARMACOLOGICAL
    );
  
    if (!nonPharmacologicalEncounter?.obs) return;
  
    // Only collect values from leaf nodes (children with values)
    const collectValues = (obs: Obs): string[] => {
      let values: string[] = [];
  
      if (obs.children && obs.children.length > 0) {
        obs.children.forEach((child: Obs) => {
          values = values.concat(collectValues(child));
        });
      } else if (obs.value) {
        values.push(obs.names?.[0]?.name || obs.value);
      }
  
      return values;
    };
  
    const observationDates = [
      ...nonPharmacologicalEncounter.obs.map((ob: Obs) => ob.obs_datetime),
      ...nonPharmacologicalEncounter.obs.flatMap((ob: Obs) =>
        ob.children ? ob.children.map((child: Obs) => child.obs_datetime) : []
      ),
    ].filter(Boolean);
  
    const latestDate =
      observationDates.length > 0
        ? new Date(Math.max(...observationDates.map(d => new Date(d).getTime())))
        : new Date();
  
    const formattedDate = latestDate.toLocaleString();
    const messages = [`Non-Pharmacological Management Plan recorded on ${formattedDate}:\n`];
  
    const grouped: Record<string, string[]> = {
      Procedures: [],
      "Supportive Care": [],
      Others: [],
    };
  
    nonPharmacologicalEncounter.obs.forEach((obs: Obs) => {
      const conceptName = obs.names?.[0]?.name?.toLowerCase() || "";
  
      const values = collectValues(obs).filter(
        v =>
          v.trim().toLowerCase() !== "procedures" &&
          v.trim().toLowerCase() !== "supportive care"
      );
  
      if (values.length === 0) return;
  
      if (conceptName.includes("procedure")) {
        grouped.Procedures.push(...values);
      } else if (conceptName.includes("supportive")) {
        grouped["Supportive Care"].push(...values);
      } else {
        grouped.Others.push(...values);
      }
    });
  
    const appendGroup = (title: string, items: string[]) => {
      if (items.length === 0) return;
      messages.push(`\n${title}:\n`);
      items.forEach(item => {
        messages.push(`  ${item}`);
      });
    };
  
    appendGroup("Procedures", grouped.Procedures);
    appendGroup("Supportive Care", grouped["Supportive Care"]);
    appendGroup("Other Observations", grouped.Others);
  
    setPatientManagementPlanMessage(prev => prev + '' + messages.join('\n'));
  }, [pData]);
  
  
  useEffect(() => {
    if (!pData) return;

    const encounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PATIENT_CARE_AREA
    );

   // console.log("Tione za patient managment",encounter)

    if (!encounter?.obs) return;

    const careAreas = encounter.obs
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (careAreas.length === 0) return;

    const encounterDate = new Date(encounter.encounter_datetime).toLocaleString();

    let messages = [`Patient Care Area recorded on: ${encounterDate}:\n`];

    careAreas.forEach((area: string) => {
      messages.push(`• ${area}`);
    });

    setPatientManagementPlanMessage(prev => prev + '\n' + messages.join('\n'));
  }, [pData]);




  useEffect(() => {
    if (!pData) return;

    const prescriptionEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PRESCRIPTION
    );

    if (!prescriptionEncounter?.obs) return;

    const observations = prescriptionEncounter.obs
      .map((ob: Obs) => ob.value)
      .filter(Boolean);

    if (observations.length === 0) return;

    const formattedDate = new Date(prescriptionEncounter.encounter_datetime).toLocaleString();
    let messages = [`Medication recorded on ${formattedDate}`];

    observations.forEach((obs: any) => {
      messages.push(`•${obs}. `);
    });

    setPatientManagementPlanMessage(prev => prev + '\n' + messages.join(''));;
  }, [pData]);


  return patientManagementPlanMessage;
};
