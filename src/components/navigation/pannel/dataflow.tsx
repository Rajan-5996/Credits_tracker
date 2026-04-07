import type { DataflowRecord } from "@/types/details_type";

const Dataflow = ({ data, status }: { data: DataflowRecord; status: "active" | "inactive" }) => {
    return (
        <div>
            dataflow - Status: {status}     {JSON.stringify(data)}
        </div>
    )
}

export default Dataflow
