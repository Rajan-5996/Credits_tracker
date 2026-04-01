import ApexCharts, { type ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";

const ChartInitializer = ({ options, loading }: { options?: ApexOptions; loading: boolean }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<ApexCharts | null>(null);

  useEffect(() => {
    const hasValidConfig = !!options?.chart?.type && Array.isArray(options?.series);
    if (!chartRef.current || !hasValidConfig) {
      return;
    }

    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const chart = new ApexCharts(chartRef.current, options);
    instanceRef.current = chart;
    chart.render();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null as any;
      }
    };
  }, [options]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      ) : (
        <div ref={chartRef} className="min-h-64"></div>
      )}
    </div>
  );
}

export default ChartInitializer
