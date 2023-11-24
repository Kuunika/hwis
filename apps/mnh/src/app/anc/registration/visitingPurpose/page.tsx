"use client"
import { MiddlePageLayout } from "@/components/layouts";
import { VisitingPurposeForm } from "./components";


export default function VisitingPurpose () {
    return (
        <MiddlePageLayout title="Reason for Visiting Facility">
        <VisitingPurposeForm/>
        </MiddlePageLayout>
    )
}