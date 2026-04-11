import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import { UserContext } from "@/context/currentUserContext";
import type { ApexOptions } from "apexcharts";
import { useContext, useEffect, useState } from "react";
import { TbChevronRight, TbTrendingDown } from "react-icons/tb";
import { formatCompactNumber } from "@/lib/utils";

const LowCreditUsage = () => {
    const [options, setOptions] = useState<ApexOptions | undefined>()
    const app = useContext(AppContext);
    const user = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;

        const loadLowCreditUsers = async () => {
            if (!app) return;

            const data = await app.lowCreditUsers();
            const categories = await Promise.all(
                data.map((item) => user?.getUserName(item.User_ID).then(name => name.split(' ')[0]) ?? Promise.resolve(item.User_ID))
            );
            const seriesData = data.map((item) => item.total_credits);

            if (!isMounted) return;

            setOptions({
                chart: {
                    type: "area",
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    animations: { enabled: false },
                    parentHeightOffset: 0,
                    sparkline: { enabled: false }
                },
                fill: {
                    type: "solid",
                    opacity: 0.05,
                },
                markers: {
                    size: 3,
                    colors: ["#fff"],
                    strokeColors: "#1a73e8",
                    strokeWidth: 2,
                    hover: { size: 5 },
                },
                grid: {
                    show: false,
                    padding: { top: 10, right: 0, bottom: 0, left: 10 }
                },
                stroke: {
                    curve: 'straight',
                    width: 2,
                    colors: ["#1a73e8"]
                },
                xaxis: {
                    categories,
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    crosshairs: { show: false }
                },
                yaxis: { show: false, labels: { show: false } },
                dataLabels: { enabled: false },
                tooltip: {
                    enabled: true,
                    theme: 'dark',
                    y: {
                        formatter: (val) => formatCompactNumber(val) + " Credits"
                    },
                    marker: { show: false }
                },
                series: [
                    {
                        name: "Usage",
                        data: seriesData,
                    },
                ],
            });
        };

        void loadLowCreditUsers();

        return () => { isMounted = false; };
    }, [app, user]);

    return (
        <div className="relative h-60 w-full min-w-80 rounded-sm bg-white border border-gray-300 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                        <TbTrendingDown size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 capitalize">Low Consumers</h2>
                        <p className="text-xs text-slate-500 font-medium">Minimal credit utilization</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 flex items-center gap-1 text-[#1a73e8] bg-blue-50 px-2 py-1 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wide">view</span>
                    <TbChevronRight className="text-sm" />
                </div>
            </div>

            <div className="flex-1 min-h-0 relative -mx-2 rounded-sm overflow-hidden mt-2">
                <ChartInitializer options={options} loading={app?.dataLoading || false} height={160} />
            </div>
        </div>
    )
}

export default LowCreditUsage;
