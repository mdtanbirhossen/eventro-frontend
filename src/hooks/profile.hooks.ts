"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  getProfileAction,
  updateProfileAction,
  uploadAvatarAction,
  changePasswordAction,
  deleteAccountAction,
} from "@/services/profile.service";

import {
  IProfile,
  IUpdateProfilePayload,
  IChangePasswordPayload,
} from "@/types/profile.types";

import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user.types";

// ============================================================
// Query Keys
// ============================================================

export const profileQueryKeys = {
  profile: ["profile"] as const,
};

// ============================================================
// Get Profile
// ============================================================

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKeys.profile,
    queryFn: async () => {
      const res = await getProfileAction();
      if (!res.success) throw new Error(res.message);
      return res.data as IProfile;
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

// ============================================================
// Update Profile
// ============================================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (payload: IUpdateProfilePayload) =>
      updateProfileAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Profile updated successfully.");

      // ✅ update cached profile
      queryClient.refetchQueries({ queryKey: profileQueryKeys.profile });

      // ✅ sync auth context + cookie so navbar reflects new name/image
      if (res.data) {
        setUser(res.data as User);
        Cookies.set("user", JSON.stringify(res.data), { expires: 7 });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
}

// ============================================================
// Upload Avatar
// ============================================================

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadAvatarAction(formData);
     if (!res.success) throw new Error(res.message);
      const url = (res.data.url as string) ?? "";
      if (!url)  throw new Error("No URL returned from upload.");
      return url;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload avatar.");
    },
  });
}

// ============================================================
// Change Password
// ============================================================

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changePasswordAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Password changed successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
}

// ============================================================
// Delete Account
// ============================================================

export function useDeleteAccount() {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => deleteAccountAction(),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Account deleted. Goodbye!");
      // ✅ clear auth state + cookies then redirect
      logout();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete account.");
    },
  });
}