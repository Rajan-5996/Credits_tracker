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
                border: selected ? "2px solid #185FA5" : "1px solid rgba(24, 95, 165, 0.25)",
                borderRadius: 14,
                padding: "10px 14px",
                minWidth: 180,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.04)",
                fontFamily: "'Montserrat', sans-serif",
            }}
        >
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 2 }}>
                {data?.subtitle || "Page"}
            </div>
            <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 700 }}>
                {data?.title || "Unknown"}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                style={{ background: "#185FA5", width: 10, height: 10, left: -5, border: "2px solid #fff" }}
            />
            {!data?.hideSource && (
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{ background: "#185FA5", width: 10, height: 10, right: -5, border: "2px solid #fff" }}
                />
            )}
        </div>
    )
}

export default CardsChildNode
