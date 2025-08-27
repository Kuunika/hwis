'use client'
import { BackButton } from "@/components/buttons"
import { roles } from "@/constants"
import AuthGuard from "@/helpers/authguard"

function Reports() {
    return <>
        <BackButton />
        <iframe
            src={process.env.NEXT_PUBLIC_METABASE}
            width="100%"
            height="800ch"
        ></iframe>
    </>
}

export default AuthGuard(Reports, [roles.ADMIN,roles.REGISTRATION_CLERK])