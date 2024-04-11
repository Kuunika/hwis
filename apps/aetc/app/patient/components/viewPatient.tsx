import { Person } from "@/interfaces";
import { WrapperBox, MainTypography, MainPaper } from "shared-ui/src";

export const ViewPatient = ({ patient }: { patient: Person }) => {
    return <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
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

}


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