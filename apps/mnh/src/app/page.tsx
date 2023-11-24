"use client"
import Image from 'next/image'
import {VitalsForm} from "@/app/anc/registration/vitals/components/VitalsForm";
import {MiddlePageLayout} from "aetc/components/layouts";
import {DemographicsForm} from "@/app/anc/registration/demographics/components/DemographicsForm";

export default function Home() {
  const handleSubmit = () => {
    console.log('Form submitted!');
  };
  const initialValues = {};

  return (
      <MiddlePageLayout title="Pages">

        <DemographicsForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
        />
        <VitalsForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
        />

      </MiddlePageLayout>
  );
}
