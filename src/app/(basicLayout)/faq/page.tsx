import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const faqs = [
    { question: "How do I host an event?", answer: "Once you create an account, you can quickly navigate to the 'Create Event' section from your dashboard, fill out the basic event details and publish it. It's fully functional within minutes." },
    { question: "Are payments completely secure?", answer: "Yes. All payments on the platform are handled strictly and securely via modern certified protocols. Eventro does not store your direct card credentials." },
    { question: "Can I make a private event?", answer: "Absolutely. When creating an event, you can set its visibility to 'Private', allowing only users with your directed invitation link to join or view the details." },
    { question: "What are the fees for paid events?", answer: "Eventro charges a standard nominal platform fee on all ticket sales. Creating public free events, however, remains 100% free forever." },
    { question: "How can I refund a purchased ticket?", answer: "Ticket refunds are generally handled directly by the event organizer. Please reach out to them via the platform. If the event gets cancelled, Eventro will issue automated refunds." },
    { question: "How do I scan attendee tickets?", answer: "As an admin/organizer, you can download the participant list from your dashboard. Future companion apps will support direct QR Code scanning capabilities." },
  ];

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
            Frequently Asked <span className="text-sky-600">Questions</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            Have questions? We&apos;re here to help. Find all the answers you need about hosting, booking, and managing events at Eventro.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="w-full py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full space-y-1">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-semibold text-slate-800 text-lg hover:text-sky-600 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed text-base pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Contact Banner */}
      <section className="w-full py-12 px-4 mb-8">
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100">
               <MessageSquare className="h-6 w-6 text-sky-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Still have questions?</h2>
          <p className="text-slate-600 mb-6">
            If you couldn&apos;t find what you were looking for, our support team is ready to help.
          </p>
          <Button asChild size="lg" className="px-8 shadow-md">
             <Link href="/contact-us">
                <Mail className="mr-2 h-4 w-4" /> Contact Support
             </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Eventro. All rights reserved.
      </footer>
    </main>
  );
}
