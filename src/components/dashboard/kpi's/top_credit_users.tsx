import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";

const TopCreditUsage = () => {
    const [options, setOptions] = useState<ApexOptions | null>(null)
    const app = useContext(AppContext);

    useEffect(() => {
        let isMounted = true;

        const loadTopUsers = async () => {
            if (!app) {
                return;
            }

            const data = await app.topCreditUsers();
            const categories = data.map((item) => item.User_ID);
            const seriesData = data.map((item) => item.total_credits);

            if (!isMounted) {
                return;
            }

            setOptions({
                chart: {
                    type: "bar",
                    toolbar: { show: false },
                },
                xaxis: {
                    categories,
                },
                colors: ["#d97706"],
                series: [
                    {
                        name: "Credits",
                        data: seriesData,
                    },
                ],
            });
        };

        void loadTopUsers();

        return () => {
            isMounted = false;
        };
    }, [app]);

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-96 rounded-2xl overflow-hidden border border-amber-200/60 bg-linear-to-br from-white via-amber-50/30 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
                {options && <ChartInitializer options={options} />}
            </div>
        </motion.div>
    )
}

export default TopCreditUsage
