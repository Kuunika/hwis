"use client"
import React from "react"
import { MiddlePageLayout } from "@/components/layouts"
import { ObstreticHistoryForm } from "./components/obstreticHistoryForm"

export default function ObstreticHistory () {
    return(
     <MiddlePageLayout title={"Obstretic History"}>
        <ObstreticHistoryForm/>
     </MiddlePageLayout>
    )
}