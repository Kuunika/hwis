'use client'

import { OverlayLoader } from "@/components/backdrop";
import { useNavigation } from "@/hooks";
import { useLayoutEffect, useState } from "react"

export default function AuthGuard(Component: any) {
    return function authGuard(props: any) {
        const [show, setShow] = useState(false)
        const { navigateTo } = useNavigation();

        useLayoutEffect(() => {

            if (localStorage) {
                if (!Boolean(localStorage.getItem("accessToken"))) {
                    navigateTo("/")
                } else {
                    setShow(true)
                }
            }
        }, [])

        if (show) {

            return <Component  {...props} />
        }
        else {
            return <OverlayLoader open={!show} />
        }

    }

}