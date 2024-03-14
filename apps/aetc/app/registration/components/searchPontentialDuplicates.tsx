import { GenericDialog } from "@/components";
import { searchByDemographics } from "@/hooks/patientReg";
import { MainTypography } from "shared-ui/src";

type Prop = {
    open: boolean
    patientDemo: any
}

export const SearchPotentialDuplicates = ({ open, patientDemo }: Prop) => {
    const { } = searchByDemographics(patientDemo.firstName, patientDemo.lastName, patientDemo.gender, patientDemo.birthdate, patientDemo.homeVillage, patientDemo.homeTraditionalAuthority, patientDemo.homeDistrict);
    return <GenericDialog title="Check Potential Duplicates" open={open} onClose={() => { }}>
        <MainTypography></MainTypography>
    </GenericDialog>
}