"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { registerAction } from "@/app/(authRouteGroup)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "./RegisterForm.css";

interface RegisterFormProps {
  redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const { login } = useAuth();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          toast.error(result.message || "Registration failed");
          return;
        }

        login(result?.data?.user, result?.data?.accessToken);

        toast.success(result.message || "Registration successful");

        const targetPath = redirectPath ? redirectPath : "/";
        router.push(targetPath);
      } catch (error: any) {
        setServerError(error.message || "Registration failed");
        toast.error(error.message || "Registration failed");
      }
    },
  });

  return (
    <div className="register-container">
      {/* Animated Background Elements */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>

      {/* Grid Background */}
      <div className="grid-background"></div>

      {/* Main Card */}
      <Card className={`register-card ${isAnimated ? "fade-in-up" : ""}`}>
        <div className="card-top-decoration"></div>

        <CardHeader className="text-center pb-6">
          <div className="logo-container">
            <div className="logo-badge">
              <Sparkles className="logo-icon" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-4">
            Create Account
          </CardTitle>

          <CardDescription className="text-base mt-2 text-slate-600">
            Sign up to explore and book amazing events on Eventro
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Name */}
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <div className="field-wrapper">
                  <AppField
                    field={field}
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    className="field-input"
                  />
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <div className="field-wrapper">
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    className="field-input"
                  />
                </div>
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <div className="field-wrapper">
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="field-input"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="password-toggle"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    }
                  />
                </div>
              )}
            </form.Field>

            {/* Error */}
            {serverError && (
              <div className="error-alert-wrapper">
                <Alert variant={"destructive"} className="error-alert">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Submit Button */}
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="button-wrapper">
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Creating Account..."
                    disabled={!canSubmit}
                    className="submit-button"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="button-icon" />
                  </AppSubmitButton>
                </div>
              )}
            </form.Subscribe>

            {/* Divider */}
            <div className="divider">
              <span>Already registered?</span>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 border-t ">
          <p className="text-sm text-slate-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="login-link">
              Login now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;