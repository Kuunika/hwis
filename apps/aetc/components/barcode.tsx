import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import { MainButton, MainTypography, WrapperBox } from 'shared-ui/src';

interface Props {
    value: string;
    display?: string
}

export const BarcodeComponent: React.FC<Props> = ({ value, display }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <WrapperBox>
            <ReactToPrint
                trigger={() => <MainButton sx={{ mb: 1 }} title={"Print"} onClick={() => { }} />}
                content={() => ref.current}
            />
            <WrapperBox sx={{ display: "flex", flexDirection: "column" }} ref={ref}>
                <Barcode margin={0} displayValue={false} value={value} />
                <MainTypography variant='body2'>{display}</MainTypography>
            </WrapperBox>
        </WrapperBox>
    );
};
