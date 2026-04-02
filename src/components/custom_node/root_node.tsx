import {
    Handle,
    Position,
} from "@xyflow/react";
import ChildNode from "./child_node";

import { formatCompactNumber } from "@/lib/utils";

const CreditNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div
            style={{
                background: "white",
                border: selected
                    ? "2px solid #7030B1"
                    : "1px solid rgba(112, 48, 177, 0.2)",
                borderRadius: "24px",
                width: 280,
                boxShadow: selected
                    ? "0 12px 40px rgba(112, 48, 177, 0.15), 0 4px 12px rgba(112, 48, 177, 0.05)"
                    : "0 8px 24px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)",
                fontFamily: "'Poppins', sans-serif",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    borderBottom: "1px solid rgba(112, 48, 177, 0.1)",
                    background: "rgba(112, 48, 177, 0.02)",
                }}
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #7030B1 0%, #B56DD3 100%)",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(112, 48, 177, 0.3)",
                    }}
                >
                    <img src="/Logo.svg" alt={data.label} height={26} width={26} style={{ filter: "brightness(0) invert(1)" }} />
                </div>

                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1e293b",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {data.label || "Node Name"}
                    </div>
                    <div
                        style={{
                            fontSize: "11px",
                            color: "#64748b",
                            marginTop: "2px",
                            fontWeight: 500,
                            opacity: 0.8,
                        }}
                    >
                        {data.description || "Node description"}
                    </div>
                </div>
            </div>

            <div
                style={{
                    margin: "12px",
                    background: "rgba(112, 48, 177, 0.03)",
                    borderRadius: "16px",
                    padding: "14px",
                    textAlign: "center",
                    border: "1px solid rgba(112, 48, 177, 0.05)",
                }}
            >
                <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Available Credits</div>
                <span
                    style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        color: "#7030B1",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {formatCompactNumber(data.credits || 0)}
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: "#7030B1",
                    width: 10,
                    height: 10,
                    border: "2px solid #fff",
                    right: -5,
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
