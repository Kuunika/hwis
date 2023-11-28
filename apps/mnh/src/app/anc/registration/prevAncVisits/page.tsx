"use client"
import { MiddlePageLayout } from "@/components/layouts";
import { PreviousAncVisitsForm } from "./components";

export default function PrevAncVisits () {

    const initialValues = {};
    const handleSubmit = () => {};
    return(
        <MiddlePageLayout title="Previous ANC Visits">
            <PreviousAncVisitsForm initialValues={initialValues} onSubmit={handleSubmit}/>

        </MiddlePageLayout>
    )

}