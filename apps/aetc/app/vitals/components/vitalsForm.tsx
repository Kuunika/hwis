import { useState } from "react";

import {
    BasePopover,
    FieldsContainer,
    FormikInit,
    MainButton, MultlineInput,
    RadioGroupInput,
    SearchComboBox, SelectInputField,
    TextInputField,
    WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";
import {Grid} from "@mui/material";

const form = {
    complaints: {
        name: "complaints",
        label: " Complaints",
    },
    temperature: {
        name: "temperature",
        label: "Temperature",
    },
    respiratoryRate: {
        name: "respiratoryRate",
        label: "Respiratory rate",
    },
    saturationRate: {
        name: "saturationRate",
        label: "Saturation rate",
    },
    heartRate: {
        name: "heartRate",
        label: "Heart rate",
    },
    bloodPressure: {
        name: "bloodPressure",
        label: "Blood pressure",
    },
    motorResponse: {
        name: "motorResponse",
        label: "Motor Response",
    },
    eyeOpeningResponse: {
        name: "eyeOpeningResponse",
        label: "Eye Opening Response",
    },
    verbalResponse: {
        name: "verbalResponse",
        label: "Verbal Response",
    },

    calculatedGCS: {
        name: "calculatedGCS",
        label: "Calculated GCS",
    },
    AVPU: {
        name: "AVPU",
        label: "AVPU",
    },
    glucose: {
        name: "glucose",
        label: "Glucose",
    },
    avpu: {
        name: "avpu",
        label:"AVPU",
    },
};
type props = {
    initialValues: any;
    onSubmit: (values: any) => void;
};
const schema = yup.object({
    [form.complaints.name]: yup.string().required().label(form.complaints.label),
    [form.respiratoryRate.name]: yup.string().required().label(form.respiratoryRate.label),
    [form.saturationRate.name]: yup.string().required().label(form.saturationRate.label),
    [form.bloodPressure.name]: yup.string().required().label(form.bloodPressure.label),
    [form.heartRate.name]: yup.string().required().label(form.heartRate.label),
    [form.temperature.name]: yup.string().required().label(form.temperature.label),
    [form.eyeOpeningResponse.name]: yup.string().required().label(form.eyeOpeningResponse.label),
    [form.motorResponse.name]: yup.string().required().label(form.motorResponse.label),
    [form.verbalResponse.name]: yup.string().required().label(form.verbalResponse.label),
    [form.calculatedGCS.name]: yup.string().required().label(form.calculatedGCS.label),
    [form.glucose.name]: yup.string().required().label(form.glucose.label),
    [form.avpu.name]: yup.string().required().label(form.avpu.label),
});

const eyeOpeningResponses = [
    { label:"To Speech", value:"To Speech"},
    { label:"To Pain", value:"To Pain"},
    {  label:"No Response", value:"No Response"},

    ];
const motorResponses = [
    {  label:"Obey", value:"Obey"},
    {  label:"Localising", value:"Localising"},
    {  label:"Extention", value:"Extention"},
    {  label:"Normal Flexion", value:"Normal Flexion"},
    {label:"None", value:"None"},

];
const verbalResponses = [
    {  label:"Confused",value:"Confused"},
    {  label:"Oriented",value:"Oriented"},
    {  label:"Words",value:"Words"},
    {  label:"Sounds",value:"Sounds"},
    {  label:"None",value:"None"},

];
const avpuLists = [
    { id: "Awake", label: "Awake" },
    { id: "Verbal", label: "Verbal" },
    { id: "Pain", label: "Pain" },
    { id: "Unresponsive", label: "Unresponsive" },
    ];

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
            <MultlineInput
                id={form.complaints.name}
                name={form.complaints.name}
                label={form.complaints.label}
                maxRows={20}
                sx={{width:'98.8%'}}
            />
            <FieldsContainer>
                <TextInputField
                    id={form.respiratoryRate.name}
                    name={form.respiratoryRate.name}
                    label={form.respiratoryRate.label}
                />
                <TextInputField
                    id={form.heartRate.name}
                    name={form.heartRate.name}
                    label={form.heartRate.label}
                />
                <br/>

            </FieldsContainer>
            <FieldsContainer>
                <TextInputField
                    id={form.saturationRate.name}
                    name={form.saturationRate.name}
                    label={form.saturationRate.label}
                />
                <TextInputField
                    id={form.bloodPressure.name}
                    name={form.bloodPressure.name}
                    label={form.bloodPressure.label}
                />
            </FieldsContainer>
            <FieldsContainer>
                <TextInputField
                    id={form.temperature.name}
                    name={form.temperature.name}
                    label={form.temperature.label}
                    sx={{width:'48.2%'}}
                />
            </FieldsContainer>
            <br/>
            <br/>

            <Grid container spacing={6}>
                <Grid item>
                    <RadioGroupInput
                        name={form.eyeOpeningResponse.name}
                        label={form.eyeOpeningResponse.label}
                        options={eyeOpeningResponses}
                        row={false}
                    />
                </Grid>

                <Grid item>
                    <RadioGroupInput
                        name={form.motorResponse.name}
                        label={form.motorResponse.label}
                        options={motorResponses}
                        row={false}
                    />
                </Grid>

                <Grid item>
                    <RadioGroupInput
                        name={form.verbalResponse.name}
                        label={form.verbalResponse.label}
                        options={verbalResponses}
                        row={false}
                    />
                </Grid>
            </Grid>
            <TextInputField
                id={form.calculatedGCS.name}
                name={form.calculatedGCS.name}
                label={form.calculatedGCS.label}
            />
            <SearchComboBox
                name={form.avpu.name}
                options={avpuLists}
                label={form.avpu.label}
            />
            <br/>
            <TextInputField
                id={form.glucose.name}
                name={form.glucose.name}
                label={form.glucose.label}
            />
        </FormikInit>

    );
}
