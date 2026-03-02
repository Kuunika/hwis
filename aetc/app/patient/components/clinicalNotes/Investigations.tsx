import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";
import { Obs } from "@/interfaces";

type RadiologyEntry = {
  imagingType: string;
  requestId: string;
  requestedBy: string;
  reasonForRequest: string;
  differentialDiagnosis: string;
  clinicalFindings: string;
  department: string;
  lmp: string;
  selectedIndications: string[];
  radiologyFindings: string;
  reportedBy: string;
  abscondReason: string;
  recordedAt: string;
  isRequest: boolean;
  isResult: boolean;
  isAbscond: boolean;
};

const DESCRIPTION_NAME = concepts.DESCRIPTION.toLowerCase();
const IMAGING_TYPE_PREFIX = "imaging type:";
const REQUEST_ID_PREFIX = "radiology request id:";
const PATIENT_ABSCONDED_PREFIX = "patient absconded the ";

const normalize = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const candidates = [
      objectValue.display,
      objectValue.name,
      objectValue.value,
      objectValue.label,
      objectValue.value_text,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "";
};

const normalizeLower = (value: unknown) => normalize(value).toLowerCase();

const getObservationName = (obs: Obs | any) =>
  normalize(obs?.names?.[0]?.name) || "Observation";

const getObservationNameLower = (obs: Obs | any) =>
  getObservationName(obs).toLowerCase();

const getObservationValue = (obs: Obs | any) =>
  normalize(obs?.value_text) || normalize(obs?.value);

const getObservationChildren = (obs: Obs | any): Obs[] => {
  if (Array.isArray(obs?.children) && obs.children.length > 0) {
    return obs.children;
  }
  if (Array.isArray(obs?.groupMembers) && obs.groupMembers.length > 0) {
    return obs.groupMembers;
  }
  return [];
};

const getObservationValueByName = (observations: Array<Obs | any>, conceptName: string) => {
  const target = conceptName.trim().toLowerCase();
  const matched = observations.find(
    (obs) => getObservationNameLower(obs) === target
  );
  return matched ? getObservationValue(matched) : "";
};

const getDescriptionValueByPrefix = (
  observations: Array<Obs | any>,
  prefixes: string[]
) => {
  const normalizedPrefixes = prefixes.map((prefix) => prefix.toLowerCase());

  for (const obs of observations) {
    if (getObservationNameLower(obs) !== DESCRIPTION_NAME) continue;

    const value = getObservationValue(obs);
    const normalizedValue = value.toLowerCase();
    const matchedPrefix = normalizedPrefixes.find((prefix) =>
      normalizedValue.startsWith(prefix)
    );

    if (matchedPrefix) {
      return value.slice(matchedPrefix.length).trim();
    }
  }

  return "";
};

