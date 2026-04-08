import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, ShieldAlert, BadgeCheck } from "lucide-react";
import Image from "next/image";

export default function TermsPage() {
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
            Terms of <span className="text-emerald-600">Service</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Please read these terms carefully before using Eventro. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <BadgeCheck className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl font-semibold text-slate-900">Platform Usage</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Eventro provides a platform for organizing and attending events. Users are strictly prohibited from using the platform to host illegal, offensive, or hazardous events. We reserve the right to suspend any account that violates our community standards.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-semibold text-slate-900">Payments & Refunds</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  All ticket purchases for paid events are securely processed. Refund policies are strictly dictated by the individual event organizers. Eventro is not directly liable for refunds unless an event is permanently cancelled without organizer recourse.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <ScrollText className="h-6 w-6 text-slate-700" />
                  <h2 className="text-2xl font-semibold text-slate-900">Account Responsibilities</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  You are fully responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access to your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Eventro. All rights reserved.
      </footer>
    </main>
  );
}
