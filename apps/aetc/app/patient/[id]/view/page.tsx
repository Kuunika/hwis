'use client'
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getOnePatient } from "@/hooks/patientReg";
import { WrapperBox, MainTypography, MainPaper } from "shared-ui/src";

const Page = () => {
    const { params } = useParameters();
    const { data, isLoading } = getPatientsEncounters(params?.id as string);
    const { data: patient, isLoading: patientLoading } = getOnePatient(params.id as string);


    console.log(patient?.addresses)

    console.log({ data })
    return <>
        <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
            <MainPaper sx={{ p: "1ch", flex: 1, mr: "1ch" }}>
                <MainTypography variant="h5">Demographics</MainTypography>
                <LabelValue label="First Name" value={patient?.given_name} />
                <LabelValue label="Last Name" value={patient?.family_name} />
                <LabelValue label="Gender" value={patient?.gender} />
                <LabelValue label="Date of birth" value={patient?.birthdate} />
                <LabelValue label="D" value={patient?.birthdate} />

            </MainPaper>
            <MainPaper sx={{ p: "1ch", flex: 1 }}>
                <MainTypography variant="h5">Demographics</MainTypography>
            </MainPaper>

        </WrapperBox>
    </>

}
export default Page;


const LabelValue = ({ label, value }: { label: string; value: any }) => {
    return (
        <WrapperBox sx={{ display: "flex", alignItems: "flex-start", mb: "0.5ch" }}>
            <MainTypography width={"10ch"} sx={{ fontSize: "0.8rem" }}>
                {label}
            </MainTypography>
            <MainTypography sx={{ fontSize: "0.8rem" }}>{value}</MainTypography>
        </WrapperBox>
    );
};