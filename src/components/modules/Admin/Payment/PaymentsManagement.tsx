"use client"
import { useAdminPayments } from "@/hooks/admin.hooks";
import { PaymentProvider, PaymentStatus } from "@/types/enums";
import { IPayment } from "@/types/payment.types";
import { CircleDollarSign, Eye, Search } from "lucide-react";
import { useState } from "react";
import SummaryCards from "./SummaryCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaymentDetailDialog, { formatCurrency, formatDate, PaymentStatusBadge, ProviderBadge, statusConfig } from "./PaymentDetailDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TableSkeleton from "../EventCategory/TableSkeleton";
import { Pagination } from "@/components/shared/Pagination/Pagination";

const PAGE_SIZE = 10;
 
export default function PaymentsManagement() {
  const { data, isLoading, isError } = useAdminPayments();
 
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [providerFilter, setProviderFilter] = useState<"ALL" | PaymentProvider>("ALL");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
 
  const allPayments = (data ?? []) as IPayment[];
 
  // ── Client-side filtering ──
  const filtered = allPayments.filter((p) => {
    const matchSearch =
      !search ||
      p.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase()) ||
      p.event.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.transactionId ?? "").toLowerCase().includes(search.toLowerCase());
 
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchProvider =
      providerFilter === "ALL" || p.provider === providerFilter;
 
    return matchSearch && matchStatus && matchProvider;
  });
 
  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
 
  const openDetail = (payment: IPayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };
 
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setProviderFilter("ALL");
    setPage(1);
  };
 
  const hasActiveFilter =
    search || statusFilter !== "ALL" || providerFilter !== "ALL";
 
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
          Payments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all transactions across the platform.
        </p>
      </div>
 
      {/* Summary cards */}
      {!isLoading && !isError && <SummaryCards payments={allPayments} />}
 
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user, event, transaction ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
 
        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as "ALL" | PaymentStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(PaymentStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
 
        {/* Provider filter */}
        <Select
          value={providerFilter}
          onValueChange={(v) => {
            setProviderFilter(v as "ALL" | PaymentProvider);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Providers</SelectItem>
            <SelectItem value={PaymentProvider.SSLCOMMERZ}>SSLCommerz</SelectItem>
            <SelectItem value={PaymentProvider.STRIPE}>Stripe</SelectItem>
          </SelectContent>
        </Select>
 
        {/* Clear filters */}
        {hasActiveFilter && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>
 
      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Event</TableHead>
              <TableHead className="w-30">Amount</TableHead>
              <TableHead className="w-27.5">Status</TableHead>
              <TableHead className="w-32.5">Provider</TableHead>
              <TableHead className="w-42.5">Paid At</TableHead>
              <TableHead className="w-15 text-right">Info</TableHead>
            </TableRow>
          </TableHeader>
 
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Failed to load payments. Please try again.
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  {hasActiveFilter
                    ? "No payments match your filters."
                    : "No payments found."}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((payment) => (
                <TableRow key={payment.id}>
                  {/* User */}
                  <TableCell>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate leading-none">
                        {payment?.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {payment?.user?.email}
                      </p>
                    </div>
                  </TableCell>
 
                  {/* Event */}
                  <TableCell>
                    <p className="text-sm truncate max-w-45">
                      {payment.event.title}
                    </p>
                  </TableCell>
 
                  {/* Amount */}
                  <TableCell className="text-sm font-medium tabular-nums">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
 
                  {/* Status */}
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
 
                  {/* Provider */}
                  <TableCell>
                    <ProviderBadge provider={payment.provider} />
                  </TableCell>
 
                  {/* Paid At */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(payment.paidAt)}
                  </TableCell>
 
                  {/* Detail */}
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openDetail(payment)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
 
        {/* Pagination footer */}
        {!isLoading && !isError && filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            showing={paginated.length}
            onPageChange={setPage}
            itemLabel="payments"
          />
        )}
      </div>
 
      {/* Detail Dialog */}
      <PaymentDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        payment={selectedPayment}
      />
    </div>
  );
}