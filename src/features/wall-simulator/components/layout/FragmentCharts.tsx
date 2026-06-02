import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import type { WallFragment } from '../../domain/wall.types.ts';

interface FragmentChartsProps {
  fragments: WallFragment[];
}

export function FragmentCharts({ fragments }: FragmentChartsProps) {
  // Data prep
  const data = fragments.map(f => ({
    name: f.label.replace('Fragmento ', 'F'), // short label
    fullName: f.label,
    fs: Math.min(f.safetyFactor, 10), // cap at 10 for chart readability
    utilization: f.utilizationRatio * 100, // percentage
    volume: f.volume,
    isCritical: f.isCritical
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Chart 1: Factor de Seguridad */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 font-sans text-center">
          Factor de Seguridad
        </h4>
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={100}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [Number(val).toFixed(2), 'FS']}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Bar dataKey="fs" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCritical ? '#ef4444' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Utilización */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4 font-sans text-center">
          Utilización de Capacidad (%)
        </h4>
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={100}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [`${Number(val).toFixed(1)}%`, 'Uso']}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCritical ? '#f97316' : '#14b8a6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Volumen */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-0 font-sans text-center">
          Distribución de Volumen
        </h4>
        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={100}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="volume"
                nameKey="name"
              >
                {data.map((entry, index) => {
                  const colors = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ec4899', '#64748b'];
                  return <Cell key={`cell-${index}`} fill={entry.isCritical ? '#ef4444' : colors[index % colors.length]} />;
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [`${Number(val).toFixed(2)} m³`, 'Volumen']}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
