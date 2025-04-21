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
    
    //console.log("Tione za Pharma", nonPharmacologicalEncounter)
    if (nonPharmacologicalEncounter?.obs) {
      const collectValues = (obs: Obs): string[] => {
        let values: string[] = [];
    
        if (obs.children && obs.children.length > 0) {
          obs.children.forEach((child: Obs) => {
            values = values.concat(collectValues(child));
          });
        } else {
          if (obs.names && obs.names.length > 0) {
            const uniqueNames = new Set(
              obs.names
                .map(name => name.name?.trim())
                .filter(name => name && name !== obs.value)
            );
            values.push(...Array.from(uniqueNames));
          }
          if (obs.value && obs.value.trim() !== "") {
            values.push(obs.value);
          }
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
     // let messages = [`Non-Pharmacological Management Plan recorded on ${formattedDate}:\n`];
    
      const grouped: Record<string, string[]> = {
        Procedures: [],
        "Supportive Care": [],
        Others: [],
      };
    
      nonPharmacologicalEncounter.obs.forEach((obs: Obs) => {
        const conceptName = obs.names?.[0]?.name?.toLowerCase() || "";
        const values = collectValues(obs).filter(
          v => v.trim().toLowerCase() !== "procedures" &&
               v.trim().toLowerCase() !== "supportive care" &&
               v.trim() !== ""
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

      const createdBy = nonPharmacologicalEncounter.created_by;
    
    
      let messages = [
        `Non-Pharmacological Management Plan recorded on ${formattedDate}:\n`
      ];
    
      // Add procedures if they exist
      if (grouped.Procedures.length > 0) {
        messages.push(`The Procedures are: ${grouped.Procedures.join(", ")}`);
      }
    
      // Add supportive care if it exists
      if (grouped["Supportive Care"].length > 0) {
        messages.push(`The Supportive Care done are: ${grouped["Supportive Care"].join(", ")}`);
      }
    
      // Add created by at the bottom right
      messages.push(`\n\nCreated by: ${createdBy}`);
    
      allMessages.push(messages.join("\n"));
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
        const createdBy = careAreaEncounter.created_by
        const messages = [
          `Patient Care Area recorded on: ${encounterDate}:\n`,
          `The Patient Care Areas are: ${careAreas.join(", ")}`,
          `\n\nCreated by: ${createdBy}`  
        ];
        allMessages.push(messages.join("\n"));
      }
    }

    // === 3. Prescription Encounter ===

    const prescriptionEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.PRESCRIPTIONS
    );
    
    console.log("Tione zamakhwala", prescriptionEncounter);
    if (prescriptionEncounter?.obs) {
      const formattedDate = new Date(prescriptionEncounter.encounter_datetime).toLocaleString();
      const createdBy = prescriptionEncounter.created_by;
    
      // Process each medication observation
      const medicationDetails = prescriptionEncounter.obs.map((med: any) => {
        // Find children by their concept names instead of hardcoded IDs
        const formulation = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('formulation')))?.value;
        
        const doseValue = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('dose') && 
          !n.name?.toLowerCase().includes('unit')))?.value;
        
        const doseUnit = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('dose unit')))?.value;
        
        const frequency = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('frequency')))?.value;
        
        const durationValue = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('duration') && 
          !n.name?.toLowerCase().includes('unit')))?.value;
        
        const durationUnit = med.children?.find((c: any) => 
          c.names?.some((n: any) => n.name?.toLowerCase().includes('duration unit')))?.value;
    
        return {
          name: med.value,
          formulation,
          dose: doseValue && doseUnit ? `${doseValue} ${doseUnit}` : null,
          frequency,
          duration: durationValue && durationUnit ? `${durationValue} ${durationUnit}` : null
        };
      });
    
      let messages = [
        `Prescriptions recorded on ${formattedDate}:\n`
      ];
    
      // Add each medication's details
      medicationDetails.forEach((med:any, index:any) => {
        messages.push(`• ${med.name}${med.formulation ? ` (${med.formulation})` : ''}`);
        if (med.dose) messages.push(`  - Dose: ${med.dose}`);
        if (med.frequency) messages.push(`  - Frequency: ${med.frequency}`);
        if (med.duration) messages.push(`  - Duration: ${med.duration}`);
        messages.push(''); // Add empty line between medications
      });
    
      // Add created by at the bottom
      messages.push(`\n\nCreated by: ${createdBy}`);
    
      allMessages.push(messages.join("\n"));
    }

    // === Final message ===
    setPatientManagementPlanMessage(allMessages.join("\n\n"));
  }, [pData]);

  return patientManagementPlanMessage;
};
