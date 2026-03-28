"use client";
 
import {
  useDeleteCategory,
} from "@/hooks/admin.hooks";
 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IEventCategory } from "@/types/eventCategory.types";

 
export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: IEventCategory | null;
}) {
  const deleteMutation = useDeleteCategory();
 
  const handleConfirm = async () => {
    if (!category) return;
    await deleteMutation.mutateAsync(category.id, {
      onSuccess: () => onOpenChange(false),
    });
  };
 
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{category?.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the category. Events linked to it will
            have their category set to{" "}
            <span className="font-medium text-foreground">null</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
 