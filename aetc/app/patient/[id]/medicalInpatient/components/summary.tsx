import {
    FormFieldContainerLayout,
    FormikInit,
    TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import { getInitialValues, getObservations } from "@/helpers";
import * as Yup from "yup";

const form = {
    summary: {
        name: concepts.SUMMARY,
        label: "Summary",
    },
};

const schema = Yup.object().shape({
    [form.summary.name]: Yup.string().label(form.summary.label),
});

const initialValues = getInitialValues(form);

export const Summary = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
    const { ServerTime } = useServerTime();

    const handleSubmit = (values: any) => {
        const obsDatetime = ServerTime.getServerTimeString();
        onSubmit(getObservations(values, obsDatetime));
    };

    return (
        <FormikInit
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
            submitButtonText="next"
        >
            <FormFieldContainerLayout title="Summary">
                <TextInputField
                    name={form.summary.name}
                    id={form.summary.name}
                    label={form.summary.label}
                    multiline
                    rows={5}
                    sx={{ width: "100%" }}
                />
            </FormFieldContainerLayout>
        </FormikInit>
    );
};