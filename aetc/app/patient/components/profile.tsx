"use client";
import { MainGrid, WrapperBox } from "@/components";
import { ConsultationCard, PersonalDetailsCard } from ".";

import React from "react";

import Image from "next/image";

import { VitalsPanel } from "./panels/vitalsDetails";

import { checkPatientIfOnWaitingAssessment, useParameters } from "@/hooks";

import FlowStarter from "./flowStarter";

import { ConsultationContext, ConsultationContextType } from "@/contexts";

import { TabsContainer } from "./tabsContainer";
import { Charts } from "./charts";

export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);

  const { setActiveStep } = React.useContext(
    ConsultationContext
  ) as ConsultationContextType;

  return (
    <MainGrid
      display={{ xs: "none", lg: "flex" }}
      container
      spacing={1}
      mt={"2ch"}
      ml={"9ch"}
    >
      <MainGrid item lg={2}>
        <PersonalDetailsCard />
        <WrapperBox sx={{ my: "1ch" }}>
          <ConsultationCard
            disabled={!isOnList}
            title="Assessments"
            links={[
              {
                title: "Primary Assessment",
                link: `/patient/${params.id}/primary-assessment`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            title="Sample History"
            links={[
              {
                title: "Sample History",
                link: `/patient/${params.id}/medicalHistory`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            title="Assessments"
            links={[
              {
                title: "Secondary Assessment",
                link: `/patient/${params.id}/secondary-assessment`,
              },
            ]}
          />
          <ConsultationCard
            disabled={!isOnList}
            onClick={setActiveStep}
            links={[
              {
                id: 0,
                title: "Differential Diagnosis",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 1,
                title: "Investigations",
                link: `/patient/${params.id}/consultation`,
              },
              {
                id: 2,
                title: "Final Diagnosis",
                link: `/patient/${params.id}/consultation`,
              },
              // {
              //   id: 3,
              //   title: "Medication",
              //   link: `/patient/${params.id}/consultation`,
              // },
            ]}
            title="Consultation"
          />
          {/* New Button */}
          <ConsultationCard
            disabled={!isOnList}
            title="Patient Management Plan"
            links={[
              {
                title: "Patient Management Plan",
                link: `/patient/${params.id}/patient-management-plan`,
              },
            ]}
          />

          {/* New Button */}
          <ConsultationCard
            disabled={!isOnList}
            title="Disposition"
            links={[
              {
                title: "Disposition",
                link: `/patient/${params.id}/disposition`,
              },
            ]}
          />

          <ConsultationCard
            disabled={!isOnList}
            title="Template Forms"
            links={[
              {
                title: "Medical Inpatient",
                link: `/patient/${params.id}/medicalInpatient`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src={"/icons/medicalInpatient.svg"}
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Surgical Notes",
                // link: `/patient/${params.id}/surgicalNotes`,
                link: `/patient/${params.id}/template-forms`,

                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/surgicalnotes.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Gynacological",
                link: `/patient/${params.id}/gynacological`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/gynacology.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Monitoring Chart",
                link: `/patient/${params.id}/nursingChart`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/monitoring.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
              {
                title: "Referral",
                link: `/patient/${params.id}/referral`,
                icon: (
                  <Image
                    width={20}
                    height={20}
                    src="/icons/referral.svg"
                    alt="AETC Form icon"
                  />
                ),
              },
            ]}
          />
        </WrapperBox>
        {/* <BasicAccordion /> */}
      </MainGrid>
      <MainGrid item lg={9}>
        <VitalsPanel />
        <Charts />
        <TabsContainer />
      </MainGrid>
      <FlowStarter patient={params} />
    </MainGrid>
  );
};
