"use client"
import React from "react"
import { MiddlePageLayout } from "@/components/layouts"
import { ObstreticHistoryForm } from "./components/obstreticHistoryForm"

export default function ObstreticHistory () {
    const initialValues = {}
    const handleSubmit = () => {};

    return(
     <MiddlePageLayout title={"Obstretic History"}>
        <ObstreticHistoryForm initialValues={initialValues} onSubmit={handleSubmit}/>
     </MiddlePageLayout>
    )
}