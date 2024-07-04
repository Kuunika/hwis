'use client'
import { BackButton } from "@/components/buttons"

export default function Reports() {
    return <>
        <BackButton />
        <iframe
            src={process.env.NEXT_PUBLIC_METABASE}
            width="100%"
            height="800ch"
        ></iframe>
    </>
}