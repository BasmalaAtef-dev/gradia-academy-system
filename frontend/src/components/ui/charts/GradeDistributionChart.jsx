import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#00C9CF', '#14B8A6', '#00979B', '#38BDF8', '#94D8CE'];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
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
      <div style={{ opacity: 0.7, marginBottom: 2 }}>Grade {item.label} ({item.band})</div>
      <strong>{item.count}</strong> students
    </div>
  );
}

export function GradeDistributionChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D9E7E8" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#D9E7E8' }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,201,207,0.06)' }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
