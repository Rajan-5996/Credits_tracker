import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import type { DatasetDetailDialogProps } from "./types";
import { BoolChip, Row, Section, StatusBadge, formatDate } from "./utils";

export function DatasetDetailDialogContent({ data }: DatasetDetailDialogProps) {
    return (
        <DialogContent className="sm:max-w-115 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border p-0 shadow-lg">
            <div className="border-b border-border bg-card px-6 py-5">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                    Dataset
                </p>

                <h2 className="text-lg font-semibold leading-tight text-foreground">
                    {data.Name || "Unnamed Dataset"}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(data.Created_Date)}</span>
                    {data.Data_Provider && (
                        <>
                            <span className="opacity-50">•</span>
                            <span>{data.Data_Provider}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="border-b border-border bg-muted/40 px-6 py-4">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Cards", value: data.Cards_Powered ?? 0 },
                        { label: "Import", value: data.Import_Type ?? "—" },
                        { label: "Source", value: data.Source_Type ?? "—" },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="rounded-lg border border-border bg-background px-3 py-2.5 shadow-sm"
                        >
                            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-1 truncate text-sm font-semibold text-foreground">
                                {label === "Cards" ? Number(value) : value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background px-6 py-4">
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
