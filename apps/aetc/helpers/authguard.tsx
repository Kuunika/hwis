'use client'

import { useLayoutEffect } from "react"

export default function AuthGuard(Component: any) {
    return function authGuard(props: any) {

        useLayoutEffect(() => {

        }, [])
        return <Component  {...props} />
    }

}