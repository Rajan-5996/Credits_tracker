import {
    Handle,
    Position,
} from "@xyflow/react";
import { formatCompactNumber } from "@/lib/utils";

const ChildNode = ({ data }: { data: any }) => {
    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "10px 16px",
                fontFamily: "'Roboto', sans-serif",
                minWidth: "160px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#94a3b8",
                    width: 8,
                    height: 8,
                    border: "2px solid #fff",
                    left: -4,
                    borderRadius: "50%",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    padding: "2px 0",
                }}
            >
                <div
                    style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#64748b",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {data.label === "RYUU_APP" ? `${data.label} [Custom Apps]` : data.label}
                </div>
                <div
                    style={{
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#1a73e8",
                        marginTop: "2px",
                    }}
                >
                    {formatCompactNumber(data.credits)} <span style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>credits</span>
                </div>
            </div>
        </div>
    );
};

export default ChildNode;
