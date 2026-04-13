import etlImage from "@/assets/ETL.png";
import { nodeTypes as cardsNodeTypes } from "@/components/custom_node/cards_node/root_node";
import { DataflowLineageContext } from "@/context/dataflow_lineage";
import type { DomoResponse } from "@/hooks/useDashboard";
import domo from "ryuu.js";
import { BaseEdge, Handle, MarkerType, Position, getBezierPath, type Edge, type EdgeProps, type EdgeTypes, type Node, type NodeTypes } from "@xyflow/react";
import { useContext, useEffect, useMemo, useState } from "react";

type DatasetInfo = {
    id: string;
    name: string;
};

type UseDataflowLineageParams = {
    dataflowId: number;
    isActive: boolean;
};

type UseDataflowLineageResult = {
    nodes: Node[];
    edges: Edge[];
    isLoading: boolean;
    error: string | null;
    nodeTypes: NodeTypes;
    edgeTypes: EdgeTypes;
};

const ETLEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
}: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: "#cbd5e1", strokeWidth: 1.5, strokeDasharray: "6 3" }} />;
};

const handleStyle = {
    background: "#94a3b8",
    width: 8,
    height: 8,
    border: "2px solid #fff",
    borderRadius: "50%",
};

const HubNode = () => {
    return (
        <div
            style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
                position: "relative",
                border: "2px solid #e2e8f0",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
        >
            <img
                src={etlImage}
                alt="ETL"
                style={{
                    width: 36,
                    height: 36,
                    objectFit: "cover",
                    borderRadius: "50%",
                }}
            />
            <Handle type="source" id="hub-right" position={Position.Right} style={{ ...handleStyle, right: -5 }} />
            <Handle type="target" id="hub-left" position={Position.Left} style={{ ...handleStyle, left: -5 }} />
        </div>
    );
};

const lineageNodeTypes: NodeTypes = {
    ...cardsNodeTypes,
    hubNode: HubNode,
};

const edgeTypes: EdgeTypes = {
    etlEdge: ETLEdge,
};

const normalizeIds = (rows: any[][]): string[] => {
    return (rows ?? [])
        .map((row) => String(row?.[0] ?? "").trim())
        .filter((id) => id.length > 0);
};

const fetchDatasetNames = async (ids: string[]): Promise<DatasetInfo[]> => {
    if (ids.length === 0) {
        return [];
    }

    const uniqueIds = Array.from(new Set(ids));
    const sqlIds = uniqueIds.map((id) => `'${id.replace(/'/g, "''")}'`).join(",");

    const response = (await domo.post(
        "/sql/v1/datasets",
        `
            SELECT ID, Name
            FROM datasets
            WHERE ID IN (${sqlIds})
        `,
        { contentType: "text/plain" }
    )) as DomoResponse;

    return (response?.rows ?? []).map((row: any[]) => ({
        id: String(row[0]),
        name: String(row[1] ?? `Dataset ${row[0]}`),
    }));
};

export const useDataflowLineage = ({ dataflowId, isActive }: UseDataflowLineageParams): UseDataflowLineageResult => {
    const dataflow = useContext(DataflowLineageContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputDatasets, setInputDatasets] = useState<DatasetInfo[]>([]);
    const [outputDatasets, setOutputDatasets] = useState<DatasetInfo[]>([]);

    useEffect(() => {
        if (!isActive || !dataflow || !Number.isFinite(dataflowId)) {
            setInputDatasets([]);
            setOutputDatasets([]);
            setError(null);
            setLoading(false);
            return;
        }

        let isCancelled = false;

        const loadLineage = async () => {
            setLoading(true);
            setError(null);

            try {
                const lineage = await dataflow.getLineageData(dataflowId);
                const inputIds = normalizeIds(lineage?.inputDatasets?.rows ?? []);
                const outputIds = normalizeIds(lineage?.outputDatasets?.rows ?? []);

                const [inputs, outputs] = await Promise.all([
                    fetchDatasetNames(inputIds),
                    fetchDatasetNames(outputIds),
                ]);

                if (!isCancelled) {
                    setInputDatasets(inputs);
                    setOutputDatasets(outputs);
                }
            } catch (err) {
                if (!isCancelled) {
                    setError("Unable to load lineage data.");
                    setInputDatasets([]);
                    setOutputDatasets([]);
                }
                console.error("Failed to load lineage", err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        void loadLineage();

        return () => {
            isCancelled = true;
        };
    }, [dataflow, dataflowId, isActive]);

    const { nodes, edges } = useMemo(() => {
        const leftX = 40;
        const centerX = 380;
        const rightX = 600;
        const baseY = 30;
        const rowHeight = 115;

        const rootNodes: Node[] = inputDatasets.map((dataset, index) => ({
            id: `input-${dataset.id}`,
            type: "cardsNode",
            position: { x: leftX, y: baseY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Input Dataset",
            },
            draggable: false,
            selectable: true,
        }));

        const totalInputHeight = (inputDatasets.length - 1) * rowHeight;
        const centerY = baseY + totalInputHeight / 2;

        const hubNode: Node = {
            id: "hub",
            type: "hubNode",
            position: { x: centerX, y: centerY },
            data: {},
            draggable: false,
            selectable: false,
        };

        const totalOutputHeight = outputDatasets.length > 1 ? (outputDatasets.length - 1) * rowHeight : 0;
        const outputStartY = centerY - totalOutputHeight / 2;

        const childNodes: Node[] = outputDatasets.map((dataset, index) => ({
            id: `output-${dataset.id}`,
            type: "cardschildNode",
            position: { x: rightX, y: outputStartY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Output Dataset",
                hideSource: true,
            },
            draggable: false,
            selectable: true,
        }));

        const inputToHubEdges: Edge[] = inputDatasets.map((input) => ({
            id: `edge-${input.id}-hub`,
            source: `input-${input.id}`,
            target: "hub",
            targetHandle: "hub-left",
            type: "etlEdge",
            animated: true,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#94a3b8",
                width: 16,
                height: 16,
            },
        }));

        const hubToOutputEdges: Edge[] = outputDatasets.map((output) => ({
            id: `edge-hub-${output.id}`,
            source: "hub",
            sourceHandle: "hub-right",
            target: `output-${output.id}`,
            type: "etlEdge",
            animated: true,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#94a3b8",
                width: 16,
                height: 16,
            },
        }));

        return {
            nodes: [...rootNodes, hubNode, ...childNodes],
            edges: [...inputToHubEdges, ...hubToOutputEdges],
        };
    }, [inputDatasets, outputDatasets]);

    return {
        nodes,
        edges,
        isLoading: loading,
        error,
        nodeTypes: lineageNodeTypes,
        edgeTypes,
    };
};
