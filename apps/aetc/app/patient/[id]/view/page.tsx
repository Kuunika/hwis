'use client'
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getOnePatient, getPatientRelationshipTypes, getPatientRelationships } from "@/hooks/patientReg";
import { WrapperBox, MainTypography, MainPaper, MainButton } from "shared-ui/src";
import { ReactNode, useEffect, useState } from "react"
import { concepts, encounters } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { ViewPatient } from "../../components/viewPatient";
import { Encounter, Person, Relationship } from "@/interfaces";
import { GenericDialog } from "@/components";
import { EditFinancingForm, EditLocation, EditRelationshipForm, EditSocialHistory } from "../../components";
import CircularProgress from '@mui/material/CircularProgress';
import { getRelationshipTypes } from "@/services/patient";

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
                <DisplaySocialHistory loading={isPending || patientLoading} socialHistory={socialHistory ? socialHistory : {} as Encounter} />
                <DisplayFinancing loading={isPending || patientLoading} financing={financing ? financing : {} as Encounter} />
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



const SocialHistoryDialog = ({ open, onClose, initialValues }: { open: boolean, onClose: () => void, initialValues: any }) => {
    return <GenericDialog maxWidth="sm" title="Edit Social History" open={open} onClose={onClose}>
        <EditSocialHistory initialValues={initialValues} onSubmit={() => { }} />
    </GenericDialog>
}
const FinancingDialog = ({ open, onClose, initialValues }: { open: boolean, onClose: () => void, initialValues: any }) => {
    return <GenericDialog maxWidth="sm" title="Edit Financing" open={open} onClose={onClose}>
        <EditFinancingForm initialValues={initialValues} onSubmit={() => { }} />
    </GenericDialog>
}

const EditRelationship = ({ open, onClose, initialValues }: { open: boolean, onClose: () => void, initialValues: any }) => {
    return <GenericDialog maxWidth="sm" title="Edit Relationships" open={open} onClose={onClose}>
        <EditRelationshipForm initialValues={initialValues} onSubmit={(values) => { }} />
    </GenericDialog>
}

