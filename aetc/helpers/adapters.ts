//@ts-nocheck
import { DDESearch, Patient } from "@/interfaces";
import { findByNPID } from "@/services/patient";

export const demographicSearchLocalAdaptor = (
  data: Patient[] | undefined
): DDESearch => {
  if (data) return { remotes: [], locals: data };

  return { remotes: [], locals: [] };
};

export const demographicSearchDDEAdaptor = (
  data: DDESearch | undefined
): DDESearch => {
  const remotes = data?.remotes?.map((d) => {
    // findByNPID(d.patient_identifiers[0].identifier).then(response=>console.log(response))
    return {
      ...d.person,
      identifiers: d.identifiers,
      patient_id: d.identifiers[0]?.identifier,
      given_name: d.person.names[0].given_name,
      family_name: d.person.names[0].family_name,
      addresses: d.addresses,
      uuid: d.identifiers[1]?.identifier,
    };
  });

  if (data) return { remotes, locals: data.locals };

  return { remotes: [], locals: [] };
};
