"use client"
import {MiddlePageLayout} from "@/components/layouts";
import { Container, Typography, Paper, Grid,Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Box, Divider } from '@mui/material';
import {VitalsForm} from "@/app/vitals/components/vitalsForm";

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