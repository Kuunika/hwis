'use client'
import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { FormikInit, MainButton } from "@/components";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode
    title: string
    maxWidth?: "md" | "sm" | "lg"
}

export function GenericDialog({ onClose, open, children, title, maxWidth = "lg" }: SimpleDialogProps) {

    const handleClose = () => {
        onClose()
    };

    const handleListItemClick = (value: string) => {
        onClose();
    };

    return (
        <Dialog maxWidth={maxWidth} fullWidth={true} onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}


