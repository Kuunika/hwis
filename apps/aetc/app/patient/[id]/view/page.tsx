'use client'
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getOnePatient } from "@/hooks/patientReg";
import { WrapperBox, MainTypography, MainPaper } from "shared-ui/src";
import { ReactNode } from "react"
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";

const Page = () => {
    const { params } = useParameters();
    const { data, isLoading } = getPatientsEncounters(params?.id as string);
    const { data: patient, isLoading: patientLoading } = getOnePatient(params.id as string);
    const { data: loadedEncounters } = getPatientsEncounters(params.id as string)

    // console.log(loadedEncounters);

    const socialHistory = loadedEncounters?.find(enc => enc.encounter_type.uuid == encounters.SOCIAL_HISTORY);
    const financing = loadedEncounters?.find(enc => enc.encounter_type.uuid == encounters.FINANCING);


    return <>
        <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
            <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
                <ContainerCard>
                    <MainTypography variant="h5">Demographics</MainTypography>
                    <LabelValue label="First Name" value={patient?.given_name} />
                    <LabelValue label="Last Name" value={patient?.family_name} />
                    <LabelValue label="Gender" value={patient?.gender} />
                    <LabelValue label="Date of birth" value={patient?.birthdate} />
                </ContainerCard>
                <ContainerCard>
                    <MainTypography variant="h5">Home Location</MainTypography>
                    <LabelValue label="Country" value={patient?.addresses[0].country} />
                    <LabelValue label="Home District" value={patient?.addresses[0].address1} />
                    <LabelValue label="Home Village" value={patient?.addresses[0].address2} />
                    <LabelValue label="Home Traditional Authority" value={patient?.addresses[0].county_district} />
                </ContainerCard>
                <ContainerCard>
                    <MainTypography variant="h5">Current Location</MainTypography>
                    <LabelValue label="Current District" value={patient?.addresses[0].address3} />
                    <LabelValue label="Current Traditional Authority" value={patient?.addresses[0].stateProvince} />
                    <LabelValue label="Current Village" value={patient?.addresses[1].address1} />
                    <LabelValue label="Close Land Mark" value={patient?.addresses[1].address2} />
                </ContainerCard>
            </WrapperBox>
            <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
                <ContainerCard>
                    <MainTypography variant="h5">Social History</MainTypography>
                    <LabelValue label="Marital Status" value={getObservationValue(socialHistory?.obs, concepts.MARITAL_STATUS)} />
                    <LabelValue label="Religion" value={getObservationValue(socialHistory?.obs, concepts.RELIGION)} />
                    <LabelValue label="Occupation" value={getObservationValue(socialHistory?.obs, concepts.OCCUPATION)} />
                    <LabelValue label="Transportation" value={getObservationValue(socialHistory?.obs, concepts.METHOD_OF_TRANSPORTATION)} />
                    <LabelValue label="Highest Education" value={getObservationValue(socialHistory?.obs, concepts.HIGHEST_EDUCATION)} />
                </ContainerCard>
                <ContainerCard>
                    <MainTypography variant="h5">Financing</MainTypography>
                    <LabelValue label="Payment Option" value={getObservationValue(financing?.obs, concepts.PAYMENT_OPTIONS)} />
                    <LabelValue label="Insurance Provider" value={getObservationValue(financing?.obs, concepts.INSURANCE_PROVIDER)} />
                    <LabelValue label="Insurance Number" value={getObservationValue(financing?.obs, concepts.INSURANCE_NUMBER)} />
                    <LabelValue label="Insurance Scheme" value={getObservationValue(financing?.obs, concepts.INSURANCE_SCHEME)} />
                    <LabelValue label="Insurance Status" value={getObservationValue(financing?.obs, concepts.INSURANCE_STATUS)} />
                </ContainerCard>
            </WrapperBox>
        </WrapperBox>
    </>
}
export default Page;

const ContainerCard = ({ children }: { children: ReactNode }) => {
    return <MainPaper sx={{ p: "1ch", flex: 1, mx: "0.5ch" }} >{children}</MainPaper>
}


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