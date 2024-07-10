"use client";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
// import { DesktopView, TabletView } from "./components/profile";
import dynamic from 'next/dynamic';


const DesktopView = dynamic(()=> import("./components/profile").then(mod=>mod.DesktopView),{ssr:false})
const TabletView = dynamic(()=> import("./components/profile").then(mod=>mod.TabletView),{ssr:false})


function PatientProfile() {
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}

export default AuthGuard(PatientProfile, [roles.CLINICIAN, roles.NURSE])
