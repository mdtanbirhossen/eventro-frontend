import { Card, CardContent } from "@/components/ui/card";
import { Lock, EyeOff, FileText } from "lucide-react";
import Image from "next/image";

export default function PrivacyPage() {
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
            Privacy <span className="text-sky-600">Policy</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information on the Eventro platform.
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
                  <FileText className="h-6 w-6 text-sky-600" />
                  <h2 className="text-2xl font-semibold text-slate-900">Data Collection</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We collect information necessary to provide our services, including your name, email address, payment details (processed securely via SSL), and event participation history. We do not sell your personal data to third parties.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <EyeOff className="h-6 w-6 text-slate-700" />
                  <h2 className="text-2xl font-semibold text-slate-900">Data Usage</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Your data is primarily used to process ticket bookings, send event updates through our notification pipeline, and improve our services. Publicly visible profile information is strictly limited to what you explicitly choose to share.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <Lock className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl font-semibold text-slate-900">Security</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  We implement robust enterprise industry-standard security protocols to protect your personal data from unauthorized access, alteration, disclosure, or destruction. We utilize token-based verification for all sensitive operations.
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
