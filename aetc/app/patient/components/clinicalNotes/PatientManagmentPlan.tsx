import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const usePatientManagementPlan = (pData: any) => {
  const [patientManagementPlanMessage, setPatientManagementPlanMessage] = useState<string | null>("");

  useEffect(() => {
    if (!pData) return;

    let allMessages: string[] = [];

    // === 1. Non-Pharmacological Management ===
    const nonPharmacologicalEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.NON_PHARMACOLOGICAL
    );
    if (nonPharmacologicalEncounter?.obs) {
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

      // const appendGroup = (title: string, items: string[]) => {
      //   if (items.length === 0) return;
      //   messages.push(`\n${title}:\n`);
      //   items.forEach(item => {
      //     messages.push(`•${item}`);
      //   });
      // };

      if (grouped.Procedures.length > 0) {
        messages.push(`The Procedures are : ${grouped.Procedures.join(", ")}`);
      }
      if (grouped["Supportive Care"].length > 0) {
        messages.push(`The Supportive Care done are: ${grouped["Supportive Care"].join(", ")}`);
      }
      if (grouped.Others.length > 0) {
        messages.push(`Other Observations: ${grouped.Others.join(", ")}`);
      }

      // appendGroup("Procedures", grouped.Procedures);
      // appendGroup("Supportive Care", grouped["Supportive Care"]);
      // appendGroup("Other Observations", grouped.Others);

      allMessages.push(messages.join(""));
    }

    // === 2. Patient Care Area Encounter ===
    const careAreaEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PATIENT_CARE_AREA
    );
    if (careAreaEncounter?.obs) {
      const careAreas = careAreaEncounter.obs
        .map((ob: Obs) => ob.value)
        .filter(Boolean);

      if (careAreas.length > 0) {
        const encounterDate = new Date(careAreaEncounter.encounter_datetime).toLocaleString();
        const messages = [
          `Patient Care Area recorded on: ${encounterDate}:\n`,
          `The Patient Care Areas are: ${careAreas.join(", ")}` 
        ];
        // careAreas.forEach((area: string) => {
        //   messages.push(`• ${area}`);
        // });
        allMessages.push(messages.join("\n"));
      }
    }

    // === 3. Prescription Encounter ===
    const prescriptionEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PRESCRIPTIONS
    );
    if (prescriptionEncounter?.obs) {
      const observations = prescriptionEncounter.obs
        .map((ob: Obs) => ob.value)
        .filter(Boolean);

      if (observations.length > 0) {
        const formattedDate = new Date(prescriptionEncounter.encounter_datetime).toLocaleString();
        const messages = [
          `Medication recorded on ${formattedDate}:\n`,
          `The medications are: ${observations.join(", ")}` 
        ];
        // observations.forEach((obs: any) => {
        //   // messages.push(`• ${obs}`);
        // });
        allMessages.push(messages.join("\n"));
      }
    }

    // === Final message ===
    setPatientManagementPlanMessage(allMessages.join("\n\n"));
  }, [pData]);

  return patientManagementPlanMessage;
};
