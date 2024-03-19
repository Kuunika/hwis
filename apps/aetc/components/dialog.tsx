'use client'
import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { MainButton } from "shared-ui/src";

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: string) => void;
    children: React.ReactNode
    title: string
    maxWidth?: "md" | "sm" | "lg"
}

export function GenericDialog({ onClose, open, children, title, maxWidth = "lg" }: SimpleDialogProps) {

    const handleClose = () => {
        console.log("closed");
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
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




