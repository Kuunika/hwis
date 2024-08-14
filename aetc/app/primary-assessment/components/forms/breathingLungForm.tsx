import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { Button } from "@mui/material";
import { FaFileLines } from "react-icons/fa6";

import * as Yup from "yup";

const schema = Yup.object().shape({
    'description': Yup.array().required().label("Description of Abnormality"),
    'notes': Yup.string().required().label("Notes"),
});


type Props = {
    onSubmit: (values: any) => void
}
const options = [
    { id: "Wound", label: "Wound" },
    { id: "Surgical Emphyema", label: "Surgical Emphyema" },
    { id: "Rib Deformity", label: "Rib Deformity" },
    { id: "Frail chest", label: "Frail chest" },
    { id: "Other", label: "Other" },
]

export const BreathingLungForm = (props: Props) => {
    return <FormikInit validationSchema={schema}
        initialValues={{ description: "", notes: "" }}
        onSubmit={props.onSubmit}
        submitButton={false}
        submitButtonText="next"
    >
        <TextInputField multiline rows={4} sx={{ width: "100%" }} id={"notes"} name={"notes"} label={"Notes"} />
        <SearchComboBox
            name={'description'}
            label={'Description of Abnormality'}
            options={options}
        />
        <br />
        <Button type="submit" sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Submit</Button>
    </FormikInit>
}