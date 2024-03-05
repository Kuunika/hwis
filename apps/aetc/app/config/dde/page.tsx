'use client'
import { SearchForm } from "@/app/registration/search/components/searchForm";
import { MainTypography, WrapperBox } from "shared-ui/src";
import { MergeDuplicates } from "./components/mergeDuplicates";
import { SearchNPIDForm } from "@/app/registration/search/components/searchNpid";
import { SearchTab } from "@/app/registration/components/searchTabs";
import { useEffect, useState } from "react";
import { OverlayLoader } from "@/components/backdrop";

export default function Page() {
    const [searching, setSearching] = useState(false);
    const [result, setResult] = useState(false);


    useEffect(() => {

        if (searching) {
            setTimeout(() => {
                setResult(true);
                setSearching(false)

            }, 2000)
        }

    }, [searching])



    return <>
        <WrapperBox sx={{ width: "100%" }}>

            {!result && <><MainTypography textAlign={"center"} variant="h5">Search Patient</MainTypography>
                <br /> <SearchTab npid={<SearchNPIDForm onSubmit={() => setSearching(true)} />} demographics={<SearchForm onSubmit={() => setSearching(true)} />} /></>}
            <OverlayLoader open={searching} />
            {result && <>
                <MainTypography textAlign={"center"} variant="h5">Search Results</MainTypography>
                <MergeDuplicates onCancel={() => setResult(false)} />
            </>}
        </WrapperBox>
    </>
}