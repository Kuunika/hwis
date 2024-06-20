import React, { ReactNode, useEffect, useRef } from 'react';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import { MainButton, MainTypography, WrapperBox } from '@/components';
import * as htmlToImage from 'html-to-image';
import zplImageConvert from '@replytechnologies/zpl-image-convert';

interface Props {
    value: string;
    display?: string;
    children: ReactNode,
    setTriggerFunc:(func:any)=>void
}

export const BarcodeComponent: React.FC<Props> = ({ value, children, setTriggerFunc }) => {

    const ref = useRef<HTMLDivElement>(null);



    useEffect(()=>{
        const convertToCanvas = () => {
            const element = document.getElementById('barcode')
            if (element) {
                htmlToImage.toCanvas(element).then((canvas) => {
                    const imageCanvas = document.body.appendChild(canvas);
                    downloadZplData("test", imageCanvas);
                })
            }
        }

        setTriggerFunc(()=>convertToCanvas)
    },[])


    return (

        <WrapperBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div id='barcode'>
                <WrapperBox sx={{ pb: '8px', display: 'flex', flexDirection: "column", alignItems: "center" }} ref={ref}>
                    {children}
                    <Barcode width={3} height={50} margin={0} displayValue={false} value={value} />
                </WrapperBox>
            </div>
        
        </WrapperBox>
    );
};


function downloadZplData(labelName: string, canvas: any) {
    const base64 = canvas.toDataURL("image/png")
    zplImageConvert.encode(base64).then((gfa: string) => {
        const zpl = `^XA^FO20,20${gfa}^XZ`
        // Create a Blob with the ZPL content
        const blob = new Blob([zpl], { type: 'text/plain' });
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element for downloading
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${labelName}.raw.z64.zpl`;
        // Trigger a click event to download the file
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // Clean up by revoking the URL
        window.URL.revokeObjectURL(url);
    })
}