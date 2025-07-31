'use client'
import { BackButton } from "@/components/buttons"
import { roles } from "@/constants"
import AuthGuard from "@/helpers/authguard"
import { useNavigation } from "@/hooks"

function Reports() {
    const {navigateBack}=useNavigation()
    return <>
        <BackButton onClick={navigateBack} label="Go back" />
        <iframe
            src={process.env.NEXT_PUBLIC_METABASE}
            width="100%"
            height="800ch"
        ></iframe>
    </>
}

export default AuthGuard(Reports, [roles.ADMIN,roles.REGISTRATION_CLERK])