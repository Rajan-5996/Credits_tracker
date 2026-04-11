import { Handle, Position } from "@xyflow/react";

const CardsChildNode = ({
    data,
    selected,
}: {
    data?: { title?: string; subtitle?: string; hideSource?: boolean };
    selected?: boolean;
}) => {
    return (
        <div
            style={{
                background: "#ffffff",
                border: selected ? "2px solid #1a73e8" : "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "8px 12px",
                minWidth: 180,
                boxShadow: selected ? "0 4px 12px rgba(26,115,232,0.15)" : "0 1px 2px rgba(0,0,0,0.04)",
                fontFamily: "'Roboto', sans-serif",
                transition: "all 0.2s ease",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = selected ? "#1a73e8" : "#e2e8f0";
                (e.currentTarget as HTMLDivElement).style.boxShadow = selected ? "0 4px 12px rgba(26,115,232,0.15)" : "0 1px 2px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
        >
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                {data?.subtitle || "Page"}
            </div>
            <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>
                {data?.title || "Unknown"}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#94a3b8",
                    width: 8,
                    height: 8,
                    left: -4,
                    border: "2px solid #fff",
                    borderRadius: "50%",
                }}
            />
            {!data?.hideSource && (
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{
                        background: "#94a3b8",
                        width: 8,
                        height: 8,
                        right: -4,
                        border: "2px solid #fff",
                        borderRadius: "50%",
                    }}
                />
            )}
        </div>
    )
}

export default CardsChildNode
