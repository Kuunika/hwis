import { useContext, useState } from "react";
import {
  BaseTable,
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import plus from "../../../../icons/plus.svg";
import Image from "next/image";
import { PatientNationalIdCheck } from "../../components";
import { useNavigation, useParameters } from "@/hooks";
import { FaUser } from "react-icons/fa6"

import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";


export const SearchResults = ({

  searchedPatient,
  searchResults,
}: {

  searchedPatient: any;
  searchResults: any;
}) => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [patient, setPatient] = useState<any>();
  const { setPatient: setRegisterPatient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const handleNewRecord = () => {
    setRegisterPatient(searchedPatient);
    navigateTo(`/registration/${params.id}/new`);
  };

  const patientsResults = [
    {
      id: "HHH-TTTT1",
      firstName: "Jon",
      lastName: "Doe",
      gender: "Male",
    },
    { id: "HHH-TTTT2", firstName: "Jane", lastName: "Doe", gender: "Male" },
    { id: "HHH-TTTT3", firstName: "Andrew", lastName: "Doe", gender: "Male" },
  ];

  const columns = [
    { field: "attribute", headerName: "Attribute", flex: 1 },
    { field: "searchResult", headerName: "Existing Person", flex: 1 },
    { field: "searched", headerName: "New Person", flex: 1 },
  ];

  const rows = [
    {
      id: "FirstName",
      attribute: "First Name",
      searchResult: patient?.firstName,
      searched: searchedPatient.firstName,
    },
    {
      id: "LastName",
      attribute: "Last Name",
      searchResult: patient?.lastName,
      searched: searchedPatient.lastName,
    },
    {
      id: "Gender",
      attribute: "Gender",
      searchResult: patient?.gender,
      searched: searchedPatient.gender,
    },
  ];

  // if (loading) {
  //   return null;
  // }

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <br />
      <MainTypography variant="h5">Search Results</MainTypography>
      <br />
      <WrapperBox sx={{ width: "100%" }}>
        <MainButton
          sx={{ mr: "0.2ch", borderRadius: "1px" }}
          variant="secondary"
          title="add new record"
          onClick={handleNewRecord}
        />
      </WrapperBox>
      <br />
      <br />
      <WrapperBox sx={{ width: "100%", height: "50ch", overflow: "scroll" }}>
        {
          patientsResults.map(pa => {
            return <ResultBox />
          })
        }
      </WrapperBox>

      {/* <WrapperBox display={"flex"}>
        <WrapperBox sx={{ mr: "1ch" }}>
          {patientsResults.map((p) => {
            return (
              <WrapperBox
                key={p.id}
                onClick={() => setPatient(p)}
                sx={{
                  width: "20ch",
                  p: "1ch",
                  cursor: "pointer",
                  backgroundColor: p.id == patient?.id ? "#E6E6E6" : "",
                  "&:hover": {
                    backgroundColor: "#E6E6E6",
                  },
                }}
              >
                <MainTypography variant="body2" fontStyle={"italic"}>
                  ID: {p.id}
                </MainTypography>
                <MainTypography variant="h6">
                  {p.firstName} {p.lastName}
                </MainTypography>
                <MainTypography variant="body2">{p.gender}</MainTypography>
              </WrapperBox>
            );
          })}
        </WrapperBox>
        <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
          <WrapperBox sx={{ display: "flex", mb: "1ch" }}>
            <MainButton
              sx={{ mr: "0.2ch", borderRadius: "1px" }}
              variant="secondary"
              title="add new record"
              onClick={handleNewRecord}
            />
            <MainButton
              sx={{ mr: "0.2ch", borderRadius: "1px" }}
              variant="secondary"
              title="Add selected existing"
              onClick={() => { }}
            />
          </WrapperBox>
          <MainPaper elevation={0} sx={{ width: "50ch", px: "2ch", py: "2ch" }}>
            {/* <AddPatientButton /> */}
      {/* <WrapperBox>
              {patient ? (
                <BaseTable
                  hidePagination={true}
                  columns={columns}
                  rows={rows}
                />
              ) : (
                "select a record"
              )}
            </WrapperBox>
          </MainPaper>
        </WrapperBox>
      // </WrapperBox> */}
    </WrapperBox>
  );
};


export const ResultBox = () => {
  return <MainPaper sx={{ display: "flex", padding: 2, width: "100%", my: 1 }}>
    <WrapperBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20%", backgroundColor: "#F5F5F5", mr: 1 }}>
      <MainTypography color={defaultTheme.primary} variant="h1"><FaUser /></MainTypography>
    </WrapperBox>
    <WrapperBox>
      <WrapperBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MainTypography variant="h5">John Doe</MainTypography>
        <MainTypography>Remote</MainTypography>
      </WrapperBox>
      <WrapperBox sx={{ display: "flex" }}>
        <MainTypography color={"GrayText"} sx={{ mr: 1 }}>NPID:</MainTypography><MainTypography color={"GrayText"} >XHIYLSP1</MainTypography>
      </WrapperBox>
      <br />
      <WrapperBox sx={{ display: "flex", mb: 1 }}>
        <Label label="Date of birth" value="12-jan-2000" />
        <Label label="Gender" value="Male" />
      </WrapperBox>
      <WrapperBox sx={{ display: "flex" }}>
        <Label label="Home district" value="Lilongwe" />
        <Label label="Home traditional authority" value="Chikulamayembe" />
        <Label label="Home village" value="vingula" />
      </WrapperBox>
    </WrapperBox>
  </MainPaper>
}


const Label = ({ label, value }: { label: string, value: string }) => {
  return <WrapperBox sx={{ display: "flex", flexDirection: "column", mr: 1 }}>
    <MainTypography variant="subtitle2" color={"#C0C0C0"} sx={{ mr: 0.5 }}>{label}</MainTypography><MainTypography variant="subtitle2" color={"#585858"} >{value}</MainTypography>
  </WrapperBox>
}



export const AddPatientButton = () => {
  const { params } = useParameters();
  return (
    <WrapperBox
      onClick={() => PatientNationalIdCheck(params.id)}
      sx={{ display: "flex", mt: "1ch", cursor: "pointer" }}
    >
      <Image src={plus} alt="plus" />
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "17px",
          letterSpacing: "0em",
          textAlign: "left",
          color: defaultTheme.primary,
          borderBottom: `1px solid ${defaultTheme.primary}`,
          ml: "1ch",
        }}
      >
        Add new patient
      </MainTypography>
    </WrapperBox>
  );
};
