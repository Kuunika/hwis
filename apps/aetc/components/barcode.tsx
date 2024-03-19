import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import { MainButton, MainTypography, WrapperBox } from 'shared-ui/src';

interface Props {
    value: string;
    display?: string;
    trigger: () => any
}

export const BarcodeComponent: React.FC<Props> = ({ value, display, trigger }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <WrapperBox>
            <ReactToPrint
                trigger={trigger}
                content={() => ref.current}
            />
            <WrapperBox sx={{
                display: 'none',
                '@media screen': {
                    display: 'none'
                },
                '@media print': {
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'center',
                    alignItems: 'center',

                }
            }} ref={ref}>
                <Barcode margin={0} displayValue={false} value={value} />
                <MainTypography variant='body2'>{display}</MainTypography>
            </WrapperBox>
        </WrapperBox>
    );
};
