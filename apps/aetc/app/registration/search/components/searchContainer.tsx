import { useEffect, useState } from "react";
import { SearchInput, ResultBox } from ".";

type Prop = {
  initialValue: string;
  placeHolder?: string;
  label?: string;
  initialSearch?: string;
  getResult?: (results: any) => void;
};
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

export const SearchContainer = ({
  initialValue,
  placeHolder,
  label,
  initialSearch,
  getResult,
}: Prop) => {
  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    if (!initialSearch) return;

    findPatient(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (getResult) getResult(searchResults);
  }, [searchResults]);

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
    <>
      <SearchInput
        label={label}
        placeHolder={placeHolder}
        initialValue={initialValue ? initialValue : ""}
        onChange={handleSearch}
      />
      {searchResults.length > 0 && <ResultBox searchResults={searchResults} />}
    </>
  );
};
