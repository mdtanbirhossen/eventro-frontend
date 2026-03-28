import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "@/hooks/admin.hooks";
import { Role } from "@/types/enums";
import { CreateAdminFormValues, createAdminSchema } from "@/zod/admin.validation";
import { useForm } from "@tanstack/react-form";
import { ShieldPlus } from "lucide-react";

export default function CreateAdminDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const createAdmin = useCreateAdmin();
 
  const form = useForm
//   <CreateAdminFormValues>
    ({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      const result = createAdminSchema.safeParse(value);
      if (!result.success) return;
 
      await createAdmin.mutateAsync(
        {
          admin: { name: result.data.name, email: result.data.email },
          password: result.data.password,
          role: Role.ADMIN,
        },
        { onSuccess: () => onOpenChange(false) }
      );
    },
  });
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <ShieldPlus className="h-4 w-4 text-muted-foreground" />
            Create New Admin
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
                <Label>
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Mr Admin"
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
 
          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
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
 
          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
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
 
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={createAdmin.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createAdmin.isPending}>
              {createAdmin.isPending ? "Creating…" : "Create Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}