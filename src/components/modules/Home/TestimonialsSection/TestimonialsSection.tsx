import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah Jenkins", role: "Event Organizer", text: "Eventro made tracking our conferences easier than ever. The sales analytics singlehandedly boosted our revenue.", image: "/avatars/01.png" },
    { name: "Alex Chen", role: "Attended ReactConf", text: "I love discovering new tech meetups through this platform. Booking is literally a 1-click process.", image: "/avatars/02.png" },
    { name: "Emily Watson", role: "Community Manager", text: "The cleanest UI I've seen in an event platform. Our community adoption rate tripled after we moved to Eventro.", image: "/avatars/03.png" },
  ];

  return (
    <section className="py-20 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Trusted by Thousands</h2>
          <p className="mt-4 text-lg text-muted-foreground">Don&apos;t just take our word for it—see what our creators and attendees have to say.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-2xl border bg-card relative shadow-sm hover:shadow-md transition">
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
