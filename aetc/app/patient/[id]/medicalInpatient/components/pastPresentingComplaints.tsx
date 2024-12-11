"use client";;
import { Panel } from "@/app/patient/components/panels";
import { WrapperBox } from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useEffect } from "react";

function PresentingComplaintsPanel() {
    const { params } = useParameters();
    const { data: complaintsData, isLoading } = getPatientsEncounters(params?.id as string);


    const complaintsEncounters = Array.isArray(complaintsData)
    ? complaintsData.filter((item) => item.encounter_type?.name === 'PRESENTING COMPLAINTS')
    : [];

  useEffect(() => {
    console.log(complaintsEncounters)
    
  },[complaintsEncounters])

return (
    <>
    
        <Panel title="Presenting Complaints">
            
            <WrapperBox></WrapperBox>
        </Panel>
    </>
  );



}


export default PresentingComplaintsPanel;