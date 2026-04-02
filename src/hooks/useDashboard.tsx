import { AppContext } from "@/context/appContext";
import { applyNodeChanges, MarkerType, Position, type Edge, type Node, type NodeChange } from "@xyflow/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import domo from "ryuu.js";

interface NodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    credits?: string;
    icon?: string;
    isLoading?: boolean;
    isExpanded?: boolean;
}

export type DomoResponse = {
    rows: any[][];
    columns: string[];
};

const MID_COL_X = 280;
const LEAF_COL_X = 560;
const GAP_Y = 100;
const MID_COUNT = 5;

export const useDashboard = () => {
    const app = useContext(AppContext);
    const [edges, setEdges] = useState<Edge[]>([]);
    const hasLoaded = useRef(false);

    const [credits, setCredits] = useState<string>("0");

    const getInitialNodeData = (): Node<NodeData>[] => [
        {
            style: { zIndex: 2 },
            id: 'n1',
            type: 'creditNode',
            position: { x: -120, y: 250 },
            data: {
                label: "Instance",
                description: "https://gwcteq-partner.domo.com/",
                credits: credits,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        },
    ];

    const [nodes, setNodes] = useState<Node<NodeData>[]>(getInitialNodeData());

    useEffect(() => {
        const fetchCredits = async () => {
            const res = await app?.domainCredits();
            if (res) {
                const creditValue = res;
                setCredits(Number(creditValue).toFixed(0).toLocaleString());
            }
        };
        fetchCredits();
    }, [app]);

    useEffect(() => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === 'n1'
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            credits,
                        },
                    }
                    : node
            )
        );
    }, [credits]);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node<NodeData>>[]) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        []
    );

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        const fetchEntityData = async () => {
            try {
                const res = await domo.post(
                    '/sql/v1/credits_tracker',
                    'SELECT entityType, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY entityType',
                    { contentType: 'text/plain' }
                ) as DomoResponse;


                const midRows = res.rows.slice(0, MID_COUNT);
                const leafRows = res.rows.slice(MID_COUNT);

                const midTotalHeight = (midRows.length - 1) * GAP_Y;
                const leafTotalHeight = (leafRows.length - 1) * GAP_Y;

                const midStartY = 250 - midTotalHeight / 2;
                const leafStartY = 250 - leafTotalHeight / 2;

                const newNodes: Node<NodeData>[] = [];
                const newEdges: Edge[] = [];

                midRows.forEach((row, i) => {
                    const [entityType, credits] = row;
                    const nodeId = `mid-${i}`;

                    newNodes.push({
                        id: nodeId,
                        type: 'childNode',
                        position: {
                            x: MID_COL_X,
                            y: midStartY + i * GAP_Y,
                        },
                        style: { zIndex: 2 },
                        data: { label: entityType, credits },
                        targetPosition: Position.Left,
                        sourcePosition: Position.Right,
                    });

                    newEdges.push({
                        id: `e-n1-${nodeId}`,
                        source: 'n1',
                        target: nodeId,
                        animated: true,
                        zIndex: 0,
                        markerEnd: { type: MarkerType.Arrow },
                        style: { stroke: '#185FA5', strokeWidth: 1.5 },
                    });
                });

                leafRows.forEach((row, i) => {
                    const [entityType, credits] = row;
                    const nodeId = `leaf-${i}`;

                    newNodes.push({
                        id: nodeId,
                        type: 'childNode',
                        position: {
                            x: LEAF_COL_X,
                            y: leafStartY + i * GAP_Y,
                        },
                        style: { zIndex: 2 },
                        data: { label: entityType, credits },
                        targetPosition: Position.Left,
                        sourcePosition: Position.Right,
                    });

                    newEdges.push({
                        id: `e-n1-${nodeId}`,
                        source: 'n1',
                        target: nodeId,
                        animated: true,
                        zIndex: 0,
                        markerEnd: { type: MarkerType.Arrow },
                        style: { stroke: '#7F77DD', strokeWidth: 1.2 },
                    });
                });

                setNodes([...getInitialNodeData(), ...newNodes]);
                setEdges(newEdges);

            } catch (error) {
                console.error('fetchEntityData error:', error);
            }
        };

        fetchEntityData();
    }, []);

    return { nodes, edges, onNodesChange };
};