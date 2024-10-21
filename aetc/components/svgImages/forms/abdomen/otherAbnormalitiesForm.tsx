import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { Box, Button } from "@mui/material";

import * as Yup from "yup";

const schema = Yup.object().shape({
    'wound': Yup.array().required().label("Wound"),
    'tenderness': Yup.array().required().label("Tenderness"),
});


type Props = {
    onSubmit: (values: any) => void;
    onCancel: () => void
}
const options = [
    { id: "Laceration", label: "Laceration" },
    { id: "Stab/Puncture", label: "Stab/Puncture" },
    { id: "Bruise", label: "Bruise" },
    { id: "Burns", label: "Burns" },
    { id: "Wound", label: "Wound" },
]

export const OtherAbnormalityForm = (props: Props) => {
    return <FormikInit validationSchema={schema}
        initialValues={{ description: "", notes: "" }}
        onSubmit={props.onSubmit}
        submitButton={false}
        submitButtonText="next"
    >
        <SearchComboBox
            name={'Tenderness'}
            label={'Tenderness'}
            options={options}
        />
        <SearchComboBox
            name={'Wound'}
            label={'Wound'}
            options={options}
        />
        <br />
        <Box sx={{ display: "flex", gap: "0.2ch" }}>
            <Button type="submit" sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Submit</Button>
            <Button sx={{ borderRadius: "1px" }} fullWidth onClick={props.onCancel}>Cancel</Button>
        </Box>
    </FormikInit>
}