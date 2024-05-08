'use client'
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getOnePatient, getPatientRelationships } from "@/hooks/patientReg";
import { WrapperBox } from "shared-ui/src";

import { encounters } from "@/constants";
import { ViewPatient } from "../../components/viewPatient";
import { Encounter, Person } from "@/interfaces";

import { DisplayFinancing, DisplayRelationship, DisplaySocialHistory } from "./components";

const Page = () => {
    const { params } = useParameters();

    const { data: patient, isLoading: patientLoading } = getOnePatient(params.id as string);
    const { data: loadedEncounters, isPending } = getPatientsEncounters(params.id as string);
    const { data: relationships, isPending: loadingRelationships } = getPatientRelationships(params.id as string)


    const socialHistory = loadedEncounters?.find(enc => enc.encounter_type.uuid == encounters.SOCIAL_HISTORY);
    const financing = loadedEncounters?.find(enc => enc.encounter_type.uuid == encounters.FINANCING);


    return <>
        <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <ViewPatient patient={patient ?? {} as Person} />
            <WrapperBox>
                <br />
                <DisplayRelationship loading={loadingRelationships} relationships={relationships ? relationships : []} />
            </WrapperBox>
            <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
                <DisplaySocialHistory onSubmit={() => { }} loading={isPending || patientLoading} socialHistory={socialHistory ? socialHistory : {} as Encounter} />
                <DisplayFinancing onSubmit={() => { }} loading={isPending || patientLoading} financing={financing ? financing : {} as Encounter} />
            </WrapperBox>
        </WrapperBox>
    </>
}
export default Page;

