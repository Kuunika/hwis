import { Person } from "@/interfaces";
import { ReactNode, useEffect, useState } from "react";
import { WrapperBox, MainTypography, MainPaper, MainButton } from "shared-ui/src";
import { EditDemographicsForm } from "./editDemographicsForm";
import { GenericDialog } from "@/components/dialog";
import { EditLocation } from ".";
import { concepts } from "@/constants";
import { patchPatient } from "@/hooks/patientReg";
import { OverlayLoader } from "@/components/backdrop";


type IProps = {
    patient: Person;

}
export const ViewPatient = ({ patient }: IProps) => {

    // const [patient, setPatient] = useState<any>({} as Person);
    // const [patientPayload, setPatientPayload] = useState(loadedPatient);
    const [openDemographics, setOpenDemographics] = useState(false);
    const [homeLocation, setHomeLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(false);
    const { mutate: updatePatient, isPending, isSuccess, data: updatedPatient } = patchPatient();
    const [demographics, setDemographics] = useState<any>({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        birthDateEstimated: ""
    })

    const [homeLocationAddress, setHomeLocationAddress] = useState({
        nationality: "",
        district: "",
        village: "",
        traditionalAuthority: ""
    })

    const [currentLocationAddress, setCurrentLocationAddress] = useState({
        district: "",
        traditionalAuthority: "",
        village: "",
        closeLandMark: ""
    })
    // console.log(loadedPatient)


    useEffect(() => {
        mapPatientDemographics(patient);
        mapCurrentLocation(patient);
        mapHomeLocation(patient)
    }, [patient])

    useEffect(() => {
        if (isSuccess && updatedPatient) {
            mapPatientDemographics(updatedPatient.patient);
            mapHomeLocation(updatedPatient.patient)
            mapCurrentLocation(updatedPatient.patient)
        }
    }, [updatedPatient])


    const mapPatientDemographics = (patient: Person) => {
        if (!patient) return
        setDemographics({
            firstName: patient?.given_name,
            lastName: patient?.family_name,
            birthDate: patient?.birthdate,
            gender: patient?.gender,
            birthDateEstimated: Boolean(patient?.birthdateEstimated),
        })
    }

    const mapHomeLocation = (patient: Person) => {
        if (!patient) return;
        setHomeLocationAddress({
            nationality: patient?.addresses[0]?.country ?? "",
            district: patient?.addresses[0]?.address1 ?? "",
            village: patient?.addresses[0]?.address2 ?? "",
            traditionalAuthority: patient?.addresses[0]?.county_district ?? ""
        })
    }

    const mapCurrentLocation = (patient: Person) => {
        if (!patient) return;
        setCurrentLocationAddress({
            district: patient?.addresses[0]?.current_district ?? "",
            traditionalAuthority: patient?.addresses[0]?.current_traditional_authority ?? "",
            village: patient?.addresses[0]?.current_village ?? "",
            closeLandMark: patient?.addresses[1]?.address2 ?? ""
        })
    }


    // useEffect(() => {
    //     setPatient(loadedPatient)
    // }, [loadedPatient])

    // useEffect(() => {
    //     setPatient(data);
    // }, [isSuccess])

    const updateDemographics = (demographics: any) => {
        const mappedPatient = {
            identifiers: [
                {
                    identifier: demographics.identificationNumber,
                    identifierType: concepts.NATIONAL_ID_IDENTIFIER_TYPE,
                    preferred: true,
                },
            ],
            names: [
                {
                    givenName: demographics.firstName,
                    familyName: demographics.lastName,
                },
            ],
            gender: demographics.gender,
            birthdateEstimated: demographics.birthdateEstimated,
            birthdate: demographics.birthDate,
        }

        updatePatient({ id: patient.uuid, data: mappedPatient });

        // setPatientPayload((patient: Person) => {
        //     const newPatient = { ...patient }
        //     newPatient.identifiers.push(mappedPatient.identifiers[0]);
        //     // newPatient.names = mappedPatient.
        //     return patient
        // })
        setOpenDemographics(false);

    }

    const handleHomeLocationSubmit = (values: any) => {
        const addresses = [{
            address1: values.district,
            address2: values.village,
            address3: patient?.addresses[0]?.current_traditional_authority,
            stateProvince: patient?.addresses[0]?.current_traditional_authority,
            countyDistrict: values.traditionalAuthority,
            cityVillage: values.traditionalAuthority,
            country: values.nationality,
            preferred: true,
        },
        {
            address1: patient?.addresses[0]?.current_village,
            address2: patient?.addresses[1]?.address2,
            countryDistrict: patient?.addresses[0]?.current_district,
            cityVillage: patient?.addresses[0]?.current_traditional_authority,
            preferred: false,
        }]
        updatePatient({ id: patient.uuid, data: { addresses } })
        setHomeLocation(false)

    }

    const handleCurrentLocationSubmit = (values: any) => {

        const addresses = [{
            address1: patient?.addresses[0].address1,
            address2: patient?.addresses[0].address2,
            address3: values.district,
            stateProvince: values.traditionalAuthority,
            countyDistrict: patient?.addresses[0].county_district,
            cityVillage: patient?.addresses[0].county_district,
            country: patient?.addresses[0].country,
            preferred: true,
        },
        {
            address1: values.village,
            address2: patient?.addresses[1]?.address2, // close landmark
            countryDistrict: values.district,
            cityVillage: values.traditionalAuthority,
            preferred: false,
        }]
        updatePatient({ id: patient.uuid, data: { addresses } })
        setCurrentLocation(false)
    }

    return <WrapperBox sx={{ display: "flex", mt: "1ch" }}>
        <>
            <OverlayLoader open={isPending} />
            <DemographicsDialog onSubmit={updateDemographics} initialValues={{
                ...demographics
                // phoneNumber: patient.phoneNumber
            }} onClose={() => setOpenDemographics(false)} open={openDemographics} />

            <ContainerCard>
                <>
                    <MainTypography variant="h5">Demographics</MainTypography>
                    <LabelValue label="First Name" value={demographics.firstName} />
                    <LabelValue label="Last Name" value={demographics.lastName} />
                    <LabelValue label="Gender" value={demographics.gender} />
                    <LabelValue label="Date of birth" value={demographics.birthDate} />
                </>
                <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setOpenDemographics(true)} />
            </ContainerCard>
            <ContainerCard>
                <>
                    <MainTypography variant="h5">Home Location</MainTypography>
                    <LabelValue label="Country" value={homeLocationAddress.nationality} />
                    <LabelValue label="Home District" value={homeLocationAddress.district} />
                    <LabelValue label="Home Traditional Authority" value={homeLocationAddress.traditionalAuthority} />
                    <LabelValue label="Home Village" value={homeLocationAddress.village} />
                </>
                <HomeLocationDialog onSubmit={handleHomeLocationSubmit} initialValues={homeLocationAddress} open={homeLocation} onClose={() => setHomeLocation(false)} />
                <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setHomeLocation(true)} />
            </ContainerCard>
            <ContainerCard>
                <>
                    <MainTypography variant="h5">Current Location</MainTypography>
                    <LabelValue label="Current District" value={currentLocationAddress.district} />
                    <LabelValue label="Current Traditional Authority" value={currentLocationAddress.traditionalAuthority} />
                    <LabelValue label="Current Village" value={currentLocationAddress.village} />
                    <LabelValue label="Close Land Mark" value={currentLocationAddress.closeLandMark} />
                </>
                <CurrentLocationDialog onSubmit={handleCurrentLocationSubmit} onClose={() => setCurrentLocation(false)} initialValues={currentLocationAddress} open={currentLocation} />
                <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setCurrentLocation(true)} />
            </ContainerCard>
        </>

    </WrapperBox>

}


