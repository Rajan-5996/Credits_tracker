import { DataflowDetailDialog } from "@/components/dialog/dataflow-detail";
import { DataflowLineageContext } from "@/context/dataflow_lineage";
import type { DataflowRecord } from "@/types/details_type";
import { useContext, useEffect } from "react";

const Dataflow = ({
    data,
    status,
}: {
    data: DataflowRecord;
    status: "active" | "inactive";
}) => {
    const dataflow = useContext(DataflowLineageContext);
    const lastRunLabel = data.last_executed_date
        ? new Date(data.last_executed_date).toLocaleString()
        : "N/A";

    useEffect(() => {
        console.log(dataflow?.getLineageData(Number(data?.id)));
    }, [dataflow])

    return (
        <div className="w-full max-w-sm rounded border bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 w-57.5 truncate">
                        {data.display_name}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                        Last Run:{" "}
                        {lastRunLabel}
                    </div>
                </div>

                <div
                    className={`flex items-center gap-1 text-xs`}
                >
                    {status}
                </div>
            </div>

            <div className="flex justify-end w-full mt-4">
                <DataflowDetailDialog data={data} />
            </div>

            {/* <a
                href={data.link}
                target="_blank"
                className="flex items-center justify-end mt-3 text-xs text-blue-600 hover:underline"
            >
                View Details <span className="ml-1"><ChevronRight size={12} /></span>
            </a> */}
        </div>
    );
};

export default Dataflow;
