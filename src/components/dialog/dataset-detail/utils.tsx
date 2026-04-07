import type { ReactNode } from "react";

function formatDate(value: string | null | undefined) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
}

function StatusBadge({ status }: { readonly status: string | null | undefined }) {
    const normalized = (status ?? "").toLowerCase();
    const isActive = normalized === "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${isActive ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-border bg-muted text-muted-foreground"}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-muted-foreground/50"}`}
            />
            {status ?? "Unknown"}
        </span>
    );
}

function BoolChip({
    value,
    label,
}: {
    readonly value: boolean | string | null | undefined;
    readonly label: string;
}) {
    const enabled = value === true || value === "true" || value === "1";

    return (
        <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${enabled ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}
            >
                {enabled ? "Enabled" : "Disabled"}
            </span>
        </div>
    );
}

function Row({
    label,
    value,
}: {
    readonly label: string;
    readonly value: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-right text-sm font-medium text-foreground">
                {value ?? "—"}
            </span>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    readonly title: string;
    readonly children: ReactNode;
}) {
    return (
        <div className="mt-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-primary/70">
                {title}
            </p>
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
                {children}
            </div>
        </div>
    );
}

export { BoolChip, Row, Section, StatusBadge, formatDate };
