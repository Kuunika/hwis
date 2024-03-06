'use client'
import { addUser } from "@/hooks/users";
import { UserForm } from "../../components";
import { OverlayLoader } from "@/components/backdrop";
import { useEffect } from "react";
import { useNavigation } from "@/hooks";

export default function Page() {
    const { mutate, isPending, isSuccess } = addUser();
    const { navigateTo } = useNavigation()

    useEffect(() => {
        if (isSuccess) {
            navigateTo("/config");
        }

    }, [isSuccess])

    const handleSubmit = (values: any) => {
        // console.log({ values })
        mutate(values)
    }
    return <>
        <UserForm initialValues={{}} onSubmit={handleSubmit} />
        <OverlayLoader open={isPending} />
    </>
}