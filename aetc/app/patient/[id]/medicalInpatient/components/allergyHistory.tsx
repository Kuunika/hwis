import {
    FormikInit,
    FormValuesListener,
    TextInputField,
} from "@/components";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
    getInitialValues,
    getObservations,
    mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { useAllergyFormat } from "@/hooks/useAllergyFormat";
import { useState } from "react";
import * as Yup from "yup";

const form = {
    allergy: {
        name: concepts.ALLERGY,
        label: "Allergy",
    },
    allergyDetails: {
        name: concepts.ALLERGY_DETAILS,
        label: "Other",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

export const AllergyHistory = ({
    onSubmit,
}: {
    onSubmit: (values: any) => void;
}) => {
    const { allergyOptions } = useAllergyFormat();
    const { ServerTime } = useServerTime();
    const [formValues, setFormValues] = useState<any>({});

    const handleSubmit = (values: any) => {
        const formValues = { ...values };
        const obsDatetime = ServerTime.getServerTimeString();

        const allergiesObs = mapSearchComboOptionsToConcepts(
            formValues[form.allergy.name],
            form.allergy.name,
            obsDatetime
        );

        delete formValues[form.allergy.name];

        const obsFormatted = [
            {
                concept: form.allergy.name,
                value: form.allergy.name,
                groupMembers: allergiesObs,
                obsDatetime: obsDatetime,
            },
        ];

        const obs = getObservations(formValues, obsDatetime);

        onSubmit([...obs, ...obsFormatted]);
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitButtonText="next"
        >
            <FormValuesListener getValues={setFormValues} />
            <GroupedSearchComboBox
                options={allergyOptions}
                multiple={true}
                name={form.allergy.name}
                label={form.allergy.label}
            />
            <br />
            <TextInputField
                multiline
                rows={4}
                name={form.allergyDetails.name}
                label={form.allergyDetails.label}
                id={form.allergyDetails.name}
                sx={{ width: "100%" }}
            />
        </FormikInit>
    );
};