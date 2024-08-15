import { FormikInit } from "@/components"

type Prop = {
    onSubmit: (values: any) => void;
  };

export const InterventionsForm = ({ onSubmit }: Prop) => {

    return(
        <FormikInit onSubmit={function (values: any, actions: any): void {
            throw new Error("Function not implemented.")
        } } children={undefined} validationSchema={undefined} initialValues={undefined}>
        </FormikInit>
    )
}