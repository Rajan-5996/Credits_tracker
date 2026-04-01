import { applyNodeChanges, MarkerType, Position, type Edge, type Node, type NodeChange } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const InitialNodeData: Node<NodeData>[] = [
    {
        id: 'n1',
        type: 'creditNode',
        position: { x: -40, y: 179 },
        data: {
            label: "Instance",
            description: "https://gwcteq-partner.domo.com/",
            credits: "$320",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
    },
];

export const useDashboard = () => {
    const [nodes, setNodes] = useState<Node<NodeData>[]>(InitialNodeData);
    const [edges, setEdges] = useState<Edge[]>([]);
    const hasLoaded = useRef(false);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node<NodeData>>[]) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
            console.log(changes);
        },
        []
    );

    useEffect(() => {
        if (hasLoaded.current) {
            return;
        }

        hasLoaded.current = true;

        const fetchEntityData = async () => {
            try {
                const res = await domo.post(
                    '/sql/v1/credits_tracker',
                    'SELECT entityType, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY entityType',
                    { contentType: 'text/plain' }
                ) as DomoResponse;

                const rootY = 0;

                const childX = 300;
                const gapY = 110;

                const newNodes: Node<NodeData>[] = [];
                const newEdges: Edge[] = [];

                res.rows.slice(0, 6).forEach((row, index) => {
                    const [entityType, credits] = row;

                    const nodeId = `entity-${index}`;

                    newNodes.push({
                        id: nodeId,
                        type: 'childNode',
                        position: {
                            x: childX,
                            y: rootY + index * gapY,
                        },
                        data: {
                            label: entityType,
                            credits: credits,
                        },
                        targetPosition: Position.Left,
                        sourcePosition: Position.Right,
                    });

                    newEdges.push({
                        id: `e-n1-${nodeId}`,
                        source: 'n1',
                        animated: true,
                        target: nodeId,
                        markerEnd: MarkerType.Arrow,
                    });
                });

                setNodes([...InitialNodeData, ...newNodes]);
                setEdges(newEdges);

            } catch (error) {
                console.log(error);
            }
        };

        fetchEntityData();
    }, []);

    return {
        nodes,
        edges,
        onNodesChange,
    };
}
