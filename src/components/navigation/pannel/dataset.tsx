import { getDatasetCoverImage } from "@/components/helpers/dataset_image_provider";
import type { DatasetRecord } from "@/types/details_type";

const Dataset = ({ data }: { data: DatasetRecord }) => {
    const createdDate = data.Created_Date
        ? new Date(data.Created_Date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "Unknown";

    const statusLabel = data.Status || "Unknown Status";
    const normalizedStatus = statusLabel.trim().toLowerCase();

    const cardBgClassName =
        normalizedStatus === "success"
            ? "bg-emerald-50"
            : normalizedStatus === "active"
                ? "bg-sky-50"
                : normalizedStatus === "error"
                    ? "bg-rose-50"
                    : normalizedStatus === "idle"
                        ? "bg-amber-50"
                        : "bg-card";

    return (
        <div className="space-y-3">
            <div className={`rounded border border-border p-4 ${cardBgClassName}`}>
                <div className="flex items-start gap-3">
                    <img className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-border bg-background/80 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70" src={getDatasetCoverImage(data.Import_Type)} alt={data.Name} />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{data.Name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {createdDate} | {Number.parseInt((data.Cards_Powered)?.toString() ?? "0") ?? 0} Cards Powered |{" "}
                            <span className={`rounded px-2 py-0.5 font-semibold text-foreground`}>{statusLabel}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dataset;