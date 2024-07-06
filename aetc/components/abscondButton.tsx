import { useEffect, useState } from "react"
import { MainButton, MainTypography } from "@/components"
import { GenericDialog } from ".";
import { closeCurrentVisit } from "@/hooks/visit";
import { OverlayLoader } from "./backdrop";

export const AbscondButton = ({ patientId, visitId, onDelete }: { patientId: string, visitId: string, onDelete: () => void }) => {
    const { mutate: closeVisit, isPending, isSuccess: visitClosed } = closeCurrentVisit();
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
    }
    useEffect(() => {
        if (visitClosed) {
            handleAbscond();
            onDelete();
        }

    }, [visitClosed])

    const handleAbscond = () => {
        closeVisit(visitId);
    }
    return <>
        <MainButton variant="secondary" sx={{ fontSize: "12px",width:"50%" }} title={"Abscond"} onClick={handleClick} />
        <GenericDialog maxWidth="sm" title="Abscond Patient" open={open} onClose={() => setOpen(false)}>
            <OverlayLoader open={isPending} />
            <MainTypography>Are you sure the patient absconded?</MainTypography>
            <br />
            <MainButton title={"Yes"} onClick={handleAbscond} />
            <MainButton sx={{ ml: 0.3 }} variant="secondary" title={"No"} onClick={() => setOpen(false)} />
        </GenericDialog>
    </>
}

