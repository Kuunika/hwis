"use client"
import { MiddlePageLayout } from "@/components/layouts";
import { VisitingPurposeForm } from "./components";


export default function VisitingPurpose () {
    const initialValues = {};
    const handleSubmit = () => {};
    return (
        <MiddlePageLayout title="Reason for Visiting Facility">
        <VisitingPurposeForm initialValues={initialValues} onSubmit={handleSubmit}/>
        </MiddlePageLayout>
    )
}