import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    { question: "How do I host an event?", answer: "Once you create an account, you can quickly navigate to the 'Create Event' section from your dashboard, fill out the basic event details and publish it. It's fully functional within minutes." },
    { question: "Are payments completely secure?", answer: "Yes. All payments on the platform are handled strictly and securely via modern certified protocols. Eventro does not store your direct card credentials." },
    { question: "Can I make a private event?", answer: "Absolutely. When creating an event, you can set its visibility to 'Private', allowing only users with your directed invitation link to join or view the details." },
    { question: "What are the fees for paid events?", answer: "Eventro charges a standard nominal platform fee on all ticket sales. Creating public free events, however, remains 100% free forever." }
  ];

  return (
    <section className="py-20 mt-10 bg-muted/30 -mx-2 md:-mx-5 px-2 md:px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about Eventro and billing.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
