import ApexCharts, { type ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";

const ChartInitializer = ({
  options,
  loading,
  height = "100%"
}: {
  options?: ApexOptions;
  loading: boolean;
  height?: string | number;
}) => {
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

    // Ensure height is set in options
    const updatedOptions = {
      ...options,
      chart: {
        ...options.chart,
        height: height
      }
    };

    const chart = new ApexCharts(chartRef.current, updatedOptions);
    instanceRef.current = chart;
    chart.render();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null as any;
      }
    };
  }, [options, height]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-primary/40 animate-pulse text-xs font-semibold">Loading data...</div>
      </div>
    );
  }

  return <div ref={chartRef} style={{ minHeight: height }}></div>;
}

export default ChartInitializer


