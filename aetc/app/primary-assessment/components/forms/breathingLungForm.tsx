import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { checkLoggedIn } from "@/hooks/auth";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { FaFileLines } from "react-icons/fa6";

import * as Yup from "yup";

const schema = Yup.object().shape({
    'description': Yup.array().required().label("Description of Abnormality"),
    'notes': Yup.string().required().label("Notes"),
    'specify': Yup.string().label("Specify"),
});


type Props = {
    onSubmit: (values: any) => void;
    onCancel: () => void
}
const options = [
    { id: "Wound", label: "Wound" },
    { id: "Surgical Emphyema", label: "Surgical Emphyema" },
    { id: "Rib Deformity", label: "Rib Deformity" },
    { id: "Frail chest", label: "Frail chest" },
    { id: "Other", label: "Other" },
]

export const BreathingLungForm = (props: Props) => {
    const [showInputTextDisplay, setShowInputTextDisplay] = useState(false);

    return <FormikInit validationSchema={schema}
        initialValues={{ description: "", notes: "" }}
        onSubmit={props.onSubmit}
        submitButton={false}
        submitButtonText="next"
    >
        <TextInputField multiline rows={2} sx={{ width: "100%" }} id={"notes"} name={"notes"} label={"Notes"} />
        <SearchComboBox
            getValue={(values) => {
                if (values)
                    setShowInputTextDisplay(Boolean(values.find((v: any) => v.id == "Other")))
            }}
            name={'description'}
            label={'Description of Abnormality'}
            options={options}
        />
        {showInputTextDisplay && <TextInputField sx={{ width: "100%" }} id={"specify"} name={"specify"} label={"Specify"} />}
        <br />
        <Box sx={{ display: "flex", gap: "0.2ch" }}>
            <Button type="submit" sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Submit</Button>
            <Button sx={{ borderRadius: "1px" }} fullWidth onClick={props.onCancel}>Cancel</Button>
        </Box>
    </FormikInit>
}