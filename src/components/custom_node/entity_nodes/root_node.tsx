import {
    Handle,
    Position,
} from "@xyflow/react";

import { formatCompactNumber } from "@/lib/utils";
import ChildNode from "./child_node";

const CreditNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div
            style={{
                width: 280,
                fontFamily: "'Roboto', sans-serif",
                background: "#ffffff",
                border: selected ? "2px solid #1a73e8" : "1px solid #e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: selected
                    ? "0 4px 12px rgba(26,115,232,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
            }}
        >
            {/* Top accent bar */}
            <div style={{ height: 3, background: "linear-gradient(90deg, #1a73e8, #ff9900)" }} />

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderBottom: "1px solid #f1f5f9",
                }}
            >
                <div
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: "6px",
                        background: "#1a73e8",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img src="/Logo.svg" alt={data.label} height={20} width={20} style={{ filter: "brightness(0) invert(1)" }} />
                </div>

                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#1e293b",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {data.label || "Node Name"}
                    </div>
                    <div
                        style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            marginTop: "3px",
                            fontWeight: 500,
                        }}
                    >
                        {data.description || "Node description"}
                    </div>
                </div>
            </div>

            {/* Credits Display */}
            <div
                style={{
                    margin: "10px 12px 12px",
                    background: "#f8fafc",
                    borderRadius: "6px",
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid #f1f5f9",
                }}
            >
                <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                    Available Credits
                </div>
                <span
                    style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "#1a73e8",
                    }}
                >
                    {formatCompactNumber(data.credits || 0)}
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: "#94a3b8",
                    width: 8,
                    height: 8,
                    border: "2px solid #fff",
                    right: -4,
                    borderRadius: "50%",
                }}
            />
        </div>
    );
};

export default CreditNode;

export const nodeTypes = {
    creditNode: CreditNode,
    childNode: ChildNode,
};
