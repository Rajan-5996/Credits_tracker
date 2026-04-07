import { Handle, Position } from "@xyflow/react";
import CardsChildNode from "./child_node";

const CardsRootNode = ({ data, selected }: { data?: { title?: string; subtitle?: string }; selected?: boolean }) => {
    return (
        <div
            style={{
                background: "#ffffff",
                border: selected ? "2px solid #7030B1" : "1px solid rgba(112, 48, 177, 0.28)",
                borderRadius: 16,
                padding: "12px 16px",
                minWidth: 220,
                boxShadow: "0 10px 24px rgba(112, 48, 177, 0.08)",
                fontFamily: "'Montserrat', sans-serif",
            }}
        >
            <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                {data?.subtitle || "Dataset"}
            </div>
            <div style={{ fontSize: 15, color: "#111827", fontWeight: 800, marginTop: 4 }}>
                {data?.title || "Unknown dataset"}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{ background: "#7030B1", width: 10, height: 10, right: -5, border: "2px solid #fff" }}
            />
        </div>
    )
}

export default CardsRootNode

export const nodeTypes = {
    cardsNode: CardsRootNode,
    cardschildNode: CardsChildNode,
};
