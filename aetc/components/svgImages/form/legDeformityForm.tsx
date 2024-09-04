import { Box, Button } from "@mui/material";
import * as Yup from "yup";
import { FormikInit, SearchComboBox } from "@/components";

const options = [
    { id: "Deformity", label: "Deformity" },
    { id: "Crepitus", label: "Crepitus" },
    { id: "Tenderness", label: "Tenderness" },

]

const schema = Yup.object().shape({
    'description': Yup.string().required().label("Description"),
});
type Props = {
    onSubmit: (values: any) => void;
    onCancel: () => void
}
export const LegDeformityForm = (props: Props) => {
    return <FormikInit validationSchema={schema}
        initialValues={{ description: "", }}
        onSubmit={props.onSubmit}
        submitButton={false}
        submitButtonText="next"
    >
        <SearchComboBox
            multiple={false}
            name={'description'}
            label={'description'}
            options={options}
        />
        <br />
        <Box sx={{ display: "flex", gap: "0.2ch" }}>
            <Button type="submit" sx={{ borderRadius: "1px" }} variant="contained" fullWidth>Submit</Button>
            <Button sx={{ borderRadius: "1px" }} fullWidth onClick={props.onCancel}>Cancel</Button>
        </Box>
    </FormikInit>
}