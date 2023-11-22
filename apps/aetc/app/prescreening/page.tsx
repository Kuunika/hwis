"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "./components/preScreeningForm";

export default function Prescreening() {
    const initialValues  = {}

    const handleSubmit = () => {}
    return (
        <>
        <MiddlePageLayout title="Prescreening">
            <PrescreeningForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit} children={undefined} validationSchema={undefined} />
        </MiddlePageLayout>
        
        </>
    )

}