import { AppContext } from "@/context/appContext";
import { useContext, useEffect, useState } from "react";
import { TbUsersGroup } from "react-icons/tb";

const TotalUsersKpi = () => {
    const app = useContext(AppContext);
    const [usersCount, setUsersCount] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            const data = await app?.userTableData();
            if (isMounted && data) {
                setUsersCount(data.length);
            }
        };

        void fetchUsers();
        return () => { isMounted = false; };
    }, [app]);

    return (
        <div className="relative h-60 w-full min-w-80 rounded-sm bg-white border border-gray-300 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-start gap-4 w-full">
                <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center border border-slate-200 p-2 shrink-0">
                    <TbUsersGroup size={24} className="text-slate-600" />
                </div>

                <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                    <h2 className="text-base font-bold text-slate-800 leading-tight truncate">
                        Total Users
                    </h2>

                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-sm" />
                        <p className="text-xs font-semibold text-slate-500 truncate">
                            Active Tracked Users
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col relative mt-auto border-t border-gray-100 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                    Total Monitored
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="text-[#1a73e8] text-4xl font-bold tracking-tight">
                        {usersCount}
                    </span>
                    <span className="text-[#1a73e8] text-sm font-medium">
                        Users
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TotalUsersKpi;
