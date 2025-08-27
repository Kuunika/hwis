import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { FaSave } from 'react-icons/fa';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


export const TextInputDisplay = ({ getValues }: { getValues: (values: any) => void }) => {
    const [value, setValue] = useState<string>('');
    const [selectedValues, setSelectedValues] = useState<Array<string>>([])

    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    const handleSave = () => {
        setSelectedValues(values => [...values, value])
        setValue('')
    };

    const handleDelete = (item: string) => {
        setSelectedValues(values => [...values.filter(value => value != item)])
    }

    useEffect(() => {
        getValues(selectedValues)
    }, [selectedValues])

    return (
        <Box>
            <TextField
                sx={{ my: "1ch" }}
                fullWidth
                id="outlined-basic"
                label="Other Presenting Complaints"
                placeholder='Enter other presenting complaints and click the save icon on the right'
                variant="outlined"
                value={value}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSave} edge="end">
                                <FaSave />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <br />
            <Stack direction="row" spacing={1}>
                {selectedValues.map(value => <Chip key={value} label={value} onDelete={() => handleDelete(value)} />)}
            </Stack>
        </Box>
    );
};
