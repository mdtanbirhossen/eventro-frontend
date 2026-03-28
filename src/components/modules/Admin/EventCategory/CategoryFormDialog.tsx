"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory, useUpdateCategory } from "@/hooks/admin.hooks";
import { IEventCategory } from "@/types/eventCategory.types";
import { CategoryFormValues, categorySchema } from "@/zod/eventCategory.validation";
import { useForm } from "@tanstack/react-form";
import { Tag } from "lucide-react";




export default function CategoryFormDialog({
    open,
    onOpenChange,
    category,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    category?: IEventCategory | null;
}) {
    const isEdit = !!category;
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const isPending = createMutation.isPending || updateMutation.isPending;

    const form = useForm
        // <CategoryFormValues>
        ({
            defaultValues: {
                name: category?.name ?? "",
                description: category?.description ?? "",
            },
            onSubmit: async ({ value }) => {
                const result = categorySchema.safeParse(value);
                if (!result.success) return;

                if (isEdit && category) {
                    await updateMutation.mutateAsync(
                        { id: category.id, payload: result.data },
                        { onSuccess: () => onOpenChange(false) }
                    );
                } else {
                    await createMutation.mutateAsync(result.data, {
                        onSuccess: () => onOpenChange(false),
                    });
                }
            },
        });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {isEdit ? "Edit Category" : "New Category"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4 pt-2"
                >
                    {/* Name */}
                    <form.Field name="name">
                        {(field) => (
                            <div className="space-y-1.5">
                                <Label htmlFor="cat-name">
                                    Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="cat-name"
                                    placeholder="e.g. Technology"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-xs text-destructive">
                                        {String(field.state.meta.errors[0])}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Description */}
                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-1.5">
                                <Label htmlFor="cat-desc">Description</Label>
                                <Textarea
                                    id="cat-desc"
                                    placeholder="Short description of this category…"
                                    rows={3}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                            </div>
                        )}
                    </form.Field>

                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending
                                ? isEdit
                                    ? "Saving…"
                                    : "Creating…"
                                : isEdit
                                    ? "Save Changes"
                                    : "Create Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}