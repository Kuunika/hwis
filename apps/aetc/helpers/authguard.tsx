
import { OverlayLoader } from "@/components/backdrop";
import { useNavigation } from "@/hooks";
import { useLayoutEffect, useState } from "react"
import { checkRole } from "./checkrole";
import { MainTypography, WrapperBox } from "@/components";
import Image from "next/image"
import { getRoles } from "./localstorage";

export default function AuthGuard(Component: any, roles: Array<string>) {
    return function authGuard(props: any) {
        const [show, setShow] = useState(false)
        const { navigateTo } = useNavigation();

        useLayoutEffect(() => {
            if (localStorage) {
                if (!Boolean(localStorage.getItem("accessToken"))) {
                    setShow(false)
                    localStorage.clear()
                    navigateTo("/")
                } else {
                    const loginTime = localStorage.getItem('loginTime');

                    if (loginTime) {
                        const startTime = parseInt(loginTime);
                        const currentTime = new Date().getTime();
                        const difference = currentTime - startTime;
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        if (minutes > 60) {
                            setShow(false);
                            navigateTo("/");
                            localStorage.clear()
                            return
                        }
                    }

                    setShow(true)
                }
            }
        }, [])

            console.log(roles)
             console.log(getRoles())
        const isAuthorized = checkRole(roles, getRoles());

        if (show) {

            return isAuthorized ? <Component  {...props} /> : <Forbidden />
        }
        else {
            return <OverlayLoader open={!show} />
        }

    }

}
const Forbidden = () => {
    return <WrapperBox sx={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <Image src={"/403.jpg"} height={500} width={500} alt="403" />
    </WrapperBox>
}