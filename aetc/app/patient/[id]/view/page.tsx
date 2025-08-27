'use client'
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getOnePatient, getPatientRelationships } from "@/hooks/patientReg";
import { WrapperBox, MainTypography, MainPaper } from "@/components";
import { ReactNode } from "react"
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
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
            <ViewPatient disabled={false} patient={patient ?? {} as Person} />
            <WrapperBox>
                <br />
                <DisplayRelationship disabled={false} patientId={params.id as string} loading={loadingRelationships} relationships={relationships ? relationships : []} />
            </WrapperBox>
            <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
                <DisplaySocialHistory disabled={false} onSubmit={() => { }} loading={isPending || patientLoading} socialHistory={socialHistory ? socialHistory : {} as Encounter} />
                <DisplayFinancing disabled={false} onSubmit={() => { }} loading={isPending || patientLoading} financing={financing ? financing : {} as Encounter} />
            </WrapperBox>
        </WrapperBox>
    </>
}
export default Page;

// const ContainerCard = ({ children }: { children: ReactNode }) => {
//     return <MainPaper sx={{ p: "1ch", flex: 1, mx: "0.5ch" }} >{children}</MainPaper>
// }


// const LabelValue = ({ label, value }: { label: string; value: any }) => {
//     return (
//         <WrapperBox sx={{ display: "flex", alignItems: "flex-start", mb: "0.5ch" }}>
//             <MainTypography width={"10ch"} sx={{ fontSize: "0.8rem" }}>
//                 {label}
//             </MainTypography>
//             <MainTypography sx={{ fontSize: "0.8rem" }}>{value}</MainTypography>
//         </WrapperBox>
//     );
// };

