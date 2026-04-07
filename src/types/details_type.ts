export interface DatasetRecord {
    ID: number;
    Name: string;
    Link: string;
    Owner_User_ID: string;
    Created_Date: string;
    Last_Run_Date: string | null;
    Status: string;
    Schedule: string | null;
    Import_Type: string | null;
    Data_Provider: string | null;
    Source_Type: string | null;
    Cards_Powered: number;
    PDP_Enabled: boolean;
    Shared: boolean;
    Account_ID: number;
    Data_Warehouse: string | null;
    Cloud_Engine: string | null;
}

export interface DataflowRecord {
    id: string;
    display_name: string;
    description: string | null;
    link: string;
    type: string;
    status: string;
    inputs: number;
    outputs: number;
    owner_id: string;
    current_version: number;
    last_executed_date: string | null;
    last_updated_date: string | null;
    last_updated_by: string | null;
}

export interface WorkflowRecord {
    workflow_name: string;
    workflow_version: string;
    model_id: string;
    created_by: string;
    owner: string;
    deployed_by: string | null;
    execution_id: string;
    workflow_status: string;
    trigger_name: string | null;
    trigger_type: string | null;
    trigger_id: string | null;
    started_by: string | null;
    start_time: string;
    end_time: string | null;
    updated_on: string | null;
    cycle_time: number | null;
    qualifying_tasks: number | null;
}

export interface JupyterWorkspaceRecord {
    workspace_id: string;
    name: string;
    description: string | null;
    created_date: string;
    owner: string;
    cpu_cores: number;
    memory: number;
}

export type unionDetailsType =
    | DatasetRecord
    | DataflowRecord
    | WorkflowRecord
    | JupyterWorkspaceRecord;