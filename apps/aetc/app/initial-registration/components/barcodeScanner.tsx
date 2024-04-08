
import { GenericDialog } from "@/components";
import { BarcodeScanner } from "@/components/barcodeScanner";
import { useEffect, useState } from "react";



export const BarcodeDialog = ({ open, onClose, onBarcodeScan }: { open: boolean, onClose: () => void, onBarcodeScan: (content: any) => void }) => {

    const [barcodeContent, setBarcodeContent] = useState('');

    useEffect(() => {
        if (barcodeContent) {
            onBarcodeScan(barcodeContent)
        }
    }, [barcodeContent])

    return <GenericDialog maxWidth="sm" title={"Scan Barcode"} open={open} onClose={onClose}>
        <BarcodeScanner onScan={setBarcodeContent} />
    </GenericDialog>
} 