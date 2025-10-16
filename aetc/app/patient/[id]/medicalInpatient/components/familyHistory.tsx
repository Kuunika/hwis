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
    familyHistory: {
        name: concepts.FAMILY_HISTORY,
        label: "Family History",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const FamilyHistory = ({
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
                sx={{ width: "100%" }}
                id={form.familyHistory.name}
                label={form.familyHistory.label}
                name={form.familyHistory.name}
            />
        </FormikInit>
    );
};