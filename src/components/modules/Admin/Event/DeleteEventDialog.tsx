import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAdminForceDeleteEvent } from "@/hooks/admin.hooks";
import { IEvent } from "@/types/event.types";

export default function DeleteEventDialog({
    open,
    onOpenChange,
    event,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    event: IEvent | null;
}) {
    const deleteMutation = useAdminForceDeleteEvent();

    const handleConfirm = async () => {
        if (!event) return;
        const res = await deleteMutation.mutateAsync(event.id);
        if (res.success) onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Force delete &quot;{event?.title}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the event along with all its
                        participants, invitations, payments, and reviews. This action{" "}
                        <span className="font-semibold text-foreground">cannot be undone</span>.
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
                        {deleteMutation.isPending ? "Deleting…" : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}