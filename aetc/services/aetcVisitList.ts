import { AetcVisitListRecord } from "@/interfaces";
import { emrApiClient } from "./apiClients";
import { create } from "./httpService";
import { getOne } from "./httpService";

const endpoint = "/aetc_visit_lists";

export const createAetcVisitList = (payload: any) =>
  create(payload, endpoint);

export const getAetcVisitListPatient = (
  patientId: string | number,
  includeClosed = false,
) =>
  getOne<AetcVisitListRecord>(
    patientId,
    endpoint,
    includeClosed ? "include_closed=true" : undefined,
  );

export const moveAetcVisitListPatient = (
  patientId: string | number,
  payload: any,
) => emrApiClient().patch(`${endpoint}/${patientId}/move`, payload);

export const patchAetcVisitListPatient = (
  patientId: string | number,
  payload: any,
) => emrApiClient().patch(`${endpoint}/${patientId}`, payload);
