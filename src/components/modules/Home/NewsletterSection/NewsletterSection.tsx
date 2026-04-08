"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-20 mt-10 border-y bg-background relative overflow-hidden">
        {/* Background blobs for visual flavor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Mail className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Stay in the Loop</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Get weekly updates on the most exciting events happening around you. No spam, just great experiences.
        </p>
        <form 
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" 
            onSubmit={(e) => {
                e.preventDefault();
                toast.success("Successfully subscribed to the newsletter!");
                (e.target as HTMLFormElement).reset();
            }}
        >
          <Input type="email" placeholder="Enter your email address" required className="flex-1 bg-background" />
          <Button type="submit" size="lg">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
