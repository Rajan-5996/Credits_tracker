import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Dataset from "../../navigation/pannel/dataset";
import { DatasetDetailDialogContent } from "./dialog-content";
import type { DatasetDetailDialogProps } from "./types";

export function DatasetDetailDialog({ data }: DatasetDetailDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full text-left transition hover:opacity-80">
                    <Dataset data={data} />
                </button>
            </DialogTrigger>

            <DatasetDetailDialogContent data={data} />
        </Dialog>
    );
}
