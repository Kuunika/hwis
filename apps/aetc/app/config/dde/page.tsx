'use client'
import { SearchForm } from "@/app/registration/search/components/searchForm";
import { WrapperBox } from "shared-ui/src";
import { MergeDuplicates } from "./components/mergeDuplicates";

export default function Page() {

    return <>
        <WrapperBox sx={{ width: "70%" }}>
            <SearchForm onSubmit={() => { }} />
            <MergeDuplicates />
        </WrapperBox>
    </>
}