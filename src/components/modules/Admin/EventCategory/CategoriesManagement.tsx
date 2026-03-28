"use client";
 
import { useState } from "react";
import {
  useCategories
} from "@/hooks/admin.hooks";
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PencilLine,
  Trash2,
  Plus,
  Tag,
  Search,
} from "lucide-react";
import { IEventCategory } from "@/types/eventCategory.types";
import TableSkeleton from "./TableSkeleton";
import CategoryFormDialog from "./CategoryFormDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
 


export default function CategoriesManagementPage() {
  const { data: categories, isLoading, isError } = useCategories();
    console.log("categories fro categories management page", categories)
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<IEventCategory | null>(null);
 
  const filtered = (categories ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
 
  const openCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };
 
  const openEdit = (category: IEventCategory) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };
 
  const openDelete = (category: IEventCategory) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };
 
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage event categories visible across the platform.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>
 
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
 
      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-50">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-40">Created</TableHead>
              <TableHead className="w-30 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
 
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  Failed to load categories. Please try again.
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  {search
                    ? `No categories match "${search}"`
                    : "No categories yet. Create one to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-sm truncate">
                    {category.description ?? (
                      <span className="italic opacity-50">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(category)}
                        title="Edit"
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openDelete(category)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
 
        {/* Footer count */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {categories?.length ?? 0} categories
          </div>
        )}
      </div>
 
      {/* Dialogs */}
      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
    </div>
  );
}