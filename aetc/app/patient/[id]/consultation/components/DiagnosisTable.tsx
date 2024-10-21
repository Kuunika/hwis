import React from "react";
import { BaseTable } from "@/components"; // Import BaseTable

interface Diagnosis {
    id: number;
    condition: string;
}

export const DiagnosisTable = ({
    diagnoses,
    onDelete,
}: {
    diagnoses: Diagnosis[];
    onDelete: (id: number) => void;
}) => {
    const columns = [
        { field: "condition", headerName: "Diagnosis", flex: 1 },
        {
            field: "label",
            headerName: " ",
            flex: 1,
            renderCell: () => <span>Differential Diagnosis</span>,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params: any) => (
                <button
                    onClick={() => onDelete(params.row.id)}
                    style={{
                        color: "white",
                        backgroundColor: "red",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                    }}
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <BaseTable
            rows={diagnoses}
            columns={columns}
            height="400px"
            width="100%"
            showTopBar={false} // Pass false to hide the search bar and toggle

        />
    );
};
