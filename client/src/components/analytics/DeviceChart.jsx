import { PieChart, Pie, Cell } from "recharts";

const DEVICE_COLORS = ["#002F2D", "#FFB95F", "#BFC8C7"];

export default function DeviceChart({ data = [] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const chartData = data.map((d) => ({
    name: d._id ? d._id.charAt(0).toUpperCase() + d._id.slice(1) : "Unknown",
    value: Math.round((d.count / total) * 100),
    count: d.count,
  }));

  const topDevice = chartData[0] || { name: "—", value: 0 };

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Device Split
      </h3>
      <p className="text-xl font-headline text-foreground mb-6">
        Device Distribution
      </p>

      <div className="relative flex justify-center mb-5">
        <PieChart width={200} height={200}>
          <Pie
            data={chartData.length ? chartData : [{ name: "No data", value: 1 }]}
            cx={100}
            cy={100}
            innerRadius={62}
            outerRadius={90}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-headline italic text-primary leading-none">
            {topDevice.value}%
          </span>
          <span className="text-xs font-mono text-secondary mt-0.5">
            {topDevice.name}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
              />
              <span className="font-mono text-xs text-secondary">{d.name}</span>
            </div>
            <span className="font-mono text-xs text-foreground font-medium">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