const toTimestamp = (value: string) => {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatDateTime = (value: unknown) => {
  const normalized = normalize(value);
  if (!normalized) return "Unknown time";
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? normalized : date.toLocaleString();
};

const formatObservation = (obs: Obs | any): string[] => {
  if (!obs) return [];

  const name = getObservationName(obs);
  const value = getObservationValue(obs);
  const children = getObservationChildren(obs);

  if (!value && children.length === 0) return [];

  if (name === concepts.DESCRIPTION) {
    if (value.startsWith("Patient context(hidden):")) return [];
    if (value.startsWith("Requested By:")) {
      return [`Requested By: ${value.replace("Requested By:", "").trim()}`];
    }
    if (value.startsWith("Clinical findings:")) {
      return [`Clinical findings: ${value.replace("Clinical findings:", "").trim()}`];
    }
  }

  if (value.toLowerCase() === "yes" && children.length > 0) {
    const selectedChildren = children
      .filter((child: Obs | any) => getObservationValue(child).toLowerCase() === "yes")
      .map((child: Obs | any) => getObservationName(child))
      .filter(Boolean);

    if (selectedChildren.length > 0) {
      return [`${name}: ${selectedChildren.join(", ")}`];
    }
  }

  const currentLine = value ? [`${name}: ${value}`] : [];
  const childLines = children.flatMap((child: Obs | any) => formatObservation(child));
  return [...currentLine, ...childLines];
};

const parseRadiologyEntry = (encounter: any): RadiologyEntry | null => {
  const observations = Array.isArray(encounter?.obs) ? encounter.obs : [];

  if (observations.length === 0) return null;

  const imagingTypeFromDescription = getDescriptionValueByPrefix(observations, [
    IMAGING_TYPE_PREFIX,
  ]);
  const imagingTypeFromObs = getObservationValueByName(
    observations,
    concepts.IMAGING_TESTS
  );
  const imagingType =
    imagingTypeFromDescription || imagingTypeFromObs || "Unspecified Imaging Type";

  const requestId = getDescriptionValueByPrefix(observations, [REQUEST_ID_PREFIX]);
  const requestedBy = getDescriptionValueByPrefix(observations, ["requested by:"]);
  const clinicalFindings = getDescriptionValueByPrefix(observations, [
    "clinical findings:",
  ]);
  const radiologyFindings = getDescriptionValueByPrefix(observations, [
    "radiology findings:",
    "radiology result:",
  ]);
  const reportedBy = getDescriptionValueByPrefix(observations, ["reported by:"]);
  const abscondReason = getDescriptionValueByPrefix(observations, [
    PATIENT_ABSCONDED_PREFIX,
  ]);

  const reasonForRequest = getObservationValueByName(
    observations,
    concepts.REASON_FOR_REQUEST
  );
  const differentialDiagnosis = getObservationValueByName(
    observations,
    concepts.DIFFERENTIAL_DIAGNOSIS
  );
  const department = getObservationValueByName(
    observations,
    concepts.SPECIALITY_DEPARTMENT
  );
  const lmp = getObservationValueByName(observations, concepts.DATE_OF_LAST_MENSTRUAL);

  const excludedForIndications = new Set([
    concepts.IMAGING_TESTS.toLowerCase(),
    concepts.REASON_FOR_REQUEST.toLowerCase(),
    concepts.DIFFERENTIAL_DIAGNOSIS.toLowerCase(),
    concepts.SPECIALITY_DEPARTMENT.toLowerCase(),
    concepts.DATE_OF_LAST_MENSTRUAL.toLowerCase(),
    concepts.DESCRIPTION.toLowerCase(),
  ]);

  const selectedIndications = observations
    .filter((obs: Obs | any) => {
      const conceptName = getObservationNameLower(obs);
      const obsValue = getObservationValue(obs).toLowerCase();
      return !excludedForIndications.has(conceptName) && obsValue === "yes";
    })
    .map((obs: Obs | any) => {
      const parentName = getObservationName(obs);
      const selectedChildren = getObservationChildren(obs)
        .filter((child: Obs | any) => getObservationValue(child).toLowerCase() === "yes")
        .map((child: Obs | any) => getObservationName(child))
        .filter(Boolean);

      if (selectedChildren.length === 0) {
        return parentName;
      }

      return `${parentName}: ${selectedChildren.join(", ")}`;
    })
    .filter(Boolean);

  const firstObsDatetime = observations.find((obs: Obs | any) => Boolean(obs?.obs_datetime))
    ?.obs_datetime;
  const recordedAt =
    normalize(encounter?.encounter_datetime) || normalize(firstObsDatetime);

  const hasRequestDetails = Boolean(
    requestedBy ||
      reasonForRequest ||
      differentialDiagnosis ||
      clinicalFindings ||
      department ||
      lmp ||
      selectedIndications.length > 0 ||
      requestId
  );

  const isResult = Boolean(radiologyFindings);
  const isAbscond = Boolean(abscondReason);
  const isRequest = hasRequestDetails && !isResult && !isAbscond;

  if (!hasRequestDetails && !isResult && !isAbscond) {
    return null;
  }

  return {
    imagingType,
    requestId,
    requestedBy,
    reasonForRequest,
    differentialDiagnosis,
    clinicalFindings,
    department,
    lmp,
    selectedIndications,
    radiologyFindings,
    reportedBy,
    abscondReason,
    recordedAt,
    isRequest,
    isResult,
    isAbscond,
  };
};

const buildRadiologySectionLines = (encounterSet: any[]) => {
  const entries = encounterSet
    .map((encounter) => parseRadiologyEntry(encounter))
    .filter(Boolean) as RadiologyEntry[];

  if (entries.length === 0) return [] as string[];

  const groupedByImagingType = entries.reduce((acc, entry) => {
    const key = entry.imagingType || "Unspecified Imaging Type";
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, RadiologyEntry[]>);

  const lines: string[] = ["Radiology examinations:\n"];

  Object.keys(groupedByImagingType)
    .sort((a, b) => a.localeCompare(b))
    .forEach((imagingType) => {
      const typeEntries = [...groupedByImagingType[imagingType]].sort(
        (a, b) => toTimestamp(a.recordedAt) - toTimestamp(b.recordedAt)
      );

      const requests = typeEntries.filter((entry) => entry.isRequest);
      const terminals = typeEntries.filter((entry) => entry.isResult || entry.isAbscond);

      type ScanRecord = {
        request?: RadiologyEntry;
        result?: RadiologyEntry;
        abscond?: RadiologyEntry;
      };

      const scans: ScanRecord[] = requests.map((request) => ({ request }));

      const requestIdToIndices = new Map<string, number[]>();
      scans.forEach((scan, index) => {
        const normalizedRequestId = normalizeLower(scan.request?.requestId);
        if (!normalizedRequestId) return;
        if (!requestIdToIndices.has(normalizedRequestId)) {
          requestIdToIndices.set(normalizedRequestId, []);
        }
        requestIdToIndices.get(normalizedRequestId)!.push(index);
      });

      const unresolvedTerminals: RadiologyEntry[] = [];

      terminals.forEach((terminal) => {
        const normalizedRequestId = normalizeLower(terminal.requestId);
        if (!normalizedRequestId || !requestIdToIndices.has(normalizedRequestId)) {
          unresolvedTerminals.push(terminal);
          return;
        }

        const candidateIndices = requestIdToIndices.get(normalizedRequestId) || [];
        const targetIndex =
          candidateIndices.find((index) => !scans[index].result && !scans[index].abscond) ??
          candidateIndices[0];

        if (targetIndex == null) {
          unresolvedTerminals.push(terminal);
          return;
        }

        if (terminal.isResult) {
          scans[targetIndex].result = terminal;
        } else {
          scans[targetIndex].abscond = terminal;
        }
      });

      unresolvedTerminals.forEach((terminal) => {
        const pendingScanIndex = scans.findIndex(
          (scan) => !scan.result && !scan.abscond
        );

        if (pendingScanIndex >= 0) {
          if (terminal.isResult) {
            scans[pendingScanIndex].result = terminal;
          } else {
            scans[pendingScanIndex].abscond = terminal;
          }
          return;
        }

        scans.push(terminal.isResult ? { result: terminal } : { abscond: terminal });
      });

      const sortedScans = scans.sort((a, b) => {
        const aTime = a.request?.recordedAt || a.result?.recordedAt || a.abscond?.recordedAt || "";
        const bTime = b.request?.recordedAt || b.result?.recordedAt || b.abscond?.recordedAt || "";
        return toTimestamp(aTime) - toTimestamp(bTime);
      });

      lines.push(`${imagingType}:\n`);

      sortedScans.forEach((scan, index) => {
        const request = scan.request;
        const result = scan.result;
        const abscond = scan.abscond;
        const referenceTime =
          request?.recordedAt || result?.recordedAt || abscond?.recordedAt;

        lines.push(
          `  ${index + 1}. ${
            request ? "Requested on" : "Recorded on"
          } ${formatDateTime(referenceTime)}\n`
        );

        if (request) {
          if (request.requestedBy) {
            lines.push(`     Clinician / Requesting Dr: ${request.requestedBy}\n`);
          }
          if (request.department) {
            lines.push(`     Department: ${request.department}\n`);
          }
          if (request.reasonForRequest) {
            lines.push(`     Examination request for: ${request.reasonForRequest}\n`);
          }
          if (request.differentialDiagnosis) {
            lines.push(
              `     Differential diagnosis: ${request.differentialDiagnosis}\n`
            );
          }
          if (request.clinicalFindings) {
            lines.push(`     Clinical findings: ${request.clinicalFindings}\n`);
          }
          if (request.selectedIndications.length > 0) {
            lines.push(
              `     Requested scan areas: ${request.selectedIndications.join("; ")}\n`
            );
          }
          if (request.lmp) {
            lines.push(`     LMP: ${request.lmp}\n`);
          }
        }

        if (result) {
          lines.push(
            `     Radiology status: Report submitted on ${formatDateTime(
              result.recordedAt
            )}\n`
          );
          if (result.radiologyFindings) {
            lines.push(`     Radiologist findings: ${result.radiologyFindings}\n`);
          }
          if (result.reportedBy) {
            lines.push(`     Reported by: ${result.reportedBy}\n`);
          }
        } else if (abscond) {
          lines.push(
            `     Radiology status: Patient absconded on ${formatDateTime(
              abscond.recordedAt
            )}\n`
          );
          if (abscond.abscondReason) {
            lines.push(`     Abscond note: ${abscond.abscondReason}\n`);
          }
        } else {
          lines.push("     Radiology status: Pending radiologist report\n");
        }

        lines.push("\n");
      });
    });

  return lines;
};

export const useInvestigations = (pData: any) => {
  const [investigationsMessage, setInvestigationsMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!Array.isArray(pData)) {
      setInvestigationsMessage(null);
      return;
    }

    const encounterGroups = [
      {
        type: encounters.BED_SIDE_TEST,
        title: "Bed side tests",
      },
      {
        type: encounters.LAB,
        title: "Laboratory findings",
      },
      {
        type: encounters.RADIOLOGY_EXAMINATON,
        title: "Radiology examinations",
      },
    ];

    const messages: string[] = [];
    messages.push("Investigations summary\n\n");

    encounterGroups.forEach(({ type, title }) => {
      const encounterSet = pData.filter((d: any) => d?.encounter_type?.uuid === type);

      if (!encounterSet.length) return;

      if (type === encounters.RADIOLOGY_EXAMINATON) {
        const radiologyLines = buildRadiologySectionLines(encounterSet);
        if (radiologyLines.length > 0) {
          messages.push(...radiologyLines, "\n");
        }
        return;
      }

      const observations = encounterSet.flatMap((encounter: any) =>
        Array.isArray(encounter?.obs) ? encounter.obs : []
      );

      if (!observations.length) return;

      messages.push(`${title}:\n`);

      encounterSet.forEach((encounter: any, encounterIndex: number) => {
        const encounterObs = Array.isArray(encounter?.obs) ? encounter.obs : [];
        const encounterTime =
          encounter?.encounter_datetime ||
          encounterObs.find((ob: Obs | any) => Boolean(ob?.obs_datetime))?.obs_datetime;

        const lines = encounterObs.flatMap((obs: Obs | any) => formatObservation(obs));
        if (lines.length === 0) return;

        messages.push(
          `${encounterIndex + 1}. Recorded on ${formatDateTime(encounterTime)}\n`
        );
        lines.forEach((line: string) => {
          messages.push(`   ${line}\n`);
        });
        messages.push("\n");
      });
    });

    const messageText = messages.join("").trim();
    setInvestigationsMessage(
      messageText === "Investigations summary" ? null : messageText
    );
  }, [pData]);

  return investigationsMessage;
};