export const DisplaySocialHistory = ({ socialHistory, loading }: { socialHistory: Encounter, loading: boolean }) => {
    const [socialHistoryDialogOpen, setSocialHistoryDialogOpen] = useState(false);

    const maritalStatus: string = getObservationValue(socialHistory?.obs, concepts.MARITAL_STATUS);
    const religion: string = getObservationValue(socialHistory?.obs, concepts.RELIGION);
    const occupation: string = getObservationValue(socialHistory?.obs, concepts.OCCUPATION)
    const transportation: string = getObservationValue(socialHistory?.obs, concepts.METHOD_OF_TRANSPORTATION)
    const highestEducation: string = getObservationValue(socialHistory?.obs, concepts.HIGHEST_EDUCATION)


    if (loading) {
        return <WrapperBox sx={{ display: 'flex', width: "100%", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
        </WrapperBox>
    }

    return <ContainerCard>
        <SocialHistoryDialog initialValues={{
            [concepts.MARITAL_STATUS]: maritalStatus,
            [concepts.RELIGION]: religion,
            [concepts.OCCUPATION]: occupation,
            [concepts.METHOD_OF_TRANSPORTATION]: transportation,
            [concepts.HIGHEST_EDUCATION]: highestEducation
        }}
            open={socialHistoryDialogOpen} onClose={() => setSocialHistoryDialogOpen(false)} />
        <MainTypography variant="h5">Social History</MainTypography>
        <LabelValue label="Marital Status" value={maritalStatus} />
        <LabelValue label="Religion" value={religion} />
        <LabelValue label="Occupation" value={occupation} />
        <LabelValue label="Transportation" value={transportation} />
        <LabelValue label="Highest Education" value={highestEducation} />

        <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setSocialHistoryDialogOpen(true)} />
    </ContainerCard>
}


export const DisplayFinancing = ({ financing, loading }: { financing: Encounter, loading: boolen }) => {
    const [financingDialogOpen, setFinancingDialogOpen] = useState(false);
    const [financingOption, setFinancingOptions] = useState({ paymentOptions: "", insuranceProvider: "", insuranceNumber: "", insuranceScheme: "", insuranceStatus: "" })

    useEffect(() => {

        const paymentOptions = getObservationValue(financing?.obs, concepts.PAYMENT_OPTIONS);
        const insuranceProvider = getObservationValue(financing?.obs, concepts.INSURANCE_PROVIDER);
        const insuranceNumber = getObservationValue(financing?.obs, concepts.INSURANCE_NUMBER);
        const insuranceScheme = getObservationValue(financing?.obs, concepts.INSURANCE_SCHEME);
        const insuranceStatus = getObservationValue(financing?.obs, concepts.INSURANCE_STATUS);

        setFinancingOptions({ paymentOptions, insuranceProvider, insuranceNumber, insuranceScheme, insuranceStatus })

    }, [financing]);


    if (loading) {
        return <WrapperBox sx={{ display: 'flex', width: "100%", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
        </WrapperBox>
    }

    const { paymentOptions, insuranceProvider, insuranceNumber, insuranceScheme, insuranceStatus } = financingOption

    return <ContainerCard>
        <FinancingDialog initialValues={{
            [concepts.PAYMENT_OPTIONS]: paymentOptions,
            [concepts.INSURANCE_PROVIDER]: insuranceProvider,
            [concepts.INSURANCE_NUMBER]: insuranceNumber,
            [concepts.INSURANCE_STATUS]: insuranceStatus
        }} open={financingDialogOpen} onClose={() => setFinancingDialogOpen(false)} />
        <MainTypography variant="h5">Financing</MainTypography>
        <LabelValue label="Payment Option" value={paymentOptions} />
        <LabelValue label="Insurance Provider" value={insuranceProvider} />
        <LabelValue label="Insurance Number" value={insuranceNumber} />
        <LabelValue label="Insurance Scheme" value={insuranceScheme} />
        <LabelValue label="Insurance Status" value={insuranceStatus} />
        <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setFinancingDialogOpen(true)} />
    </ContainerCard>
}


export const DisplayRelationship = ({ relationships, loading }: { relationships: Relationship[], loading: boolean }) => {
    const [relationshipDialog, setRelationshipDialog] = useState(false);
    const { data: relationshipTypes, isPending } = getPatientRelationshipTypes();
    const [initialValues, setInitialValues] = useState({})

    if (loading || isPending) {
        return <WrapperBox sx={{ display: 'flex', width: "100%", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
        </WrapperBox>
    }

    const mappedRelationships = relationships?.map(relationship => {
        const relationshipId = relationship.relationship;
        const relationshipType = relationshipTypes?.find(r => r.relationship_type_id == relationshipId);

        return {
            given_name: relationship.person_b.names[0].given_name,
            family_name: relationship.person_b.names[0].family_name,
            relationship: relationshipType?.b_is_to_a,
            relationshipUUID: relationshipType?.uuid
        }
    })


    return <WrapperBox sx={{ display: "flex", width: mappedRelationships.length == 1 ? "50%" : "100%" }}>
        <EditRelationship initialValues={initialValues} open={relationshipDialog} onClose={() => setRelationshipDialog(false)} />
        {mappedRelationships.map(relationship => {
            return <ContainerCard >
                <LabelValue label="First Name" value={relationship.given_name} />
                <LabelValue label="Last Name" value={relationship.family_name} />
                <LabelValue label="Relationship" value={relationship.relationship} />
                <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => {
                    setRelationshipDialog(true);
                    setInitialValues({ ...relationship, relationship: relationship.relationshipUUID })
                }} />
            </ContainerCard>
        })}
    </WrapperBox>
}