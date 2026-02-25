"use client";

import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RadiologyAdult } from "@/assets/radiologyAdult";
import { concepts, encounters, YES } from "@/constants";
import { getActivePatientDetails } from "@/hooks";
import {
  fetchConceptAndCreateEncounter,
  getPatientsEncounters,
} from "@/hooks/encounter";
import { useServerTime } from "@/contexts/serverTimeContext";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { Bounce, toast } from "react-toastify";
import { FormDatePicker, FormikInit, TextInputField } from "@/components";
import * as Yup from "yup";

type ImagingType = "X-Ray" | "Ultrasound" | "CT" | "MRI" | "Other";
type BodyPartKey =
  | "head"
  | "neck"
  | "chest"
  | "abdomen"
  | "upper_extremity"
  | "spine"
  | "pelvis"
  | "lower_extremity";

type SelectedIndicationsState = Partial<Record<BodyPartKey, string[]>>;

type RadiologyFormValues = {
  lmp: string;
  requestingDrName: string;
  department: string;
  differentialDiagnosis: string;
  examinationRequestFor: string;
  clinicalFindings: string;
};

interface BodyPartConfig {
  label: string;
  concept: string;
  clickTargetIds: string[];
  highlightTargetIds: string[];
  indications: string[];
  supportedIn: ImagingType[];
}

const IMAGING_TYPE_OPTIONS: ImagingType[] = [
  "X-Ray",
  "Ultrasound",
  "CT",
  "MRI",
  "Other",
];

