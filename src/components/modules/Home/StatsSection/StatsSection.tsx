import { Users, CalendarCheck, Globe2, TicketCheck } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Events Hosted", value: "10K+", icon: CalendarCheck },
    { label: "Tickets Sold", value: "2M+", icon: TicketCheck },
    { label: "Countries", value: "15+", icon: Globe2 },
  ];

  return (
    <section className="py-20 mt-10 rounded-3xl bg-primary/5 dark:bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Our Global Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join the community that's reshaping how events are experienced around the world.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center p-6 border bg-card rounded-2xl shadow-sm text-center hover:-translate-y-1 transition duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
