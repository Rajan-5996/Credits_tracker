import { Handle, Position } from "@xyflow/react";

const RootNode = ({ data, selected }: { data?: any; selected?: boolean }) => {
    return (
        <div
            style={{
                background: "white",
                border: selected
                    ? "2px solid #7030B1"
                    : "1px solid rgba(112, 48, 177, 0.2)",
                borderRadius: "20px",
                padding: "18px 22px",
                minWidth: 220,
                textAlign: "center",
                boxShadow: selected
                    ? "0 12px 40px rgba(112, 48, 177, 0.15), 0 4px 12px rgba(112, 48, 177, 0.05)"
                    : "0 8px 24px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "6px",
                    letterSpacing: "-0.01em",
                }}
            >
                {data?.label || "User Name"}
            </div>

            <div
                style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 500,
                    opacity: 0.9,
                }}
            >
                {data?.description || "$24500 credits used"}
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

            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#7030B1",
                    width: 10,
                    height: 10,
                    border: "2px solid #fff",
                    left: -5,
                }}
            />
        </div>
    );
};

export default RootNode;

export const nodeTypes = {
    usertNode: RootNode,
    // childNode: ChildNode,
};
