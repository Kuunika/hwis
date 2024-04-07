
import { GenericDialog } from "@/components";
import { BarcodeScanner } from "@/components/barcodeScanner";
import { useState } from "react";



export const BarcodeDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {

    const [s, set] = useState('')

    const handleScan = (data: any) => {
        set(data)
        console.log({ data })
    }

    return <GenericDialog maxWidth="sm" title={"Scan Barcode"} open={open} onClose={onClose}>
        {s}
        <BarcodeScanner onScan={handleScan} />
    </GenericDialog>
} 