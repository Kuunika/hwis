
import { ViewPatient } from "@/app/patient/components/viewPatient";
import { GenericDialog } from "@/components";
import { OverlayLoader } from "@/components/backdrop";
import { FormError } from "@/components/formError";
import { CustomizedProgressBars } from "@/components/loader";
import { OperationSuccess } from "@/components/operationSuccess";
import { AETC_VISIT_TYPE, concepts, encounters } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { useFormLoading } from "@/hooks/formLoading";
import { addVisit } from "@/hooks/visit";
import { getVisitNum } from "@/hooks/visitNumber";
import { DDESearch, Person } from "@/interfaces";
import { useEffect, useState } from "react";
import { BaseTable, MainButton } from "shared-ui/src";



export const PatientSearchResultsDialog = ({ open, onClose, isLoading, patientResults }: { open: boolean, isLoading?: boolean, onClose: () => void, patientResults: DDESearch }) => {
    const { navigateTo } = useNavigation();
    const [selectedPatient, setSelectedPatient] = useState<Person | undefined>();
    const rows = [...patientResults.locals, ...patientResults.remotes].map(row => ({ id: row.patient_id, ...row }))
    const {
        loading,
        setLoading,
        completed,
        setCompleted,
        message,
        setMessage,
        showForm,
        setShowForm,
        error,
        setError,
    } = useFormLoading();


    const {
        mutate: createVisit,
        isPending: creatingVisit,
        isSuccess: visitCreated,
        data: visit,
        isError: visitError,
    } = addVisit();

    const {
        mutate: createEncounter,
        isPending: creatingEncounter,
        isSuccess: encounterCreated,
        isError: encounterError,
    } = addEncounter();

    const {
        data: visitNumberResponse,
        isSuccess: visitNumberGenerated,
        isPending: generatingVisitNumber,
        refetch: generateVisitNumber,
        isFetching: fetchingVisitNumber,
        isError: visitNumberError,
    } = getVisitNum();

    // after patient registration create a visit


    const triggerSave = () => {
        setLoading(true)
        setShowForm(false)
        setMessage("creating visit");
        const uuid = selectedPatient?.uuid;
        createVisit({
            patient: uuid,
            visitType: AETC_VISIT_TYPE,
            startDatetime: new Date().toISOString(),
        });
    }


    useEffect(() => {
        if (!visitCreated) return;
        setCompleted(1);
        setMessage("generating visit number...");
        generateVisitNumber();
    }, [creatingVisit]);

    // after creating a visit create an encounter
    useEffect(() => {
        if (!visit) return
        if (!visitNumberGenerated) return;

        setCompleted(2);
        setMessage("creating an encounter...");

        const dateTime = getDateTime();
        createEncounter({
            encounterType: encounters.INITIAL_REGISTRATION,
            visit: visit?.uuid,
            patient: selectedPatient?.uuid,
            encounterDatetime: dateTime,
            obs: [
                {
                    concept: concepts.VISIT_NUMBER,
                    value: visitNumberResponse?.next_visit_number,
                    obsDatetime: dateTime,
                },
            ],
            includeAll: true,
        });
    }, [fetchingVisitNumber]);

    useEffect(() => {
        if (encounterCreated) {
            setCompleted(3);
            setLoading(false);
            setMessage("done");
        }
    }, [encounterCreated]);

    useEffect(() => {
        const error =
            visitError || visitNumberError || encounterError;

        setError(error);
    }, [visitError, visitNumberError, encounterError]);



    const columns = [
        { field: "given_name", headerName: "First Name" },
        { field: "family_name", headerName: "Last Name" },
        { field: "gender", headerName: "Gender", },
        { field: "birthdate", headerName: "Birthdate", flex: 1 },
        {
            field: "currentDistrict", headerName: "Current District", flex: 1, renderCell: (cell: any) => {
                return cell.row.addresses[0].current_district
            }
        },
        {
            field: "currentTraditionalAuthority", headerName: "Current TA", flex: 1, renderCell: (cell: any) => {
                return cell.row.addresses[0].current_traditional_authority
            }
        },
        {
            field: "currentVillage", headerName: "Current Location", flex: 1, renderCell: (cell: any) => {
                return cell.row.addresses[0].current_village
            }
        },
        {
            field: "action",
            flex: 1,
            headerName: "Action",
            renderCell: (cell: any) => {
                return (
                    <>
                        <MainButton
                            sx={{ fontSize: "12px" }}
                            title={"view"}
                            onClick={() => setSelectedPatient(cell.row)}
                        />
                    </>
                );
            },
        },
    ];

    return <GenericDialog maxWidth="lg" title={"Patient Search Results"} open={open} onClose={onClose}>
        {showForm && <>
            {!selectedPatient && <BaseTable columns={columns} rows={rows} />}
            {selectedPatient && <>
                <ViewPatient patient={selectedPatient} />
                <br />
                <MainButton title={"Continue"} sx={{ mr: "0.5ch" }} onClick={triggerSave} />
                <MainButton variant="secondary" title={"Cancel"} onClick={() => setSelectedPatient(undefined)} />
            </>}
        </>}
        {error && (
            <FormError
                error={message}
                onPrimaryAction={() => {
                    setError(false);
                    setCompleted(0);
                    setLoading(false);
                    setShowForm(true);
                }}
                onSecondaryAction={() => {
                    setCompleted(0);
                    setShowForm(true);
                    setLoading(false);
                    setError(false);
                }}
            />
        )}

        {loading && !error && (
            <>
                <br />
                <br />
                <CustomizedProgressBars
                    message={message}
                    progress={(completed / 3) * 100}
                />
            </>
        )}

        {completed == 3 && (
            <OperationSuccess
                title={`Patient Created With Visit Number ${visitNumberResponse?.next_visit_number}`}
                primaryActionText="Register More Patient"
                secondaryActionText="Go Home"
                onPrimaryAction={() => {
                    setShowForm(true);
                    setCompleted(0);
                    onClose()
                }}
                onSecondaryAction={() => {
                    navigateTo("/dashboard")
                }}
            />
        )}

        <OverlayLoader open={Boolean(isLoading)} />
    </GenericDialog>
} 