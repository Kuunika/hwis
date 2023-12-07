"use client";
import { useEffect, useState } from "react";
import { ResultBox, SearchInput } from "./components";
import { WrapperBox } from "shared-ui/src";
import { useSearchParams } from "next/navigation";

const results = [
  { id: "1234", fullName: "James Doe", number: "1234" },
  { id: "5678", fullName: "John Doe", number: "5678" },
  { id: "9876", fullName: "Alice Smith", number: "9876" },
  { id: "5432", fullName: "Bob Johnson", number: "5432" },
  { id: "2468", fullName: "Eva Davis", number: "2468" },
  { id: "1357", fullName: "Chris Brown", number: "1357" },
  { id: "6543", fullName: "Olivia White", number: "6543" },
  { id: "7890", fullName: "Daniel Miller", number: "7890" },
  { id: "3210", fullName: "Sophia Taylor", number: "3210" },
  { id: "8765", fullName: "Michael Wilson", number: "8765" },
  { id: "4321", fullName: "Emma Anderson", number: "4321" },
  { id: "5678", fullName: "William Jackson", number: "5678" },
];
export default function RegistrationSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.get("s");

  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    if (search) findPatient(search);
  }, [search]);

  const handleSearch = (search: string) => {
    if (search.length === 0) {
      setSearchResults([]);
      return;
    }

    findPatient(search);
  };

  const findPatient = (search: string) => {
    setSearchResults(
      results.filter((result) =>
        result.fullName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <WrapperBox
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WrapperBox sx={{ width: "40%", position: "relative" }}>
        <SearchInput
          initialValue={search ? search : ""}
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <ResultBox searchResults={searchResults} />
        )}
      </WrapperBox>
    </WrapperBox>
  );
}
