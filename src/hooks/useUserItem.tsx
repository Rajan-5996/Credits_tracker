import { AppContext } from "@/context/appContext";
import { formatCompactNumber } from "@/lib/utils";
import { applyNodeChanges, Position, type Node, type NodeChange } from "@xyflow/react";
import { useCallback, useContext, useEffect, useState } from "react";

interface NodeData extends Record<string, unknown> {
    label: string;
    description: string
}

const useUserItem = (userId: number) => {
    //contexts
    const app = useContext(AppContext);

    //utility states
    const [userName, setUserName] = useState<string>("User Name");
    const [creditsUsed, setCreditsUsed] = useState<number>(0);

    useEffect(() => {
        if (userId) {
            app?.resetLoader2?.();
            app?.getUserCredits(userId.toString()).then((result) => {
                if (typeof result === "object" && result !== null) {
                    setUserName(result.name || "User Name");
                    setCreditsUsed(result.totalCredits);
                } else {
                    setCreditsUsed(result);
                }
            });
        }
    }, [userId]);

    const getInitialNodeData = (): Node<NodeData>[] => [
        {
            style: { zIndex: 2 },
            id: 'root',
            type: 'usertNode',
            position: { x: -120, y: 250 },
            data: {
                label: userName,
                description: `${formatCompactNumber(creditsUsed)} credits used`,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        },
    ];

    const [nodes, setNodes] = useState<Node<NodeData>[]>(getInitialNodeData());

    useEffect(() => {
        setNodes((previousNodes) =>
            previousNodes.map((node) =>
                node.id === 'root'
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            label: userName,
                            description: `${formatCompactNumber(creditsUsed)} credits used`,
                        },
                    }
                    : node
            )
        );
    }, [userName, creditsUsed]);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node<NodeData>>[]) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        []
    );

    return {
        nodes,
        setNodes,
        onNodesChange,
    };
}

export default useUserItem;
