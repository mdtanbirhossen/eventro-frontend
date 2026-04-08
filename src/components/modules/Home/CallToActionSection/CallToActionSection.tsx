import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="py-20 mt-10 mb-10">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] bg-linear-to-br from-[#1F84BC] via-[#36B8C2] to-[#62A83D] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Ready to host your own event?</h2>
            <p className="text-lg md:text-xl font-medium text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of organizers creating incredible experiences today. Setup takes exactly 2 minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
                <Link href="/register">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
