import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { Obs } from "@/interfaces";

export const useInvestigations = (pData: any) => {
  const [investigationsMessage, setInvestigationsMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pData) return;

    const fieldsEncounter = pData.find(
      (d: any) => d.encounter_type.uuid === encounters.BED_SIDE_TEST
    );
   
    if (!fieldsEncounter?.obs) return;

    const processObservation = (obs: Obs, indent = 0): string => {
      let message = '';
      const indentStr = ' '.repeat(indent * 2);
      

      if (obs.value) {
        message += `${indentStr}${obs.names?.[0]?.name || 'Test'}: ${obs.value}\n`;
      }

      
      if (obs.children && obs.children.length > 0) {
        obs.children.forEach(child => {
          message += processObservation(child, indent + 1);
        });
      }

      return message;
    };

    // const observationDates = fieldsEncounter.obs
    //   .map((ob: Obs) => ob.obs_datetime)
    //   .filter(Boolean);

    // const latestDate = observationDates.length > 0
    //   ? new Date(Math.max(...observationDates.map(d => new Date(d).getTime())))
    //   : new Date();

    const observationDates = fieldsEncounter.obs
      .map((ob: Obs) => ob.obs_datetime)
      .filter((d: string | null | undefined): d is string => Boolean(d));

    const latestDate = observationDates.length > 0
      ? new Date(Math.max(...observationDates.map((d: string) => new Date(d).getTime())))
      : new Date();

    const formattedDate = latestDate.toLocaleString();

    let messages = [`Bed side tests recorded on ${formattedDate}:\n\n`];

    fieldsEncounter.obs.forEach((obs: Obs) => {
      messages.push(processObservation(obs));
    });

    setInvestigationsMessage(messages.join(""));
  }, [pData]);

  return investigationsMessage;
};