import { useState } from "react";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import type { DatasetDetailDialogProps } from "./types";
import { BoolChip, Section, StatusBadge, formatDate } from "./utils";
import PoweredCard from "@/components/navigation/pannel/powered_card";
import { motion, AnimatePresence } from "framer-motion";

export function DatasetDetailDialogContent({ data }: DatasetDetailDialogProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "cards">("overview");

    return (
        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[750px] lg:max-w-[1000px] flex h-[90vh] flex-col overflow-hidden rounded-[2rem] border border-primary/10 p-0 shadow-2xl bg-white">

            <div className="border-b border-primary/5 bg-white px-10 py-8 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 gwc-gradient" />
                
                <div className="flex items-start justify-between">
                    <div>
                        <DialogTitle className="text-2xl font-black text-foreground font-heading tracking-tight leading-none capitalize">
                            {data.Name || "Unnamed Dataset"}
                        </DialogTitle>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-black text-primary/40 capitalize tracking-[0.15em]">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/5 italic">
                                {formatDate(data.Created_Date)}
                            </span>
                            {data.Data_Provider && (
                                <>
                                    <span className="opacity-30">•</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/5">
                                        Provider: <span className="text-primary">{data.Data_Provider}</span>
                                    </span>
                                </>
                            )}

                            {data.Import_Type && (
                                <>
                                    <span className="opacity-30">•</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/5">
                                        Source: <span className="text-primary">{data.Import_Type}</span>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {data.Cards_Powered !== undefined && (
                        <div className="hidden sm:flex flex-col items-center p-3 rounded-2xl bg-primary/5 border border-primary/10">
                            <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest mb-1">Impact</span>
                            <span className="text-xl font-black text-primary leading-none">{Number(data.Cards_Powered)}</span>
                            <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest mt-1">Cards</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex border-b border-primary/5 px-10 bg-secondary/5">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-5 mr-10 text-[11px] font-black capitalize tracking-[0.2em] transition-all relative group ${activeTab === "overview"
                        ? "text-primary"
                        : "text-primary/40 hover:text-primary/60"
                        }`}
                >
                    Overview
                    {activeTab === "overview" ? (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 gwc-gradient rounded-t-full" />
                    ) : (
                        <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-primary/20 transition-all rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("cards")}
                    className={`py-5 text-[11px] font-black capitalize tracking-[0.2em] transition-all relative group ${activeTab === "cards"
                        ? "text-primary"
                        : "text-primary/40 hover:text-primary/60"
                        }`}
                >
                    Dataset Lineage
                    {activeTab === "cards" ? (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 gwc-gradient rounded-t-full" />
                    ) : (
                        <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-primary/20 transition-all rounded-t-full" />
                    )}
                </button>
            </div>

            <div className={`flex-1 min-h-0 relative ${activeTab === "overview" ? "overflow-y-auto px-10 py-8 custom-scrollbar" : "overflow-hidden p-0"}`}>
                <AnimatePresence mode="wait">
                    {activeTab === "overview" ? (
                        <motion.div 
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <Section title="Operational Status">
                                <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-primary/5 shadow-sm hover:border-primary/20 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[11px] font-black text-primary/60 capitalize tracking-widest">Global Synchronization</span>
                                    </div>
                                    <StatusBadge status={data.Status} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/5">
                                        <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Last execution</span>
                                        <span className="text-xs font-bold text-foreground">{formatDate(data.Last_Run_Date)}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/5">
                                        <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Refresh schedule</span>
                                        <span className="text-xs font-bold text-foreground">{data.Schedule || "Manual triger"}</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Technical Infrastructure">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl border border-primary/5 hover:border-primary/10 transition-all">
                                        <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Warehouse</span>
                                        <span className="text-[13px] font-bold text-foreground truncate block">{data.Data_Warehouse || "Internal"}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-primary/5 hover:border-primary/10 transition-all">
                                        <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Compute engine</span>
                                        <span className="text-[13px] font-bold text-foreground truncate block">{data.Cloud_Engine || "Standard"}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-primary/5 hover:border-primary/10 transition-all">
                                        <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Account identifier</span>
                                        <span className="text-[13px] font-bold text-foreground font-mono truncate block">{data.Account_ID || "---"}</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Governance Protocol">
                                <div className="flex gap-4 p-6 bg-primary/5 rounded-[1.5rem] border border-primary/5">
                                    <BoolChip value={data.PDP_Enabled} label="PDP isolation" />
                                    <BoolChip value={data.Shared} label="Public authority" />
                                </div>
                            </Section>

                            {data.Link && (
                                <Section title="Gateway Access">
                                    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border-2 border-primary/5 shadow-inner">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                        <code className="flex-1 truncate font-mono text-[11px] text-primary/60">
                                            {data.Link}
                                        </code>

                                        <a
                                            href={data.Link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 gwc-gradient text-white text-[10px] font-black capitalize tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all active:scale-95"
                                        >
                                            Launch Console
                                        </a>
                                    </div>
                                </Section>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="lineage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <PoweredCard datasetId={String(data.ID)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <DialogFooter className="flex items-center justify-between border-t border-primary/5 bg-secondary/10 px-10 py-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] leading-none">Security context:</span>
                    <span className="font-mono text-[11px] font-bold text-primary/70 bg-white px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">{data.ID}</span>
                </div>

                <DialogClose asChild>
                    <button className="px-10 py-3 rounded-full bg-white border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-md active:scale-95">
                        Terminate Session
                    </button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

