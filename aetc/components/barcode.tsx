
import React, { ReactNode, useEffect, useRef } from 'react';
import Barcode from 'react-barcode';
import { WrapperBox } from '@/components';
import * as htmlToImage from 'html-to-image';
import zplImageConvert from '@replytechnologies/zpl-image-convert';
import axios from 'axios';

interface Props {
    value: string;
    display?: string;
    children: ReactNode;
    setTriggerFunc: (func: any) => void;
}

export const BarcodeComponent: React.FC<Props> = ({ value, children, setTriggerFunc }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const convertToCanvas = async () => {
            const element = document.getElementById('barcode');
            if (element) {
                const canvas = await htmlToImage.toCanvas(element);
                downloadZplData("test", canvas);
            }
        };

        setTriggerFunc(() => convertToCanvas);
    }, []);

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

const downloadZplData = async (labelName: string, canvas: HTMLCanvasElement) => {
    const base64 = canvas.toDataURL("image/png");
    try {
        const gfa = await zplImageConvert.encode(base64);
        const zpl = `^XA^FO20,20${gfa}^XZ`;

        // console.log(zpl);

        await axios.post(`${process.env.NEXT_PUBLIC_PRINTER_IP}/print`, { zpl });

       
        // const blob = new Blob([zpl], { type: 'text/plain' });
     
        // const url = window.URL.createObjectURL(blob);

        // const downloadLink = document.createElement('a');
        // downloadLink.href = url;
        // downloadLink.download = `${labelName}.raw.z64.zpl`;
       
        // downloadLink.click();
    
        // window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error encoding image to ZPL:', error);
    }
};
