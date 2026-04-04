import { Loader2 } from "@/components";
import { nodeTypes } from "@/components/custom_node/user_nodes/root_node";
import { AppContext } from "@/context/appContext";
import useUserItem from "@/hooks/useUserItem";
import { Background, BackgroundVariant, ReactFlow, type ReactFlowInstance } from "@xyflow/react";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"

const UserItems = () => {
    const { userId } = useParams();
    const flowRef = useRef<ReactFlowInstance<any, any> | null>(null);
    const app = useContext(AppContext);

    const { nodes, edges, onNodesChange } = useUserItem(Number(userId));

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

    return (
        <div style={{ width: '100%', height: '100vh', background: 'transparent', display: 'block' }}>
            <ReactFlow
                onInit={(instance) => {
                    flowRef.current = instance;
                }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2, duration: 0 }}
                nodeTypes={nodeTypes}
            >
                <Background
                    color="#7030B1"
                    variant={BackgroundVariant.Cross}
                    style={{ opacity: 0.12 }}
                />
            </ReactFlow>
        </div>
    )
}

export default UserItems
