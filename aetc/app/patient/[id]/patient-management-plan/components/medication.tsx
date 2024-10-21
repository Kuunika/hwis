// MedicationsForm.tsx
import {
    FieldsContainer,
    FormikInit,
    SearchComboBox,
    FormValuesListener,
    MainButton,
    RadioGroupInput,
    WrapperBox,
} from "@/components";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { KeyValueContext, KeyValueContextType } from "@/contexts/keyValueContext";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
};

const schema = Yup.object().shape({
    medications: Yup.array().of(
        Yup.object().shape({
            formulation: Yup.string().required("Formulation is required"),
            frequency: Yup.string().required("Frequency is required"),
            route_of_administration: Yup.string().required("Route of administration is required"),
            duration: Yup.string().required("Duration is required"),
            last_prescribed_date: Yup.string().required("Date last prescribed is required"),
            date_and_time_of_last_med: Yup.string().required("Date and time last taken is required"),
        })
    ),
});

export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [medications, setMedications] = useState([
        { formulation: "", frequency: "", route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" },
    ]);
    const { addKeyToFlow } = useContext(KeyValueContext) as KeyValueContextType;

    const formulationLists = [
        { id: "tablet", label: "Tablet" },
        { id: "syrup", label: "Syrup" },
        { id: "injection", label: "Injection" },
    ];

    const frequencyLists = [
        { id: "24-Hourly-(OD)-Once-a-day", label: "24 Hourly (OD)-Once a day" },
        { id: "12-Hourly-(BID)-Twice-a-day", label: "12 Hourly (BID)-Twice a day" },
        { id: "8-Hourly-(TID)-Three-times-a-day", label: "8 Hourly (TID) -Three times a day" },
        { id: "6-Hourly-(QID)-Four-times-a-day", label: "6 Hourly (QID)- Four times a day" },
        { id: "4-Hourly-Six-times-a-day", label: "4 Hourly- Six times a day" },
    ];

    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedMedications = medications.map((medication, i) =>
            i === index ? { ...medication, [field]: value } : medication
        );
        setMedications(updatedMedications);
    };

    const handleAddMedication = () => {
        setMedications([...medications, { formulation: "", frequency: "", route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" }]);
    };

    const handleRemoveMedication = (index: number) => {
        const updatedMedications = medications.filter((_, i) => i !== index);
        setMedications(updatedMedications);
    };

    const handleSubmit = () => {
        formValues["medications"] = medications;
        onSubmit(formValues);
    };

    return (
        <FormikInit
            validationSchema={schema}
            initialValues={{ medications }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            submitButtonText="Submit"
            submitButton={false}
        >
            <FormValuesListener getValues={setFormValues} />

            <WrapperBox sx={{ padding: "1.5rem", borderRadius: "8px", backgroundColor: "#f7f9fc" }}>
                {medications.map((medication, index) => (
                    <div key={index}>
                        {/* Formulation */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                    

                        <FormControl sx={{ width: 300 }}>
                            <InputLabel id={`formulation-label-${index}`}>Formulation</InputLabel>
                            <Select
                                labelId={`formulation-label-${index}`}
                                id={`formulation-${index}`}
                                value={medications[index].formulation || ""}
                                onChange={(e) => handleInputChange(index, "formulation", e.target.value)}
                                label="Formulation"
                            >
                                {formulationLists.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        

                        <FormControl sx={{ width: 300 }}>
                            <InputLabel id={`frequency-${index}`}>Frequency</InputLabel>
                            <Select
                                labelId={`frequency-label-${index}`}
                                id={`frequency-${index}`}
                                value={medications[index].frequency || ""}
                                onChange={(e) => handleInputChange(index, "frequency", e.target.value)}
                                label="Frequency"
                            >
                                {frequencyLists.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </FieldsContainer>

                        {/* Route of Administration */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <RadioGroupInput
                                row={true}
                                name={`medications[${index}].route_of_administration`}
                                label="Route of Administration"
                                options={[
                                    { label: "Oral", value: "oral" },
                                    { label: "Oral suppository", value: "oral-suppository" },
                                    { label: "Intravenous", value: "Intravenous" },
                                ]}
                            />
                        </FieldsContainer>

                        {/* Duration */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <RadioGroupInput
                                row={true}
                                name={`medications[${index}].duration`}
                                label="Duration"
                                options={[
                                    { label: "Single dose", value: "single dose" },
                                    { label: "Number of days", value: "number of days" },
                                    { label: "Number of months", value: "number of months" },
                                    { label: "Number of years", value: "number of years" },
                                ]}
                            />
                        </FieldsContainer>

                        {/* Last Prescribed Date */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <label style={{ marginBottom: '0.5ch', fontSize: '14px' }}>
                                Date Last Prescribed
                            </label>
                            <input
                                type="date"
                                name={`medications[${index}].last_prescribed_date`}
                                onChange={(e) => handleInputChange(index, "last_prescribed_date", e.target.value)}
                                value={medication.last_prescribed_date}
                                style={{
                                    padding: '0.5ch 1ch',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4',
                                    color: '#333',
                                    cursor: 'pointer',
                                    marginRight: '1ch',
                                    width: '15%',
                                }}
                            />
                        </FieldsContainer>

                        {/* Date and Time Last Taken */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <label style={{ marginBottom: '0.5ch', fontSize: '14px' }}>
                                Date and Time Last Taken
                            </label>
                            <input
                                type="datetime-local"
                                name={`medications[${index}].date_and_time_of_last_med`}
                                onChange={(e) => handleInputChange(index, "date_and_time_of_last_med", e.target.value)}
                                value={medication.date_and_time_of_last_med}
                                style={{
                                    padding: '0.5ch 1ch',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4',
                                    color: '#333',
                                    cursor: 'pointer',
                                    marginRight: '1ch',
                                    width: '20%',
                                }}
                            />
                        </FieldsContainer>
                    </div>
                ))}
            </WrapperBox>
            <MainButton sx={{ m: 0.5 }} onClick={handleSubmit} title="Submit" />
            <MainButton variant={"secondary"} sx={{ m: 0.5 }} onClick={onSkip} title="Skip" />
        </FormikInit>
    );
};
