'use client'
import { SearchForm } from "@/app/registration/search/components/searchForm";
import { WrapperBox } from "shared-ui/src";

export default function Page() {

    return <>
        <WrapperBox sx={{ width: "70%" }}>
            <SearchForm onSubmit={() => { }} />
        </WrapperBox>
    </>
}