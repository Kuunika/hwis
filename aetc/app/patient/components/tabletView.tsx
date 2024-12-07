import { TabsContainer } from "./tabsContainer";
import { Box, Grid } from "@mui/material";
import FloatingButtonWithMenu from "./floatButton";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";
import { getActivePatientDetails } from "@/hooks";
import Image from "next/image";
import { PatientDetailsTablet } from "./tablet/patientDetails";
import { getOnePatient } from "@/hooks/patientReg";

export const TabletView = () => {
  const { patientId } = getActivePatientDetails();

  const menuItems = [
    {
      label: "Primary Assessment",
      link: `/patient/${patientId}/primary-assessment`,
    },
    { label: "Sample History", link: `/patient/${patientId}/medical-history` },
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
        },
        {
          label: "Investigation",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
        },
        {
          label: "Final Diagnosis",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
        },
        {
          label: "Medication",
          link: `/patient/${patientId}/consultation`,
          icon: <FiSettings />,
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

      <TabsContainer />
      <FloatingButtonWithMenu menuItems={menuItems} />
    </Box>
  );
};
