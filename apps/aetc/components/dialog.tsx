import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: string) => void;
    children: React.ReactNode
    title: string
}

export function GenericDialog({ onClose, open, children, title }: SimpleDialogProps) {

    const handleClose = () => {
        console.log("closed");
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog maxWidth="lg" fullWidth={true} onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}




