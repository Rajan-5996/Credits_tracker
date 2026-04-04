import {
    Handle,
    Position,
} from "@xyflow/react";
import { formatCompactNumber } from "@/lib/utils";

const ChildNode = ({ data }: { data: any }) => {
    return (
        <div
            className="border border-border/40 px-6 py-2 rounded-2xl"
            style={{
                background: "rgba(255, 255, 255, 0.8)",
                position: "relative",
                zIndex: 2,
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
                overflow: "hidden",
                fontFamily: "'Montserrat', sans-serif",
                backdropFilter: "blur(8px)",
                minWidth: "180px",
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#7030B1",
                    width: 10,
                    height: 10,
                    border: "2px solid #fff",
                    left: -5,
                    zIndex: 3,
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    padding: "8px 0",
                }}
            >
                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1e293b",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {data.label === "RYUU_APP" ? `${data.label} [Custom Apps]` : data.label}
                </div>
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "900",
                        color: "#7030B1",
                        marginTop: "4px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {formatCompactNumber(data.credits)} <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>credits</span>
                </div>
            </div>
        </div>
    );
};


export default ChildNode;