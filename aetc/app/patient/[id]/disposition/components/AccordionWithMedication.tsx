import { AccordionComponent } from "@/components/accordion";
// import { MedicationsForm } from "../../consultation/components/medication";
import { MedicationsForm } from "./medication";

export const AccordionWithMedication = () => {
    const sections = [
        {
            id: "medications",
            title: "Prescribe Medications",
            content: <MedicationsForm onSubmit={function (values: any): void {
                throw new Error("Function not implemented.");
            }} onSkip={function (): void {
                throw new Error("Function not implemented.");
            }} />, // Embedding the Medications Form
        },
    ];

    return <AccordionComponent sections={sections} />;
};