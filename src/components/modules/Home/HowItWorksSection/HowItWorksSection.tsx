"use client";
 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ArrowRight,
  Search,
  UserCheck,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
 
const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover Events",
    description:
      "Browse hundreds of events by category, date, or location. Filter by free or paid, public or private.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Join or Request",
    description:
      "Join free public events instantly. Request to join private ones or pay for exclusive access.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Attend & Enjoy",
    description:
      "Get notified, show up, and connect with other attendees. Share your experience with a review.",
    color: "bg-emerald-50 text-emerald-600",
  },
];
 
export default function HowItWorksSection() {
  return (
    <section className="rounded-2xl border bg-card p-8 sm:p-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          How It Works
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Three steps to your next event
        </h2>
        <p className="text-muted-foreground text-sm">
          Whether you're a host or an attendee, Eventro makes it effortless to
          create memories.
        </p>
      </div>
 
      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-4">
            <div className="relative">
              <div className={`rounded-2xl p-4 ${s.color}`}>
                <s.icon className="h-7 w-7" />
              </div>
              <span className="absolute -top-2 -right-2 text-[10px] font-bold text-muted-foreground/50">
                {s.step}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
 
      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
          <Link href="/events">
            Browse Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
          <Link href="/dashboard/my-events/create">
            <CalendarDays className="h-4 w-4" />
            Create an Event
          </Link>
        </Button>
      </div>
    </section>
  );
}