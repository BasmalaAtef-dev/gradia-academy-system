import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--color-text)',
        color: 'var(--color-text-inverse)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--fs-xs)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ opacity: 0.7, marginBottom: 2 }}>{label}</div>
      <strong>{payload[0].value}%</strong> average
    </div>
  );
}

export function PerformanceTrendChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C9CF" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#00C9CF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#D9E7E8" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#D9E7E8' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          domain={[50, 100]}
          width={36}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="average"
          stroke="#00979B"
          strokeWidth={2.5}
          fill="url(#trendFill)"
          dot={{ r: 3, fill: '#00979B', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
