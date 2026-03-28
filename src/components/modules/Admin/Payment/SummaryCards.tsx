import { PaymentStatus } from "@/types/enums";
import { IPayment } from "@/types/payment.types";
import { CircleDollarSign, Clock, CreditCard, TrendingUp } from "lucide-react";

export default function SummaryCards({ payments }: { payments: IPayment[] }) {
  const paid = payments.filter((p) => p.status === PaymentStatus.PAID);
  const pending = payments.filter((p) => p.status === PaymentStatus.UNPAID);
  const failed = payments.filter(
    (p) =>
      p.status === PaymentStatus.FAILED ||
      p.status === PaymentStatus.CANCELLED
  );
 
  const totalRevenue = paid
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toLocaleString("en-US", { minimumFractionDigits: 2 });
 
  const cards = [
    {
      label: "Total Revenue",
      value: `BDT ${totalRevenue}`,
      icon: CircleDollarSign,
      className: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Successful",
      value: paid.length,
      icon: TrendingUp,
      className: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: pending.length,
      icon: Clock,
      className: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Failed / Cancelled",
      value: failed.length,
      icon: CreditCard,
      className: "text-red-500",
      bg: "bg-red-50",
    },
  ];
 
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border bg-card p-4 flex items-center gap-4"
        >
          <div className={`rounded-md p-2 ${card.bg}`}>
            <card.icon className={`h-5 w-5 ${card.className}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-lg font-semibold leading-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}