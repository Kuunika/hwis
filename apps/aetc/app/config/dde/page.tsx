'use client'
import { SearchForm } from "@/app/registration/search/components/searchForm";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { MergeDuplicates } from "./components/mergeDuplicates";

export default function Page() {

    return <>
        <WrapperBox sx={{ width: "70%" }}>
            <MainTypography variant="h5">Search Patient</MainTypography>
            <br />
            <SearchForm onSubmit={() => { }} />
            <MergeDuplicates />
        </WrapperBox>
    </>
}