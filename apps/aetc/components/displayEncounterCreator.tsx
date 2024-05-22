'use client'
import Image from "next/image";
import { getPatientsEncounters } from "@/hooks/encounter";
import { MainTypography } from "shared-ui/src";

type IProps = {
    patientId: string;
    encounterType: string
}

export const DisplayEncounterCreator = ({ patientId, encounterType }: IProps) => {
    const { data, isLoading } = getPatientsEncounters(patientId);

    if (isLoading) {
        return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
    }

    const encounter = data?.find(encounter => encounter.encounter_type.uuid == encounterType)

    return <MainTypography>{encounter?.created_by}</MainTypography>
}