import { CustomPanel } from "@/components";
import { nodeTypes } from "@/components/custom_node/user_nodes/root_node";
import useUserItem from "@/hooks/useUserItem";
import { Panel, ReactFlow, type Node, type ReactFlowInstance, Background, BackgroundVariant, useNodesInitialized, ReactFlowProvider } from "@xyflow/react";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useParams } from "react-router-dom"
import { TbFocusCentered } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

const UserItemsContent = ({ userId }: { userId: string }) => {
    const flowRef = useRef<ReactFlowInstance<any, any> | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const nodesInitialized = useNodesInitialized();
    const [hasFitted, setHasFitted] = useState(false);

    const { nodes, edges, onNodesChange } = useUserItem(Number(userId));

    const selectedNode = useMemo(() => {
        return nodes.find((node) => node.id === selectedNodeId) as Node<any> | undefined;
    }, [nodes, selectedNodeId]);

    useEffect(() => {
        if (flowRef.current && nodesInitialized && !hasFitted && nodes.length > 0) {
            const timer = setTimeout(() => {
                flowRef.current?.fitView({ padding: 0.2, duration: 1000, maxZoom: 1 });
                setHasFitted(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [nodesInitialized, nodes.length, hasFitted]);

    const handleNodeClick = (_event: MouseEvent, node: Node<any>) => {
        if (node.id === "root") {
            setSelectedNodeId(null);
            return;
        }
        setSelectedNodeId(node.id);
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-background">
            <div className="flex-1 w-full relative z-10 bg-[#fafafc]/50">
                {nodes.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-black text-primary/40 capitalize tracking-[0.2em]">Synchronizing local node data...</p>
                    </div>
                ) : (
                    <ReactFlow
                        onInit={(instance) => {
                            flowRef.current = instance;
                        }}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onNodeClick={handleNodeClick}
                        onPaneClick={() => setSelectedNodeId(null)}
                        nodeTypes={nodeTypes}
                        minZoom={0.2}
                        maxZoom={2}
                        zoomOnScroll={true}
                        panOnScroll={false}
                        panOnDrag={true}
                    >
                        <Background
                            color="#6F2B8B"
                            gap={40}
                            size={1}
                            variant={BackgroundVariant.Dots}
                            style={{ opacity: 0.1 }}
                        />

                        <Panel position="top-right" className="m-4 z-[70]">
                            <button
                                onClick={() => {
                                    setHasFitted(false);
                                    flowRef.current?.fitView({ duration: 800, padding: 0.2 });
                                }}
                                className="h-10 px-6 rounded-full gwc-gradient text-[10px] font-black text-white capitalize tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <TbFocusCentered size={14} />
                                Auto Fit
                            </button>
                        </Panel>

                        <Panel position="top-left" className="!m-0 w-full sm:w-[450px] lg:w-[480px] pointer-events-none z-[70]">
                            <div className="pointer-events-auto mt-4 ml-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedNodeId || "default"}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <CustomPanel selectedNode={selectedNode} setSelectedNodeId={setSelectedNodeId} userId={userId ?? ""} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Panel>
                    </ReactFlow>
                )}
            </div>

            {/* Legend/Status bar */}
            <footer className="relative z-[60] bg-white/80 backdrop-blur-3xl border-t border-primary/5 px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--sidebar-primary)]" />
                        <span className="text-[10px] font-black text-primary capitalize tracking-widest">Master Node</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--sidebar-accent)]" />
                        <span className="text-[10px] font-black text-accent capitalize tracking-widest">Peripheral Node</span>
                    </div>
                </div>
                <p className="text-[10px] font-black text-primary/30 capitalize tracking-[0.3em] hidden sm:block">
                    Grid isolation protocol V.4.2 active | Adaptive viewport tracking
                </p>
            </footer>
        </div>
    );
};

const UserItems = () => {
    const { userId } = useParams();

    return (
        <ReactFlowProvider>
            <UserItemsContent userId={userId ?? ""} />
        </ReactFlowProvider>
    )
}

export default UserItems
