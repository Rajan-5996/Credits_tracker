import { AppContext } from "@/context/appContext";
import { DetailsContext } from "@/context/detailsContext";
import { formatCompactNumber } from "@/lib/utils";
import { applyNodeChanges, MarkerType, Position, type Edge, type Node, type NodeChange } from "@xyflow/react";
import { useCallback, useContext, useEffect, useState } from "react";

interface NodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    value?: string;
    activeCount?: number;
    inactiveCount?: number;
    side?: "left" | "right";
}

const useUserItem = (userId: number) => {
    //contexts
    const app = useContext(AppContext);
    const detail = useContext(DetailsContext);
    const getUserCredits = app?.getUserCredits;
    const resetLoader2 = app?.resetLoader2;
    const fetchdatasetCount = detail?.fetchdatasetCount;

    const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        if (!userId || !getUserCredits || !resetLoader2 || !fetchdatasetCount) {
            return;
        }

        let cancelled = false;

        const loadUserGraph = async () => {
            resetLoader2();

            const [creditsResult, countsResult] = await Promise.all([
                getUserCredits(userId.toString()),
                fetchdatasetCount(userId.toString()),
            ]);

            if (cancelled) {
                return;
            }

            const resolvedUserName = typeof creditsResult === "object" && creditsResult !== null
                ? creditsResult.name ?? "User Name"
                : "User Name";
            const resolvedCredits = typeof creditsResult === "object" && creditsResult !== null
                ? creditsResult.totalCredits
                : creditsResult;

            const rootNode: Node<NodeData> = {
                style: { zIndex: 2 },
                id: "root",
                type: "usertNode",
                position: { x: -120, y: 250 },
                data: {
                    label: resolvedUserName,
                    description: `${formatCompactNumber(resolvedCredits)} credits used`,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            };

            const metrics = countsResult
                ? [
                    {
                        key: "datasets",
                        label: "Datasets",
                        value: countsResult.datasets.count,
                        description: `${formatCompactNumber(countsResult.datasets.cardsPowered)} cards powered`,
                    },
                    {
                        key: "dataflows",
                        label: "Dataflows",
                        value: countsResult.dataflows.count,
                        activeCount: countsResult.dataflows.activeCount,
                        inactiveCount: countsResult.dataflows.inactiveCount,
                        description: "Connected dataflows",
                    },
                    {
                        key: "workflows",
                        label: "Workflows",
                        value: countsResult.workflows.count,
                        activeCount: countsResult.workflows.activeCount,
                        inactiveCount: countsResult.workflows.inactiveCount,
                        description: "Active workflows",
                    },
                    {
                        key: "jupyter",
                        label: "Jupyter",
                        value: countsResult.jupyter.count,
                        description: "Notebook workspaces",
                    },
                ]
                : [];

            const leftMetrics = metrics.slice(0, 2);
            const rightMetrics = metrics.slice(2);

            const leftStartY = 160;
            const rightStartY = 160;
            const gapY = 150;

            const leftNodes: Node<NodeData>[] = leftMetrics.map((metric, index) => ({
                id: metric.key,
                type: "childNode",
                position: { x: -420, y: leftStartY + index * gapY },
                style: { zIndex: 2 },
                data: {
                    label: metric.label,
                    value: formatCompactNumber(metric.value),
                    description: metric.description,
                    activeCount: metric.activeCount,
                    inactiveCount: metric.inactiveCount,
                    side: "left",
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            }));

            const rightNodes: Node<NodeData>[] = rightMetrics.map((metric, index) => ({
                id: metric.key,
                type: "childNode",
                position: { x: 220, y: rightStartY + index * gapY },
                style: { zIndex: 2 },
                data: {
                    label: metric.label,
                    value: formatCompactNumber(metric.value),
                    description: metric.description,
                    activeCount: metric.activeCount,
                    inactiveCount: metric.inactiveCount,
                    side: "right",
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            }));

            const childNodes = [...leftNodes, ...rightNodes];

            const leftEdges: Edge[] = leftNodes.map((node) => ({
                id: `e-root-${node.id}`,
                source: "root",
                sourceHandle: "source-left",
                target: node.id,
                targetHandle: "target-right",
                animated: true,
                zIndex: 10,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                style: { stroke: "#cbd5e1", strokeWidth: 2 },
            }));

            const rightEdges: Edge[] = rightNodes.map((node) => ({
                id: `e-root-${node.id}`,
                source: "root",
                sourceHandle: "source-right",
                target: node.id,
                targetHandle: "target-left",
                animated: true,
                zIndex: 10,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                style: { stroke: "#cbd5e1", strokeWidth: 2 },
            }));

            const childEdges: Edge[] = [...leftEdges, ...rightEdges];

            setNodes([rootNode, ...childNodes]);
            setEdges(childEdges);
        };

        loadUserGraph().catch((error) => {
            console.error("useUserItem loadUserGraph error:", error);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchdatasetCount, getUserCredits, resetLoader2, userId]);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node<NodeData>>[]) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        []
    );

    return {
        nodes,
        edges,
        setNodes,
        onNodesChange,
    };
}

export default useUserItem;

