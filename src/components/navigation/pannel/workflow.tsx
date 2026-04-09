import type { WorkflowRecord } from "@/types/details_type";

const Workflow = ({ data, status }: { data: WorkflowRecord; status: "active" | "inactive" }) => {
    return (
        <div>
            workflow - Status: {status} {JSON.stringify(data)}
        </div>
    )
}

export default Workflow

