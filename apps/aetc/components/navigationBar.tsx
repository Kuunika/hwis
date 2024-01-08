"use client";
import { SearchContainer } from "@/app/registration/search/components";
import { useNavigation } from "@/hooks";
import { NavigationBar, WrapperBox } from "shared-ui/src";

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

export const NavBar = () => {
  const { navigateTo } = useNavigation();
  const search = (
    <WrapperBox
      sx={{
        width: "40%",
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: "5px",
      }}
    >
      <SearchContainer label="" placeHolder="Search Patient" initialValue="" />
    </WrapperBox>
  );

  return (
    <>
      <NavigationBar onTitleClick={() => navigateTo("/")} search={search} />
    </>
  );
};
