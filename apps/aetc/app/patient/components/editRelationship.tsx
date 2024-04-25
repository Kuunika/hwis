import { RegistrationCard, RegistrationCardTitle } from "@/app/registration/components/common"
import { concepts } from "@/constants";
import { FormikInit, SelectInputField, TextInputField } from "shared-ui/src"
import * as Yup from "yup";

const relationships = [
    {
        name: "Parent",
        value: concepts.PARENT,
    },
    {
        name: "Uncle",
        value: concepts.UNCLE_AUNTIE,
    },
    {
        name: "Auntie",
        value: concepts.AUNTIE,
    },
    {
        name: "Spouse",
        value: concepts.SPOUSE,
    },
    {
        name: "Siblings",
        value: concepts.SIBLING,
    },
];
const schema = Yup.object().shape({
    given_name: Yup.string().required().label('First Name'),
    family_name: Yup.string().required().label('Last Name'),
    relationship: Yup.string().required().label('Relationship'),
})

export const EditRelationship = ({ onSubmit, initialValues }: { initialValues: any, onSubmit: (values: any) => void }) => {
    return <FormikInit submitButtonText="Update" validationSchema={schema} initialValues={initialValues} onSubmit={onSubmit}>
        <RegistrationCard>
            <RegistrationCardTitle>Next of kin Information</RegistrationCardTitle>
            <TextInputField
                name={'given_name'}
                id={'given_name'}
                label={'First Name'}
            />
            <TextInputField
                name={'family_name'}
                id={'family_name'}
                label={'Last Name'}
            />
            <SelectInputField
                name={"relationship"}
                id={"relationship"}
                label={'Relationship'}
                selectItems={relationships}
            />
            <TextInputField
                name={'phoneNumber'}
                id={'phoneNumber'}
                label={'Phone Number'}
            />
        </RegistrationCard>
    </FormikInit>
}