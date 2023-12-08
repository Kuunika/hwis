"use client";

import { SearchContainer } from "./components";
import { MainButton, WrapperBox } from "shared-ui/src";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useNavigation } from "@/hooks";

export default function RegistrationSearch() {
  const searchParams = useSearchParams();
  const [searchResults, setSetResults] = useState<Array<any>>([]);
  const search = searchParams.get("s");
  const { navigateTo } = useNavigation();

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WrapperBox
        sx={{
          width: "40%",
          position: "relative",
        }}
      >
        <SearchContainer
          getResult={(results) => setSetResults(results)}
          initialSearch={search ? search : ""}
          initialValue={search ? search : ""}
        />
      </WrapperBox>
      {searchResults.length == 0 && (
        <MainButton
          sx={{
            mt: "5ch",
            p: "2ch",
          }}
          title={"Start Registration"}
          onClick={() => navigateTo("/registration")}
        />
      )}
    </WrapperBox>
  );
}
