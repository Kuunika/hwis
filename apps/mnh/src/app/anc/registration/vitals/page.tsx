"use client"
import { Container, Typography, Paper, Grid,Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Box, Divider } from '@mui/material';
import {VitalsForm} from "@/app/anc/registration/vitals/components/VitalsForm";
import {MiddlePageLayout} from "@/app/components/layouts";


export default function Vitals() {
    const handleSubmit = () => {
        console.log('Form submitted!');
    };
    const initialValues = {};

    return (
        <MiddlePageLayout title="Vitals">

            <VitalsForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
            />

        </MiddlePageLayout>
    );
}