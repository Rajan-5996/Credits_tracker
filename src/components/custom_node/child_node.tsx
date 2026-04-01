import {
    Handle,
    Position,
} from "@xyflow/react";

const ChildNode = ({ data }: { data: any }) => {
    return (
        <div
            className="border border-gray-300 px-6 py-1 rounded-lg"
        >
            <Handle
                type="target"
                position={Position.Left}
            />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 14px 10px",
                    borderBottom: "1.5px solid rgba(180,140,0,0.25)",
                }}
            >
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
                </div>
            </div>

            <span
                style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#3a2a00",
                    letterSpacing: "0.5px",
                }}
            >
                Credits: {Number.parseInt(data.credits) || "$450"}
            </span>
        </div>
    );
};

export default ChildNode;