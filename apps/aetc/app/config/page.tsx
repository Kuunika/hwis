'use client'

import { MainButton } from "shared-ui/src"
import { UsersList } from "./components"
import { useNavigation } from "@/hooks"

export default function Page() {
    const { navigateTo } = useNavigation()
    return <>
        <MainButton title={"create user"} onClick={() => navigateTo("/config/users/create")} />
        <UsersList />
    </>
}