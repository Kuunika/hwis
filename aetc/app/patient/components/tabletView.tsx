import { TabsContainer } from "./tabsContainer";
import { Box, Grid } from "@mui/material";
import FloatingButtonWithMenu from "./floatButton";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";
import { getActivePatientDetails } from "@/hooks";
import Image from "next/image";
import { PatientDetailsTablet } from "./tablet/patientDetails";

import { Charts } from "./charts";
import { ConsultationContext, ConsultationContextType } from "@/contexts";
import { useContext } from "react";

export const TabletView = () => {
  const { setActiveStep } = useContext(
    ConsultationContext
  ) as ConsultationContextType;
  const { patientId } = getActivePatientDetails();

  const menuItems = [
    {
      label: "Primary Assessment",
      link: `/patient/${patientId}/primary-assessment`,
    },
    { label: "Sample History", link: `/patient/${patientId}/medicalHistory` },
    {
      label: "Secondary Assessment",
      link: `/patient/${patientId}/secondary-assessment`,
    },
    {
      label: "Consultation",
      submenu: [
        {
          label: "Differential Diagnosis",
          link: `/patient/${patientId}/consultation`,
          icon: <FiUser />,
          id: 0,
        },
        {
          label: "Investigation",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
          id: 1,
        },
        {
          label: "Final Diagnosis",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
          id: 2,
        },
        {
          label: "Medication",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
          id: 3,
        },
      ],
    },
    { label: "Disposition", link: `/patient/${patientId}/disposition` },
    {
      label: "Template Forms",
      link: "/",
      submenu: [
        {
          label: "Medical Inpatient",
          link: `/patient/${patientId}/medicalInpatient`,
          icon: (
            <Image
              width={15}
              height={15}
              src={"/icons/medicalInpatient.svg"}
              alt="AETC Form icon"
            />
          ),
        },
        {
          label: "Gynacological",
          link: `/patient/${patientId}/medicalInpatient`,
          icon: (
            <Image
              width={15}
              height={15}
              src="/icons/gynacology.svg"
              alt="AETC Form icon"
            />
          ),
        },
        {
          label: "Surgical Notes",
          link: `/patient/${patientId}/surgicalNotes`,
          icon: (
            <Image
              width={15}
              height={15}
              src="/icons/surgicalnotes.svg"
              alt="AETC Form icon"
            />
          ),
        },
        {
          label: "Monitoring Chart",
          link: `/patient/${patientId}/nursingChart`,
          icon: (
            <Image
              width={15}
              height={15}
              src="/icons/monitoring.svg"
              alt="AETC Form icon"
            />
          ),
        },
        {
          label: "Referral",
          link: `/patient/${patientId}/referral`,
          icon: (
            <Image
              width={15}
              height={15}
              src="/icons/referral.svg"
              alt="AETC Form icon"
            />
          ),
        },
      ],
    },
  ];

  return (
    <Box display={{ xs: "flex", lg: "none" }} flexDirection={"column"} px={4}>
      <PatientDetailsTablet />
      <Charts />
      <TabsContainer />
      <FloatingButtonWithMenu
        onClickAction={setActiveStep}
        menuItems={menuItems}
      />
    </Box>
  );
};
