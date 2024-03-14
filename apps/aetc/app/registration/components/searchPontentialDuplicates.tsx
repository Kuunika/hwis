import { GenericDialog } from "@/components";
import { MainTypography } from "shared-ui/src";

type Prop = {
    open: boolean
}

export const SearchPotentialDuplicates = ({ open }: Prop) => {
    return <GenericDialog title="Check Potential Duplicates" open={open} onClose={() => { }}>
        <MainTypography></MainTypography>
    </GenericDialog>
}