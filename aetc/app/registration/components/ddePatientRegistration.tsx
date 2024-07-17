// import { Person } from "@/interfaces";
// import { Box, Paper, Typography } from "@mui/material"
// import { ReactNode } from "react";



// type IProps = {
//     patient: Person;

// }
// export const ViewPatient = ({ patient }: IProps) => {

//     // const [patient, setPatient] = useState<any>({} as Person);
//     // const [patientPayload, setPatientPayload] = useState(loadedPatient);
//     const [openDemographics, setOpenDemographics] = useState(false);
//     const [homeLocation, setHomeLocation] = useState(false);
//     const [currentLocation, setCurrentLocation] = useState(false);
//     const { mutate: updatePatient, isPending, isSuccess, data: updatedPatient } = patchPatient();
//     const [demographics, setDemographics] = useState<any>({
//         firstName: "",
//         lastName: "",
//         birthDate: "",
//         gender: "",
//         birthDateEstimated: ""
//     })

//     const [homeLocationAddress, setHomeLocationAddress] = useState({
//         nationality: "",
//         district: "",
//         village: "",
//         traditionalAuthority: ""
//     })

//     const [currentLocationAddress, setCurrentLocationAddress] = useState({
//         district: "",
//         traditionalAuthority: "",
//         village: "",
//         closeLandMark: ""
//     })
//     // console.log(loadedPatient)


//     useEffect(() => {
//         mapPatientDemographics(patient);
//         mapCurrentLocation(patient);
//         mapHomeLocation(patient)
//     }, [patient])

//     useEffect(() => {
//         if (isSuccess && updatedPatient) {
//             mapPatientDemographics(updatedPatient.patient);
//             mapHomeLocation(updatedPatient.patient)
//             mapCurrentLocation(updatedPatient.patient)
//         }
//     }, [updatedPatient])


//     const mapPatientDemographics = (patient: Person) => {
//         if (!patient) return
//         setDemographics({
//             firstName: patient?.given_name,
//             lastName: patient?.family_name,
//             birthDate: patient?.birthdate,
//             gender: patient?.gender,
//             birthDateEstimated: Boolean(patient?.birthdateEstimated),
//         })
//     }

//     const mapHomeLocation = (patient: Person) => {
//         if (!patient) return;
//         setHomeLocationAddress({
//             nationality: patient?.addresses[0]?.country ?? "",
//             district: patient?.addresses[0]?.address1 ?? "",
//             village: patient?.addresses[0]?.address2 ?? "",
//             traditionalAuthority: patient?.addresses[0]?.county_district ?? ""
//         })
//     }

//     const mapCurrentLocation = (patient: Person) => {
//         if (!patient) return;
//         setCurrentLocationAddress({
//             district: patient?.addresses[0]?.current_district ?? "",
//             traditionalAuthority: patient?.addresses[0]?.current_traditional_authority ?? "",
//             village: patient?.addresses[1]?.address1 ?? "",
//             closeLandMark: patient?.addresses[1]?.address2 ?? ""
//         })
//     }



//     return <Box sx={{ display: "flex", mt: "1ch" }}>
//         <>
//             <ContainerCard>
//                 <>
//                     <Typography variant="h5">Demographics</Typography>
//                     <LabelValue label="First Name" value={demographics.firstName} />
//                     <LabelValue label="Last Name" value={demographics.lastName} />
//                     <LabelValue label="Gender" value={demographics.gender} />
//                     <LabelValue label="Date of birth" value={demographics.birthDate} />
//                 </>
//             </ContainerCard>
//             <ContainerCard>
//                 <>
//                     <Typography variant="h5">Home Location</Typography>
//                     <LabelValue label="Country" value={homeLocationAddress.nationality} />
//                     <LabelValue label="Home District" value={homeLocationAddress.district} />
//                     <LabelValue label="Home Traditional Authority" value={homeLocationAddress.traditionalAuthority} />
//                     <LabelValue label="Home Village" value={homeLocationAddress.village} />
//                 </>

//                 <Button variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setHomeLocation(true)} />
//             </ContainerCard>
//             <ContainerCard>
//                 <>
//                     <Typography variant="h5">Current Location</Typography>
//                     <LabelValue label="Current District" value={currentLocationAddress.district} />
//                     <LabelValue label="Current Traditional Authority" value={currentLocationAddress.traditionalAuthority} />
//                     <LabelValue label="Current Village" value={currentLocationAddress.village} />
//                     <LabelValue label="Close Land Mark" value={currentLocationAddress.closeLandMark} />
//                 </>
//                 <CurrentLocationDialog onSubmit={handleCurrentLocationSubmit} onClose={() => setCurrentLocation(false)} initialValues={currentLocationAddress} open={currentLocation} />
//                 <MainButton variant="secondary" sx={{ width: "10%" }} title="Edit" onClick={() => setCurrentLocation(true)} />
//             </ContainerCard>
//         </>

//     </WrapperBox>

// }
// export const DDEPatientRegistration = ()=>{

// }

// export const DisplayAllDetails = ()=>{
//     return <Box></Box>
// }




// const ContainerCard = ({ children }: { children: ReactNode }) => {
//     return <Paper sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", p: "1ch", flex: 1, mx: "0.5ch" }} >{children}</Paper>
// }

// const LabelValue = ({ label, value }: { label: string; value: any }) => {
//     return (
//         <Box sx={{ display: "flex", alignItems: "flex-start", py: "0.5ch", mb: "0.5ch", borderBottom: "#D8D8D8 solid 1px" }}>
//             <Typography width={"20ch"} sx={{ fontSize: "0.8rem" }}>
//                 {label}
//             </Typography>
//             <Typography fontWeight={"900"} sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}>{value}</Typography>
//         </Box>
//     );
// };