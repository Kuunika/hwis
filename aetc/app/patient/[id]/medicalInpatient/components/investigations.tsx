import { LabRequestPlanForm } from "../../consultation/components/labRequestPlanForm";

export const Investigations = ({onClose}:{onClose:()=>void}) => {
    return (
        <>
        <LabRequestPlanForm onClose={onClose} addRequest={() => {}} />
        </>
    );
}