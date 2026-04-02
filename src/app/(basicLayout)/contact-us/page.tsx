import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
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
                        Contact <span className="text-sky-600">Eventro</span>
                    </h1>

                    <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
                        Need help or want to know more about Eventro?
                        This page provides official contact and support information.
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="w-full py-14 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Text */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900">
                            We’re Here to Help
                        </h2>

                        <p className="text-slate-600 leading-relaxed">
                            Eventro is designed to provide a smooth experience for event
                            organizers and participants. If you have any questions regarding
                            events, payments, invitations, or platform usage — feel free to
                            reach out through our official channels.
                        </p>

                        <p className="text-slate-600 leading-relaxed">
                            For security issues or payment disputes, we recommend contacting
                            support as soon as possible.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid gap-4">
                        <Card className="rounded-2xl border border-slate-200 shadow-sm">
                            <CardContent className="p-6 flex items-start gap-4">
                                <Phone className="h-6 w-6 text-emerald-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">Phone Support</h3>
                                    <p className="text-sm text-slate-600">
                                        Available during business hours (Bangladesh time).
                                    </p>
                                    <p className="text-sm font-medium text-slate-800 mt-1">
                                        +880 1XXXXXXXXX
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-slate-200 shadow-sm">
                            <CardContent className="p-6 flex items-start gap-4">
                                <Globe className="h-6 w-6 text-sky-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">Website</h3>
                                    <p className="text-sm text-slate-600">
                                        Visit our official platform anytime.
                                    </p>
                                    <p className="text-sm font-medium text-slate-800 mt-1">
                                        www.eventro.com
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-slate-200 shadow-sm">
                            <CardContent className="p-6 flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-emerald-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">Office Address</h3>
                                    <p className="text-sm text-slate-600">
                                        Dhaka, Bangladesh
                                    </p>
                                    <p className="text-sm font-medium text-slate-800 mt-1">
                                        Corporate Support Center
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-slate-50">
                            <CardContent className="p-6 flex items-start gap-4">
                                <ShieldCheck className="h-6 w-6 text-sky-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Payment & Security
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Eventro uses secure payment gateway integrations and ensures
                                        transaction verification for all paid events.
                                    </p>
                                </div>
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