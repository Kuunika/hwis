import { useState } from "react";

import {
    FormikInit,
    TextInputField,
} from "shared-ui/src";
import * as yup from "yup";

const form = {
    weight: {
        name: "weight",
        label: " Weight",
    },
    temperature: {
        name: "temperature",
        label: "Temperature",
    },
    gait: {
        name: "gait",
        label: "Gait",
    },
    height: {
        name: "height",
        label: "Height",
    },
    bloodPressure: {
        name: "bloodPressure",
        label: "Blood pressure",
    },
};
type props = {
    initialValues: any;
    onSubmit: (values: any) => void;
};
const schema = yup.object({
    [form.bloodPressure.name]: yup.string().required().label(form.bloodPressure.label),
    [form.weight.name]: yup.string().required().label(form.weight.label),
    [form.height.name]: yup.string().required().label(form.height.label),
    [form.temperature.name]: yup.string().required().label(form.temperature.label),
    [form.gait.name]: yup.string().required().label(form.gait.label),
});


export function VitalsForm({ initialValues, onSubmit }: props) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <FormikInit
            onSubmit={onSubmit}
            validationSchema={schema}
            initialValues={initialValues}
        >
                <TextInputField
                    id={form.bloodPressure.name}
                    name={form.bloodPressure.name}
                    label={form.bloodPressure.label}
                />
                <br/>
                <TextInputField
                    id={form.weight.name}
                    name={form.weight.name}
                    label={form.weight.label}
                />
                <TextInputField
                    id={form.temperature.name}
                    name={form.temperature.name}
                    label={form.temperature.label}
                />
                <TextInputField
                    id={form.height.name}
                    name={form.height.name}
                    label={form.height.label}
                />
                <TextInputField
                    id={form.gait.name}
                    name={form.gait.name}
                    label={form.gait.label}
                />
            <br/>
        </FormikInit>

    );
}
