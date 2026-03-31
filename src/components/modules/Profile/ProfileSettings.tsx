"use client";

import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  useDeleteAccount,
} from "@/hooks/profile.hooks";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Loader2,
  KeyRound,
  Trash2,
  User,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null;
  return (
    <p className="text-xs text-destructive mt-1">{String(errors[0])}</p>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-muted p-2 shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <Separator />
      {children}
    </div>
  );
}

// ─── Zod schemas ──────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ─── Profile Info Section ─────────────────────────────────────

function ProfileInfoSection() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const form = useForm
//   <ProfileFormValues>
  ({
    defaultValues: { name: profile?.name ?? "" },
    onSubmit: async ({ value }) => {
      const result = profileSchema.safeParse(value);
      if (!result.success) return;
      await updateProfile.mutateAsync(result.data);
    },
  });

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAvatar.mutateAsync(file);
    await updateProfile.mutateAsync({ image: url });
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <Section title="Profile Information" icon={User}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </Section>
    );
  }

  return (
    <Section
      title="Profile Information"
      description="Update your display name and profile picture."
      icon={User}
    >
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.image ?? undefined} />
            <AvatarFallback className="text-lg">
              {profile?.name ? getInitials(profile.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadAvatar.isPending || updateProfile.isPending}
            className="absolute bottom-0 right-0 rounded-full bg-foreground text-background p-1.5 hover:bg-foreground/80 transition-colors disabled:opacity-50"
          >
            {uploadAvatar.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{profile?.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {profile?.email}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {profile?.role?.toLowerCase()} ·{" "}
            {profile?.emailVerified ? "Email verified" : "Email not verified"}
          </p>
        </div>
      </div>

      {/* Name form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your display name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        {/* Email — read only */}
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={profile?.email ?? ""} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed.
          </p>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Section>
  );
}

// ─── Change Password Section ──────────────────────────────────

function ChangePasswordSection() {
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm
//   <PasswordFormValues>
    ({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const result = passwordSchema.safeParse(value);
      if (!result.success) return;
      const res = await changePassword.mutateAsync({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });
      if (res.success) form.reset();
    },
  });

  const EyeButton = ({
    show,
    toggle,
  }: {
    show: boolean;
    toggle: () => void;
  }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <Section
      title="Change Password"
      description="Use a strong password you don't use elsewhere."
      icon={KeyRound}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Current password */}
        <form.Field name="currentPassword">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="pr-10"
                />
                <EyeButton
                  show={showCurrent}
                  toggle={() => setShowCurrent((v) => !v)}
                />
              </div>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        {/* New password */}
        <form.Field name="newPassword">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="pr-10"
                />
                <EyeButton
                  show={showNew}
                  toggle={() => setShowNew((v) => !v)}
                />
              </div>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        {/* Confirm password */}
        <form.Field name="confirmPassword">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="pr-10"
                />
                <EyeButton
                  show={showConfirm}
                  toggle={() => setShowConfirm((v) => !v)}
                />
              </div>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <Button
          type="submit"
          size="sm"
          disabled={changePassword.isPending}
        >
          {changePassword.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating…</>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </Section>
  );
}

// ─── Danger Zone Section ──────────────────────────────────────

function DangerZoneSection() {
  const [open, setOpen] = useState(false);
  const deleteAccount = useDeleteAccount();

  return (
    <Section
      title="Danger Zone"
      description="Permanent actions that cannot be undone."
      icon={ShieldAlert}
    >
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-destructive">
            Delete Account
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently delete your account and all associated data. This
            cannot be undone.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="shrink-0 gap-2"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, all your events,
              participations, payments, and reviews.{" "}
              <span className="font-semibold text-foreground">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAccount.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccount.mutate()}
              disabled={deleteAccount.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAccount.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</>
              ) : (
                "Yes, delete my account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function ProfileSettings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, password and account preferences.
        </p>
      </div>

      <ProfileInfoSection />
      <ChangePasswordSection />
      <DangerZoneSection />
    </div>
  );
}