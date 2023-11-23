"use client"
import Image from 'next/image'
import {VitalsForm} from "@/app/anc/registration/vitals/components/VitalsForm";
import {MiddlePageLayout} from "aetc/components/layouts";

export default function Home() {
  const handleSubmit = () => {
    console.log('Form submitted!');
  };
  const initialValues = {};

  return (
      <MiddlePageLayout title="Vitals">

        <VitalsForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
        />

      </MiddlePageLayout>
  );
}
