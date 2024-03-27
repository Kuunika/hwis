
import { GenericDialog } from "@/components";
import { WrapperBox } from "shared-ui/src"



export const BarcodeDialog = ({ open }: { open: boolean }) => {
    return <GenericDialog title={"Scan Barcode"} open={open} onClose={() => { }}>
        <WrapperBox>
            {/* <QrScanner
                onResult={(result: any) => console.log(result)}
                onError={(error: any) => console.log(error?.message)}
            /> */}
            {/* <BarcodeReader
                onError={(data: any) => console.log({ data })}
                onScan={(data: any) => console.log({ data })}
            /> */}
        </WrapperBox>
    </GenericDialog>
}