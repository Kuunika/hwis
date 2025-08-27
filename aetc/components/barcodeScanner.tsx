import React, { useEffect, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import { WrapperBox } from '@/components';

export const BarcodeScanner = ({ onScan }: { onScan: (data: any) => void }) => {

    useEffect(() => {
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                constraints: {
                    // width: 640,
                    // height: 480,
                    facingMode: 'environment' // or 'user' for front-facing camera
                },
                target: document.querySelector('#barcode-scanner') ?? ''
            },
            decoder: {
                readers: ['code_128_reader']
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            Quagga.start();

            Quagga.onDetected((data) => {

                onScan(data.codeResult.code)
            });

            return () => {
                Quagga.stop();
            };
        });
    }, []);

    return (
        <WrapperBox sx={{ width: "100%" }} id="barcode-scanner">
        </WrapperBox>
    );
};