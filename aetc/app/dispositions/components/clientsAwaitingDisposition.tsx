"use client";
import { useEffect, useState } from "react";
import { useNavigation } from "@/hooks";
// import { getPatientsAwaitingDisposition } from "@/hooks/patientReg"; 
import { getPatientsWaitingForAssessmentPaginated } from "@/hooks/patientReg";

import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
    CalculateWaitingTime,
    MainButton,
    PatientTableListServer,
    WrapperBox,
} from "../../../components";

import { DisplayEncounterCreator } from "@/components";
import { encounters } from "@/constants";
import { Box } from "@mui/material";
import { calculateAge } from "@/helpers/dateTime";

export const ClientsAwaitingDisposition = () => {
    const [deleted, setDeleted] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
    });

    const { navigateTo } = useNavigation();
    const [searchText, setSearchText] = useState("");
    const { data, refetch, isPending } = getPatientsWaitingForAssessmentPaginated(
        paginationModel,
        searchText
    );

    useEffect(() => {
        refetch();
    }, [paginationModel]);

    const columns = [
        { field: "aetc_visit_number", headerName: "Visit" },
        { field: "given_name", headerName: "First Name", flex: 1 },
        { field: "family_name", headerName: "Last Name", flex: 1 },
        { field: "gender", headerName: "Gender" },
        {
            field: "waiting",
            headerName: "Aggregated Time",
            flex: 1,
            renderCell: (cell: any) => (
                <CalculateWaitingTime arrival_time={cell.row.arrival_time} />
            ),
        },
        {
            field: "last_encounter_creator",
            headerName: "Disposed By",
            flex: 1,
        },
        {
            field: "care_area",
            headerName: "Disposition Type",
            flex: 1,
            // renderCell: (cell: any) => <CareAreaDropdown patient={cell.row} />,
        },
        {
            field: "action",
            headerName: "Actions",
            flex: 1.2,
            renderCell: (cell: any) => <DispositionActions patient={cell.row} />,
        },
    ];

    const formatForMobileView = data?.data?.map((row: any) => {
        return {
            id: row.id,
            visitNumber: row.aetc_visit_number,
            firstName: row.given_name,
            lastName: row.family_name,
            gender: row.gender,
            arrivalTime: row.patient_arrival_time,
            arrivalDateTime: row.arrival_time,
            actor: (
                <DisplayEncounterCreator encounterType={encounters.DISCHARGE_PATIENT} patientId={row.id} />
            ),
            aggregate: <CalculateWaitingTime arrival_time={row.arrival_time} />,
            waitingTime: (
                <CalculateWaitingTime arrival_time={row?.latest_encounter_time} />
            ),
            actionName: "Disposed By",
            action: (
                <CardAction
                    patient={row}
                    setDeleted={(id: any) => setDeleted(id)}
                    triage={row.triage_result}
                    visitId={row.visit_uuid}
                    id={row.uuid}
                />
            ),
            age: `${calculateAge(row.birthdate)}yrs`,
            triageResult: row.triage_result,
        };
    });

    return (
        <PatientTableListServer
            columns={columns}
            data={data?.data ? data : { data: [], page: 1, per_page: 10, total_pages: 0 }}
            searchText={searchText}
            setSearchString={setSearchText}
            setPaginationModel={setPaginationModel}
            paginationModel={paginationModel}
            loading={isPending}
            formatForMobileView={formatForMobileView ? formatForMobileView : []}
        />
    );
};

// Dropdown for selecting care area
const CareAreaDropdown = ({ patient }: { patient: any }) => {
    const careAreas = ["ICU", "General Ward", "Surgical Unit"];
    const [selectedArea, setSelectedArea] = useState(patient.care_area || "");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(event.target.value);
        // Make API call to update care area
    };

    return (
        <select value={selectedArea} onChange={handleChange}>
            {careAreas.map((area) => (
                <option key={area} value={area}>
                    {area}
                </option>
            ))}
        </select>
    );
};

// Actions: Select form or close visit
const DispositionActions = ({ patient }: { patient: any }) => {
    const { navigateTo } = useNavigation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseVisit = () => {
        console.log(`Closing visit for patient ${patient.id}`);
        // Add API call to close the visit here
    };

    return (
        <div>
            {/* Close Visit Button */}
            <MainButton
                size="small"
                sx={{ fontSize: "12px", ml: "5px" }}
                title={"Close Visit"}
                onClick={handleCloseVisit}
            />
            {/* Dropdown for template forms */}
            <MainButton
                size="small"
                sx={{ fontSize: "12px", ml: "5px", mr: "5px" }}
                title={"Select Form"}
                onClick={handleClick}
            />
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => navigateTo(`/patient/${patient.id}/forms`)}>Form 1</MenuItem>
                <MenuItem onClick={() => navigateTo(`/patient/${patient.id}/forms`)}>Form 2</MenuItem>
                <MenuItem onClick={() => navigateTo(`/patient/${patient.id}/forms`)}>Form 3</MenuItem>
            </Menu>


        </div>
    );
};

const CardAction = ({
    id,
    visitId,
    triage,
    setDeleted,
    patient,
}: {
    id: string;
    visitId: string;
    triage: string;
    setDeleted: (id: any) => void;
    patient: any;
}) => {
    const { navigateTo } = useNavigation();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
            <WrapperBox
                sx={{
                    borderRadius: "2px",
                    width: "100%",
                    height: "80%",
                    backgroundColor:
                        triage == "red"
                            ? "#B42318"
                            : triage == "yellow"
                                ? "#ede207"
                                : triage == "green"
                                    ? "#016302"
                                    : "",
                    marginY: 1,
                }}
            ></WrapperBox>
        </Box>
    );
};