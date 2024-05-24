'use client'
import { BackButton } from "@/components/buttons"

export default function Reports() {
    return <>
        <BackButton />
        <iframe
            src="http://18.218.225.103:3000/public/dashboard/abbd73b5-e87a-4a36-b571-3cfbb335893f"
            width="100%"
            height="800ch"
        ></iframe>
    </>
}