    //@ts-nocheck
import { DDESearch, Patient } from "@/interfaces";

export const demographicSearchLocalAdaptor = (
  data: Patient[] | undefined
): DDESearch => {

  if (data) return { remotes: [], locals: data };


  return {remotes:[], locals:[]}
};

export const demographicSearchDDEAdaptor = (
  data: DDESearch | undefined
): DDESearch => {



 const remotes = data?.remotes?.map(d=>{
  return {
    identifiers: d.patient_identifiers,
    given_name: d.person.names[0].given_name,
    family_name: d.person.names[0].family_name,
    ...d.person
  }
 })


 console.log( { remotes, locals: data.locals})


  if (data) return { remotes, locals: data.locals}


  return {remotes:[], locals:[]}
};
