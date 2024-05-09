
import { getPatientRelationshipTypes } from "@/hooks/patientReg";
import { WrapperBox, MainTypography, MainPaper, MainButton } from "shared-ui/src";
import { ReactNode, useEffect, useState } from "react"
import { concepts } from "@/constants";
import { getObservationValue } from "@/helpers/emr";
import { Encounter, Relationship } from "@/interfaces";
import { GenericDialog } from "@/components";
import { EditFinancingForm, EditRelationshipForm, EditSocialHistory } from "../../../components";
import CircularProgress from '@mui/material/CircularProgress';




export const DisplaySocialHistory = ({ socialHistory, loading, onSubmit }: { socialHistory: Encounter, loading: boolean, onSubmit: (values: any) => void }) => {
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
        <SocialHistoryDialog onSubmit={onSubmit} initialValues={{
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


export const DisplayFinancing = ({ financing, loading, onSubmit }: { financing: Encounter, loading: boolean, onSubmit: (values: any) => void }) => {
    const [financingDialogOpen, setFinancingDialogOpen] = useState(false);
    const [financingOption, setFinancingOptions] = useState({ paymentOptions: "", insuranceProvider: "", insuranceNumber: "", insuranceScheme: "", insuranceStatus: "" })



    useEffect(() => {

        const paymentOptions = getObservationValue(financing?.obs, 'c7bcc8bd-09d5-4f98-8d58-5179f749fd99');
        const insuranceProvider = getObservationValue(financing?.obs, 'b0ffce26-2d25-449e-871e-c702e44bb37e');
        const insuranceNumber = getObservationValue(financing?.obs, '98b08fb2-f877-45b6-a95a-db89dffefb27');
        const insuranceScheme = getObservationValue(financing?.obs, 'db2e6bba-7d04-4873-a0a2-ac7bd69dd7b1');
        const insuranceStatus = getObservationValue(financing?.obs, '3cdd53d9-35a5-47e5-909f-654e5bc7c9a8');

        setFinancingOptions({ paymentOptions, insuranceProvider, insuranceNumber, insuranceScheme, insuranceStatus })

    }, [financing]);


    if (loading) {
        return <WrapperBox sx={{ display: 'flex', width: "100%", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
        </WrapperBox>
    }

    const { paymentOptions, insuranceProvider, insuranceNumber, insuranceScheme, insuranceStatus } = financingOption

    return <ContainerCard>
        <FinancingDialog
            onSubmit={(values: any) => { onSubmit(values); setFinancingDialogOpen(false) }}
            initialValues={{
                [concepts.PAYMENT_OPTIONS]: [paymentOptions],
                [concepts.INSURANCE_PROVIDER]: insuranceProvider,
                [concepts.INSURANCE_NUMBER]: insuranceNumber,
                [concepts.INSURANCE_STATUS]: insuranceStatus,
                [concepts.INSURANCE_SCHEME]: insuranceScheme,
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
                <MainTypography variant="h5">{relationship.relationship?.toLowerCase() == 'guardian' ? "Guardian Information" : "Next Of Kin Information"}</MainTypography>
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

const ContainerCard = ({ children }: { children: ReactNode }) => {
    return <MainPaper sx={{ p: "1ch", flex: 1, mx: "0.5ch" }} >{children}</MainPaper>
}

const LabelValue = ({ label, value }: { label: string; value: any }) => {
    return (
        <WrapperBox sx={{ display: "flex", alignItems: "flex-start", py: "0.5ch", mb: "0.5ch", borderBottom: "#D8D8D8 solid 1px" }}>
            <MainTypography width={"20ch"} sx={{ fontSize: "0.8rem" }}>
                {label}
            </MainTypography>
            <MainTypography fontWeight={"900"} sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}>{value}</MainTypography>
        </WrapperBox>
    );
};



const SocialHistoryDialog = ({ open, onClose, initialValues, onSubmit }: { open: boolean, onClose: () => void, initialValues: any, onSubmit: (values: any) => void }) => {
    return <GenericDialog maxWidth="sm" title="Edit Social History" open={open} onClose={onClose}>
        <EditSocialHistory initialValues={initialValues} onSubmit={onSubmit} />
    </GenericDialog>
}
const FinancingDialog = ({ open, onClose, initialValues, onSubmit }: { open: boolean, onClose: () => void, initialValues: any, onSubmit: (values: any) => void }) => {
    return <GenericDialog maxWidth="sm" title="Edit Financing" open={open} onClose={onClose}>
        <EditFinancingForm initialValues={initialValues} onSubmit={onSubmit} />
    </GenericDialog>
}

const EditRelationship = ({ open, onClose, initialValues }: { open: boolean, onClose: () => void, initialValues: any }) => {
    return <GenericDialog maxWidth="sm" title="Edit Relationships" open={open} onClose={onClose}>
        <EditRelationshipForm initialValues={initialValues} onSubmit={(values) => { }} />
    </GenericDialog>
}
