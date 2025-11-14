import { useState, useRef } from "react";

export interface Administration {
  time: string;
  initial: string;
}

export interface AdministrationDate {
  date: string;
  initials: Administration[];
}

export interface MedicationRecord {
  date: string;
  medication: {
    name: string;
    dose: string;
    frequency: string;
    route: string;
    prescriber: string;
    stopDate: string;
  };
  administrationDatesAndInitials: AdministrationDate[];
}

interface DrugChartProps {
  medications: MedicationRecord[];
}

export const DrugChart: React.FC<DrugChartProps> = ({ medications }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement && chartRef.current) {
      await chartRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Control Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={handleToggleFullscreen}
          style={{
            padding: "8px",
            cursor: "pointer",
            border: "1px solid #bdbdbd",
            borderRadius: "4px",
            background: "#fff",
          }}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? "⤓" : "⤢"}
        </button>
      </div>

      {/* Table Container */}
      <div
        ref={chartRef}
        style={{
          border: "1px solid #bdbdbd",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#fff",
          width: "100%",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", fontWeight: 600 }}>
              <th
                rowSpan={3}
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "8%",
                }}
              >
                Date & Time
              </th>
              <th
                colSpan={2}
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "20%",
                }}
              >
                Medication Name
              </th>
              <th
                rowSpan={3}
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "6%",
                }}
              >
                Route
              </th>
              <th
                rowSpan={3}
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "8%",
                }}
              >
                Prescriber
              </th>
              <th
                rowSpan={3}
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "7%",
                }}
              >
                Stop Date
              </th>
              <th
                // rowSpan={3}
                colSpan={
                  medications[0]?.administrationDatesAndInitials.length || 1
                }
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                Drug Given and Signature
              </th>
            </tr>
            <tr style={{ backgroundColor: "#f5f5f5", fontWeight: 600 }}>
              <th
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "10%",
                }}
              >
                Dose
              </th>
              <th
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "center",
                  width: "10%",
                }}
              >
                Freq
              </th>
              {medications[0]?.administrationDatesAndInitials.map((date) => (
                <th
                  key={date.date}
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "4px",
                    textAlign: "center",
                    minWidth: "120px",
                    fontWeight: 600,
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {date.date}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#f5f5f5", fontWeight: 600 }}>
              <th
                colSpan={2}
                style={{ border: "none", padding: 0, height: 0 }}
              />
            </tr>
          </thead>
          <tbody>
            {medications.map((record, idx) => (
              <>
                <tr key={idx}>
                  <td
                    rowSpan={2}
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.date}
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.name}
                  </td>
                  <td
                    rowSpan={2}
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.route}
                  </td>
                  <td
                    rowSpan={2}
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.prescriber}
                  </td>
                  <td
                    rowSpan={2}
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.stopDate}
                  </td>
                  {record.administrationDatesAndInitials.map(
                    (date, dateIdx) => (
                      <td
                        key={date.date}
                        rowSpan={2}
                        style={{
                          border: "1px solid #bdbdbd",
                          padding: "4px",
                          backgroundColor: "#fafafa",
                          minWidth: "120px",
                          verticalAlign: "top",
                        }}
                      >
                        {date.initials.map((initial) => (
                          <div
                            key={initial.time}
                            style={{
                              padding: "4px 0",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <div style={{ fontSize: "0.7rem", color: "#555" }}>
                              {initial.time}
                            </div>
                            <div
                              style={{ fontWeight: 600, fontSize: "0.7rem" }}
                            >
                              {initial.initial}
                            </div>
                          </div>
                        ))}
                      </td>
                    )
                  )}
                </tr>
                <tr key={`${idx}-dose`}>
                  <td
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.dose}
                  </td>
                  <td
                    style={{
                      border: "1px solid #bdbdbd",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {record.medication.frequency}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
