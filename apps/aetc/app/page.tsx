'use client'

import { BarcodeDialog } from "./initial-registration/components/barcodeScanner";
import { LoginForm } from "./login/components/loginForm";

export default function LoginPage() {
  // return <BarcodeScanner />

  return <>
    {/* <BarcodeDialog open={true}  onClose={() => { }} /> */}
    <LoginForm />;
  </>
}
