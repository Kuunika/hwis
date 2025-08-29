import {
    FormikInit,
    FormValuesListener,
    SearchComboBox,
    TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import {
    getInitialValues,
    getObservations,
    mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { useState } from "react";
import * as Yup from "yup";

const form = {
    intoxication: {
        name: concepts.INTOXICATION,
        label: "Intoxication",
    },
    intoxicationDescription: {
        name: concepts.INTOXICATION_DESCRIPTION,
        label: "Intoxication description",
    },
};

const initialValues = getInitialValues(form);

const schema = Yup.object().shape({});

const intoxications = [
    { id: "ethanol", label: "Ethanol (Beer, Wine, Spirits)" },
    { id: "methanol", label: "Methanol" },
    { id: "isopropanol", label: "Isopropanol (Rubbing alcohol)" },
    { id: "cannabis", label: "Cannabis (Marijuana, THC products)" },
    { id: "cocaine", label: "Cocaine" },
    { id: "heroin", label: "Heroin" },
    { id: "methamphetamine", label: "Methamphetamine" },
    { id: "mdma", label: "MDMA (Ecstasy)" },
    { id: "lsd", label: "LSD (Acid)" },
    { id: "pcp", label: "PCP (Phencyclidine)" },
    { id: "ketamine", label: "Ketamine" },
    {
        id: "opioids",
        label: "Opioids (Morphine, Codeine, Oxycodone, Fentanyl, Tramadol)",
    },
    {
        id: "benzodiazepines",
        label: "Benzodiazepines (Diazepam, Lorazepam, Alprazolam)",
    },
    { id: "barbiturates", label: "Barbiturates (Phenobarbital, Secobarbital)" },
    {
        id: "antidepressants",
        label: "Antidepressants (Amitriptyline, Fluoxetine, Sertraline)",
    },
    { id: "antipsychotics", label: "Antipsychotics (Haloperidol, Olanzepine)" },
    { id: "acetaminophen", label: "Acetaminophen (Paracetamol)" },
    { id: "nsaids", label: "NSAIDs (Ibuprofen, Diclofenac)" },
    { id: "carbon_monoxide", label: "Carbon Monoxide" },
    { id: "cyanide", label: "Cyanide" },
    { id: "pesticides", label: "Pesticides (Organophosphates, Carbamates)" },
    { id: "heavy_metals", label: "Heavy Metals (Lead, Mercury, Arsenic)" },
    { id: "antifreeze", label: "Antifreeze (Ethylene glycol)" },
    { id: "paint_thinners", label: "Paint thinners, Glue (Toluene, Xylene)" },
    { id: "mushrooms", label: "Mushrooms (Amanita, Psilocybin)" },
    { id: "aflatoxins", label: "Aflatoxins (Contaminated grains, nuts)" },
    { id: "strychnine", label: "Strychnine" },
    { id: "poisonous_plants", label: "Poisonous berries or plants" },
    { id: "synthetic_cannabinoids", label: "Synthetic Cannabinoids (Spice, K2)" },
    { id: "bath_salts", label: "Bath salts (Synthetic cathinones)" },
    { id: "inhalants", label: "Inhalants (Nitrous oxide, Butane, Freon)" },
    { id: concepts.OTHER, label: "Other" },
];

export const IntoxicationHistory = ({
    onSubmit,
}: {
    onSubmit: (values: any) => void;
}) => {
    const { ServerTime } = useServerTime();
    const [formValues, setFormValues] = useState<any>({});

    const handleSubmit = (values: any) => {
        const formValues = { ...values };
        const obsDatetime = ServerTime.getServerTimeString();

        const intoxicationObs = mapSearchComboOptionsToConcepts(
            formValues[form.intoxication.name],
            form.intoxication.name,
            obsDatetime
        );

        delete formValues[form.intoxication.name];

        const obsFormatted = [
            {
                concept: form.intoxication.name,
                value: form.intoxication.name,
                groupMembers: intoxicationObs,
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
            <SearchComboBox
                options={intoxications}
                name={form.intoxication.name}
                label={form.intoxication.label}
            />
            {formValues[form.intoxication.name] &&
                formValues[form.intoxication.name]?.find(
                    (opt: any) => opt.id == concepts.OTHER
                ) && (
                    <>
                        <br />
                        <TextInputField
                            multiline
                            rows={5}
                            sx={{ width: "100%" }}
                            name={form.intoxicationDescription.name}
                            label={form.intoxicationDescription.label}
                            id={form.intoxicationDescription.name}
                        />
                    </>
                )}
        </FormikInit>
    );
};