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
import { DemographicsSearchSkeleton } from "@/components/loadingSkeletons";
import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";
import Skeleton from "@mui/material/Skeleton";

export const SearchResults = ({
  loading,
  searchedPatient,
  searchResults,
}: {
  loading: boolean;
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

  if (loading) {
    return <DemographicsSearchSkeleton />;
  }

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
      <WrapperBox display={"flex"}>
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
              onClick={() => {}}
            />
          </WrapperBox>
          <MainPaper elevation={0} sx={{ width: "50ch", px: "2ch", py: "2ch" }}>
            {/* <AddPatientButton /> */}
            <WrapperBox>
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
      </WrapperBox>
    </WrapperBox>
  );
};

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
