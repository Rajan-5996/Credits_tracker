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

    const statusLabel = data.Status || "Unknown";
    const normalizedStatus = statusLabel.trim().toLowerCase();

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "success":
            case "active":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "error":
            case "failed":
                return "bg-rose-50 text-rose-600 border-rose-100";
            case "idle":
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            default:
                return "bg-primary/5 text-primary/60 border-primary/10";
        }
    };

    return (
        <div className="group w-full glass-console rounded-[1.5rem] p-4 transition-all duration-300 hover:bg-white/60 border-none shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <img 
                        className="h-14 w-14 rounded-xl border border-primary/10 bg-white object-cover shadow-sm group-hover:scale-105 transition-transform" 
                        src={getDatasetCoverImage(data.Import_Type)} 
                        alt={data.Name} 
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-transparent shadow-sm flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${normalizedStatus === 'success' || normalizedStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-black text-foreground font-heading truncate leading-tight capitalize">
                        {data.Name || "Identity dataset"}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-primary/40 capitalize tracking-widest whitespace-nowrap">{createdDate}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-primary/10" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-primary tracking-tight">{Math.round(Number(data.Cards_Powered || 0))}</span>
                            <span className="text-[8px] font-black text-primary/30 capitalize tracking-widest leading-none">Cards powered</span>
                        </div>
                    </div>
                </div>

                <div className={`px-3 py-1.5 rounded-full text-[8px] font-black capitalize tracking-widest border ${getStatusStyles(normalizedStatus)}`}>
                    {statusLabel}
                </div>
            </div>
        </div>
    );
};

export default Dataset;