const ContainerCard = ({ children }: { children: ReactNode }) => {
    return <MainPaper sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", p: "1ch", flex: 1, mx: "0.5ch" }} >{children}</MainPaper>
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


const DemographicsDialog = ({ open, onClose, initialValues, onSubmit }: { open: boolean, onClose: () => void, initialValues: any, onSubmit: (values: any) => void }) => {
    return <GenericDialog maxWidth="sm" title="Edit Demographics" open={open} onClose={onClose}>
        <EditDemographicsForm onSubmit={onSubmit} initialValues={initialValues} />
    </GenericDialog>
}
const HomeLocationDialog = ({ open, onClose, initialValues, onSubmit }: { open: boolean, onClose: () => void, initialValues: any, onSubmit: (values: any) => void }) => {
    return <GenericDialog maxWidth="sm" title="Edit Home Location" open={open} onClose={onClose}>
        <EditLocation initialValues={initialValues} onSubmit={onSubmit} />
    </GenericDialog>
}
const CurrentLocationDialog = ({ open, onClose, initialValues, onSubmit }: { open: boolean, onClose: () => void, initialValues: any, onSubmit: (values: any) => void }) => {
    return <GenericDialog maxWidth="sm" title="Edit Current Location" open={open} onClose={onClose}>
        <EditLocation currentLocation={true} initialValues={initialValues} onSubmit={onSubmit} />
    </GenericDialog>
}