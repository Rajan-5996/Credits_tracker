import type { DatasetRecord } from "@/types/details_type";

const Dataset = ({ data }: { data: DatasetRecord }) => {
    const createdDate = data.Created_Date
        ? new Date(data.Created_Date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Unknown";

    return (
        <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{data.Name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Created: {createdDate}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Cards Powered</span>
                        <p className="text-sm font-bold text-foreground mt-1">{Number.parseInt((data.Cards_Powered)?.toString() ?? "0") ?? 0}</p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status</span>
                        <p className="text-sm font-bold text-foreground mt-1">{data.Status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dataset;