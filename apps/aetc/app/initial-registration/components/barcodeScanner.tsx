
import { GenericDialog } from "@/components";
import { BarcodeScanner } from "@/components/barcodeScanner";
import { useEffect, useState } from "react";



export const BarcodeDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {


    const [barcodeContent, setBarcodeContent] = useState('');

    useEffect(() => {

    }, [barcodeContent])

    return <GenericDialog maxWidth="sm" title={"Scan Barcode"} open={open} onClose={onClose}>
        <BarcodeScanner onScan={setBarcodeContent} />
    </GenericDialog>
} 