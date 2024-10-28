import React from "react";
import { BaseTable } from "@/components";

interface Diagnosis {
    id: string;
    condition: string;
    obsDatetime: string; // Ensure consistency with obsDatetime
}

export const DiagnosisTable = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
    const columns = [
        { field: "condition", headerName: "Diagnosis", flex: 1 },
        {
            field: "label",
            headerName: " ",
            flex: 1,
            renderCell: () => <span>Differential Diagnosis</span>,
        },
        {
            field: "obsDatetime",
            headerName: "Date Recorded",
            flex: 1,
            renderCell: (params: any) => {
                const date = params.row.obsDatetime;
                return <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>;
            },
        },
    ];

    return (
        <BaseTable
            rows={diagnoses}
            columns={columns}
            height="400px"
            width="100%"
            showTopBar={false}
        />
    );
};
