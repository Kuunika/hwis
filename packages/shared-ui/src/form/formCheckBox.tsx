import { useEffect, useState } from 'react';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useFormikField } from './hooks';


type Props = {
    name: string,
    options: Array<{ value: string, label: string }>
}
export function CheckboxesGroup({ options, name }: Props) {
    const [checkBoxValue, setCheckBoxValue] = useState<{ [key: string]: any }>({});

    const { setFieldValue, hasError, errorMessage } =
        useFormikField(name);


    useEffect(() => {
        const array = Object.keys(checkBoxValue).map(key => ({ key, value: checkBoxValue[key] }));
        setFieldValue(name, array)
    }, [checkBoxValue])



    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxValue({
            ...checkBoxValue,
            [event.target.value]: event.target.checked,
        });
    };

    return (
        <FormControl error={hasError} name={name} component="fieldset" variant="standard">
            <FormLabel component="legend">Assign responsibility</FormLabel>
            <FormGroup>
                {options.map(option => (<FormControlLabel
                    control={
                        <Checkbox value={option.value} onChange={handleCheckboxChange} name={option.value} />
                    }
                    label={option.label}
                />))}
            </FormGroup>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>

    );
}
