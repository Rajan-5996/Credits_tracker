import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { DataflowRecord } from "@/types/details_type";
import {
    Database,
    GitBranch,
    Clock,
    CalendarClock,
    FileText,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Lineage from "./Lineage";

export function DataflowDetailDialog({
    data,
}: Readonly<{ data: DataflowRecord }>) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const lastExecutedLabel = data.last_executed_date
        ? new Date(data.last_executed_date).toLocaleString()
        : "N/A";

    const lastUpdatedLabel = data.last_updated_date
        ? new Date(data.last_updated_date).toLocaleString()
        : "N/A";

    const fields = [
        { label: "Inputs", value: data.inputs, icon: <Database size={12} className="text-primary" /> },
        { label: "Outputs", value: data.outputs, icon: <GitBranch size={12} className="text-primary" /> },
        { label: "Last Run", value: lastExecutedLabel, icon: <Clock size={12} className="text-primary" /> },
        { label: "Updated", value: lastUpdatedLabel, icon: <CalendarClock size={12} className="text-primary" /> },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex cursor-pointer items-center px-3 py-1.5 text-sm font-semibold text-primary transition hover:underline">
                    View Details
                </div>
            </DialogTrigger>

            <DialogContent className="flex max-h-[82vh] w-[96vw] max-w-[96vw] flex-col overflow-hidden rounded-2xl border border-black/8 bg-white p-0 shadow-lg sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">

                <DialogHeader className="shrink-0 border-b border-[#f0eef5] px-6 py-5">
                    <div className="min-w-0">
                        <DialogTitle className="truncate text-[17px] font-bold leading-snug tracking-tight text-foreground">
                            {data.display_name}
                        </DialogTitle>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            {data.type}&nbsp;&nbsp;·&nbsp;&nbsp;Last run {lastExecutedLabel}
                        </p>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                    <TabsList className="shrink-0 justify-start gap-0 rounded-none border-b border-[#f0eef5] bg-transparent px-6 pb-0 pt-0 h-auto">
                        {["overview", "lineage"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="h-auto rounded-none border-b-2 border-transparent px-0 py-2.5 mr-5 text-[13px] font-medium capitalize text-muted-foreground shadow-none transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:font-semibold"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent
                        value="overview"
                        className="mt-0 min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        <div className="divide-y divide-[#f5f3fa]">
                            {fields.map(({ label, value, icon }) => (
                                <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                                    <div className="flex w-24 shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                                        {icon}
                                        {label}
                                    </div>
                                    <span className="text-right text-[13px] font-medium text-foreground">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="my-3 h-px bg-[#f0eef5]" />

                        <div>
                            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                                <FileText size={12} className="text-primary" />
                                Description
                            </div>
                            <p className="text-[12.5px] leading-relaxed text-foreground/75">
                                {data.description || "No description available."}
                            </p>
                        </div>

                        <a
                            href={data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition hover:opacity-70"
                        >
                            <ExternalLink size={12} />
                            Open in Domo
                        </a>
                    </TabsContent>

                    <TabsContent
                        value="lineage"
                        className="mt-0 min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        <Lineage dataflowId={Number(data.id)} isActive={open && activeTab === "lineage"} />
                    </TabsContent>
                </Tabs>

                <div className="shrink-0 border-t border-[#f0eef5] px-6 py-3 flex justify-end">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-lg border-primary/20 px-4 text-[13px] font-medium text-primary hover:bg-primary/5 hover:text-primary"
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog >
    );
}
