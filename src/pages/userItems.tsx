import { CustomPanel, Loader2 } from "@/components";
import { nodeTypes } from "@/components/custom_node/user_nodes/root_node";
import { AppContext } from "@/context/appContext";
import useUserItem from "@/hooks/useUserItem";
import { Background, BackgroundVariant, Panel, ReactFlow, type Node, type ReactFlowInstance } from "@xyflow/react";
import { useContext, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useParams } from "react-router-dom"

export interface UserNodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    value?: string;
    activeCount?: number;
    inactiveCount?: number;
    side?: "left" | "right";
}

const UserItems = () => {
    const { userId } = useParams();
    const flowRef = useRef<ReactFlowInstance<any, any> | null>(null);
    const app = useContext(AppContext);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const { nodes, edges, onNodesChange } = useUserItem(Number(userId));

    const selectedNode = useMemo(() => {
        return nodes.find((node) => node.id === selectedNodeId) as Node<UserNodeData> | undefined;
    }, [nodes, selectedNodeId]);

    useEffect(() => {
        setSelectedNodeId(null);
    }, [userId]);

    useEffect(() => {
        if (!flowRef.current || nodes.length === 0) {
            return;
        }

        const frame = globalThis.requestAnimationFrame(() => {
            flowRef.current?.fitView({ maxZoom: 1, padding: 0.2, duration: 0 });
        });

        return () => globalThis.cancelAnimationFrame(frame);
    }, [nodes.length]);

    if (app?.loader2) {
        return <Loader2 />
    }

    const handleNodeClick = (_event: MouseEvent, node: Node<UserNodeData>) => {
        if (node.id === "root") {
            setSelectedNodeId(null);
            return;
        }

        setSelectedNodeId(node.id);
    };

    return (
        <div style={{ width: '100%', height: '100vh', background: 'transparent', display: 'block' }}>
            <ReactFlow
                onInit={(instance) => {
                    flowRef.current = instance;
                }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeClick={handleNodeClick}
                onPaneClick={() => setSelectedNodeId(null)}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2, duration: 0 }}
                nodeTypes={nodeTypes}
            >
                <Background
                    color="#7030B1"
                    variant={BackgroundVariant.Cross}
                    style={{ opacity: 0.12 }}
                />
                <Panel position="top-left">
                    <CustomPanel selectedNode={selectedNode} setSelectedNodeId={setSelectedNodeId} userId={userId ?? ""} />
                </Panel>
            </ReactFlow>
        </div>
    )
}

export default UserItems

