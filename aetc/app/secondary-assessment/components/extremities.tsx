import { NO, YES, concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { useState } from "react";
import {
    FieldsContainer,
    FormFieldContainerLayout,
    FormValuesListener,
    FormikInit,
    RadioGroupInput,
    SearchComboBox,
    TextInputField,
} from "@/components";
import * as Yup from "yup";
import {
    LowerLimbPosterior,
} from "@/components/svgImages";


const form = {
    oedama: {
        name: concepts.OEDEMA,
        label: "Oedema",
    },
    oedamaDetails: {
        name: concepts.OEDEMA_DETAILS,
        label: "Oedema Details",
    },
    coldClammy: {
        name: concepts.COLD_CLAMMY,
        label: "Cold Clammy",
    },
    abnormalitiesUpperLimb: {
        name: concepts.ABNORMALITIES_UPPER_LIMB,
        label: "Are there other abnormalities  in the upper limbs",
    },

};

type Prop = {
    onSubmit: (values: any) => void;
};

const schema = Yup.object().shape({

    [form.oedama.name]: Yup.string().required().label(
        form.oedama.label
    ),
    [form.oedamaDetails.name]: Yup.string().required().label(
        form.oedamaDetails.label
    ),
    [form.coldClammy.name]: Yup.string().required().label(
        form.coldClammy.label
    ),
    [form.abnormalitiesUpperLimb.name]: Yup.string().required().label(
        form.abnormalitiesUpperLimb.label
    ),

});

const oedamaOptions = [
    { id: concepts.FEET_ONLY, label: "Feet Only" },
    { id: concepts.UP_TO_KNEE, label: "Up To knee" },
    { id: concepts.UP_TO_THIGH, label: "Up to Thighs" },
    { id: concepts.WHOLE_BODY, label: "Whole Body" },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
    { label: "Yes", value: YES },
    { label: "No", value: NO },
];




export const ExtremitiesForm = ({ onSubmit }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [showSpecify, setShowSpecify] = useState(false);
    const [showAbnormalities, setShowAbnormalities] = useState(false);

    const handleValueChange = (values: Array<any>) => {
        setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={initialsValues}
            onSubmit={onSubmit}
        >
            <FormValuesListener getValues={setFormValues} />
            <FormFieldContainerLayout title="">
                <FieldsContainer mr="2px">
                    <RadioGroupInput row options={radioOptions} name={form.oedama.name} label={form.oedama.label} />
                    <RadioGroupInput row options={radioOptions} name={form.coldClammy.name} label={form.coldClammy.label} />
                </FieldsContainer>
                {formValues[form.oedama.name] == YES && <SearchComboBox sx={{ width: '100%' }} multiple={false} name={form.oedamaDetails.name} options={oedamaOptions} label={form.oedamaDetails.label} />}
                <RadioGroupInput row options={radioOptions} name={form.abnormalitiesUpperLimb.name} label={form.abnormalitiesUpperLimb.label} />
            </FormFieldContainerLayout>
            <LowerLimbPosterior />

        </FormikInit>
    );
};
