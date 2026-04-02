import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Hero */}
      <section className="w-full py-16 px-4 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/logo/e-no-bg.png"
              alt="Eventro Logo"
              width={90}
              height={90}
              className="rounded-xl"
            />
          </div>

          <h1 className="text-4xl font-bold text-slate-900">
            About <span className="text-emerald-600">Eventro</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Eventro is a modern event management platform designed to make event
            discovery, participation, and hosting simple, fast, and enjoyable.
            Whether you are organizing a conference, concert, workshop, or
            private gathering — Eventro helps you manage everything smoothly.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="w-full py-14 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Our mission is to empower event organizers and attendees by
              providing a clean, secure, and feature-rich platform where events
              can be created, managed, and enjoyed without hassle.
            </p>

            <p className="text-slate-600 leading-relaxed">
              We believe that every event should feel seamless — from ticketing
              to payments, from invitations to participation tracking.
            </p>
          </div>

          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Why Eventro?
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex gap-2 items-start">
                  <Sparkles className="h-5 w-5 text-sky-600 mt-0.5" />
                  Simple and modern UI for both users and admins
                </li>
                <li className="flex gap-2 items-start">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                  Secure authentication and payment-ready integration
                </li>
                <li className="flex gap-2 items-start">
                  <CalendarCheck className="h-5 w-5 text-sky-600 mt-0.5" />
                  Smart event participation tracking system
                </li>
                <li className="flex gap-2 items-start">
                  <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                  Public & private events with invitation support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-14 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              What We Offer
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Eventro is built to handle both small and large-scale events with
              smooth user experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-slate-900">
                  Event Hosting
                </h3>
                <p className="text-sm text-slate-600">
                  Create events with full details, rules, fee type, and visibility.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-slate-900">
                  Event Discovery
                </h3>
                <p className="text-sm text-slate-600">
                  Browse and join public events easily with clean filtering.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-slate-900">
                  Secure Payments
                </h3>
                <p className="text-sm text-slate-600">
                  Integrated payment system for paid events with transaction tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-slate-900">
                  Admin Dashboard
                </h3>
                <p className="text-sm text-slate-600">
                  Powerful management dashboard for events, payments, and users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Eventro. All rights reserved.
      </footer>
    </main>
  );
}