const BODY_PART_CONFIG: Record<BodyPartKey, BodyPartConfig> = {
  head: {
    label: concepts.HEAD,
    concept: concepts.HEAD,
    clickTargetIds: ["HEAD", "LABEL-7"],
    highlightTargetIds: ["HEAD", "LABEL-7"],
    indications: [
      concepts.SKULL,
      concepts.MASTOID,
      concepts.PARA_SINUSES,
      concepts.OPTIC_FORAMEN,
      concepts.ORBITS,
      concepts.NASAL_BONE,
      concepts.MANDIBLE,
      concepts.TMJS,
      concepts.ZYGOMATIC,
    ],
    supportedIn: ["X-Ray", "CT", "MRI", "Other"],
  },
  neck: {
    label: concepts.NECK,
    concept: concepts.NECK,
    clickTargetIds: ["NECK", "LABEL-6"],
    highlightTargetIds: ["NECK", "LABEL-6"],
    indications: [concepts.NECK],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
  chest: {
    label: concepts.CHEST,
    concept: concepts.CHEST,
    clickTargetIds: ["CHEST", "LABEL-5"],
    highlightTargetIds: ["CHEST", "LABEL-5"],
    indications: [
      concepts.CHEST,
      concepts.HEART,
      concepts.STERNUM,
      concepts.RIBS,
      concepts.SCJ,
    ],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
  abdomen: {
    label: concepts.ABDOMEN,
    concept: concepts.ABDOMEN,
    clickTargetIds: ["ABDOMEN", "ABDOMEN_LABEL", "ABDOMEN_LABEL-2"],
    highlightTargetIds: ["ABDOMEN", "ABDOMEN_LABEL", "ABDOMEN_LABEL-2"],
    indications: [concepts.ABDOMEN, concepts.IVP],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
  upper_extremity: {
    label: concepts.UPPER_EXTREMITY,
    concept: concepts.UPPER_EXTREMITY,
    clickTargetIds: ["UPPER_EXTRMITY", "UPPER_EXTREMITY", "LABEL-3"],
    highlightTargetIds: ["UPPER_EXTRMITY", "UPPER_EXTREMITY", "LABEL-3"],
    indications: [
      concepts.CLAVICLE,
      concepts.SHOULDER,
      concepts.SCAPULA,
      concepts.HUMERUS,
      concepts.ELBOW,
      concepts.FOREARM,
      concepts.WRIST,
      concepts.HAND,
      concepts.PHALANGES,
    ],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
  spine: {
    label: concepts.SPINE,
    concept: concepts.SPINE,
    clickTargetIds: ["SPINE", "LABEL-4"],
    highlightTargetIds: ["SPINE", "LABEL-4"],
    indications: [
      concepts.C_SPINE,
      concepts.T_SPINE,
      concepts.L_SPINE,
      concepts.S_SPINE,
      concepts.COCCYX,
    ],
    supportedIn: ["X-Ray", "CT", "MRI", "Other"],
  },
  pelvis: {
    label: concepts.PELVIS,
    concept: concepts.PELVIS,
    clickTargetIds: ["PELVIS", "LABEL-2"],
    highlightTargetIds: ["PELVIS", "LABEL-2"],
    indications: [concepts.PELVIS, concepts.SACROILLAC_JOINTS, concepts.HIP],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
  lower_extremity: {
    label: concepts.LOWER_EXTREMITY,
    concept: concepts.LOWER_EXTREMITY,
    clickTargetIds: ["LOWER_EXTREMITY", "LOWER_EXTREMITY-2", "LABEL"],
    highlightTargetIds: ["LOWER_EXTREMITY", "LOWER_EXTREMITY-2", "LABEL"],
    indications: [
      concepts.FEMUR,
      concepts.KNEE,
      concepts.PATELLA,
      concepts.LEG,
      concepts.ANKLE,
      concepts.CALCANEUS,
      concepts.FOOT,
      concepts.TOE,
    ],
    supportedIn: ["X-Ray", "Ultrasound", "CT", "MRI", "Other"],
  },
};

const IMAGING_TYPE_VISUALS: Record<
  ImagingType,
  { accent: string; filter: string; helperText: string }
> = {
  "X-Ray": {
    accent: "#ae0303",
    filter: "contrast(1.2) brightness(1.05)",
    helperText: "X-Ray mode: broad skeletal coverage.",
  },
  Ultrasound: {
    accent: "#ae0303",
    filter: "contrast(1.2) brightness(1.05)",
    helperText: "Ultrasound mode: soft tissue focused regions.",
  },
  CT: {
    accent: "#ae0303",
    filter: "contrast(1.2) brightness(1.05)",
    helperText: "CT mode: cross-sectional planning.",
  },
  MRI: {
    accent: "#ae0303",
    filter: "contrast(1.2) brightness(1.05)",
    helperText: "MRI mode: high-detail region planning.",
  },
  Other: {
    accent: "#ae0303",
    filter: "contrast(1.2) brightness(1.05)",
    helperText: "Other mode: specify imaging type and select regions.",
  },
};

const DEPARTMENT_NAME = "AETC";

const radiologyRequestSchema = Yup.object().shape({
  requestingDrName: Yup.string().required("Requesting doctor is required"),
  department: Yup.string().required("Department is required"),
  differentialDiagnosis: Yup.string().required(
    "Differential diagnosis is required"
  ),
  clinicalFindings: Yup.string(),
  lmp: Yup.string(),
});

const SHAPE_SELECTOR =
  "path, polygon, rect, circle, ellipse, line, polyline";

const getBodyPartInteractiveElements = (
  svg: SVGSVGElement,
  targetIds: string[]
) => {
  const elements = new Set<SVGElement>();

  targetIds.forEach((targetId) => {
    const target = svg.getElementById(targetId) as SVGElement | null;
    if (!target) return;

    if (
      ["path", "polygon", "rect", "circle", "ellipse", "line", "polyline"].includes(
        target.tagName.toLowerCase()
      )
    ) {
      elements.add(target);
    }

    target
      .querySelectorAll<SVGElement>(SHAPE_SELECTOR)
      .forEach((shape) => elements.add(shape));
  });

  return Array.from(elements);
};

const setRegionHighlight = (
  svg: SVGSVGElement,
  targetId: string,
  selected: boolean,
  accent: string
) => {
  const targetElement = svg.getElementById(targetId) as SVGElement | null;
  if (!targetElement) return;

  const nodes = [
    targetElement,
    ...Array.from(
      targetElement.querySelectorAll<SVGElement>(
        "path, polygon, rect, circle, ellipse, line"
      )
    ),
  ];

  nodes.forEach((node) => {
    const tagName = node.tagName.toLowerCase();

    if (selected) {
      if (tagName === "line") {
        node.style.stroke = accent;
        node.style.opacity = "1";
      } else {
        node.style.fill = accent;
        node.style.opacity = "0.55";
      }
      return;
    }

    if (tagName === "line") {
      node.style.stroke = "";
    } else {
      node.style.fill = "";
    }

    node.style.opacity = "";
  });
};

export const Radiology = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedBodyPartsRef = useRef<BodyPartKey[]>([]);

  const { activeVisit, patientId, patient } = getActivePatientDetails();
  const { ServerTime } = useServerTime();
  const { mutate: submitRadiologyPlan, isPending } = fetchConceptAndCreateEncounter();
  const { data: diagnosisEncounters } = getPatientsEncounters(
    patientId as string,
    `encounter_type=${encounters.OUTPATIENT_DIAGNOSIS}`
  );

  const [imagingType, setImagingType] = useState<ImagingType | "">("");
  const [otherImagingType, setOtherImagingType] = useState("");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartKey[]>([]);
  const [selectedIndications, setSelectedIndications] =
    useState<SelectedIndicationsState>({});

  const [requestingDrName, setRequestingDrName] = useState("");

  useEffect(() => {
    selectedBodyPartsRef.current = selectedBodyParts;
  }, [selectedBodyParts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setRequestingDrName(localStorage.getItem("userName") || "");
  }, []);

  const hiddenPatientFields = useMemo(() => {
    const rootName = patient?.names?.[0] || {};
    const personName = patient?.person?.names?.[0] || {};

    return {
      firstName:
        patient?.given_name ||
        rootName?.given_name ||
        patient?.person?.given_name ||
        personName?.given_name ||
        "",
      lastName:
        patient?.family_name ||
        rootName?.family_name ||
        patient?.person?.family_name ||
        personName?.family_name ||
        "",
      dateOfBirth: patient?.birthdate || patient?.person?.birthdate || "",
      sex: patient?.gender || patient?.person?.gender || "",
    };
  }, [patient]);

  const isFemalePatient = useMemo(() => {
    const sex = (hiddenPatientFields.sex || "").toString().trim().toUpperCase();
    return sex === "F" || sex === "FEMALE";
  }, [hiddenPatientFields.sex]);

  const differentialDiagnosis = useMemo(() => {
    if (!diagnosisEncounters || diagnosisEncounters.length === 0) {
      return "";
    }

    const encountersInActiveVisit = diagnosisEncounters.filter((encounter: any) => {
      if (!activeVisit) return true;
      const visitUuid =
        encounter?.visit?.uuid || encounter?.visit_uuid || encounter?.visit;
      return visitUuid === activeVisit;
    });

    const sourceEncounters =
      encountersInActiveVisit.length > 0
        ? encountersInActiveVisit
        : diagnosisEncounters;

    const records: Array<{ value: string; time: string }> = [];

    sourceEncounters.forEach((encounter: any) => {
      (encounter?.obs || []).forEach((observation: any) => {
        const isDifferential = (observation?.names || []).some(
          (name: any) => name?.name === concepts.DIFFERENTIAL_DIAGNOSIS
        );

        if (!isDifferential) return;

        const value = observation?.value_text || observation?.value || "";
        if (!value) return;

        records.push({
          value,
          time:
            observation?.obs_datetime ||
            encounter?.encounter_datetime});
      });
    });

    records.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return records[0]?.value || "";
  }, [diagnosisEncounters, activeVisit]);

  const requestInitialValues = useMemo<RadiologyFormValues>(
    () => ({
      lmp: "",
      requestingDrName,
      department: DEPARTMENT_NAME,
      differentialDiagnosis,
      examinationRequestFor: "",
      clinicalFindings: "",
    }),
    [requestingDrName, differentialDiagnosis]
  );

  const supportedBodyParts = useMemo(() => {
    if (!imagingType) return [] as BodyPartKey[];

    return (Object.keys(BODY_PART_CONFIG) as BodyPartKey[]).filter((key) =>
      BODY_PART_CONFIG[key].supportedIn.includes(imagingType)
    );
  }, [imagingType]);

  useEffect(() => {
    if (!imagingType) {
      setSelectedBodyParts([]);
      setSelectedIndications({});
      return;
    }

    const supportedSet = new Set<BodyPartKey>(supportedBodyParts);

    setSelectedBodyParts((prev) =>
      prev.filter((bodyPart) => supportedSet.has(bodyPart))
    );

    setSelectedIndications((prev) => {
      const next: SelectedIndicationsState = {};

      (Object.keys(prev) as BodyPartKey[]).forEach((bodyPart) => {
        if (supportedSet.has(bodyPart)) {
          next[bodyPart] = prev[bodyPart];
        }
      });

      return next;
    });
  }, [imagingType, supportedBodyParts]);

  const toggleBodyPart = useCallback((bodyPart: BodyPartKey) => {
    const wasSelected = selectedBodyPartsRef.current.includes(bodyPart);

    setSelectedBodyParts((prev) =>
      wasSelected
        ? prev.filter((part) => part !== bodyPart)
        : prev.includes(bodyPart)
          ? prev
          : [bodyPart, ...prev]
    );

    if (!wasSelected) return;

    setSelectedIndications((prev) => {
      const next: SelectedIndicationsState = { ...prev };
      delete next[bodyPart];
      return next;
    });
  }, []);

  const toggleIndication = useCallback(
    (bodyPart: BodyPartKey, indication: string) => {
      setSelectedIndications((prev) => {
        const current = prev[bodyPart] || [];
        const exists = current.includes(indication);
        const updated = exists
          ? current.filter((item) => item !== indication)
          : [...current, indication];

        const next: SelectedIndicationsState = { ...prev, [bodyPart]: updated };

        if (updated.length === 0) {
          delete next[bodyPart];
        }

        return next;
      });
    },
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !imagingType) return;

    const supportedSet = new Set<BodyPartKey>(supportedBodyParts);
    const listeners: Array<{ target: SVGElement; handler: (event: Event) => void }> = [];

    (Object.entries(BODY_PART_CONFIG) as Array<[BodyPartKey, BodyPartConfig]>).forEach(
      ([bodyPart, config]) => {
        const isSupported = supportedSet.has(bodyPart);
        const elements = getBodyPartInteractiveElements(svg, config.clickTargetIds);

        elements.forEach((element) => {
          element.style.cursor = isSupported ? "pointer" : "not-allowed";
          element.style.pointerEvents = isSupported ? "auto" : "none";
          element.style.opacity = isSupported ? "" : "0.25";

          if (!isSupported) return;

          const handler = (event: Event) => {
            event.stopPropagation();
            toggleBodyPart(bodyPart);
          };

          element.addEventListener("click", handler);
          listeners.push({ target: element, handler });
        });
      }
    );

    return () => {
      listeners.forEach(({ target, handler }) => {
        target.removeEventListener("click", handler);
      });
    };
  }, [imagingType, supportedBodyParts, toggleBodyPart]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !imagingType) return;

    const accent = IMAGING_TYPE_VISUALS[imagingType].accent;
    const selectedSet = new Set<BodyPartKey>(selectedBodyParts);

    (Object.entries(BODY_PART_CONFIG) as Array<[BodyPartKey, BodyPartConfig]>).forEach(
      ([bodyPart, config]) => {
        const isSelected = selectedSet.has(bodyPart);
        config.highlightTargetIds.forEach((targetId) => {
          setRegionHighlight(svg, targetId, isSelected, accent);
        });
      }
    );
  }, [imagingType, selectedBodyParts]);

  const selectedIndicationsCount = useMemo(
    () =>
      Object.values(selectedIndications).reduce(
        (total, indications) => total + (indications?.length || 0),
        0
      ),
    [selectedIndications]
  );

  const hasSelectedIndications = selectedIndicationsCount > 0;

  const submit = useCallback((values: RadiologyFormValues, actions: any) => {
    if (!imagingType) {
      toast.error("Select an imaging type first.");
      return;
    }

    if (imagingType === "Other" && !otherImagingType.trim()) {
      toast.error("Specify the other imaging type.");
      return;
    }

    if (!hasSelectedIndications) {
      toast.error("Select at least one extra indication.");
      return;
    }

    const differentialDiagnosisValue = differentialDiagnosis.trim();

    if (!differentialDiagnosisValue) {
      toast.error(
        "Differential diagnosis is missing. Please record it before submitting."
      );
      return;
    }

    if (!activeVisit || !patientId) {
      toast.error("Active visit or patient context is missing.");
      return;
    }

    const dateTime = ServerTime.getServerTimeString();
    const imagingTypeValue =
      imagingType === "Other" ? otherImagingType.trim() : imagingType;

    const examinationRequestForValue = selectedBodyParts
      .flatMap((bodyPart) =>
        (selectedIndications[bodyPart] || []).map(
          (indication) => `${BODY_PART_CONFIG[bodyPart].label} - ${indication}`
        )
      )
      .join(", ");

    const observations: Array<{
      concept: string;
      value: string;
      obsDatetime: string;
      groupMembers?: Array<{ concept: string; value: string; obsDatetime: string }>;
    }> = [
      {
        concept: concepts.IMAGING_TESTS,
        value: imagingTypeValue,
        obsDatetime: dateTime,
      },
      {
        concept: concepts.SPECIALITY_DEPARTMENT,
        value: DEPARTMENT_NAME,
        obsDatetime: dateTime,
      },
      {
        concept: concepts.REASON_FOR_REQUEST,
        value: examinationRequestForValue,
        obsDatetime: dateTime,
      },
      {
        concept: concepts.DIFFERENTIAL_DIAGNOSIS,
        value: values.differentialDiagnosis.trim(),
        obsDatetime: dateTime,
      },
      {
        concept: concepts.DESCRIPTION,
        value: `Requested By: ${values.requestingDrName}`,
        obsDatetime: dateTime,
      },
      {
        concept: concepts.DESCRIPTION,
        value: `Clinical findings: ${values.clinicalFindings}`,
        obsDatetime: dateTime,
      },
      {
        concept: concepts.DESCRIPTION,
        value: `Patient context(hidden): ${hiddenPatientFields.firstName} ${hiddenPatientFields.lastName}, DOB ${hiddenPatientFields.dateOfBirth}, Sex ${hiddenPatientFields.sex}`,
        obsDatetime: dateTime,
      },
    ];

    if (isFemalePatient && values.lmp) {
      observations.push({
        concept: concepts.DATE_OF_LAST_MENSTRUAL,
        value: values.lmp,
        obsDatetime: dateTime,
      });
    }

    selectedBodyParts.forEach((bodyPart) => {
      const pickedIndications = selectedIndications[bodyPart] || [];
      if (pickedIndications.length === 0) return;

      observations.push({
        concept: BODY_PART_CONFIG[bodyPart].concept,
        value: YES,
        obsDatetime: dateTime,
        groupMembers: pickedIndications.map((indication) => ({
          concept: indication,
          value: YES,
          obsDatetime: dateTime,
        })),
      });
    });

    submitRadiologyPlan(
      {
        encounterType: encounters.RADIOLOGY_EXAMINATON,
        visit: activeVisit,
        patient: patientId,
        encounterDatetime: dateTime,
        obs: observations,
      },
      {
        onSuccess: () => {
          toast.success("Radiology investigation plan submitted.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });

          setSelectedBodyParts([]);
          setSelectedIndications({});
          actions.resetForm({
            values: {
              ...values,
              lmp: "",
              examinationRequestFor: "",
              clinicalFindings: "",
            },
          });
        },
        onError: () => {
          toast.error("Failed to submit radiology investigation plan.");
        },
      }
    );
  }, [
    imagingType,
    otherImagingType,
    hasSelectedIndications,
    differentialDiagnosis,
    isFemalePatient,
    activeVisit,
    patientId,
    ServerTime,
    hiddenPatientFields.firstName,
    hiddenPatientFields.lastName,
    hiddenPatientFields.dateOfBirth,
    hiddenPatientFields.sex,
    selectedBodyParts,
    selectedIndications,
    submitRadiologyPlan,
  ]);

  return (
    <ContainerLoaderOverlay loading={isPending}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/*<Typography variant="h5">Radiology Investigation Plan</Typography>*/}

        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControl>
            <FormLabel>Imaging Type</FormLabel>
            <RadioGroup
              row
              value={imagingType}
              onChange={(event) =>
                setImagingType(event.target.value as ImagingType)
              }
            >
              {IMAGING_TYPE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {imagingType === "Other" && (
            <TextField
              label="Specify other imaging type"
              value={otherImagingType}
              onChange={(event) => setOtherImagingType(event.target.value)}
              fullWidth
              sx={{ mt: 2 }}
              required
            />
          )}
        </Paper>

        {imagingType && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {IMAGING_TYPE_VISUALS[imagingType].helperText}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
                gap: 2,
                alignItems: "start",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Body Map
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 1,
                    maxHeight: 620,
                    overflow: "auto",
                    "& svg": {
                      width: "100%",
                      height: "auto",
                      display: "block",
                    },
                    filter: IMAGING_TYPE_VISUALS[imagingType].filter,
                  }}
                >
                  <RadiologyAdult ref={svgRef} />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1">Extra Indications</Typography>
                <Typography variant="caption" color="text.secondary">
                  Click body parts on the image, then select one or more extra
                  indications.
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                {selectedBodyParts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No body part selected yet.
                  </Typography>
                )}

                {selectedBodyParts.map((bodyPart) => {
                  const config = BODY_PART_CONFIG[bodyPart];
                  const selectedForPart = selectedIndications[bodyPart] || [];

                  return (
                    <Box
                      key={bodyPart}
                      sx={{ mb: 2, p: 1.5, border: "1px solid #ececec", borderRadius: 1 }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Body Part: {config.label}
                      </Typography>

                      <FormGroup>
                        {config.indications.map((indication) => (
                          <FormControlLabel
                            key={`${bodyPart}-${indication}`}
                            control={
                              <Checkbox
                                checked={selectedForPart.includes(indication)}
                                onChange={() =>
                                  toggleIndication(bodyPart, indication)
                                }
                              />
                            }
                            label={indication}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {!hasSelectedIndications && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Select one or more extra indications to continue.
              </Typography>
            )}
          </Paper>
        )}

        {imagingType && hasSelectedIndications && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Request Details
            </Typography>

            <FormikInit
              initialValues={requestInitialValues}
              validationSchema={radiologyRequestSchema}
              enableReinitialize
              submitButtonText="Submit"
              onSubmit={(values, actions) => submit(values, actions)}
            >
              <>
                {isFemalePatient && (
                  <FormDatePicker name="lmp" label="LMP" width="100%" />
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <TextInputField
                    id="requestingDrName"
                    name="requestingDrName"
                    label="Requested By"
                    disabled
                    externalValue={requestingDrName}
                  />

                  <TextInputField
                    id="department"
                    name="department"
                    label="Department"
                    disabled
                    externalValue={DEPARTMENT_NAME}
                  />
                </Box>

                {differentialDiagnosis.trim() ? (
                    <TextInputField
                        id="differentialDiagnosis"
                        name="differentialDiagnosis"
                        label="Differential Diagnosis"
                        disabled
                        externalValue={differentialDiagnosis}
                        multiline
                        rows={2}
                    />
                ) : (
                    <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mt: 1,
                          mb: 1,
                          px: 2,
                          py: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#fff4e5",
                          border: "1px solid #f5a623",
                          color: "#b26a00",
                        }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ⚠️ No differential diagnosis found. Please record it before submitting.
                      </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                    Examination Request For
                  </Typography>
                  <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        p: 1.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        minHeight: 48,
                        backgroundColor: "#f9f9f9",
                      }}
                  >
                    {selectedBodyParts.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No body parts selected yet.
                        </Typography>
                    ) : (
                        selectedBodyParts.map((bodyPart) => {
                          const indications = selectedIndications[bodyPart] || [];
                          return indications.map((indication) => (
                              <Box
                                  key={`${bodyPart}-${indication}`}
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 5,
                                    backgroundColor: "#455a64",
                                    color: "#fff",
                                    fontSize: "0.78rem",
                                    fontWeight: 500,
                                  }}
                              >
                                {BODY_PART_CONFIG[bodyPart].label} — {indication}
                              </Box>
                          ));
                        })
                    )}
                  </Box>
                </Box>

                <TextInputField
                    id="clinicalFindings"
                    name="clinicalFindings"
                    label="Clinical findings"
                    multiline
                    rows={3}
                    sx={{ mt: 2, width: "100%" }}
                />
              </>
            </FormikInit>
          </Paper>
        )}
      </Box>
    </ContainerLoaderOverlay>
  );
};
