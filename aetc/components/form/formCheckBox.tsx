'use client'
import { useEffect, useState } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useFormikField } from './hooks';


type Props = {
    name: string,
    options: Array<{ value: string, label: string }>
    getValue?: (value: any) => void;
}
export function CheckboxesGroup({ options, name, getValue }: Props) {
    const [checkBoxValue, setCheckBoxValue] = useState<{ [key: string]: any }>({});
    const [disabled, setDisabled] = useState(false);
    const { setFieldValue, hasError, errorMessage, value } =
        useFormikField(name);

    useEffect(() => {
        if (value) {
            if (value?.filter((v: any) => v?.value).length == 2) {
                setDisabled(true)
            } else {
                setDisabled(false)
            }
        }
    }, [value])


    useEffect(() => {
        const obj: any = {};
        for (let i = 0; i < options.length; i++) {
            const key = options[i];

            obj[key.value] = false;
        }

        setCheckBoxValue(obj)
    }, [])



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

    useEffect(() => {
        getValue && getValue(value);
    }, [value, checkBoxValue]);

    return (
        <FormControl error={hasError} name={name} component="fieldset" variant="standard">
            <FormGroup>
                {options.map(option => (<FormControlLabel
                    control={
                        <Checkbox disabled={(disabled && !checkBoxValue[option.value])} value={option.value} onChange={handleCheckboxChange} name={option.value} />
                    }
                    label={option.label}
                />))}
            </FormGroup>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>

    );
}
