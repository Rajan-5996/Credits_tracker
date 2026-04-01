import {
    Handle,
    Position,
} from "@xyflow/react";
import ChildNode from "./child_node";

const CreditNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, #f9e07a, #f5c842)",
                border: selected
                    ? "2.5px dashed #b8860b"
                    : "2.5px dashed #d4a800",
                borderRadius: "18px",
                width: 260,
                boxShadow: selected
                    ? "0 8px 32px rgba(180,140,0,0.35), 0 2px 8px rgba(0,0,0,0.1)"
                    : "0 4px 16px rgba(180,140,0,0.18), 0 2px 6px rgba(0,0,0,0.08)",
                fontFamily: "'Caveat', 'Comic Sans MS', cursive",
                overflow: "hidden",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px 10px",
                    borderBottom: "1.5px solid rgba(180,140,0,0.25)",
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.55)",
                        border: "1.5px solid rgba(180,140,0,0.3)",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                    }}
                >
                    <img src="/Logo.svg" alt={data.label} height={25} width={25} />
                </div>

                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#3a2a00",
                            letterSpacing: "0.5px",
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
                            fontSize: "12px",
                            color: "#7a5c00",
                            marginTop: "2px",
                            fontFamily: "'Caveat', cursive",
                            fontWeight: 400,
                        }}
                    >
                        {data.description || "Node description"}
                    </div>
                </div>
            </div>

            <div
                style={{
                    margin: "10px",
                    background: "rgba(255,255,240,0.75)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    textAlign: "center",
                    border: "1px solid rgba(180,140,0,0.15)",
                }}
            >
                <span
                    style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#3a2a00",
                        letterSpacing: "0.5px",
                    }}
                >
                    Credits: {data.credits || "$450"}
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: "#b8860b",
                    width: 12,
                    height: 12,
                    border: "2px solid #fff",
                    right: -6,
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
