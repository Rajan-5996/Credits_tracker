import type { JupyterWorkspaceRecord } from "@/types/details_type";

const JupyterWorkflows = ({ data }: { data: JupyterWorkspaceRecord }) => {
    return (
        <div>
            jupyter workspace {JSON.stringify(data)}
        </div>
    )
}

export default JupyterWorkflows
