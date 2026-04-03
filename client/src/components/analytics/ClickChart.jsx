import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="bg-surface-container-lowest rounded-xl px-4 py-3 font-mono text-xs"
      style={{ boxShadow: "0 4px 20px rgba(0,47,45,0.12)" }}
    >
      <p className="text-secondary mb-1 uppercase tracking-widest">{label}</p>
      <p className="text-primary font-medium text-sm">
        {payload[0].value.toLocaleString()} clicks
      </p>
    </div>
  );
}

export default function ClickChart({ data = [] }) {
  const chartData = data.map((d) => ({
    date: d._id
      ? new Date(d._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : d.date,
    clicks: d.count ?? d.clicks ?? 0,
  }));

  const totalThisPeriod = chartData.reduce((s, d) => s + d.clicks, 0);

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-secondary">
            Click Performance
          </h3>
          <p className="text-2xl font-headline text-foreground mt-0.5">
            Weekly Overview
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary">
            This Period
          </p>
          <p className="text-lg font-headline text-primary">
            {totalThisPeriod.toLocaleString()} clicks
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: "clamp(240px, 30vw, 320px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#002F2D" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#002F2D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#BFC8C7"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "Geist Mono", fontSize: 11, fill: "#5F5E5E" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "Geist Mono", fontSize: 11, fill: "#5F5E5E" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#002F2D"
              strokeWidth={2}
              fill="url(#clickGradient)"
              dot={{ fill: "#FFB95F", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#FFB95F", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
