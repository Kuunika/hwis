import { useEffect } from "react"
import { useNavigation } from ".";


export const checkLoggedIn = () => {
    const { navigateTo } = useNavigation()

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigateTo("/")
        }
    }, [])

    return null
}