'use client'
import { BackButton } from "@/components/buttons"
import { roles } from "@/constants"
import AuthGuard from "@/helpers/authguard"
import { useNavigation } from "@/hooks"
import { jwtDecode } from "jwt-decode";

type MyJwtPayload = {
    user_id: string;
};

function Reports() {
    const {navigateBack}=useNavigation();
    const accessToken = localStorage.getItem("accessToken");

   const {user_id} = jwtDecode<MyJwtPayload>(accessToken!)

    return <>
        <BackButton onClick={navigateBack} label="Go back" />
        <iframe
            src={`${process.env.NEXT_PUBLIC_METABASE}?user_id=${user_id}`}
            width="100%"
            height="800ch"
        ></iframe>
    </>
}

export default AuthGuard(Reports, [roles.ADMIN,roles.REGISTRATION_CLERK])