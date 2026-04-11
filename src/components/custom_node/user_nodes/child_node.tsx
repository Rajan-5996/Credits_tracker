import { Handle, Position } from "@xyflow/react";

const ChildNode = ({ data, selected }: { data?: any; selected?: boolean }) => {
    const isLeftNode = data?.side === "left";
    const isRightNode = data?.side === "right";
    const labelText = String(data?.label || "").toLowerCase();
    const isWorkflowOrDataflow =
        labelText.includes("workflow") || labelText.includes("dataflow");

    const activeCount = Number(data?.activeCount ?? 0);
    const inactiveCount = Number(data?.inactiveCount ?? 0);

    return (
        <div
            style={{
                background: "#ffffff",
                border: selected ? "2px solid #1a73e8" : "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "16px 20px",
                minWidth: 200,
                textAlign: "center",
                boxShadow: selected
                    ? "0 4px 12px rgba(26,115,232,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.06)",
                fontFamily: "'Roboto', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = selected ? "#1a73e8" : "#e2e8f0";
                (e.currentTarget as HTMLDivElement).style.boxShadow = selected ? "0 4px 12px rgba(26,115,232,0.15)" : "0 1px 3px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}
            >
                {data?.label || "Metric"}
            </div>

            <div
                style={{
                    fontSize: "24px",
                    lineHeight: 1.2,
                    color: "#1e293b",
                    fontWeight: 700,
                }}
            >
                {data?.value || data?.description || "0"}
            </div>

            <div
                style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginTop: "6px",
                }}
            >
                {isWorkflowOrDataflow ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "6px",
                        }}
                    >
                        <span style={{
                            color: "#16a34a",
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: 600,
                            fontSize: "10px",
                        }}>
                            Active: {activeCount}
                        </span>
                        <span style={{
                            color: "#dc2626",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: 600,
                            fontSize: "10px",
                        }}>
                            Inactive: {inactiveCount}
                        </span>
                    </div>
                ) : (
                    data?.description || "No details available"
                )}
            </div>

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                style={{
                    display: isLeftNode ? "none" : "block",
                    background: "#94a3b8",
                    width: 8,
                    height: 8,
                    border: "2px solid #fff",
                    left: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                }}
            />

            <Handle
                type="target"
                id="target-right"
                position={Position.Right}
                style={{
                    display: isRightNode ? "none" : "block",
                    background: "#94a3b8",
                    width: 8,
                    height: 8,
                    border: "2px solid #fff",
                    right: -4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
};

export default ChildNode;
