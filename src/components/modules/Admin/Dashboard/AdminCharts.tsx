"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const data = [
  { name: 'Jan', events: 4, revenue: 1000 },
  { name: 'Feb', events: 3, revenue: 800 },
  { name: 'Mar', events: 5, revenue: 1200 },
  { name: 'Apr', events: 8, revenue: 1900 },
  { name: 'May', events: 6, revenue: 1500 },
  { name: 'Jun', events: 10, revenue: 2500 }
];

const pieData = [
  { name: 'Published', value: 400 },
  { name: 'Draft', value: 300 },
  { name: 'Completed', value: 300 },
  { name: 'Cancelled', value: 200 },
];
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-8">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold mb-4">Revenue Overview</h2>
        <div className="h-[300px] w-full text-foreground text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="currentColor" opacity={0.5} />
              <YAxis axisLine={false} tickLine={false} stroke="currentColor" opacity={0.5} />
              <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold mb-4">Event Status Distribution</h2>
        <div className="h-[300px] w-full flex items-center justify-center text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
