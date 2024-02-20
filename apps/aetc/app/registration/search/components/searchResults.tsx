import { useState } from "react";
import {
  BaseTable,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import plus from "../../../../icons/plus.svg";
import Image from "next/image";
import { PatientNationalIdCheck } from "../../components";
import { useParameters } from "@/hooks";

export const SearchResults = () => {
  const [patient, setPatient] = useState<any>();

  const searchObject = {
    firstName: "John",
    lastName: "Doel",
    gender: "Male",
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
    { field: "searchResult", headerName: "Search Result", flex: 1 },
    { field: "searched", headerName: "Searched", flex: 1 },
  ];

  const rows = [
    {
      id: "FirstName",
      attribute: "First Name",
      searchResult: patient?.firstName,
      searched: searchObject.firstName,
    },
    {
      id: "LastName",
      attribute: "Last Name",
      searchResult: patient?.lastName,
      searched: searchObject.lastName,
    },
    {
      id: "Gender",
      attribute: "Gender",
      searchResult: patient?.gender,
      searched: searchObject.gender,
    },
  ];
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
        <WrapperBox>
          {patientsResults.map((p) => {
            return (
              <WrapperBox
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
        <MainPaper elevation={0} sx={{ width: "50ch", px: "2ch", py: "2ch" }}>
          <AddPatientButton />
          <WrapperBox>
            {patient ? (
              <BaseTable hidePagination={true} columns={columns} rows={rows} />
            ) : (
              "select a record"
            )}
          </WrapperBox>
        </MainPaper>
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
