import {
    FormikInit,
    TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
    getInitialValues,
    getObservations,
} from "@/helpers";
import * as Yup from "yup";

const form = {
    surgicalHistory: {
        name: concepts.SURGICAL_HISTORY,
        label: "Surgical History",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const PastSurgicalHistory = ({
    onSubmit,
}: {
    onSubmit: (values: any) => void;
}) => {
    const { ServerTime } = useServerTime();

    const handleSubmit = (values: any) => {
        const obsDatetime = ServerTime.getServerTimeString();
        const obs = getObservations(values, obsDatetime);
        onSubmit(obs);
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitButtonText="next"
        >
            <TextInputField
                multiline
                rows={5}
                name={form.surgicalHistory.name}
                label={form.surgicalHistory.label}
                id={form.surgicalHistory.name}
                sx={{ width: "100%" }}
            />
        </FormikInit>
    );
};