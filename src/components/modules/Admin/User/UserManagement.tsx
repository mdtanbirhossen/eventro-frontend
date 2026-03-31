"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers } from "@/hooks/admin.hooks";
import { IAdmin } from "@/types/admin.types";
import { Search, ShieldPlus, Users } from "lucide-react";
import { useState } from "react";
import AdminTableSkeleton from "./AdminTableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleBadge, StatusBadge } from "./StatusBadge";
import CreateAdminDialog from "./CreateAdminDialog";
import { Pagination } from "@/components/shared/Pagination/Pagination";


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


export default function UsersManagement() {
    const LIMIT = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
 
  const { data, isLoading, isError } = useUsers({
    page,
    limit: LIMIT,
    search: search || undefined,
  });

 
  // client-side role filter on top of server results
  const users = (data ?? []) as IAdmin[];
  const filtered =
    roleFilter === "ALL"
      ? users
      : users.filter((u) => u.role === roleFilter);
 
  const totalPages = Math.ceil((data?.meta as { total?: number })?.total ?? 0 / LIMIT);
 
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-muted-foreground" />
            Users & Admins
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all registered users and manage admin accounts.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setCreateAdminOpen(true)}
        >
          <ShieldPlus className="h-4 w-4" />
          New Admin
        </Button>
      </div>
 
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
 
        {/* Role filter */}
        <Select
          value={roleFilter}
          onValueChange={(v) =>
            setRoleFilter(v as "ALL" | "ADMIN" | "USER")
          }
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="USER">Users</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>
 
      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead className="w-25">Role</TableHead>
              <TableHead className="w-27.5">Status</TableHead>
              <TableHead className="w-40">Joined</TableHead>
            </TableRow>
          </TableHeader>
 
          <TableBody>
            {isLoading ? (
              <AdminTableSkeleton />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  Failed to load users. Please try again.
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  {search
                    ? `No users match "${search}"`
                    : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id} className="group">
                  {/* Name + email + avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="text-xs bg-muted">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
 
                  {/* Role */}
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
 
                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
 
                  {/* Joined date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
 
        {/* Pagination */}
        {!isLoading && !isError && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={data?.meta ? (data.meta as { total?: number })?.total ?? 0 : 0}
            showing={filtered.length}
            onPageChange={setPage}
            itemLabel="users"
          />
        )}
      </div>
 
      {/* Create Admin Dialog */}
      <CreateAdminDialog
        open={createAdminOpen}
        onOpenChange={setCreateAdminOpen}
      />
    </div>
  );
}
 