"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const activityData = [
  { name: 'Mon', joined: 1 },
  { name: 'Tue', joined: 0 },
  { name: 'Wed', joined: 2 },
  { name: 'Thu', joined: 1 },
  { name: 'Fri', joined: 3 },
  { name: 'Sat', joined: 4 },
  { name: 'Sun', joined: 2 }
];

const statusData = [
  { name: 'Approved', value: 15 },
  { name: 'Pending', value: 4 },
  { name: 'Rejected', value: 1 },
];
const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export function UserCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-8">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold mb-4">Activity (This Week)</h2>
        <div className="h-[300px] w-full text-foreground text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="currentColor" opacity={0.5} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} stroke="currentColor" opacity={0.5} />
              <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }} />
              <Bar dataKey="joined" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-base font-semibold mb-4">Join Status Overview</h2>
        <div className="h-[300px] w-full flex items-center justify-center text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
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
