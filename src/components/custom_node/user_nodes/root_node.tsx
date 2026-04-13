import { Handle, Position } from "@xyflow/react";
import ChildNode from "./child_node";

const RootNode = ({ data, selected }: { data?: any; selected?: boolean }) => {
    return (
        <div
            style={{
                position: "relative",
                fontFamily: "'Roboto', sans-serif",
                background: "#ffffff",
                border: selected ? "2px solid #1a73e8" : "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "16px 24px",
                minWidth: 220,
                textAlign: "center",
                boxShadow: selected
                    ? "0 4px 12px rgba(26,115,232,0.15)"
                    : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
            }}
        >
            {/* Top accent bar */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #1a73e8, #ff9900)",
                borderRadius: "6px 6px 0 0",
            }} />

            <div
                style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    marginBottom: "4px",
                    color: "#1e293b",
                    marginTop: "4px",
                }}
            >
                {data?.label || "User Name"}
            </div>

            <div
                style={{
                    fontSize: "12px",
                    color: "#1a73e8",
                    fontWeight: 600,
                }}
            >
                {data?.description || "credits used"}
            </div>

            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                style={{
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

            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                style={{
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
        </div>
    );
};

export default RootNode;

export const nodeTypes = {
    usertNode: RootNode,
    childNode: ChildNode,
};
