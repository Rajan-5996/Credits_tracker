import { Handle, Position } from "@xyflow/react";
import CardsChildNode from "./child_node";

const CardsRootNode = ({ data, selected }: { data?: { title?: string; subtitle?: string }; selected?: boolean }) => {
    return (
        <div
            style={{
                position: "relative",
                background: "#ffffff",
                border: selected ? "2px solid #1a73e8" : "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "10px 14px",
                minWidth: 200,
                boxShadow: selected ? "0 4px 12px rgba(26,115,232,0.15)" : "0 1px 3px rgba(0,0,0,0.06)",
                fontFamily: "'Roboto', sans-serif",
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
                background: "#ff9900",
                borderRadius: "6px 6px 0 0",
            }} />

            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginTop: 2 }}>
                {data?.subtitle || "Dataset"}
            </div>
            <div style={{ fontSize: 14, color: "#1e293b", fontWeight: 700, marginTop: 2 }}>
                {data?.title || "Unknown dataset"}
            </div>

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
        </div>
    )
}

export default CardsRootNode

export const nodeTypes = {
    cardsNode: CardsRootNode,
    cardschildNode: CardsChildNode,
};
