import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import type { DatasetDetailDialogProps } from "./types";
import { BoolChip, Row, Section, StatusBadge, formatDate } from "./utils";

export function DatasetDetailDialogContent({ data }: DatasetDetailDialogProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "cards">("overview");

    return (
        <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-225 lg:max-w-275 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border p-0 shadow-lg">

            <div className="border-b border-border bg-card px-6 py-5">
                <DialogTitle className="text-lg font-semibold leading-tight text-foreground">
                    {data.Name || "Unnamed Dataset"}
                </DialogTitle>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(data.Created_Date)}</span>
                    {data.Data_Provider && (
                        <>
                            <span className="opacity-50">•</span>
                            <span>import : {data.Data_Provider}</span>
                        </>
                    )}

                    {data.Source_Type && (
                        <>
                            <span className="opacity-50">•</span>
                            <span>source : {data.Source_Type}</span>
                        </>
                    )}

                    {
                        data.Cards_Powered !== undefined && (
                            <>
                                <span className="opacity-50">•</span>
                                <span>cards : {Number(data.Cards_Powered)}</span>
                            </>
                        )
                    }
                </div>
            </div>

            <div className="flex border-b border-border px-6">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-3 mr-6 text-sm font-medium transition ${activeTab === "overview"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Overview
                </button>

                <button
                    onClick={() => setActiveTab("cards")}
                    className={`py-3 text-sm font-medium transition ${activeTab === "cards"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Powered Cards
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {activeTab === "overview" ? (
                    <>
                        <Section title="Overview">
                            <div className="flex items-center justify-between px-3 py-2.5">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge status={data.Status} />
                            </div>
                            <Row label="Last Run" value={formatDate(data.Last_Run_Date)} />
                            <Row label="Schedule" value={data.Schedule} />
                        </Section>

                        <Section title="Infrastructure">
                            <Row label="Warehouse" value={data.Data_Warehouse} />
                            <Row label="Engine" value={data.Cloud_Engine} />
                            <Row label="Account ID" value={data.Account_ID} />
                        </Section>

                        <Section title="Settings">
                            <BoolChip value={data.PDP_Enabled} label="PDP Enabled" />
                            <BoolChip value={data.Shared} label="Shared" />
                        </Section>

                        {data.Link && (
                            <Section title="Link">
                                <div className="flex items-center gap-2 px-3 py-2.5">
                                    <code className="flex-1 truncate rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                                        {data.Link}
                                    </code>

                                    <a
                                        href={data.Link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Open
                                    </a>
                                </div>
                            </Section>
                        )}
                    </>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Powered cards content goes here...
                    </div>
                )}
            </div>

            <DialogFooter className="flex items-center justify-between border-t border-border bg-background px-6 py-3">
                <p className="text-xs text-muted-foreground">
                    ID <span className="font-mono text-foreground">{data.ID}</span>
                </p>

                <DialogClose asChild>
                    <Button variant="outline" size="sm" className="rounded-lg px-4 text-xs">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}